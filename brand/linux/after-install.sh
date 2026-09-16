#!/bin/sh
# OxeeOffice deb/rpm post-install: expose the command line shipped inside the
# app. Replaces upstream's build/linux-after-install.sh for the brand build.
#
# The command keeps upstream's name (`genoffice`) until the CLI rename lands
# (brand/README.md). Unlike upstream, never overwrite a link that belongs to a
# real GenOffice install on the same machine.
set -e
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
