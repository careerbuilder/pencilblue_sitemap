module.exports = function CrawlServiceModule(pb){
    var Crawler = require('simplecrawler');
    var LINQ = require('node-linq').LINQ;
    var pages = [];

    /**
     * Service for access to careerbuilder Job APIs
    */
    function CrawlService(options) {
        this.pluginService = new pb.PluginService(options);
    }

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
        loadSettings(this, function(pluginPaths, excludedCrawlPaths, excludedSiteMapPaths){
            pluginPaths.forEach(function(path){
                var siteRoot = hostname.replace('http://', '').replace('https://','').replace('/', '').replace(':8080','');
                pb.log.debug("CrawlService - SiteMap: Creating CrawlService: SITEROOT=" + siteRoot + " PATH=" + path);
                var myCrawler = new Crawler(siteRoot, path);
                myCrawler.initialPort = pb.config.sitePort;
                myCrawler.maxConcurrency = pb.config.crawler.maxConcurrency;
                pb.log.debug("CrawlService - SiteMap: Excluded crawl paths [" + excludedCrawlPaths + "]");
                pb.log.debug("CrawlService - SiteMap: Excluded sitemap paths [" + excludedSiteMapPaths + "]");
                myCrawler.addFetchCondition(function(parsedURL) {
                    var shouldFetch = pathIsNotAFile(parsedURL.path) && shouldIncludePath(excludedCrawlPaths, parsedURL.path);
                    pb.log.debug("CrawlService: Should fetch [" + parsedURL.path + "]: " + !!shouldFetch);
                    return shouldFetch;
                });
                myCrawler.on("fetchcomplete",function(queueItem, data, res){
                    pb.log.debug("CrawlService - SiteMap: Fetch complete: QUEUEITEM=" + JSON.stringify(queueItem));
                    var myPath = stripQueryString(queueItem.path);
                    var url = stripQueryString(queueItem.url);
                    if(pathIsNotAFile(myPath) && shouldIncludePath(excludedSiteMapPaths, myPath) && urlIsNotAlreadyInSiteMap(url)){
                        pages.push({
                            url: url,
                            priority: getPagePriority(queueItem)
                        });
                    }
                });
                myCrawler.on("complete", function(){
                    pb.log.debug("CrawlService - SiteMap: Crawling from " + path + " Complete");
                    if(path === pluginPaths[pluginPaths.length - 1]){
                        cb(pages);
                    }
                });
                myCrawler.start();
            });
        });
    };

    //PRIVATE
    function pathIsNotAFile(path){
        return path.match(/^[^.]+$|\.(?!(js|css|woff|tff|ttf|svg|eot|ico|jpg|png|bmp|gif|mp4|xml|json)$)([^.]+$)/);
    }
    function urlIsNotAlreadyInSiteMap(url){
        var queryResult = new LINQ(pages).Where(function(page){
            return page.url === url;
        }).ToArray();
        var notInList = queryResult.length === 0;
        return notInList;
    }

    function shouldIncludePath(exclusionList, path) {
        if (!exclusionList || exclusionList.length == 0) {
            return true;
        }

        var exclusionMatches = exclusionList.filter(function(item){
            return item ? path.includes(item) : false;
        });

        return exclusionMatches.length == 0;
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
        else if(queueItem.path === '/'){
            return 1.0;
        }
        return 0.3;
    }

    function loadSettings(self, cb){
        self.pluginService.getSettingsKV('pencilblue_sitemap', function(err, siteMapSettings){
        var pluginPaths = siteMapSettings['crawl_paths_csv'].split(','),
          excludedCrawlPaths = siteMapSettings['ignore_path_csv'].split(','),
          excludedSiteMapPaths = siteMapSettings['exclude_sitemap_path_csv'].split(',');
        cb(pluginPaths, excludedCrawlPaths, excludedSiteMapPaths);
      });
    }

    return CrawlService;
};
