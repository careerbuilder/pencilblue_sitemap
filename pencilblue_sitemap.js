module.exports = function PencilblueSitemapModule(pb){
    
    function PencilblueSitemap(){}

    PencilblueSitemap.onInstall = function(cb){
        var cos = new pb.CustomObjectService();
        cos.loadTypeByName("sitemap", function(err, siteMapType){
            if(!siteMapType){
                var siteMapValues = {
                    name: 'siteMap',
                    fields: {
                        host:{field_type: 'text'},
                        xml:{field_type: 'text'}
                    }
                };
                cos.saveType(siteMapValues, function(err, siteMapType){
                    pb.log.info("pencilblue_sitemap: " + JSON.stringify(err));
                    pb.log.info("pencilblue_sitemap custom object type: " + JSON.stringify(siteMapType));
                    cb(null, true);
                });
            }
            else{
                cb(null, true);
            }
        });
    };

    PencilblueSitemap.onUninstall = function(cb){
        var cos = new pb.CustomObjectService();
        cos.loadTypeByName('siteMap', function(err, siteMapType){
            if(siteMapType){
                cos.deleteTypeById(siteMapType._id.string(), cb);
            }
        });
        cb(null, true);
    };

    PencilblueSitemap.onStartup = function(cb){
        cb(null, true);
    };

    PencilblueSitemap.onShutdown = function(cb){
        cb(null, true);
    };

    return PencilblueSitemap;
};