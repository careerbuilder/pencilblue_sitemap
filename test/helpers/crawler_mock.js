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