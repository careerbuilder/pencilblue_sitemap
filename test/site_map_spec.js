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

var pb = require('./helpers/pb_mock').getMockPB(),
  CrawlService = require('../services/crawl_service')(pb),
  SitemapService = require('../services/sitemap_service')(pb),
  sitemapXml = require('./helpers/xml_mock').xml,
  chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect;

describe('Site Map Controller', function () {
  var SiteMapController,
    siteMapController,
    crawlSiteStub,
    getSiteMapStub,
    updateSiteMapStub,
    pluginServiceStub;

  before(function () {
    crawlSiteStub = sinon.stub(CrawlService.prototype, 'crawlSite');
    crawlSiteStub.yields(getPages());
    getSiteMapStub = sinon.stub(SitemapService.prototype, 'getSiteMap');
    getSiteMapStub.yields(sitemapXml);
    updateSiteMapStub = sinon.stub(SitemapService.prototype, 'updateSiteMap');
    updateSiteMapStub.yields(sitemapXml);
    pluginServiceStub = sinon.stub(pb.PluginService.prototype, 'getService');
    pluginServiceStub.withArgs('crawlService', 'pencilblue_sitemap').returns(CrawlService);
    pluginServiceStub.withArgs('sitemapService', 'pencilblue_sitemap').returns(SitemapService);
    SiteMapController = require('../controllers/site_map')(pb);
    siteMapController = new SiteMapController();
  });

  it('should be a SiteMap object', function () {
    expect(siteMapController).to.be.instanceof(SiteMapController);
  });

  it('controller should have routes', function (done) {
    SiteMapController.getRoutes(function (err, routes) {
      expect(err).to.equal(null);
      expect(routes).to.have.length.above(0);
      done();
    });
  });

  it('controller should return content', function(done) {
    siteMapController.SiteMap(function(response) {
      expect(response).to.not.equal(null);
      expect(response).to.have.property('code', 200);
      expect(response).to.have.property('content_type', 'application/xml');
      expect(response).to.have.property('content', sitemapXml);
      done();
    });
  });
});

function getPages() {
  var pages = [];
  pages.push({
    url: "http://dev.careerbuildercareers.com:8080",
    priority: 1.0
  });
  pages.push({
    url: "http://dev.careerbuildercareers.com:8080/job/jobtitle/jobid/",
    priority: 0.5
  });
  return pages;
}