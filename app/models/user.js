var mongoose = require('mongoose'); 

var user = mongoose.Schema({
	token: String,
    email: String,
   	id: String,
   	name: String
});

module.exports = mongoose.model('user',user);