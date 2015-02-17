var pb = global.pb;
var util = global.util;

var sm = require('sitemap');
var CrawlService = pb.plugins.getService('crawlService', 'pencilblue_sitemap');

function SiteMapController() {}

util.inherits(SiteMapController, pb.BaseController);

SiteMapController.prototype.SiteMap = function(cb){
    var cos = new pb.CustomObjectService();
    
    cos.loadTypeByName('siteMap', function(err, siteMapType){
        if(err){
            pb.log.error(err);
        }
        else{
            cos.findByType(siteMapType, {}, function(err, siteMap){
                if(err){
                    pb.log.error(err);
                }
                else{
                    if(siteMap.length === 0){
                        cb({
                                    code: 200,
                                    content_type: 'application/xml',
                                    content: ''
                        });
                        updateSiteMap(cos, siteMapType);
                    }
                    else{
                        var content = {
                            code: 200,
                            content_type: 'application/xml',
                            content: siteMap[0].xml
                        };
                        cb(content);
                        updateSiteMap(cos, siteMapType);
                    }
                }
            });
        }
    });
};

function updateSiteMap(cos, siteMapType){
    pb.log.info('Updating Site Map');
    var crawlService = new CrawlService();
    crawlService.crawlSite(pb.config.siteRoot, function(pages){
        var sitemap = sm.createSitemap({
            hostname: pb.config.siteRoot,
            cacheTime: 0,
            urls:pages
        });
        sitemap.toXML(function(xml){
            var coSiteMap = { 
                type: siteMapType._id.toString(),
                name: siteMapType.name,
                host: sitemap.hostname,
                xml: xml
            };
            var siteMapDocument = pb.DocumentCreator.create('custom_object', coSiteMap);
            cos.save(siteMapDocument, siteMapType, function(err, result){
                if(err){
                    pb.log.error(err);
                }
                pb.log.silly(result);
            });
        });
    });
}

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

module.exports = SiteMapController;