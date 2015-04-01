module.exports = function SiteMapModule(pb){
    var util = require("util");

    var pluginService = new pb.PluginService();
    var CrawlService = pluginService.getService('crawlService', 'pencilblue_sitemap');
    var SitemapService = pluginService.getService('sitemapService', 'pencilblue_sitemap');

    function SiteMapController() {}

    util.inherits(SiteMapController, pb.BaseController);

    SiteMapController.prototype.SiteMap = function(cb){
        var sitemapService = new SitemapService();
        var crawlService = new CrawlService();
        sitemapService.getSiteMap(function(xml){
            crawlService.crawlSite(pb.config.siteRoot, function(pages){
                sitemapService.updateSiteMap(pages, function(xml){
                    pb.log.silly("Sitemap update complete.  Result: " + xml);
                });
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
    
    return SiteMapController;
}