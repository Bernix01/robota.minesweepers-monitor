#!/usr/bin/env node

"use strict";

const rosnodejs = require("rosnodejs");
const std_msgs = rosnodejs.require("std_msgs").msg;

(async () => {
  await rosnodejs.initNode("gps", {
    onTheFly: true
  });

  const nh = rosnodejs.nh;
  const app = require("express")();
  const http = require("http").Server(app);
  var io = require("socket.io")(http);
  const port = process.env.PORT || 3001;
  io.on("connection", function(socket) {
    console.log("connected", socket.id);
  });

  let sub = nh.subscribe("/chatter", std_msgs.String, data => {
    io.emit("mine", JSON.parse(data.data));
  });

  http.listen(port, function() {
    console.log("listening on *:" + port);
  });
})();
