module.exports = function SiteMapModule(pb){
  var util = pb.util,
    options,
    CrawlService,
    SitemapService;

  function SiteMapController() {
     options = {
        site: this.site,
        onlyThisSite: this.onlyThisSite,
        hostname: this.hostname
      },
      CrawlService = pb.PluginService.getService('crawlService', 'pencilblue_sitemap', this.site),
      SitemapService = pb.PluginService.getService('sitemapService', 'pencilblue_sitemap', this.site);
  }

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