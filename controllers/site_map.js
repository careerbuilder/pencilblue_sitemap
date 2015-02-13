var pb = global.pb;
var util = global.util;

var sm = require('sitemap');

function SiteMapController() {}

util.inherits(SiteMapController, pb.BaseController);

SiteMapController.prototype.SiteMap = function(cb){
    var dao = new pb.DAO();
    var options = {
        where: {
            draft:{$ne: 1}
        },
        select: {
            url: 1
        }
    };
    
    dao.q('page', options, function(err, pages){
        console.log(pages);
        var urls = [];
        pages.forEach(function(page){
            console.log(page);
            urls.push({
                url: pb.config.siteRoot + '/page/' + page.url,
                priority: 0.3
            });
        });
        var sitemap = sm.createSitemap({
            hostname: pb.config.siteRoot,
            cacheTime: 0,
            urls:urls
        });
        sitemap.toXML(function(xml){
            var content = {
                code: 200,
                content_type: 'application/xml',
                content: xml
            };
            cb(content);
        });
    });
}

SiteMapController.getRoutes = function(cb){
    var routes = [
        {
            method: 'get',
            path: '/sitemap.xml',
            content_type: 'application/xml',
            handler: "SiteMap"
        }
    ];
    
    cb(null, routes);
};

module.exports = SiteMapController;