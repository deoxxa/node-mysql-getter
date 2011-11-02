exports.MySQLGetter = MySQLGetter;

function MySQLGetter(mysql) {
  this.mysql = mysql;
  this.handles_idle = {};
  this.handles = {};
};

MySQLGetter.prototype.get_mysql = function(args, cb) {
  var id = JSON.stringify(args);

  if (this.handles_idle[id] === undefined) { this.handles_idle[id] = []; }
  if (this.handles[id] === undefined) { this.handles[id] = []; }

  var handle;

  if (this.handles_idle[id].length > 0) {
    handle = this.handles_idle[id].shift();
  } else {
    handle = this.mysql.createClient(args);
    this.handles[id].push(handle);
    this.handles_idle[id].push(handle);
  }

  var self = this;
  cb(handle, function() {
    self.handles_idle[id].push(handle);
  });
};
