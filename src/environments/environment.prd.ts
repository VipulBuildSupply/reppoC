export const environment = {
    ga: "UA-145397532-1",
    production: true,
    debug_mode: false,
    // apiURL: 'https://api.yeho.ga'
    apiURL: (window.location.host.split('.').length < 3) ? (window.location.protocol + '//api.' + window.location.host) : (window.location.protocol + '//api.' + window.location.host.split('.')[ window.location.host.split('.').length - 2 ] + '.' + window.location.host.split('.')[ window.location.host.split('.').length - 1 ])
};
