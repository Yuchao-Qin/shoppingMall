var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Goods = require('../models/goods')
// 链接 MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo')

mongoose.connection.on('cinnected',()=>{
  console.log("MongoDB connected success")
})

mongoose.connection.on('error',()=>{
  console.log("MongoDB connected fail")
})

// 与数据库断开连接
mongoose.connection.on('disconnected',()=>{
  console.log("MongoDB connected disconnected")
})

// 查询商品列表数据
router.get("/list",(req,res,next)=>{
  // get (req.parma(""))
  // post (req.body(""))
  let page =parseInt(req.param("page"))
  let pageSize = parseInt(req.param("pageSize"))
  let priceChecked = req.param("priceChecked")
  let sort = req.param("sort")
  let skip = (page - 1) * pageSize
  let priceGt = '',priceLte = '';
  let params = {};
  if(priceChecked!=='all'){
    switch (priceChecked) {
      case '0':priceGt =0,priceLte=500;break
      case '1':priceGt =500,priceLte=1000;break
      case '2':priceGt =1000,priceLte=5000;break
      // case '3':priceGt =1000,priceLte=5000;break
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort})
  //  sort 如果是1就是升序，如果是二就是降序
  goodsModel.exec((err,doc)=>{
    // 因为前面已经find 所以后面用exec，不用find????
      if(err){
        res.json({
          status:'1',
          msg:err.message
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:{
            count:doc.length,
            list:doc
          }
        })
      }
  })
})
// 加入购物车
router.post("/addCart",(req,res,next)=>{
      var userId='100000077',productId = req.body.productId;
      var User = require('../models/user')
      User.findOne({userId:userId},(err,userDoc)=>{
          if(err) {
            res.json({
              status:"1",
              msg:err.message
            })
          }else{
            if(userDoc){
              var goodsItem = '';
              userDoc.cartList.forEach((item) =>{
                if(item.productId == productId){
                  goodsItem = item;
                  item.productNum ++;
                }
              });
              if(goodsItem){
                userDoc.save((err2,doc2)=>{
                  if(err2) {
                    res.json({
                      status:"1",
                      msg:err2.message,    
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }else{
                Goods.findOne({productId:productId},(err1,doc) => {
                  if(err1) {
                    res.json({
                      status:"1",
                      msg:err1.message
                    })
                  }else{
                    if(doc){
                      doc.productNum=1;
                      doc.checked =1;
                      userDoc.cartList.push(doc);
                      console.log(userDoc.cartList)
                      userDoc.save((err2,doc2)=>{
                        if(err2) {
                          res.json({
                            status:"1",
                            msg:err2.message,    
                          })
                        }else{
                          res.json({
                            status:'0',
                            msg:'',
                            result:'suc'
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          }
      })
})
module.exports = router
