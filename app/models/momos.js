// MOngodb MOdelS

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WaybillSch = new Schema({
    userTo:{
      name:String,
      signCode:String,
      company:String,
    },
    userFrom:{
      name:String,
      signCode:String,
      company:String,
    },
    goods:[
      {
        name:String,
        qty:Number,
        price:Number
      },
      {
        name:String,
        qty:Number,
        price:Number
      },
  ],
    date:String,
    total:Number
});

module.exports = mongoose.model('waybill', WaybillSch);
