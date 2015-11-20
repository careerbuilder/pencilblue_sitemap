module.exports = function SitemapServiceModule(pb){
  var sm = require('sitemap');

  /**
  * Service for access to careerbuilder Job APIs
  */
  function SitemapService(options) {
    this.site = options.site || '';
    this.onlyThisSite = options.onlyThisSite;
    this.hostname = options.hostname;
    this.cos = new pb.CustomObjectService(this.site, this.onlyThisSite)
  }


  /**
  * This function is called when the service is being setup by the system.  It is
  * responsible for any setup that is needed when first created.  The services
  * are all instantiated at once and are not added to the platform untill all
  * initialization is complete.  Relying on other plugin services in the
  * initialization could result in failure.
  *
  * @static
  * @method init
  * @param cb A callback that should provide one argument: cb(error) or cb(null)
  * if initialization proceeded successfully.
  */
  SitemapService.init = function(cb) {
    pb.log.debug("SitemapService: Initialized");
    cb(null, true);
  };

  /**
  * A service interface function designed to allow developers to name the handle
  * to the service object what ever they desire. The function must return a
  * valid string and must not conflict with the names of other services for the
  * plugin that the service is associated with.
  *
  * @static
  * @method getName
  * @return {String} The service name
  */
  SitemapService.getName = function() {
    return "sitemapService";
  };

  SitemapService.prototype.getSiteMap = function(cb){
    var self = this;
    loadSitemap(self, function(siteMapDoc){
      if(!siteMapDoc) {
        return cb('');
      }

      cb(siteMapDoc.xml);
    });
  };

  SitemapService.prototype.updateSiteMap = function(pages, cb){
    var self = this;
    var sitemap = sm.createSitemap({
      hostname: this.hostname,
      cacheTime: 0,
      urls:pages
    }); 
    sitemap.toXML(function(xml){
      saveSiteMap(self, xml);
      cb(xml);
    });
  };

  function loadSitemap(self, cb){
    //Loading the siteMap cos type from global is required if we only want to install the sitemap globally
    var globalCos = new pb.CustomObjectService();
    globalCos.loadTypeByName('siteMap', function(err, siteMapType){
      if (err){
        pb.log.error(err);
        return cb();
      }

      self.cos.findByType(siteMapType, {}, function(err, siteMap){
        if (err){
          pb.log.error(err);
          return cb();
        }

        if (siteMap && siteMap.length > 0){
            return cb(siteMap[0], siteMapType);
        }

        cb();
      });
    });
  }

  function saveSiteMap(self, xml){
    loadSitemap(self, function(siteMapDoc, siteMapType){
      if(!siteMapDoc) {
        var siteMapObject = {
          type: siteMapType._id.toString(),
          name: siteMapType.name,
          host: self.hostname
        };
        siteMapDoc = pb.DocumentCreator.create('custom_object', siteMapObject);
      }

      siteMapDoc.xml = xml;
      self.cos.save(siteMapDoc, siteMapType, function (err, result) {
        if (err) {
          pb.log.error(err);
        }
      });
    });
  }

  return SitemapService;
};