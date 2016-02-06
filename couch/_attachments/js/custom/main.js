SCORE_A = 'scoreA';
SCORE_B = 'scoreB';

// @todo concat van sumobservable met view, zodat je de huidige score kan bepalen
// @todo partial sum observable maken, zoals nu de hack is
// @todo mooi streamA en streamB inregelen, ze zijn bijna hetzelfde op dev.type oid na, behandel ze dus ook zo
// @todo een onCompleted event op games? Als A of B 5 punten heeft kunnen in theorie beide streams in de onCOmpleted, een nieuw spel start
// @todo node_modules en andere dingen die niet op couch horen verplaatsen ,(kan evt ook met couchapp ignore?!)
// @todo task manager gebruiken: gulp of grunt?

$db = $.couch.db(DB);
var now = new Date().getTime();
console.debug('now',now);
var counterA = 0;
var counterB = 0;

// One stream to rule them all!
var dbStream = Rx.Observable.fromCouchDB($db);

// score stream: stream of score documents
var goalStream = dbStream.filter(
    function (doc) {
        return doc.type === 'score';
    }
);

var goalStreamA = goalStream.filter(
    function(doc) {
        var condition = doc.dev === SCORE_A && doc.time > now;
        if (condition) {
            console.debug('goalStreamA',doc);
        }
        return condition;
    }
);

var goalStreamB = goalStream.filter(
    function(doc) {
        var condition = doc.dev === SCORE_B && doc.time > now;
        if (condition) {
            console.debug('goalStreamB',doc);
        }
        return condition;
    }
);

var ding = 0;
var ding2 = 0;

$(document).ready(function ($) {
    console.debug('Debug enabled');

    ding = goalStreamA.sum(function (x, idx, obs) {
        return x.goal;
    }).subscribe(
        function (x) {
            counterA = x;
            $('#scoreA').html(x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        }
    );

    ding2 = goalStreamB.sum(function (x, idx, obs) {
        return x.goal;
    }).subscribe(
        function (x) {
            counterB = x;
            $('#scoreB').html(x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        }
    );

});

var now = new Date().getTime();
var range60minutes = {
    min: now - (30 * 60 * 1000),
    max: now + (30 * 60 * 1000)
};

var baseOptions = {
    view: 'time',
    designDoc: DDOC,
    include_docs: true
};

var graphOptions = {
    width: 600,
    height: 300,
    stroke: true,
    renderer: 'multi',
    offset: 'value',
    min: 0,
    max: 10,

    unstack: true,
    interpolation: 'step-after'
};

var baseOptions60m = $.extend({range: range60minutes}, baseOptions);

var view = Rx.Observable.fromCouchDBView(
    $db,
    $.extend(
        {device: SCORE_A},
        baseOptions60m
    )
);




view.subscribe(function (doc) {
    //console.debug('goalie', doc);
});


var timer = Rx.Observable.timer(200, 1000)
    .timeInterval()
    .pluck('interval')


var interval = Rx.Observable.interval(2000).map(function(){
    return {
        time: Math.round(new Date().getTime())
    }
});

//var cl = Rx.Observable.combineLatest(
//    interval,
//    goalStreamA,on
//    goalStreamB
//);

//var aStream = Rx.Observable.combineLatest(
//    Rx.Observable.merge(
//        goalStreamA,
//        goalStreamA.sum(function (x, idx, obs) {
//            return x.goal;
//        })
//    ),
//    interval
//);

var aStream = Rx.Observable.combineLatest(
    Rx.Observable.combineLatest(
        goalStreamA,
        goalStreamA.sum(function (x, idx, obs) {
            return x.goal;
        })
    ),
    interval
);

aMapper = aStream.map(function(all){
    return{
        x: ((Math.max(all[0][0].time, all[1].time))-now)/1000,
        y: all[0][1]
    }
})

//)

//var mergeB = Rx.Observable.merge(
//    goalStreamB
    //intervalB
//);

aStream.subscribe(function(d){
   console.log('aStream',d);
});

aMapper.subscribe(function(d){
    console.log('aMapper',d);
});



//// Helper function to map values of db to values to graph.
//function mapGoalA(doc) {
//    console.debug('mapGoalA',doc);
//    return {
//        x: Math.round(doc.time / 1000),
//        y: (counterA += doc.goal)
//    };
//}
//// Helper function to map values of db to values to graph.
//function mapGoalB(doc) {
//    return {
//        x: Math.round(doc[2].time / 1000),
//        y: (counterB += doc[2].goal)
//    };
//}

//mergeA.subscribe(function(d){
//    console.log('mergeA',d);
//},function(a){
//    console.log('error',a);
//}, function(c) {
//    console.log('completed',c);
//});
//
//mergeB.subscribe(function(d){
//    console.log('mergeB',d);
//},function(a){
//    console.log('error',a);
//}, function(c) {
//    console.log('completed',c);
//});


console.log('graphOptions', graphOptions);
var graph = new GraphTile('#graph',aMapper,{
  range:range60minutes,
  name: 'Score',
  serie:{
    name : 'Ok doei',
    data : [],
    color : '#c05020',
    strokeWidth : 1,
    renderer: 'line',
    interpolation: 'step-after'
  },
    //preserve: true,
    //stack:false,
  //offset: "zero",
  graphOptions: graphOptions
});
//
//graph.addIndependentSerie(mergeB,{
//     name : 'Gewenste Temperatuur',
//     data : [],
//     color : 'yellow',
//     renderer: 'line'
//});
//
//graph.vSetSmooth(0);



graph.vRender();