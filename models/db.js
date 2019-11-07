const mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/organicstore';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.set('useCreateIndex', true);

mongoose.connect(mongoDB, {
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log('MongoDB connected');
    } else {
        console.log('Error: ' + err);
    }
});

require('./order.model');