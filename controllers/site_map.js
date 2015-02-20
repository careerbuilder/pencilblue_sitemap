var pb = global.pb;
var util = global.util;

var sm = require('sitemap');
var CrawlService = pb.plugins.getService('crawlService', 'pencilblue_sitemap');
var SitemapService = pb.plugins.getService('sitemapService', 'pencilblue_sitemap');

function SiteMapController() {}

util.inherits(SiteMapController, pb.BaseController);

SiteMapController.prototype.SiteMap = function(cb){
    var sitemapService = new SitemapService();
    var crawlService = new CrawlService();
    sitemapService.getSiteMap(function(xml){
        crawlService.crawlSite(pb.config.siteRoot, function(pages){
            sitemapService.updateSiteMap(pages);
        });
        cb({
            code:200,
            content_type: 'application/xml',
            content: xml
        });
    });
};

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