var pb = require('../test/helpers/pb_mock').getMockPB();
var CrawlService = require('../services/crawl_service')(pb);
var Crawler = require('simplecrawler');
var MockCrawler = require('../test/helpers/crawler_mock');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

describe('When crawling a pencilblue site', function(){
  var crawlService,
    crawlerStub,
    settingsKVStub;

  before(function(){
    var mockCrawler = new MockCrawler();
    crawlerStub = sinon.stub(Crawler.prototype, 'start', mockCrawler.start);
    settingsKVStub = sinon.stub(pb.PluginService.prototype, 'getSettingsKV');
    settingsKVStub.yields(null, getValidSettingsResponse());
    crawlService = new CrawlService();
  });

  it('should have name', function() {
    var name = CrawlService.getName();
    expect(name).to.equal('crawlService');
  });

  it('should initialize', function(done) {
    CrawlService.init(function(err,success) {
      expect(err).to.equal(null);
      expect(success).to.equal(true);
      done();
    });
  });

  it('just check the pages passed in', function(done){
    crawlService.crawlSite("http://dev.careerbuildercareers.com:8080", function(pages){
      expect(pages.length).to.equal(3);
      console.log(pages);
      done();
    });  
  });

  after(function() {
    crawlerStub.restore();
    settingsKVStub.restore();
  });
});

function getValidSettingsResponse() {
  return {
    crawl_paths_csv: '/,/search',
    ignore_path_csv: '/api/localization/script,/public/,/bower_components/',
    exclude_sitemap_path_csv: '/join,/search'
  };
}