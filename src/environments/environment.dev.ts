export const environment = {
    ga: "",
    hmr: false,
    production: false,
    debug_mode: false,
    apiURL: (window.location.host.split('.').length < 3) ? (window.location.protocol + '//api.' + window.location.host) : (window.location.protocol + '//api.' + window.location.host.split('.')[ window.location.host.split('.').length - 2 ] + '.' + window.location.host.split('.')[ window.location.host.split('.').length - 1 ])
};

