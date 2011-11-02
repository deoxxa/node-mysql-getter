#!/usr/bin/env node

var mysql = require("mysql"),
    MySQLGetter = require("mysql-getter").MySQLGetter,
    mysql_getter = new MySQLGetter(mysql);

setInterval(function() {
  mysql_getter.get_mysql({host: "localhost", user: "my_user", password: "my_password", database: "my_database"}, function(client, cb) {
    client.query("SELECT Foo, Bar FROM baz", function(err, rows, columns) {
      console.log(JSON.stringify(rows));
      cb();
    });
  });

  console.log(mysql_getter.handles.length);
}, 100);
