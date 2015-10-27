module.exports = function PluginServiceModule() {
  function PluginService(){};

  PluginService.getSettings = function(pluginName, cb) {
    cb('settings');
  };

  PluginService.prototype.getSettings = function(pluginName, cb) {
    cb('settings');
  };

  PluginService.isActivePlugin = function(plugin) {
    return true;
  };

  PluginService.getService = function(service, plugin) {
    return true;
  };

  PluginService.prototype.getSettingsKV = function(pluginName, cb) {
    cb('settings');
  };

  return PluginService;
};
