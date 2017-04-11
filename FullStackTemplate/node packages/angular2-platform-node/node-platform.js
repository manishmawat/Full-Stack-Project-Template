"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var get_dom_1 = require('./get-dom');
var __private_imports__1 = require('./__private_imports__');
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var compiler_1 = require('@angular/compiler');
var http_1 = require('@angular/http');
var preboot_1 = require('preboot');
var node_location_1 = require('./node-location');
var node_document_1 = require('./node-document');
var node_renderer_1 = require('./node-renderer');
var node_shared_styles_host_1 = require('./node-shared-styles-host');
var parse5_adapter_1 = require('./parse5-adapter');
var tokens_1 = require('./tokens');
function _errorHandler() {
    return new core_1.ErrorHandler();
}
exports._errorHandler = _errorHandler;
var _documentDeps = [node_shared_styles_host_1.NodeSharedStylesHost, core_1.NgZone];
function _document(domSharedStylesHost, zone) {
    var document = Zone.current.get('document');
    if (!document) {
        throw new Error('Please provide a document in the universal config');
    }
    if (typeof document === 'string') {
        document = node_document_1.parseDocument(document);
    }
    domSharedStylesHost.addHost(document.head);
    return document;
}
exports._document = _document;
function _resolveDefaultAnimationDriver() {
    if (get_dom_1.getDOM().supportsWebAnimation()) {
        return platform_browser_1.AnimationDriver.NOOP;
    }
    return platform_browser_1.AnimationDriver.NOOP;
}
exports._resolveDefaultAnimationDriver = _resolveDefaultAnimationDriver;
exports.__PLATFORM_REF = null;
function removePlatformRef() {
    exports.__PLATFORM_REF = null;
}
exports.removePlatformRef = removePlatformRef;
function getPlatformRef() {
    return exports.__PLATFORM_REF;
}
exports.getPlatformRef = getPlatformRef;
function setPlatformRef(platformRef) {
    exports.__PLATFORM_REF = platformRef;
}
exports.setPlatformRef = setPlatformRef;
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
var NodePlatform = (function () {
    function NodePlatform(_platformRef) {
        this._platformRef = _platformRef;
    }
    Object.defineProperty(NodePlatform.prototype, "platformRef", {
        get: function () {
            return this._platformRef;
        },
        enumerable: true,
        configurable: true
    });
    NodePlatform.prototype.cacheModuleFactory = function (moduleType, compilerOptions) {
        if (NodePlatform._cache.has(moduleType)) {
            return Promise.resolve(NodePlatform._cache.get(moduleType));
        }
        var compilerFactory = this._platformRef.injector.get(core_1.CompilerFactory);
        var compiler;
        if (compilerOptions) {
            compiler = compilerFactory.createCompiler(compilerOptions instanceof Array ? compilerOptions : [compilerOptions]);
        }
        else {
            compiler = compilerFactory.createCompiler();
        }
        return compiler.compileModuleAsync(moduleType)
            .then(function (moduleFactory) {
            NodePlatform._cache.set(moduleType, moduleFactory);
            return moduleFactory;
        });
    };
    NodePlatform.prototype.serializeModule = function (ModuleType, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        if (config && !config.id) {
            config.id = s4();
        }
        config.time && console.time('id: ' + config.id + ' bootstrapModule: ');
        config.time && console.time('id: ' + config.id + ' ngApp: ');
        return (config.compilerOptions ?
            this.bootstrapModule(ModuleType, config.compilerOptions)
            :
                this.bootstrapModule(ModuleType))
            .then(function (moduleRef) {
            config.time && console.timeEnd('id: ' + config.id + ' bootstrapModule: ');
            return _this.serialize(moduleRef, config);
        })
            .then(function (html) {
            config.time && console.timeEnd('id: ' + config.id + ' ngApp: ');
            return html;
        });
    };
    NodePlatform.prototype.serializeModuleFactory = function (ModuleType, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        if (config && !config.id) {
            config.id = s4();
        }
        config.time && console.time('id: ' + config.id + ' bootstrapModuleFactory: ');
        config.time && console.time('id: ' + config.id + ' ngApp: ');
        return this.bootstrapModuleFactory(ModuleType)
            .then(function (moduleRef) {
            config.time && console.timeEnd('id: ' + config.id + ' bootstrapModuleFactory: ');
            return _this.serialize(moduleRef, config);
        })
            .then(function (html) {
            config.time && console.timeEnd('id: ' + config.id + ' ngApp: ');
            return html;
        });
    };
    NodePlatform.prototype.serialize = function (moduleRef, config) {
        if (config === void 0) { config = {}; }
        var cancelHandler = function () { return false; };
        if (config && ('cancelHandler' in config)) {
            cancelHandler = config.cancelHandler;
        }
        var _map = new Map();
        var _store = {
            set: function (key, value, defaultValue) {
                _map.set(key, (value !== undefined) ? value : defaultValue);
            },
            get: function (key, defaultValue) {
                return _map.has(key) ? _map.get(key) : defaultValue;
            },
            clear: function () {
                _map.clear();
                _store = null;
                _map = null;
            }
        };
        function errorHandler(err, store, modRef, currentIndex, currentArray) {
            var document = '';
            try {
                document = store.get('DOCUMENT');
                if (typeof document !== 'string') {
                    document = Zone.current.get('document');
                }
                if (typeof document !== 'string') {
                    document = Zone.current.get('DOCUMENT');
                }
                var appRef = store.get('ApplicationRef');
                if (appRef && appRef.ngOnDestroy) {
                    appRef.ngOnDestroy();
                }
                if (modRef && modRef.destroy) {
                    modRef.destroy();
                }
                _store && _store.clear();
            }
            catch (e) { }
            return document;
        }
        return asyncPromiseSeries(_store, moduleRef, errorHandler, cancelHandler, config, [
            function createDiStore(store, moduleRef) {
                var modInjector = moduleRef.injector;
                var instance = moduleRef.instance;
                store.set('universalOnInit', instance.universalOnInit, NodePlatform._noop);
                store.set('universalDoCheck', instance.universalDoCheck, NodePlatform._noop);
                store.set('universalOnStable', instance.universalOnStable, NodePlatform._noop);
                store.set('universalDoDehydrate', instance.universalDoDehydrate, NodePlatform._noop);
                store.set('universalAfterDehydrate', instance.universalAfterDehydrate, NodePlatform._noop);
                store.set('universalOnRendered', instance.universalOnRendered, NodePlatform._noop);
                store.set('ApplicationRef', modInjector.get(core_1.ApplicationRef));
                store.set('NgZone', modInjector.get(core_1.NgZone));
                store.set('preboot', config.preboot, false);
                store.set('APP_ID', modInjector.get(core_1.APP_ID, null));
                store.set('NODE_APP_ID', s4());
                store.set('DOCUMENT', modInjector.get(platform_browser_1.DOCUMENT));
                store.set('DOM', get_dom_1.getDOM());
                store.set('UNIVERSAL_CACHE', {});
                return moduleRef;
            },
            function checkStable(store, moduleRef) {
                config.time && console.time('id: ' + config.id + ' stable: ');
                var universalDoCheck = store.get('universalDoCheck');
                var universalOnInit = store.get('universalOnInit');
                var rootNgZone = store.get('NgZone');
                var appRef = store.get('ApplicationRef');
                var components = appRef.components;
                universalOnInit();
                function outsideNg(compRef, ngZone, http, jsonp) {
                    function checkStable(done, ref) {
                        ngZone.runOutsideAngular(function () {
                            setTimeout(function stable() {
                                if (cancelHandler()) {
                                    return done(ref);
                                }
                                if (ngZone.hasPendingMicrotasks === true) {
                                    return checkStable(done, ref);
                                }
                                if (ngZone.hasPendingMacrotasks === true) {
                                    return checkStable(done, ref);
                                }
                                if (http && http._async > 0) {
                                    return checkStable(done, ref);
                                }
                                if (jsonp && jsonp._async > 0) {
                                    return checkStable(done, ref);
                                }
                                if (ngZone.isStable === true) {
                                    var isStable = universalDoCheck(ref, ngZone);
                                    if (universalDoCheck !== NodePlatform._noop) {
                                        if (typeof isStable !== 'boolean') {
                                            console.warn('\nWARNING: universalDoCheck must return a boolean value of either true or false\n');
                                        }
                                        else if (isStable !== true) {
                                            return checkStable(done, ref);
                                        }
                                    }
                                }
                                if (ngZone.isStable === true) {
                                    return done(ref);
                                }
                                return checkStable(done, ref);
                            }, 0);
                        });
                    }
                    return ngZone.runOutsideAngular(function () {
                        return new Promise(function (resolve) {
                            checkStable(resolve, compRef);
                        });
                    });
                }
                var stableComponents = components.map(function (compRef, i) {
                    var cmpInjector = compRef.injector;
                    var ngZone = cmpInjector.get(core_1.NgZone);
                    var http = cmpInjector.get(http_1.Http, null);
                    var jsonp = cmpInjector.get(http_1.Jsonp, null);
                    return rootNgZone.runOutsideAngular(outsideNg.bind(null, compRef, ngZone, http, jsonp));
                });
                return rootNgZone.runOutsideAngular(function () {
                    return Promise.all(stableComponents);
                })
                    .then(function () {
                    config.time && console.timeEnd('id: ' + config.id + ' stable: ');
                    return moduleRef;
                });
            },
            function injectPreboot(store, moduleRef) {
                var preboot = store.get('preboot');
                if (typeof preboot === 'boolean') {
                    if (!preboot) {
                        return moduleRef;
                    }
                    else {
                        preboot = {};
                    }
                }
                config.time && console.time('id: ' + config.id + ' preboot: ');
                var DOM = store.get('DOM');
                var DOCUMENT = store.get('DOCUMENT');
                var appRef = store.get('ApplicationRef');
                var selectorsList = moduleRef.bootstrapFactories.map(function (factory) { return factory.selector; });
                var bodyList = DOCUMENT.body.children.filter(function (el) { return Boolean(el.tagName); }).map(function (el) { return el.tagName.toLowerCase(); }).join(',');
                var components = appRef.components;
                var prebootCode = null;
                var prebootConfig = null;
                var key = (typeof preboot === 'object') && JSON.stringify(preboot) || null;
                var prebootEl = null;
                var el = null;
                var lastRef = null;
                try {
                    if (key && NodePlatform._cache.has(key)) {
                        prebootEl = NodePlatform._cache.get(key).prebootEl;
                    }
                    else if (key && !prebootEl) {
                        try {
                            prebootConfig = JSON.parse(key);
                        }
                        catch (e) {
                            prebootConfig = preboot;
                        }
                        if (!prebootConfig.appRoot) {
                            prebootConfig.appRoot = selectorsList;
                        }
                        if (!selectorsList) {
                            selectorsList = moduleRef.bootstrapFactories.map(function (factory) { return factory.selector; });
                        }
                        config.time && console.time('id: ' + config.id + ' preboot insert dom: ');
                        prebootCode = node_document_1.parseFragment('' +
                            '<script>\n' +
                            ' ' + preboot_1.getInlineCode(prebootConfig) +
                            '</script>' +
                            '');
                        prebootEl = DOM.createElement('div');
                        DOM.appendChild(prebootEl, prebootCode.childNodes[0]);
                        NodePlatform._cache.set(key, { prebootCode: prebootCode, prebootEl: prebootEl });
                        config.time && console.timeEnd('id: ' + config.id + ' preboot insert dom: ');
                    }
                    lastRef = { cmp: null, strIndex: -1, index: -1 };
                    selectorsList.forEach(function (select, i) {
                        var lastValue = bodyList.indexOf(select);
                        if (lastValue >= lastRef.strIndex) {
                            lastRef.strIndex = lastValue;
                            lastRef.cmp = components[i];
                        }
                    });
                    el = lastRef.cmp.location.nativeElement;
                    lastRef = null;
                    DOM.insertAfter(el, prebootEl);
                }
                catch (e) {
                    console.log(e);
                    config.time && console.timeEnd('id: ' + config.id + ' preboot: ');
                    return moduleRef;
                }
                config.time && console.timeEnd('id: ' + config.id + ' preboot: ');
                return moduleRef;
            },
            function dehydrateCache(store, moduleRef) {
                config.time && console.time('id: ' + config.id + ' universal cache: ');
                var appId = store.get('NODE_APP_ID', null);
                var UNIVERSAL_CACHE = store.get('UNIVERSAL_CACHE');
                var universalDoDehydrate = store.get('universalDoDehydrate');
                var cache = {};
                UNIVERSAL_CACHE['APP_ID'] = appId;
                Object.assign(cache, UNIVERSAL_CACHE);
                universalDoDehydrate(cache);
                Object.assign(UNIVERSAL_CACHE, cache);
                cache = null;
                config.time && console.timeEnd('id: ' + config.id + ' universal cache: ');
                return moduleRef;
            },
            function injectCacheInDocument(store, moduleRef) {
                config.time && console.time('id: ' + config.id + ' dehydrate: ');
                var universalAfterDehydrate = store.get('universalAfterDehydrate');
                var DOM = store.get('DOM');
                var UNIVERSAL_CACHE = store.get('UNIVERSAL_CACHE');
                var document = store.get('DOCUMENT');
                var script = null;
                var el = null;
                try {
                    config.time && console.time('id: ' + config.id + ' dehydrate insert dom: ');
                    el = DOM.createElement('universal-script');
                    script = node_document_1.parseFragment('' +
                        '<script>\n' +
                        ' try {' +
                        'window.UNIVERSAL_CACHE = (' + JSON.stringify(UNIVERSAL_CACHE) + ') || {};' +
                        '} catch(e) {' +
                        '  console.warn("Angular Universal: There was a problem parsing data from the server")' +
                        '}\n' +
                        '</script>' +
                        '');
                    DOM.appendChild(el, script.childNodes[0]);
                    DOM.appendChild(document, el);
                    el = null;
                    universalAfterDehydrate();
                    config.time && console.timeEnd('id: ' + config.id + ' dehydrate insert dom: ');
                }
                catch (e) {
                    config.time && console.timeEnd('id: ' + config.id + ' dehydrate: ');
                    return moduleRef;
                }
                config.time && console.timeEnd('id: ' + config.id + ' dehydrate: ');
                return moduleRef;
            },
            function destroyAppAndSerializeDocument(store, moduleRef) {
                config.time && console.time('id: ' + config.id + ' serialize: ');
                var universalOnRendered = store.get('universalOnRendered');
                var document = store.get('DOCUMENT');
                var appId = store.get('NODE_APP_ID');
                var appRef = store.get('ApplicationRef');
                var html = null;
                var destroyApp = null;
                var destroyModule = null;
                html = node_document_1.serializeDocument(document).replace(/%cmp%/g, appId);
                universalOnRendered(html);
                document = null;
                store.clear();
                destroyApp = function () {
                    appRef.ngOnDestroy();
                    appRef = null;
                    destroyApp = null;
                };
                destroyModule = function () {
                    moduleRef.destroy();
                    moduleRef = null;
                    destroyModule = null;
                };
                if (config.asyncDestroy) {
                    setTimeout(function () { return destroyApp() && setTimeout(destroyModule, 1); }, 1);
                }
                else {
                    destroyApp() && destroyModule();
                }
                config.time && console.timeEnd('id: ' + config.id + ' serialize: ');
                return html;
            },
        ]);
    };
    Object.defineProperty(NodePlatform.prototype, "injector", {
        get: function () {
            return this.platformRef.injector;
        },
        enumerable: true,
        configurable: true
    });
    NodePlatform.prototype.bootstrapModule = function (moduleType, compilerOptions) {
        var _this = this;
        if (NodePlatform._cache.has(moduleType)) {
            return this.platformRef.bootstrapModuleFactory(NodePlatform._cache.get(moduleType));
        }
        var compilerFactory = this._platformRef.injector.get(core_1.CompilerFactory);
        var compiler;
        if (compilerOptions) {
            compiler = compilerFactory.createCompiler(compilerOptions instanceof Array ? compilerOptions : [compilerOptions]);
        }
        else {
            compiler = compilerFactory.createCompiler();
        }
        return compiler.compileModuleAsync(moduleType)
            .then(function (moduleFactory) {
            NodePlatform._cache.set(moduleType, moduleFactory);
            return _this.platformRef.bootstrapModuleFactory(moduleFactory);
        });
    };
    NodePlatform.prototype.bootstrapModuleFactory = function (moduleFactory) {
        return this.platformRef.bootstrapModuleFactory(moduleFactory);
    };
    Object.defineProperty(NodePlatform.prototype, "disposed", {
        get: function () { return this.platformRef.destroyed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodePlatform.prototype, "destroyed", {
        get: function () { return this.platformRef.destroyed; },
        enumerable: true,
        configurable: true
    });
    NodePlatform.prototype.destroy = function () { return this.platformRef.destroy(); };
    NodePlatform.prototype.dispose = function () { return this.destroy(); };
    NodePlatform.prototype.registerDisposeListener = function (dispose) {
        return this.platformRef.onDestroy(dispose);
    };
    NodePlatform.prototype.onDestroy = function (callback) {
        this._platformRef = null;
        return this.platformRef.onDestroy(callback);
    };
    NodePlatform._noop = function () { };
    NodePlatform._cache = new Map();
    return NodePlatform;
}());
exports.NodePlatform = NodePlatform;
function asyncPromiseSeries(store, modRef, errorHandler, cancelHandler, config, middleware, timer) {
    if (timer === void 0) { timer = 1; }
    var errorCalled = false;
    config.time && console.time('id: ' + config.id + ' asyncPromiseSeries: ');
    return middleware.reduce(function reduceAsyncPromiseSeries(promise, cb, currentIndex, currentArray) {
        if (errorCalled || cancelHandler()) {
            return promise;
        }
        return promise.then(function reduceAsyncPromiseSeriesChain(ref) {
            if (errorCalled || cancelHandler()) {
                return ref;
            }
            return new Promise(function reduceAsyncPromiseSeriesPromiseChain(resolve, reject) {
                setTimeout(function () {
                    if (errorCalled || cancelHandler()) {
                        return resolve(ref);
                    }
                    try {
                        resolve(cb(store, ref));
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            });
        }).catch(function (err) {
            errorCalled = true;
            return errorHandler(err, store, modRef, currentIndex, currentArray);
        });
    }, Promise.resolve(modRef)).then(function (val) {
        config.time && console.timeEnd('id: ' + config.id + ' asyncPromiseSeries: ');
        if (cancelHandler()) {
            return errorHandler(null, store, modRef, null, null);
        }
        return val;
    });
}
var NodeEventManager = (function () {
    function NodeEventManager(plugins, _document, _zone) {
        var _this = this;
        this._document = _document;
        this._zone = _zone;
        plugins.forEach(function (p) { return p.manager = _this; });
        this._plugins = plugins.slice().reverse();
    }
    NodeEventManager.prototype.getWindow = function () { return this._document._window; };
    NodeEventManager.prototype.getDocument = function () { return this._document; };
    NodeEventManager.prototype.getZone = function () { return this._zone; };
    NodeEventManager.prototype.addEventListener = function (element, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
    };
    NodeEventManager.prototype.addGlobalEventListener = function (target, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
    };
    NodeEventManager.prototype._findPluginFor = function (eventName) {
        var plugins = this._plugins;
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            if (plugin.supports(eventName)) {
                return plugin;
            }
        }
        throw new Error("No event manager plugin found for event " + eventName);
    };
    NodeEventManager = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(platform_browser_1.EVENT_MANAGER_PLUGINS)),
        __param(1, core_1.Inject(platform_browser_1.DOCUMENT)), 
        __metadata('design:paramtypes', [Array, Object, core_1.NgZone])
    ], NodeEventManager);
    return NodeEventManager;
}());
exports.NodeEventManager = NodeEventManager;
var NodeDomEventsPlugin = (function () {
    function NodeDomEventsPlugin() {
    }
    NodeDomEventsPlugin.prototype.supports = function (eventName) { return true; };
    NodeDomEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var zone = this.manager.getZone();
        var outsideHandler = function (event) { return zone.runGuarded(function () { return handler(event); }); };
        return this.manager.getZone().runOutsideAngular(function () {
            return get_dom_1.getDOM().onAndCancel(element, eventName, outsideHandler);
        });
    };
    NodeDomEventsPlugin.prototype.addGlobalEventListener = function (target, eventName, handler) {
        var window = this.manager.getWindow();
        var document = this.manager.getDocument();
        var zone = this.manager.getZone();
        var element;
        switch (target) {
            case 'window':
                element = document._window;
                break;
            case 'document':
                element = document;
                break;
            case 'body':
                element = document.body;
                break;
        }
        var outsideHandler = function (event) { return zone.runGuarded(function () { return handler(event); }); };
        return this.manager.getZone().runOutsideAngular(function () {
            return get_dom_1.getDOM().onAndCancel(element, eventName, outsideHandler);
        });
    };
    NodeDomEventsPlugin = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NodeDomEventsPlugin);
    return NodeDomEventsPlugin;
}());
exports.NodeDomEventsPlugin = NodeDomEventsPlugin;
function _APP_BASE_HREF(zone) {
    return Zone.current.get('baseUrl');
}
exports._APP_BASE_HREF = _APP_BASE_HREF;
function _REQUEST_URL(zone) {
    return Zone.current.get('requestUrl');
}
exports._REQUEST_URL = _REQUEST_URL;
function _ORIGIN_URL(zone) {
    return Zone.current.get('originUrl');
}
exports._ORIGIN_URL = _ORIGIN_URL;
var NodeModule = (function () {
    function NodeModule(parentModule) {
        if (parentModule) {
            throw new Error("NodeModule has already been loaded.");
        }
    }
    NodeModule.forRoot = function (document, config) {
        if (config === void 0) { config = {}; }
        var _config = Object.assign({}, { document: document }, config);
        return NodeModule.withConfig(_config);
    };
    NodeModule.withConfig = function (config) {
        if (config === void 0) { config = {}; }
        var providers = tokens_1.createUrlProviders(config);
        return {
            ngModule: NodeModule,
            providers: providers.slice()
        };
    };
    NodeModule = __decorate([
        core_1.NgModule({
            providers: [
                { provide: common_1.PlatformLocation, useClass: node_location_1.NodePlatformLocation },
                __private_imports__1.BROWSER_SANITIZATION_PROVIDERS,
                { provide: core_1.ErrorHandler, useFactory: _errorHandler, deps: [] },
                { provide: platform_browser_1.DOCUMENT, useFactory: _document, deps: _documentDeps },
                NodeDomEventsPlugin,
                { provide: __private_imports__1.DomEventsPlugin, useExisting: NodeDomEventsPlugin, multi: true },
                { provide: platform_browser_1.EVENT_MANAGER_PLUGINS, useExisting: NodeDomEventsPlugin, multi: true },
                { provide: platform_browser_1.EVENT_MANAGER_PLUGINS, useClass: __private_imports__1.KeyEventsPlugin, multi: true },
                { provide: platform_browser_1.EVENT_MANAGER_PLUGINS, useClass: __private_imports__1.HammerGesturesPlugin, multi: true },
                { provide: platform_browser_1.HAMMER_GESTURE_CONFIG, useClass: platform_browser_1.HammerGestureConfig },
                NodeEventManager,
                { provide: platform_browser_1.EventManager, useExisting: NodeEventManager },
                { provide: platform_browser_1.AnimationDriver, useFactory: _resolveDefaultAnimationDriver, deps: [] },
                core_1.Testability,
                node_renderer_1.NodeDomRootRenderer,
                { provide: __private_imports__1.DomRootRenderer, useExisting: node_renderer_1.NodeDomRootRenderer },
                { provide: core_1.RootRenderer, useExisting: __private_imports__1.DomRootRenderer },
                node_shared_styles_host_1.NodeSharedStylesHost,
                { provide: __private_imports__1.SharedStylesHost, useExisting: node_shared_styles_host_1.NodeSharedStylesHost },
                { provide: __private_imports__1.DomSharedStylesHost, useExisting: node_shared_styles_host_1.NodeSharedStylesHost },
                { provide: common_1.APP_BASE_HREF, useFactory: _APP_BASE_HREF, deps: [core_1.NgZone] },
                { provide: tokens_1.REQUEST_URL, useFactory: _REQUEST_URL, deps: [core_1.NgZone] },
                { provide: tokens_1.ORIGIN_URL, useFactory: _ORIGIN_URL, deps: [core_1.NgZone] },
                { provide: core_1.APP_ID, useValue: '%cmp%' },
                { provide: core_1.TestabilityRegistry, useValue: { registerApplication: function () { return null; } } }
            ],
            exports: [common_1.CommonModule, core_1.ApplicationModule]
        }),
        __param(0, core_1.Optional()),
        __param(0, core_1.SkipSelf()), 
        __metadata('design:paramtypes', [NodeModule])
    ], NodeModule);
    return NodeModule;
}());
exports.NodeModule = NodeModule;
function initParse5Adapter() {
    parse5_adapter_1.Parse5DomAdapter.makeCurrent();
}
exports.INTERNAL_NODE_PLATFORM_PROVIDERS = [
    { provide: core_1.PLATFORM_INITIALIZER, useValue: initParse5Adapter, multi: true },
];
exports.platformNodeDynamic = function (extraProviders, platform) {
    if (!platform) {
        if (!getPlatformRef()) {
            platform = core_1.createPlatformFactory(compiler_1.platformCoreDynamic, 'nodeDynamic', exports.INTERNAL_NODE_PLATFORM_PROVIDERS)(extraProviders);
            setPlatformRef(platform);
        }
        else {
            platform = getPlatformRef();
        }
    }
    return new NodePlatform(platform);
};