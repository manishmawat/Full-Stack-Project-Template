"use strict";
var lib_1 = require('../lib');
var ProxyElement = (function () {
    function ProxyElement(__zone) {
        this.__zone = __zone;
    }
    Object.defineProperty(ProxyElement.prototype, "_zone", {
        get: function () { return this.__zone || Zone.current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "querySelector", {
        get: function () {
            var parentElement = this._zone.get('parentElement');
            var _zone = this._zone.fork({
                name: 'ProxyElement.querySelector',
                properties: { parentElement: parentElement }
            });
            return _zone.wrap(querySelector, 'ProxyElement.querySelector');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "querySelectorAll", {
        get: function () {
            var parentElement = this._zone.get('parentElement');
            var _zone = this._zone.fork({
                name: 'ProxyElement.querySelectorAll',
                properties: { parentElement: parentElement }
            });
            return _zone.wrap(querySelectorAll, 'ProxyElement.querySelector');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "tagName", {
        get: function () {
            var el = this._zone.get('element');
            return el.tagName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "value", {
        get: function () {
            var el = this._zone.get('element');
            return el.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "nodeName", {
        get: function () {
            var el = this._zone.get('element');
            return el.tagName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "nodeValue", {
        get: function () {
            var el = this._zone.get('element');
            return el.nodeValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "firstChild", {
        get: function () {
            var DOM = lib_1.getDOM();
            var parentElement = this._zone.get('element');
            var _zone = this._zone.fork({
                name: 'ProxyElement.querySelector',
                properties: { parentElement: parentElement }
            });
            return _zone.run(function () { return DOM.firstChild(parentElement); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "nextSibling", {
        get: function () {
            var el = this._zone.get('element');
            return el.nextSibling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "parentElement", {
        get: function () {
            var el = this._zone.get('element');
            return el.parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyElement.prototype, "childNodes", {
        get: function () {
            var DOM = lib_1.getDOM();
            var parentElement = this._zone.get('element');
            var _zone = this._zone.fork({
                name: 'ProxyElement.querySelector',
                properties: { parentElement: parentElement }
            });
            return _zone.run(function () { return DOM.childNodes(parentElement); });
        },
        enumerable: true,
        configurable: true
    });
    ProxyElement.prototype.createElement = function (tagName) {
        var DOM = lib_1.getDOM();
        return DOM.createElement(tagName);
    };
    return ProxyElement;
}());
exports.ProxyElement = ProxyElement;
var ProxyDocument = (function () {
    function ProxyDocument(__zone) {
        this.__zone = __zone;
    }
    Object.defineProperty(ProxyDocument.prototype, "_zone", {
        get: function () { return this.__zone || Zone.current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyDocument.prototype, "querySelector", {
        get: function () {
            var document = this._zone.get('document');
            var zone = this._zone.fork({
                name: 'ProxyDocument.querySelector',
                properties: {
                    parentElement: document
                }
            });
            return zone.wrap(querySelector, 'ProxyDocument.querySelector');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyDocument.prototype, "querySelectorAll", {
        get: function () {
            var document = this._zone.get('document');
            var _zone = this._zone.fork({
                name: 'ProxyDocument.querySelectorAll',
                properties: {
                    parentElement: document
                }
            });
            return _zone.wrap(querySelectorAll, 'ProxyDocument.querySelector');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyDocument.prototype, "tagName", {
        get: function () {
            var el = this._zone.get('document');
            return el.tagName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyDocument.prototype, "cookie", {
        get: function () {
            var el = this._zone.get('cookie');
            return el.cookie;
        },
        enumerable: true,
        configurable: true
    });
    ProxyDocument.prototype.createElement = function (tagName) {
        var DOM = lib_1.getDOM();
        return DOM.createElement(tagName);
    };
    return ProxyDocument;
}());
exports.ProxyDocument = ProxyDocument;
function createDocumentProxy() {
    return new ProxyDocument();
}
exports.createDocumentProxy = createDocumentProxy;
function createGlobalProxy() {
    var originalDocumentRef = global.document;
    if (originalDocumentRef instanceof ProxyDocument) {
        return originalDocumentRef;
    }
    var document = createDocumentProxy();
    Object.defineProperty(global, 'document', {
        enumerable: false,
        configurable: false,
        get: function () {
            var doc = Zone.current.get('document');
            if (doc) {
                return document;
            }
            return originalDocumentRef;
        },
        set: function (newValue) {
        }
    });
}
exports.createGlobalProxy = createGlobalProxy;
function querySelector(query) {
    var DOM = lib_1.getDOM();
    var parentElement = Zone.current.get('parentElement');
    var element = DOM.querySelector(parentElement, query);
    var zone = Zone.current.fork({
        name: 'querySelector',
        properties: { parentElement: parentElement, element: element }
    });
    return new ProxyElement(zone);
}
function querySelectorAll(query) {
    var DOM = lib_1.getDOM();
    var parentElement = Zone.current.get('parentElement');
    var element = DOM.querySelectorAll(parentElement, query);
    var zone = Zone.current.fork({
        name: 'querySelector',
        properties: { parentElement: parentElement, element: element }
    });
    return new ProxyElement(zone);
}