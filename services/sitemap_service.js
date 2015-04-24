module.exports = function SitemapServiceModule(pb){
  var sm = require('sitemap');
  var cos = new pb.CustomObjectService();
  var mySiteMapDoc;
  var mySiteMapType;

  /**
  * Service for access to careerbuilder Job APIs
  */
  function SitemapService() {}


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
    loadSitemap(function(siteMapDoc){
      if(siteMapDoc === null){
        cb('');
      }
      else{
        mySiteMapDoc = siteMapDoc;
        cb(siteMapDoc.xml);
      }
    });
  };

  SitemapService.prototype.updateSiteMap = function(pages, cb){
    pb.log.silly("Updating Sitemap");
    var sitemap = sm.createSitemap({
      hostname: pb.config.siteRoot,
      cacheTime: 0,
      urls:pages
    }); 
    sitemap.toXML(function(xml){
      saveSiteMap(xml);
      cb(xml);
    });
  };

  function loadSitemap(cb){
    cos.loadTypeByName('siteMap', function(err, siteMapType){
      mySiteMapType = siteMapType;
      if(err){
        pb.log.error(err);
      }
      else{
        cos.findByType(siteMapType, {}, function(err, siteMap){
          if(err){
            pb.log.error(err);
          }
          if(siteMap.length > 0){
            cb(siteMap[0]);
          }
          else{
            cb(null);
          }
        });
      }
    });
  }

  function saveSiteMap(xml){
    cos.loadTypeByName('siteMap', function(err, siteMapType) {
      if (mySiteMapDoc === undefined) {
        mySiteMapDoc = {
          type: siteMapType._id.toString(),
          name: siteMapType.name,
          host: pb.config.siteRoot
        };
      }
      mySiteMapDoc.xml = xml;
      var document = pb.DocumentCreator.create('custom_object', mySiteMapDoc);
      cos.save(document, mySiteMapType, function (err, result) {
        if (err) {
          pb.log.error(err);
        }
        else {
          pb.log.info("Sitemap custom object save/update count: " + result);
        }
      });
    });
  }

  return SitemapService;
};