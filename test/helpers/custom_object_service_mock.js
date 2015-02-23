function CustomObjectService() {}
CustomObjectService.xmlUpdate = false;
var xml = require('./xml_mock').xml;

CustomObjectService.prototype.save = function(document, type, cb){
    cb(undefined, 1);
};
CustomObjectService.prototype.loadTypeByName = function(name, cb){
    cb(undefined, {});
};
CustomObjectService.prototype.findByType = function(type, options, cb){
    cb(undefined, [{xml: xml}]);
};

module.exports = CustomObjectService;