// Ensures there will be no 'console is undefined' errors
if (typeof console === "undefined" || DEBUG === false) {
  window.console = window.console || (function(){
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(s){};
    return c;
  })();
}
