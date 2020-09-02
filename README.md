# testGulp
projectGulp

## Configurazione e gestione degli assets
Installazione e configurazione gulp (Task Runner)

`prerequisiti` : installare in maniera globale node e npm

Install the gulp command line utility - `npm install --global gulp-cli`

Create a package.json file in your project directory - `npm init`

Install the gulp package in your devDependencies - `npm install --save-dev gulp`

Creare un file chiamato `gulpfile.js` nella root del progetto , che viene caricato automaticamente quando si esegue il comando gulp

In `gulpfile.js`:
* definiamo come costanti i require alle librerie da utilizzare - esempio `const gulp = require('gulp');`
* creiamo i gulp.task: funzioni JavaScript asincrone (definite in serie) - esempio `gulp.task('default', function() { console.log("Gulp is running!");});`
* nelle funzioni utilizziamo il  `pipe` 'evento che viene emesso quando il stream.pipe()metodo viene chiamato - esempio `.pipe(gulp.src('./js/**/*.js'));`
* facciamo per default l'export delle funzioni - esempio `gulp.task('default', gulp.series(['sass', 'copyCss']));`
* esecuzione dell'export configurato in your gulpfile directory , eseguire il comando `gulp` - per eseguire un singolo gulp.task - esempio `gulp nomeTask`

Dipendenze utilizzate :
 "del": "^5.1.0",
 "gulp": "^4.0.2",
 "gulp-gzip": "^1.4.2",
 "gulp-rev": "^9.0.0",
 "gulp-sass": "^4.1.0",
 "modify-filename": "^1.1.0",
 "through2": "^4.0.2",
 "yargs": "^15.4.1"
 
Gli assets vengono copiati,minificati e compressi dalla cartella di origine `module/assets` alla cartella di destinazione `public`

per ogni file generato viene creato un hash fisso e mappato in un file chiamato `manifest.json`

quando si esegue da shell il gulpfile.js impostando manualmente il nome dell'hash dei file eseguire il seguente comando :  `gulp --hash nome`
