var pages = [];
var Crawler = require("simplecrawler");
var excludedPaths = [
    '/api/localization/script',
    '/public/'
];
var myCrawler = new Crawler("pencilblue-548349876.us-east-1.elb.amazonaws.com", "/search");
var conditionID = myCrawler.addFetchCondition(function(parsedURL) {
    return pathIsNotAFile(parsedURL.path) && pathIsNotInExclusionList(parsedURL.path);
});

myCrawler.stripQuerystring = false;
myCrawler.maxConcurrency = 50;
myCrawler.on("fetchcomplete",function(queueItem, data, res){
    var path = stripQueryString(queueItem.path);
    if(pathIsNotAFile(path) && pathIsNotInExclusionList(path)){
        pages.push(stripQueryString(queueItem.url));
    }
});

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
    return excludedPaths.indexOf(path) === -1;
}

//Functional
function stripQueryString(url){
    return url.substr(0, url.indexOf("?"));
}
