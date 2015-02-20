function CustomObjectService() {}
CustomObjectService.xmlUpdate = false;
var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url> <loc>http://dev.careerbuildercareers.com:8080</loc><changefreq>weekly</changefreq> <priority>1</priority> </url></urlset>';

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