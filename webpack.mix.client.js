const mix = require('laravel-mix');
mix.options({
    processCssUrls: false
});

mix.extract();
mix.autoload({
    jquery: ['$', 'global.jQuery', "jQuery", "global.$", "jquery", "global.jquery"]
});

mix.setPublicPath('templates/default');

mix.sass('templates/default/resources/sass/app.scss', 'templates/default/css/vendor.css').sourceMaps();
mix.js('templates/default/resources/js/app.js', 'templates/default/js').sourceMaps();

mix.copy(
    [
        'node_modules/@fortawesome/fontawesome-free/webfonts',
    ],
    'templates/default/webfonts'
);

if (mix.inProduction()) {
    mix.version();
}