#!/bin/sh
# OxeeOffice deb/rpm post-remove: undo the post-install only on a real
# uninstall, and only what is ours.
# rpm runs the old package's %postun after the new %post during an upgrade
# (with $1 = 1); deb passes "upgrade" there. Removing then would kill the
# link and profile the new version just installed.
case "$1" in
  0|remove|purge) ;;
  *) exit 0 ;;
esac
# the package manager already removed our MIME file; rebuild the database so
# the per-type icons come back without a relogin
command -v update-mime-database >/dev/null 2>&1 && update-mime-database /usr/share/mime >/dev/null 2>&1 || true
profile="/etc/apparmor.d/oxeeoffice"
if [ -f "$profile" ]; then
  if apparmor_status --enabled >/dev/null 2>&1 && ! { [ -x /usr/bin/ischroot ] && /usr/bin/ischroot; } && command -v apparmor_parser >/dev/null 2>&1; then
    apparmor_parser --remove "$profile" >/dev/null 2>&1 || true
  fi
  rm -f "$profile"
fi
if [ -L /usr/bin/genoffice ] && [ "$(readlink /usr/bin/genoffice)" = "/opt/OxeeOffice/resources/cli/genoffice" ]; then
  rm -f /usr/bin/genoffice
fi
exit 0
