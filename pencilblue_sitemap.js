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