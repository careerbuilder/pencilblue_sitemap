var mockService = require('../test/helpers/pb_mock_service');
var CrawlService = require('../services/crawl_service')(mockService.getMockPB());
var Crawler = require('simplecrawler');
var MockCrawler = require('../test/helpers/crawler_mock');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

describe('When crawling a pencilblue site', function(){
  var crawlService;
  before(function(){
    var mockCrawler = new MockCrawler();
    var crawlerStub = sinon.stub(Crawler.prototype, "start", mockCrawler.start);
    crawlService = new CrawlService();
  });
  //Event driven process, test cases are determined by event driven data defined in crawler_mock.js
  it('just check the pages passed in', function(done){
    crawlService.crawlSite("http://dev.careerbuildercareers.com:8080", function(pages){
      expect(pages.length).to.equal(3);
        done();
    });  
  });
});