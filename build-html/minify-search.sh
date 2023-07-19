#! /bin/sh
(echo "(function(){var PrefixTree,DocFinder;" && cat search/prefix-tree.js search/doc-finder.js search/search.js && echo "})()") > temp.js
minify-js temp.js > res/search.js
rm -f temp.js