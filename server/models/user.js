var mongooes = require ('mongoose');

var userSchema = new mongooes.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
   { "productId":String,
    "productName":String,
    "salePrice":String,
    "productImage":String,
    "checked":String,
    "productNum":String,}
  ],
  "addressList":Array
})


module.exports = mongooes.model("User",userSchema);