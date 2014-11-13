var dbStream = Rx.Observable.fromCouchDB($.couch.db(DB));

var stream = dbStream.filter(
  function(doc){
    return doc.type === 'score';
  }
);

$(document).ready(function($) {
  console.debug('Debug enabled');

  stream.subscribe(function(doc) {
    console.debug(doc);
    $('#'+doc._id).html(doc.score);
  }); // end subscribe
});