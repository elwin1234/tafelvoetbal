function (doc,req){
  var Mustache = require('libs/mustache');
  var ddoc = this;
   var Syntax = require('libs/syntax');
  // var helpers = require('libs/helpers');
  // var body;
  var globalTemplate = ddoc.templates.global;
  var head = ddoc.head;

  provides("html", function() {
    if (req.query.debug !== undefined) {
      send("<h1>Request</h1>");
      send(Syntax.highlight(req));

      send("<h1>Doc</h1>");
      send(Syntax.highlight(doc));
    }

    content = {
      head:head
    };

    return Mustache.render(globalTemplate, content);
  });
}