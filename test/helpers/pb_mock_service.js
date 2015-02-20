var CustomObjectService = require('./custom_object_service_mock');
module.exports.getMockPB = function(){
    return {
        plugins: {
            getSettings : function(pluginname, cb){}    
        },
        config: {
            sitePort:'80',
            siteRoot:'dev.careerbuildercareers.com',
            crawler:{
                maxConcurrency: 10
            }
        },
        log:{
            silly:function(message){log(message);},
            info:function(message){log(message);},
            error:function(message){log(message);},
            debug:function(message){log(message);}
        },
        CustomObjectService: CustomObjectService
    };
};

function log(message){
    console.log(message);
}