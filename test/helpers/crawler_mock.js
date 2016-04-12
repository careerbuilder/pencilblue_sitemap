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
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var myHost;
var myConditions = [];
function MockCrawler(host, initalPath){
    myHost = 'http://' + host;
}

util.inherits(MockCrawler,EventEmitter);

MockCrawler.prototype.start = function(){
    var crawler = this;
    crawler.emit("fetchcomplete", {
        url: myHost + "/",
        path: "/"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/job/software-engineer/jobdid?substring=sub",
        path: "/job/software-engineer/jobdid"
    }, undefined, undefined);
    crawler.emit("fetchcomplete", {
        url:myHost + "/sales",
        path: "/sales"
    }, undefined, undefined);
    //INVALID FOR SITEMAP as it is excluded in settings.  
    crawler.emit("fetchcomplete", {
        url:myHost + "/search",
        path: "/search"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/join",
        path: "/join"
    });
    
    //INVALID FOR SITEMAP, should not show up durring testing.  
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.js",
        path: "/test.js"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.css",
        path: "/test.css"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.woff",
        path: "/test.woff"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.tff",
        path: "/test.tff"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.ttf",
        path: "/test.ttf"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.svg",
        path: "/test.svg"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.eot",
        path: "/test.eot"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.ico",
        path: "/test.ico"
    }, undefined, undefined);
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.jpg",
        path: "/test.jpg"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.png",
        path: "/test.png"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.bmp",
        path: "/test.bmp"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.gif",
        path: "/test.gif"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.xml",
        path: "/test.xml"
    });
    crawler.emit("fetchcomplete", {
        url:myHost + "/test.json",
        path: "/test.json"
    });
    crawler.emit("complete");
};

MockCrawler.prototype.addFetchCondition = function(cb){  
    myConditions.push(cb);
};

module.exports = MockCrawler;