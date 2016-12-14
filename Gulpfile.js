var gulp      = require('gulp'),
    connect   = require('gulp-connect'),
    stylus    = require('gulp-stylus'),
    nib       = require('nib'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    inject    = require('gulp-inject'),
    wiredep   = require('wiredep').stream,
    gulpif    = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref    = require('gulp-useref'),
    uglify    = require('gulp-uglify'),
    watch 	  = require('gulp-watch'),
    templateCache = require('gulp-angular-templatecache'),
    historyApiFallback = require('connect-history-api-fallback');

// Servidor web de desarrollo 
gulp.task('server', function() {  
	connect.server({    
		root: './app',    
		hostname: '0.0.0.0',    
		port: 3000,    
		livereload: true,    
		middleware: function(connect, opt) {      
			return [ historyApiFallback ];    
		}  
	}); 
});


//servidor web para porduccion
gulp.task('server-producccion', function() {  
	connect.server({    
		root: './dist',    
		hostname: '0.0.0.0',    
		port: 3000,    
		livereload: true,    
		middleware: function(connect, opt) {      
			return [ historyApiFallback ];    
		}  
	}); 
});


// Busca errores en el JS y nos los muestra en el terminal 
gulp.task('jshint', function() {  
	return gulp.src('./app/scripts/**/*.js')    
	.pipe(jshint('.jshintrc'))    
	.pipe(jshint.reporter('jshint-stylish'))    
	.pipe(jshint.reporter('fail')); 
});

// Recarga el navegador cuando hay cambios en el HTML 
gulp.task('html', function() {  
	gulp.src('./app/**/*.html')    
	.pipe(connect.reload()); 
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado 
// para inyectarlos en el index.html 
gulp.task('inject', function() {  
	var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css']);  
	return gulp.src('index.html', {cwd: './app'})    
	.pipe(inject(sources, {      
		read: false,      
		ignorePath: '/app/'    
	}))    
	.pipe(gulp.dest('./app')); 
}); 

// Inyecta las librerias que instalemos vía Bower 
gulp.task('wiredep', function () {  
	gulp.src('./app/index.html')    
	.pipe(wiredep({ directory: './app/lib'}))   
	.pipe(gulp.dest('./app')); 
});


// observa todo los cambios y los asociamos a una tares
gulp.task('watch', function() { 
	gulp.watch(['./app/**/*.html'], ['html']);  
	gulp.watch(['./app/vistas/**/*.html'], ['templates']);  
	gulp.watch(['./app/stylesheets/**/*.styl'], ['css','inject']);  
	gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['inject']);  
	gulp.watch(['./bower.json'],['wiredep']); 
	watch('./app').pipe(connect.reload());
});


// genera los templates en 
gulp.task('templates', function() {
   	gulp.src('./app/vistas/**/*.html')
		.pipe(templateCache({
			root:'vistas/',
			module: 'app.templates',
			standalone: true,
			base:function(file){				
				var ruta = file.relative;
				var fic = ruta.replace(/^.*[\\\/]/,'').split('/');
				var fileOnly = fic[fic.length - 1];
				return fileOnly;
			}
	}))
    .pipe(gulp.dest('./app/scripts'));
});


// genera un index con las referencias ya compresas como se especifico en el index.html
gulp.task('compress', function() {  
	gulp.src('./app/index.html')    
	.pipe(useref.assets())    
	.pipe(gulpif('*.css', minifyCss()))    
	.pipe(gulpif('*.js', uglify({mangle: false })))    
	.pipe(gulp.dest('./dist')); 
});


// copiamos el contenido del index y las imagenes del proyecto
gulp.task('copy', function() {  
	gulp.src('./app/index.html')    
	.pipe(useref())    
	.pipe(gulp.dest('./dist'));   
	gulp.src('./app/img/**')        
	.pipe(gulp.dest('./dist/img'));
});

// tarea principal para produccion
gulp.task('produccion', ['compress','copy']);

// tarea por defecto para desarrollo

gulp.task('default', ['server','templates','inject','wiredep', 'watch']);




