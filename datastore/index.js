const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    // console.log(data);
    fs.writeFileSync(exports.dataDir + '/' + data + '.txt', text);
    fs.writeFile(__dirname + '/data' + '/' + data + '.txt', text);
    items[data] = {id: data, text: text};
    callback(err, items[data]);
  });
  //console.log(id, text);
  //fs.writeFile(exports.dataDir + '/' + id + '.txt', text);
  // fs.writeFile(__dirname + '/data' + '/' + id + '.txt', text);
  //callback(null, {id: id, text: text});
};

exports.readOne = (id, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, item);
  }
};

exports.readAll = (callback) => {
  var data = [];
  _.each(fs.readdirSync(exports.dataDir), (item, idx) => {
    data.push({ id: item.slice(0, 5), text: item.slice(0, 5) });
  });
  callback(null, data);
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFileSync(exports.dataDir + '/' + id + '.txt', text);
    items[id].text = text;
    callback(null, {id: id, text: text});
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.unlinkSync(exports.dataDir + '/' + id + '.txt');
    callback(null);
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
