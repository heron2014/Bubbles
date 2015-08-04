var test = require("tape"),
  server = require("../server.js"),
  fs = require("fs");

test("Check that index.html is sent when requested and returns 200 status code", function(t) {
  server.inject({method: "GET", url: "/"}, function(response){
    var page = fs.readFileSync(__dirname + "/../public/views/index.html", "utf-8");
    t.equal(response.result, page, "Index.html is displayed as expected");
    t.equal(response.statusCode, 200, "Status code is 200");
    server.stop();
    t.end();
  });
});