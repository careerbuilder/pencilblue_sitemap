var CustomObjectService = require('./custom_object_service_mock');
var PluginService = require('./plugin_service_mock');
module.exports.getMockPB = function(){
    return {
        plugins: {
            getSettings : getSettings   
        },
        config: {
            sitePort:'8080',
            siteRoot:'http://dev.careerbuildercareers.com:8080',
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
        CustomObjectService: CustomObjectService,
        PluginService: PluginService
    };
};

function getSettings(pluginname, cb){
    var settings = [
        {
            name: 'crawl_paths_csv',
            value: '/,/search'
        },
        {
            name: 'ignore_path_csv',
            value: '/api/localization/script,/public/'
        },
        {
            name: 'exclude_sitemap_path_csv',
            value: '/search,/join'
        },
    ];
    cb(undefined, settings);
}

function log(message){
    //console.log is commented out unless a debug of pb.log messages is needed.  
    //console.log(message);
}