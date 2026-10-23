#!/bin/sh
# OxeeOffice deb/rpm post-install: expose the command line shipped inside the
# app. Replaces upstream's build/linux-after-install.sh for the brand build.
#
# The command keeps upstream's name (`genoffice`) until the CLI rename lands
# (brand/README.md). Unlike upstream, never overwrite a link that belongs to a
# real GenOffice install on the same machine.
set -e
# electron-builder stamps every MIME type it registers with
# <icon name="x-office-document"/>, which overrides the system's per-type
# icons (spreadsheet, presentation, text, pdf...). Dropping the line lets each
# type fall back to its freedesktop generic icon; associations are untouched.
# The file is named after executableName, which is still "genoffice".
mime="/usr/share/mime/packages/genoffice.xml"
if [ -f "$mime" ] && grep -q '<icon name="x-office-document"' "$mime"; then
  sed -i '/<icon name="x-office-document"/d' "$mime"
  command -v update-mime-database >/dev/null 2>&1 && update-mime-database /usr/share/mime >/dev/null 2>&1 || true
fi
launcher="/opt/OxeeOffice/resources/cli/genoffice"
link="/usr/bin/genoffice"
if [ -x "$launcher" ]; then
  if [ ! -e "$link" ] && [ ! -L "$link" ]; then
    ln -s "$launcher" "$link"
  elif [ -L "$link" ] && [ "$(readlink "$link")" = "$launcher" ]; then
    ln -sf "$launcher" "$link"
  fi
fi
exit 0
