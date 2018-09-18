const fs = require('fs');
const csv = require('csv');
const config = require('./src/config');
const mongoose = require('mongoose');
const Store = require('./src/models/Store');

const file = fs.readFileSync('./attrattivo.csv');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, config.db.options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));

db.once('open', () => {
  console.log('database open')
});

csv.parse(file, (err,data) => {
  for(entry of data) {
    if(entry[0]) {
      let store = new Store();
      store.name = entry[1];
      store.ip_pc = entry[2];
      store.phone = entry[3];
      store.ipvpn = entry[9];
      store.company = entry[0];
      store.save();
    }
  }
});