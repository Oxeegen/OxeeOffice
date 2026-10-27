#!/bin/sh
# OxeeOffice deb/rpm post-install. Replaces upstream's build/linux-after-install.sh
# for the brand build, and, like it, electron-builder's default template, so the
# template's chrome-sandbox and AppArmor steps are repeated here.
#
# The command keeps upstream's name (`genoffice`) until the CLI rename lands
# (brand/README.md). Unlike upstream, never overwrite a link that belongs to a
# real GenOffice install on the same machine.
set -e
app="/opt/OxeeOffice"
# Chromium aborts when the SUID helper exists without 4755; Chrome's deb sets it unconditionally.
[ -f "$app/chrome-sandbox" ] && { chown root:root "$app/chrome-sandbox" 2>/dev/null || true; chmod 4755 "$app/chrome-sandbox" 2>/dev/null || true; }
# Ubuntu 24.04+ restricts unprivileged user namespaces; the bundled profile lifts
# that for our binary. electron-builder names it after executableName ("genoffice"),
# which would collide with a real GenOffice install, so it is installed as
# "oxeeoffice". --skip-kernel-load doubles as the abi/4.0 check (Ubuntu 22.04 skips).
profile_src="$app/resources/apparmor-profile"
profile_dst="/etc/apparmor.d/oxeeoffice"
if [ -f "$profile_src" ] && apparmor_status --enabled >/dev/null 2>&1; then
  tmp="$(mktemp 2>/dev/null)" || tmp=""
  if [ -n "$tmp" ]; then
    sed -e 's/^profile "genoffice"/profile "oxeeoffice"/' -e 's#<local/genoffice>#<local/oxeeoffice>#' "$profile_src" > "$tmp"
    if apparmor_parser --skip-kernel-load --debug "$tmp" >/dev/null 2>&1; then
      cp -f "$tmp" "$profile_dst"
      chmod 644 "$profile_dst"
      if ! { [ -x /usr/bin/ischroot ] && /usr/bin/ischroot; } && command -v apparmor_parser >/dev/null 2>&1; then
        apparmor_parser --replace --write-cache --skip-read-cache "$profile_dst" || true
      fi
    fi
    rm -f "$tmp"
  fi
fi
# electron-builder stamps every MIME type it registers with
# <icon name="x-office-document"/>, which overrides the system's per-type
# icons (spreadsheet, presentation, text, pdf...). Dropping the line lets each
# type fall back to its freedesktop generic icon; associations are untouched.
# The file is named after executableName, which is still "genoffice".
mime="/usr/share/mime/packages/genoffice.xml"
if [ -f "$mime" ] && grep -q '<icon name="x-office-document"' "$mime"; then
  sed -i '/<icon name="x-office-document"/d' "$mime"
fi
command -v update-mime-database >/dev/null 2>&1 && update-mime-database /usr/share/mime >/dev/null 2>&1 || true
command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database /usr/share/applications >/dev/null 2>&1 || true
launcher="$app/resources/cli/genoffice"
link="/usr/bin/genoffice"
if [ -x "$launcher" ]; then
  if [ ! -e "$link" ] && [ ! -L "$link" ]; then
    ln -s "$launcher" "$link"
  elif [ -L "$link" ] && [ "$(readlink "$link")" = "$launcher" ]; then
    ln -sf "$launcher" "$link"
  fi
fi
exit 0
