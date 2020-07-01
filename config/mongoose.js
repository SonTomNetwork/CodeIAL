const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codeial_development', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongoDB."));
db.once('open', function () {
    console.log('Connected to DB.');
});

module.exports = db;