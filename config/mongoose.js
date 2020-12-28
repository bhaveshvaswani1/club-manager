const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/clubManager`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Something went wrong with the db'));

db.once('open', function () {
  console.log('Database successfully connected and running');
});

module.exports = db;
