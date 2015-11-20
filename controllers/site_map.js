module.exports = function SiteMapModule(pb){
  var util = pb.util,
    BaseController = pb.BaseController;

  util.inherits(SiteMapController, pb.BaseController);

  function SiteMapController() {}

  SiteMapController.prototype.init = function(props, cb) {
    var self = this;
    BaseController.prototype.init.call(self, props, function () {
      var options = {
        site: self.context.site ,
        onlyThisSite: self.context.onlyThisSite,
        hostname: self.context.hostname
      };
      self.crawlService = new (pb.PluginService.getService('crawlService', 'pencilblue_sitemap', self.site))(options);
      self.sitemapService = new (pb.PluginService.getService('sitemapService', 'pencilblue_sitemap', self.site))(options);
      cb();
    });
  };

  SiteMapController.prototype.SiteMap = function(cb) {
    var self = this;
    self.sitemapService.getSiteMap(function(xml){
      pb.log.info("SITE MAP: " + xml);
      self.crawlService.crawlSite(self.hostname, function(pages) {
        self.sitemapService.updateSiteMap(pages, function(xml){
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