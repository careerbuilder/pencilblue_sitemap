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