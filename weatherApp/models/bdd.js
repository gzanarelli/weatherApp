const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gzanarel:MailysB1992@lacapsule-jnjrz.mongodb.net/weatherapp?retryWrites=true&w=majority',
{useNewUrlParser: true},
() => console.log(`Db is up`));

module.exports = mongoose;