Steps to create the HTML version from the LaTeX file:
1. Open https://schnark.github.io/lewis-carroll/latex-to-html/lc-convert.html, open `complete-lewis-carroll.tex` and download the result as `lc.zip` to the root folder.
2. Call `build-html/apply-diff.sh`.
3. Inspect the log and fix all unresolved patches.
4. If the diff didn’t apply cleanly, recreate the diff by calling `build-html/create-diff.sh`.