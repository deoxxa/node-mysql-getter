exports.MySQLGetter = MySQLGetter;

function MySQLGetter(mysql, config) {
  if (typeof config != "object" || !config) { config = {}; }
  this.config = config;

  if (!this.config.max_handles) { this.config.max_handles = 16; }

  this.mysql = mysql;
  this.idle_handles = {};
  this.handles = {};
};

MySQLGetter.prototype.get_mysql = function(mysql_config, cb) {
  var id = JSON.stringify(mysql_config);

  if (this.idle_handles[id] === undefined) { this.idle_handles[id] = []; }
  if (this.handles[id] === undefined) { this.handles[id] = []; }

  var handle;

  if (this.idle_handles[id].length > 0) {
    handle = this.idle_handles[id].shift();
  } else if (this.handles[id].length < this.config.max_handles) {
    handle = this.mysql.createClient(mysql_config);
    this.handles[id].push(handle);
    this.idle_handles[id].push(handle);
  } else {
    var self = this;
    setTimeout(function() { self.get_mysql(mysql_config, cb); }, 100);
    return;
  }

  var self = this;
  cb(handle, function() {
    self.idle_handles[id].push(handle);
  });
};
