var CrawlService = require('../services/crawl_service');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;


describe('When crawling a pencilblue site', function(){
    var crawlService;
    
    before(function(){
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