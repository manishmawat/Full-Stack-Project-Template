"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var common_2 = require('@angular/common');
exports.APP_BASE_HREF = common_2.APP_BASE_HREF;
exports.ORIGIN_URL = new core_1.OpaqueToken('ORIGIN_URL');
exports.REQUEST_URL = new core_1.OpaqueToken('REQUEST_URL');
exports.PRIME_CACHE = new core_1.OpaqueToken('PRIME_CACHE');
exports.COOKIE_KEY = new core_1.OpaqueToken('COOKIE_KEY');
exports.NODE_APP_ID = new core_1.OpaqueToken('NODE_APP_ID');
function getUrlConfig() {
    return [
        { provide: common_1.APP_BASE_HREF, useValue: 'baseUrl' },
        { provide: exports.REQUEST_URL, useValue: 'requestUrl' },
        { provide: exports.ORIGIN_URL, useValue: 'originUrl' }
    ];
}
exports.getUrlConfig = getUrlConfig;
function createUrlProviders(config) {
    return getUrlConfig()
        .filter(function (provider) { return (provider.useValue in config); })
        .map(function (provider) {
        var key = provider.useValue;
        provider.useValue = config[key];
        return provider;
    });
}
exports.createUrlProviders = createUrlProviders;