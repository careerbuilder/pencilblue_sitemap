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

var pb = require('../test/helpers/pb_mock_service').getMockPB(),
  sinon = require('sinon'),
  chai = require('chai'),
  expect = chai.expect,
  sm = require('sitemap'),
  mockxml = require('./helpers/xml_mock').xml;

describe('When using sitemap service', function() {
  var SitemapService,
    sitemapService;

  before(function() {
    SitemapService = require('../services/sitemap_service')(pb);
    sitemapService = new SitemapService({site : 'testSite', onlyThisSite : false});
  });

  it('should have name', function() {
    var name = SitemapService.getName();
    expect(name).to.equal('sitemapService');
  });

  it('should initialize', function(done) {
    SitemapService.init(function(err,success) {
      expect(err).to.equal(null);
      expect(success).to.equal(true);
      done();
    });
  });
});

describe('When getting sitemap', function(){
  var SitemapService,
    sitemapService,
    sitemap,
    pages = [],
    cosLoadStub,
    cosFindStub,
    cosSaveStub;

  before(function(){
    cosLoadStub = sinon.stub(pb.CustomObjectService.prototype, 'loadTypeByName');
    cosLoadStub.onCall(0).yields(new Error(), {});
    cosLoadStub.yields(undefined, {});
    cosFindStub = sinon.stub(pb.CustomObjectService.prototype, 'findByType');
    cosFindStub.onCall(0).yields(new Error(), null);
    cosFindStub.onCall(1).yields(null, null);
    cosFindStub.yields(undefined, [{xml: mockxml}]);
    cosSaveStub = sinon.stub(pb.CustomObjectService.prototype, 'save');
    cosSaveStub.yields(undefined, 1);
    SitemapService = require('../services/sitemap_service')(pb);
    sitemapService = new SitemapService({site : 'testSite', onlyThisSite : false});
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

  it('should have name', function() {
    var name = SitemapService.getName();
    expect(name).to.equal('sitemapService');
  });

  it('should initialize', function(done) {
    SitemapService.init(function(err,success) {
      expect(err).to.equal(null);
      expect(success).to.equal(true);
      done();
    });
  });

  it('should return blank document on custom object service loading error', function(done){
    sitemapService.getSiteMap(function(xml){
      expect(xml).to.equal('');
      done();
    });
  });

  it('should return blank document on custom object service finding error', function(done){
    sitemapService.getSiteMap(function(xml){
      expect(xml).to.equal('');
      done();
    });
  });

  it('should return blank document if site map object is empty', function(done){
    sitemapService.getSiteMap(function(xml){
      expect(xml).to.equal('');
      done();
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

  it('should update sitemap and return the result xml', function(done){
    sitemapService.updateSiteMap(pages, function(xml){
      sitemap.toXML(function(sitemapXml){
        expect(xml).to.equal(sitemapXml);
        done();
      });
    });
  });

  it('should update sitemap and return the result xml if site map doc exists from getting', function(done){
    sitemapService.updateSiteMap(pages, function(xml){
      sitemap.toXML(function(sitemapXml){
        expect(xml).to.equal(sitemapXml);
        done();
      });
    });
  });

  after(function() {
    cosFindStub.restore();
    cosLoadStub.restore();
    cosSaveStub.restore();
  });
});

describe('When updating sitemap', function(){
  var SitemapService,
    sitemapService,
    sitemap,
    pages = [],
    cosLoadStub,
    cosSaveStub;

  before(function(){
    cosLoadStub = sinon.stub(pb.CustomObjectService.prototype, 'loadTypeByName');
    cosLoadStub.yields(undefined, getSiteMapDocument());
    cosSaveStub = sinon.stub(pb.CustomObjectService.prototype, 'save');
    cosSaveStub.onCall(0).yields(new Error(), null);
    cosSaveStub.yields(undefined, 1);
    SitemapService = require('../services/sitemap_service')(pb);
    sitemapService = new SitemapService({site : 'testSite', onlyThisSite : false});
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

  it('should return the result xml if error', function(done){
    sitemapService.updateSiteMap(pages, function(xml){
      sitemap.toXML(function(sitemapXml){
        expect(xml).to.equal(sitemapXml);
        done();
      });
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

  after(function() {
    cosLoadStub.restore();
    cosSaveStub.restore();
  });
});

function getSiteMapDocument() {
  return {
    _id: 'someid',
    name: 'somename'
  };
}