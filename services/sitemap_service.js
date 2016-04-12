/*
 Copyright (C) 2015  Careerbuilder, LLC

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var sm = require('sitemap');
module.exports = function SitemapServiceModule(pb){

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
    loadSitemap(self, function(err, siteMapType, siteMapDoc){
      if (err) {
        pb.log.error(err);
        return cb('');
      }

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
        return cb(err);
      }

      if (!siteMapType) {
        return cb(new Error("The siteMap custom object type is null or undefined."))
      }

      self.cos.findByType(siteMapType, {}, function(err, siteMap){
        if (err){
          return cb(err);
        }

        if (siteMap && siteMap.length > 0){
            return cb(null, siteMapType, siteMap[0]);
        }

        cb(null, siteMapType);
      });
    });
  }

  function saveSiteMap(self, xml){
    loadSitemap(self, function(err, siteMapType, siteMapDoc){
      if(err) {
        pb.log.error(err);
        return;
      }

      if(!siteMapDoc) {
        var siteMapObject = {
          type: siteMapType._id.toString(),
          name: siteMapType.name + self.site,
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
