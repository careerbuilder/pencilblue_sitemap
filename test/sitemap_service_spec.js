var mockService = require('../test/helpers/pb_mock_service');
var pb = mockService.getMockPB();
var SitemapService = require('../services/sitemap_service');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var sm = require('sitemap');

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
    
    it('should return something', function(done){
        sitemapService.getSiteMap(function(xml){
            expect(xml).to.equal('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url> <loc>http://dev.careerbuildercareers.com:8080</loc><changefreq>weekly</changefreq> <priority>1</priority> </url></urlset>');
            done();
        });
    });
    
    it('', function(done){
        sitemapService.updateSiteMap(pages, function(xml){
            sitemap.toXML(function(sitemapXml){
                expect(xml).to.equal(sitemapXml);
                done();
            });
        });
    });
});