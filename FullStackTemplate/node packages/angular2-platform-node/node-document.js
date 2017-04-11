"use strict";
var get_dom_1 = require('./get-dom');
var parse5 = require('parse5');
var treeAdapter = parse5.treeAdapters.htmlparser2;
function isTag(tagName, node) {
    return node.type === 'tag' && node.name === tagName;
}
exports.isTag = isTag;
function parseFragment(el) {
    return parse5.parseFragment(el, { treeAdapter: parse5.treeAdapters.htmlparser2 });
}
exports.parseFragment = parseFragment;
function parseDocument(documentHtml) {
    if (documentHtml === undefined) {
        throw new Error('parseDocument requires a document string');
    }
    if (typeof documentHtml !== 'string') {
        throw new Error('parseDocument needs to be a string to be parsed correctly');
    }
    var doc = parse5.parse(documentHtml, { treeAdapter: parse5.treeAdapters.htmlparser2 });
    var rootNode = undefined;
    var bodyNode = undefined;
    var headNode = undefined;
    var titleNode = undefined;
    for (var i = 0; i < doc.childNodes.length; ++i) {
        var child = doc.childNodes[i];
        if (isTag('html', child)) {
            rootNode = child;
            break;
        }
    }
    if (!rootNode) {
        rootNode = doc;
    }
    for (var i = 0; i < rootNode.childNodes.length; ++i) {
        var child = rootNode.childNodes[i];
        if (isTag('head', child)) {
            headNode = child;
        }
        if (isTag('body', child)) {
            bodyNode = child;
        }
    }
    if (!headNode) {
        headNode = treeAdapter.createElement('head', null, []);
        get_dom_1.getDOM().appendChild(doc, headNode);
    }
    if (!bodyNode) {
        bodyNode = treeAdapter.createElement('body', null, []);
        get_dom_1.getDOM().appendChild(doc, bodyNode);
    }
    for (var i = 0; i < headNode.childNodes.length; ++i) {
        if (isTag('title', headNode.childNodes[i])) {
            titleNode = headNode.childNodes[i];
            break;
        }
    }
    if (!titleNode) {
        titleNode = treeAdapter.createElement('title', null, []);
        get_dom_1.getDOM().appendChild(headNode, titleNode);
    }
    doc._window = {};
    doc.head = headNode;
    doc.body = bodyNode;
    var titleNodeText = titleNode.childNodes[0];
    Object.defineProperty(doc, 'title', {
        get: function () { return titleNodeText.data; },
        set: function (newTitle) { return titleNodeText.data = newTitle; }
    });
    return doc;
}
exports.parseDocument = parseDocument;
function serializeDocument(document, pretty) {
    var doc = parse5.serialize(document, { treeAdapter: parse5.treeAdapters.htmlparser2 });
    if (pretty) {
        var beautify = require('js-beautify');
        return beautify.html(doc, { indent_size: 2 });
    }
    return doc;
}
exports.serializeDocument = serializeDocument;