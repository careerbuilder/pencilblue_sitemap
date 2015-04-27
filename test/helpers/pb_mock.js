var util = require('util');
module.exports.getMockPB = function () {
  var baseController = require('./base_controller_mock')(),
    pluginService = require('./plugin_service_mock')(),
    CustomObjectService = require('./custom_object_service_mock');
  var pb = {
    BaseController: baseController,
    config: {
      sitePort:'8080',
      siteRoot:'http://dev.careerbuildercareers.com:8080',
      crawler:{
        maxConcurrency: 10
      }
    },
    CustomObjectService: CustomObjectService,
    log: {
      info: function () {},
      error: function () {},
      debug: function() {},
      silly: function() {}
    },
    PluginService: pluginService,
    SecurityService: {
      ACCESS_EDITOR: "ACCESS_EDITOR"
    },
    util : util,
  };

  return pb;
};
