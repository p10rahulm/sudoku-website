# To run type the command below. Leave an enter on the last line
# >$ cmd < GoogleCloudStorageUpdate.sh
# JS minification is done through terser
terser assets/js/builder.js assets/js/solver.js assets/js/sudoku-ui.js assets/js/updater.js assets/js/utilities.js assets/js/levels.js -o assets/js/allJS.min.js -c -m
# CSS minification is done through CSSO
csso assets/css/gameStyles.css --output assets/css/gameStyles.min.css
csso assets/css/styles.css --output assets/css/styles.min.css

gsutil -m rsync -r assets gs://www.sudokusolver.in/assets

gsutil -m rsync -r content gs://www.sudokusolver.in/content

gsutil -m rsync ./ gs://www.sudokusolver.in/

