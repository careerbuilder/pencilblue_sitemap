function PluginService() {}

PluginService.prototype.getSettings = function(pluginName, cb){
  cb(null, [
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
    ]);
};


module.exports = PluginService;