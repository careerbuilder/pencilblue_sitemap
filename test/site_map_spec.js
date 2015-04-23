var pb = require('./helpers/pb_mock').getMockPB();
var SiteMapController = require('../controllers/site_map')(pb);
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

describe('Site Map Controller', function () {
  var siteMapController;

  before(function () {
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
});