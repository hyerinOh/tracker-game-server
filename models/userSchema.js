const mongoose = require('mongoose');

const DB_URL = 'mongodb://admin:h11111@ds163825.mlab.com:63825/street-paper';

mongoose.connect(DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.once('open', (() => {
  console.log(`connected to database at ${DB_URL}`);
}));

const UserSchema = new mongoose.Schema({
  userId: { type: String },
  totalCount: { type: Number },
  WinningPercentage: { type: Number }
});

module.exports = mongoose.model('User', UserSchema);
