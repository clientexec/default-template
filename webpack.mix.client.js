const mix = require('laravel-mix');
mix.options({
    processCssUrls: false
});

mix.extract();
mix.autoload({
    jquery: ['$', 'global.jQuery', "jQuery", "global.$", "jquery", "global.jquery"]
});

mix.setPublicPath('templates/default');

mix.sass('templates/default/resources/sass/app.scss', 'templates/default/css/vendor.css', {
    sassOptions: {
        quietDeps: true
    }
}).sourceMaps();
mix.js('templates/default/resources/js/app.js', 'templates/default/js').sourceMaps();

mix.copyDirectory(
    'templates/default/resources/fonts',
    'templates/default/fonts'
);

// We want to only minify affiliate.js
mix.minify('templates/default/resources/js/affiliate.js', 'templates/default/js/aff.js');

mix.copy(
    [
        'node_modules/@fortawesome/fontawesome-free/webfonts',
    ],
    'templates/default/webfonts'
);

if (mix.inProduction()) {
    mix.version();
}