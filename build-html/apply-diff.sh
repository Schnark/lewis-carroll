#! /bin/sh
rm -r html
unzip -d html lc.zip
cd html
patch --unified-reject-files -p1 < ../build-html/lc-manual-fix.diff