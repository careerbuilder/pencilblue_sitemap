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

var CustomObjectService = require('./custom_object_service_mock');
var PluginService = require('./plugin_service_mock');
var DocumentCreator = require('./document_creator_mock');
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
        PluginService: PluginService,
        DocumentCreator: DocumentCreator
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