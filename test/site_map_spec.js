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
    pluginServiceStub = sinon.stub(pb.PluginService, 'getService');
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