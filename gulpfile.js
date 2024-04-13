// function tarea(callback) {
//     console.log("Mi primer tarea");
    
//     callback(); // Se usa para indicar que ya termino la ejecucion de la funcion
// }

// exports.tarea = tarea; // Codigo de Node.js para llamar una función

// Se importan las funciones de Gulp a utilizar
const {src, dest, watch, parallel} = require("gulp"); // El require permite extraer una funcionalidad
// src permite indetificar y dest permite almacenar

// Dependencias de CSS
const sass = require("gulp-sass")(require("sass"));
const plumbler = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Dependencias de Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// Dependencias JavaScript
const terser = require("gulp-terser-js");

function css(done) {
    src('src/scss/**/*.scss' // Busca archivos que contengan la extensión especificada
    ) // Identificar el archivo SASS
        .pipe(sourcemaps.init()) // Guarda la referencia original del archivo SASS
        .pipe(plumbler()) 
        .pipe(sass()) // Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()])) // Permite minificar (optimizar o mejorar) el código css
        .pipe(sourcemaps.write(".")) // Se define la ruta donde se va a guardar la referencia '.'=mismaruta
        .pipe(dest('build/css')); // Almacenarla en el disco duro


    done(); // Callback que avisa a Gulp cuando llegamos al final
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src("src/img/**/*.{png,jpg}")
        .pipe(cache(imagemin(opciones)))
        .pipe(dest("build/img"));
    done();
}

function convertirWebp(done) {
    const opciones = {
        quality: 50
    }
    src("src/img/**/*.{png,jpg}")// Busca todas las imagenes de la carpeta especificada
        .pipe(webp(opciones))
        .pipe(dest("build/img")); 
    done();
}

function convertirAvif(done) {
    const opciones = {
        quality: 50
    }
    src("src/img/**/*.{png,jpg}")// Busca todas las imagenes de la carpeta especificada
        .pipe(avif(opciones))
        .pipe(dest("build/img")); 
    done();
}

function javascript(done) {
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(terser()) // Miminica o Mejora el código de JavaScript
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/js"));
    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css); // Se establece el archivo a escuchar y que ejecutar cuando ese archivo cambie 
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.convertirWebp = convertirWebp;
exports.convertirAvif = convertirAvif;
exports.dev = parallel(imagenes, convertirAvif, convertirWebp, javascript, dev); // Se usa para ejecutar varias funciones en paralelo