var pb, Crawler;
if (typeof global.pb === 'undefined') {
    var mockService = require('../test/helpers/pb_mock_service');
    pb = mockService.getMockPB();
    Crawler = require('../test/helpers/crawler_mock');
}
else{
    pb = global.pb;
    Crawler = require('simplecrawler');
}
var LINQ = require('node-linq').LINQ;

var excludedCrawlPaths = [];
var excludedSiteMapPaths = [].concat(excludedCrawlPaths);
var pluginPaths = [];
var pages = [];

/**
 * Service for access to careerbuilder Job APIs
*/
function CrawlService() {}


/**
 * This function is called when the service is being setup by the system.  It is
 * responsible for any setup that is needed when first created.  The services
 * are all instantiated at once and are not added to the platform untill all
 * initialization is complete.  Relying on other plugin services in the
 * initialization could result in failure.
 *
 * @static
 * @method init
 * @param cb A callback that should provide one argument: cb(error) or cb(null)
 * if initialization proceeded successfully.
 */
CrawlService.init = function(cb) {
	pb.log.debug("CrawlService: Initialized");
	cb(null, true);
};

/**
 * A service interface function designed to allow developers to name the handle
 * to the service object what ever they desire. The function must return a
 * valid string and must not conflict with the names of other services for the
 * plugin that the service is associated with.
 *
 * @static
 * @method getName
 * @return {String} The service name
 */
CrawlService.getName = function() {
    return "crawlService";
};

CrawlService.prototype.crawlSite = function(hostname, cb){
    pages.splice(0, pages.length);
    loadSettings(function(){
        pages.push({
            url: stripQueryString(hostname),
            priority: 1.0
        });
        pluginPaths.forEach(function(path){
            var siteRoot = hostname.replace('http://', '').replace('https://','').replace('/', '').replace(':8080','');
            var myCrawler = new Crawler(siteRoot, path);
            myCrawler.initialPort = pb.config.sitePort;
            myCrawler.maxConcurrency = pb.config.crawler.maxConcurrency;
            var conditionID = myCrawler.addFetchCondition(function(parsedURL) {
                return pathIsNotAFile(parsedURL.path) && pathIsNotInExclusionList(parsedURL.path);
            });
            myCrawler.on("fetchcomplete",function(queueItem, data, res){
                var myPath = stripQueryString(queueItem.path);
                var url = stripQueryString(queueItem.url);
                if(pathIsNotAFile(myPath) && pathIsNotInExclusionSiteMapList(myPath) && urlIsNotAlreadyInSiteMap(url)){
                    pages.push({
                        url: url,
                        priority: getPagePriority(queueItem)
                    });
                }
            });
            myCrawler.on("complete", function(){
                pb.log.silly("Crawling from " + path + " Complete");
                if(path === pluginPaths[pluginPaths.length - 1]){
                    pb.log.silly("Crawling all paths Complete");
                    pb.log.silly("Crawler found " + pages.length + " pages");
                    cb(pages);
                }
            });
            myCrawler.start();
        });
    });
};

//PRIVATE
function pathDoesNotContainQueryString(path){
    return path.indexOf('?') === -1;
}
function pathIsNotAFile(path){
    return path.match(/^[^.]+$|\.(?!(js|css|woff|tff|ttf|svg|eot|ico|jpg|png|bmp|gif|xml|json)$)([^.]+$)/);
}
function pathIsNotInExclusionList(path){
    return listDoesNotContainItem(excludedCrawlPaths, path);
}
function pathIsNotInExclusionSiteMapList(path){
    return listDoesNotContainItem(excludedSiteMapPaths, path);
}
function urlIsNotAlreadyInSiteMap(url){
    var queryResult = new LINQ(pages).Where(function(page){
        return page.url === url;
    }).ToArray();
    var notInList = queryResult.length === 0;
    return notInList;
}

function listDoesNotContainItem(list, item){
    var listcontaining_item = new LINQ(list).Where(function(myItem){
        return item.indexOf(myItem) > -1;
    }).ToArray().length === 0;
    return listcontaining_item;
}

function stripQueryString(url){
    if(url.indexOf("?") > -1){
         return url.substr(0, url.indexOf("?"));
    }
    return url;
}
    
function getPagePriority(queueItem){
    if(queueItem.path.indexOf('/job/') === 0){
        return 0.5;
    }
    return 0.3;
}

function loadSettings(cb){
    pb.plugins.getSettings('pencilblue_sitemap', function(err, siteMapSettings){
        for(var i in siteMapSettings){
            var setting = siteMapSettings[i]
            switch(setting.name){
                    case 'crawl_paths_csv':
                        pluginPaths = setting.value.split(',');
                        break;
                    case 'ignore_path_csv':
                        excludedCrawlPaths = setting.value.split(',');
                        break;
                    case 'exclude_sitemap_path_csv':
                        excludedSiteMapPaths = setting.value.split(',');
                        break;
                    default:
                        break;
            }
        }
        cb();
    });
}

//exports
module.exports = CrawlService;