#!/usr/bin/env node

"use strict";

const rosnodejs = require("rosnodejs");
const std_msgs = rosnodejs.require("std_msgs").msg;
const SX127x = require("sx127x");

(async () => {
  await rosnodejs.initNode("radio", {
    onTheFly: true
  });

  const nh = rosnodejs.nh;
  const sx127x = new SX127x({
    frequency: 433e6
  });
  let cameraPub = nh.advertise("/camera_feed", std_msgs.String);
  let minePub = nh.advertise("/mine", std_msgs.String);
  sx127x.open(function(err) {
    console.log("open", err ? err : "success");

    if (err) {
      throw err;
    }

    // add a event listener for data events
    sx127x.on("data", function(data, rssi) {
      const rdata = data.toString();
      const jsonData = JSON.parse(rdata);
      const msg = new std_msgs.String();
      msg.data = JSON.stringify(jsonData.payload);
      if (jsonData.action == "cm"){
        cameraPub.publish(msg);
      }
      if (jsonData.action == "dm"){
        minePub.publish(msg);
      }
    });

    // enable receive mode
    sx127x.receive(function(err) {
      console.log("receive", err ? err : "success");
    });
  });

  process.on("SIGINT", function() {
    // close the device
    sx127x.close(function(err) {
      console.log("close", err ? err : "success");
      process.exit();
    });
  });
})();
