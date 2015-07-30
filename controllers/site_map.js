module.exports = function SiteMapModule(pb){
  var util = require("util"),
      options = {
        site: this.site,
        onlyThisSite: this.onlyThisSite,
        hostname: this.hostname
      },
      pluginService = new pb.PluginService(options),
      CrawlService = pluginService.getService('crawlService', 'pencilblue_sitemap'),
      SitemapService = pluginService.getService('sitemapService', 'pencilblue_sitemap');
  function SiteMapController() {}

  util.inherits(SiteMapController, pb.BaseController);

  SiteMapController.prototype.SiteMap = function(cb) {
    var self = this;
    var sitemapService = new SitemapService(options);
    var crawlService = new CrawlService(options);
    sitemapService.getSiteMap(function(xml){
      pb.log.info("SITE MAP: " + xml);
      crawlService.crawlSite(self.hostname, function(pages) {
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
};