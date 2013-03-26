var express = require("express");
var app = express.createServer();
app.use(express.static(__dirname + "/public"));
app.listen(process.env.VCAP_APP_PORT || 3030);
