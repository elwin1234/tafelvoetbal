Rx.Observable.fromCouchDB = function (couchDB) {
  console.debug(couchDB);
  var observable = Rx.Observable.create(function (observer) {
    var changesRunning = false;
    var changeHandler = null;

    $.couch.db(couchDB.name).info({
      success: function(data) {
        recentUpdateSeq = data.update_seq-50;

        var options = {
          feed:"normal",
          since:recentUpdateSeq,
          include_docs:true
        };
        $.getJSON("/"+couchDB.name+"/_changes?"+
          decodeURIComponent($.param(options)), function(data) {
          if (data.results.length) {
            // get latest measurement doc from result set
            $.each(data.results,function(key, doc){
              observer.onNext(doc);
            });
          }
          setupChanges(data.last_seq);
        });
      }
    });

    /*
     * setup observer to listen to couchDB changes
     * use eventsource if enabled and supported,
     * else use long polling api (through jQuery.couch lib)
     */
    function setupChanges(since) {
      if (!changesRunning) {
        if (ENABLE_EVENTSOURCE && window.EventSource) {
            var source = new EventSource(
              "/"+DB+"/_changes?feed=eventsource&include_docs=true&since="+since);

            var sourceListener = function(e) {
              var data = JSON.parse(e.data);
              observer.onNext(data);
            };

          // start listening for events
          source.addEventListener('message', sourceListener , false);

          changesRunning = true;

        } else {
          changeHandler = couchDB.changes(since,{include_docs:true});
          changesRunning = true;
          changeHandler.onChange(function(data){
              $.each(data.results,function(key, doc){
                observer.onNext(doc);
            });
          });
        }
      }
    }

    // Any cleanup logic might go here
    return function () {
      // clearInterval(timeoutHandler);
      // console.log('disposed');
    };
  }).map(function(data){return data.doc;}).publish();

  observable.connect();
  return observable;
};

Rx.Observable.fromCouchDBView = function(couchDB,options){
  //call super for sanity checks on a_oRange
  var $this = this;
  // console.log(this.options);
  if(!options)
    throw "options must be given, no default available";
  var observable = Rx.Observable.create(function (observer) {
    baseCouchOptions = {
      reduce:false,
      update_seq : true,
      success : function(data) {
        $.each(data.rows,function(index,couchIndex){
          myDoc = couchIndex.doc;
          observer.onNext(myDoc);
        });
        observer.onCompleted();
      },
      error : function(data){
        observer.onError(data);
      }
    };
    if (options.device && options.range) {
      baseCouchOptions.startkey = [options.device,options.range.min];
      baseCouchOptions.endkey = [options.device,options.range.max];
    }
    couchDB.view(
      options.designDoc + "/" + options.view,
      $.extend(true,baseCouchOptions,options)
    );

    // Any cleanup logic might go here
    return function () {
      // clearInterval(timeoutHandler);
      // console.log('disposed');
    };
  });

  return observable;
};