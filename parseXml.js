const config = require('./src/config');
const mongoose = require('mongoose');
const Store = require('./src/models/Store');
const Ticket = require('./src/models/Ticket');
 
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, config.db.options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error: '));

db.once('open', () => {
  console.log('database open')
});


console.log(getTickets().then(value => value.forEach(item => console.log(item.ip_pc))));



async function getTickets() {
  try {
    const tickets = await Store.find({}).sort({ip_pc:1}).exec();
    db.close();
    return tickets;
  } catch (err) {
    return err;
  }
}
