var pages = [];
var Crawler = require("simplecrawler");
var LINQ = require('node-linq').LINQ;
var excludedCrawlPaths = [
    '/api/localization/script',
    '/public/'
];

var excludedSiteMapPaths = ['/search', '/join'];
var myCrawler = new Crawler("pencilblue-548349876.us-east-1.elb.amazonaws.com", "/search");
var conditionID = myCrawler.addFetchCondition(function(parsedURL) {
    return pathIsNotAFile(parsedURL.path) && pathIsNotInExclusionList(parsedURL.path);
});

myCrawler.stripQuerystring = false;
myCrawler.maxConcurrency = 50;
myCrawler.on("fetchcomplete",function(queueItem, data, res){
    var path = stripQueryString(queueItem.path);
    if(pathIsNotAFile(path) && pathIsNotInExclusionSiteMapList(path)){
        pages.push({
                url: stripQueryString(queueItem.url),
                priority: getPagePriority(queueItem)
        });
    }
});

function getPagePriority(queueItem){
    if(queueItem.path.indexOf('/job/') === 0){
        return 0.1;
    }
    return 0.3;
}

myCrawler.on("complete", function(){
    console.log(pages);
    console.log("Crawling Complete");
    process.exit();
});

myCrawler.start();

//PRIVATE 
//Conditionals
function pathDoesNotContainQueryString(path){
    return path.indexOf('?') === -1;
}
function pathIsNotAFile(path){
    return path.match(/^[^.]+$|\.(?!(js|css|woff|tff|ttf|svg|eot|ico|jpg|png|bmp|gif|xml|json)$)([^.]+$)/);
}
function pathIsNotInExclusionList(path){
    return excludedCrawlPaths.indexOf(path) === -1;
}
function pathIsNotInExclusionSiteMapList(path){
    return excludedSiteMapPaths.indexOf(path) === -1;
}

function urlIsNotAlreadyInSiteMap(url){
    return new LINQ(pages).Where(function(page){
        return page.url === url;
    }).toArray().length === 0;
}
//Functional
function stripQueryString(url){
    return url.substr(0, url.indexOf("?"));
}
