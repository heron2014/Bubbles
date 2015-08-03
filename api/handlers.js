var handlers = {
  home: function(request, reply) {
    reply.view("index");
  }
};

module.exports = handlers;