function DocumentCreator() {}
DocumentCreator.xmlUpdate = false;
var xml = require('./xml_mock').xml;

DocumentCreator.create = function(documentType, document){
    return document;
};

module.exports = DocumentCreator;