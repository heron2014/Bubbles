var test = require("tape"),
  server = require("../server.js");

test("check the server returns 200 response", function(t) {
  server.inject({method: "GET", url: "/"}, function(response){
    t.equal(response.statusCode, 200);
    server.stop();
    t.end();
  });
});