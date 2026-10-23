#!/bin/sh
# OxeeOffice deb/rpm post-remove: drop the command-line link only on a real
# uninstall, and only if it is ours.
# rpm runs the old package's %postun after the new %post during an upgrade
# (with $1 = 1); deb passes "upgrade" there. Removing then would kill the
# link the new version just created.
case "$1" in
  0|remove|purge) ;;
  *) exit 0 ;;
esac
# the package manager already removed our MIME file; rebuild the database so
# the per-type icons come back without a relogin
command -v update-mime-database >/dev/null 2>&1 && update-mime-database /usr/share/mime >/dev/null 2>&1 || true
if [ -L /usr/bin/genoffice ] && [ "$(readlink /usr/bin/genoffice)" = "/opt/OxeeOffice/resources/cli/genoffice" ]; then
  rm -f /usr/bin/genoffice
fi
exit 0
