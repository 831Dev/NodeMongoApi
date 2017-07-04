var mongoose = require('mongoose');

var ItemSchema = {
    id:String,
    name:String,
    url:String,
    price: { type: Number, default: 0 },
    purchased: { type: Boolean, default: false },
    uri:String
};

var Item = mongoose.model('Item', ItemSchema, 'Items');

module.exports = Item;