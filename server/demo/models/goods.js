let mongoose = require('mongoose')
let Schema = mongoose.Schema
// Schema 定义表模型
let produtSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "productUrl":String,
  "productNum":Number,
  "checked":String,
});

module.exports = mongoose.model('Good',produtSchema);