#! /bin/sh
unzip -d a lc.zip
mv html b
find b -name '*~' -delete
diff -ru a b > build-html/lc-manual-fix.diff
mv b html
rm -r a