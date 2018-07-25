#!/usr/bin/env node

'use strict';

const rosnodejs = require('rosnodejs');
const std_msgs = rosnodejs.require('std_msgs').msg;
const SX127x = require('sx127x');


(async () => {
  await rosnodejs.initNode('my_node', {
    onTheFly: true
  });

  const nh = rosnodejs.nh;


  var sx127x = new SX127x({
    frequency: 433e6
  });


  var count = 0;
  sx127x.open(function(err) {
    console.log('open', err ? err : 'success');
  
    if (err) {
      throw err;
    }
  
    // add a event listener for data events
    sx127x.on('data', function(data, rssi) {
      console.log('data:', '\'' + data.toString() + '\'', rssi);
    });
  
    // enable receive mode
    sx127x.receive(function(err) {
      console.log('receive', err ? err : 'success');
    });
  });
  
  process.on('SIGINT', function() {
    // close the device
    sx127x.close(function(err) {
      console.log('close', err ? err : 'success');
      process.exit();
    });
  });


})();