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
