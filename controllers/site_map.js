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
      pb.log.debug("SiteMapController: SITEMAP=" + JSON.stringify(xml));
      self.crawlService.crawlSite(self.hostname, function(pages) {
        self.sitemapService.updateSiteMap(pages, function(xml){
          pb.log.debug("SiteMapController: Sitemap update complete: " + JSON.stringify(xml));
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