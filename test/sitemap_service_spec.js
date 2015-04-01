var mockService = require('../test/helpers/pb_mock_service');
var pb = mockService.getMockPB();
var SitemapService = require('../services/sitemap_service')(pb);
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var sm = require('sitemap');
var mockxml = require('../test/helpers/xml_mock').xml;

describe('When getting and updating a sitemap', function(){
    var sitemapService;
    var sitemap;
    var pages = [];
    before(function(){
        sitemapService = new SitemapService();
        pages.push({
            url: "http://dev.careerbuildercareers.com:8080",
            priority: 1.0
        });
        pages.push({
            url: "http://dev.careerbuildercareers.com:8080/job/jobtitle/jobid/",
            priority: 0.5
        });
        sitemap = sm.createSitemap({
            hostname: 'dev.careerbuildercareers.com',
            cacheTime: 0,
            urls: pages
        });
    });
    
    it('should return xml document from custom object service', function(done){
        sitemapService.getSiteMap(function(xml){
            expect(xml).to.equal(mockxml);
            done();
        });
    });
    
    it('should update sitemap and return the result xml', function(done){
        sitemapService.updateSiteMap(pages, function(xml){
            sitemap.toXML(function(sitemapXml){
                expect(xml).to.equal(sitemapXml);
                done();
            });
        });
    });
});