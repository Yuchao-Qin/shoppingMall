
var express = require('express');
var router = express.Router();
var User = require('./../models/user')
require('./../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/', //cookie 存放的目录
          maxAge:1000*60*60  //存放的时间
        })
        res.cookie("userName",doc.userName,{
          path:'/', //cookie 存放的目录
          maxAge:1000*60*60  //存放的时间
        })
        // req.session.user = doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
});
// 登出接口
router.post("/logout",(req,res,next)=>{
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'',
    result:''
  })
})


router.get("/checkLogoin",(req,res,next) => {
  if(req.cookies.userName){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
});
// 查询当前用户下的购物车物品
router.get("/cartList",(req,res,next) => {
  var userId = req.cookies.userId
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:'err.message',
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.cartList 
      })
    }
  })
})

// 删除购物车
router.post("/cartDel", function (req,res,next) {
  var userId = req.cookies.userId,productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

router.post("/cartEdit",(req,res,next) => {
  var userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,   //更新子文档
    "cartList.$.checked":checked,   
  },(err,doc) =>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  })    
})
// 全选接口
router.post("/editCheckAll",(req,res,next) => {
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},(err,user)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        console.log(user.cartList)
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save((err1,doc)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            })
          }
        })
      }
    }
  });    
})

// 查询用户地址接口
router.get("/addressList",(req,res,next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})

//设置默认地址接口
router.post("/setDefault", function (req,res,next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    });
  }else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId ==addressId){
             item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });

        doc.save( (err1,doc1) => {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
              res.json({
                status:'0',
                msg:'',
                result:''
              });
          }
        })
      }
    });
  }
});

// 删除地址接口
router.post("/delAddress",(req,res,next) => {
  var userId = req.cookies.userId,addressId = req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },(err,doc) => {
    if(err) {
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:''
      });
    }
  })
}) 

router.post("/payMent",(req,res,next) => {
  var userId = req.cookies.userId,
       orderTotal = req.body.orderTotal,
       addressId = req.body.addressId;
  User.findOne({userId:userId},(err,doc) => {
    if(err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      var address = '', goodsList = [] ;
      // 后去当前用户的地址信息
      doc.addressList.forEach((item) => {
        if(addressId == item.addressId){
          address = item
        }
      })
    //  获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if(item.checked == '1') {
          goodsList.push(item);
        }
      });
      var platform = '633'
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform+r1+sysDate+r2 ;
      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save((err1,doc1) => {
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })    
        }
      })
    }
  })
})


// 根据订单id查询订单你信息
router.get("/orderDetail",(req,res,next) => {
  var userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId},(err,userInfo) => {
    if(err){
    res.json({
      status:'1',
      msg:'err.message',
      result:''
    })
  }else{
    var orderList = userInfo.orderList
    if(orderList.length>0){
      var orderTotal = 0
      orderList.forEach((item) => {
        if(item.orderId === orderId){
          orderTotal = item.orderTotal
        }
      })
      if(orderTotal){
        res.json({
          status:'0',
          msg:"",
          result:{
            orderId:orderId,
            orderTotal:orderTotal
          }
        })
      }else{
        res.json({
          status:'12002',
          msg:'无此订单',
          result:''
        })
      }
    }else{
      res.json({
        status:'12001',
        msg:'当前用户没有订单',
        result:''
      })
      
    }
  }
  })
})


// 查询购物车商品数量
router.get("/CartCount",(req,res,next) => {
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({userId:userId},(err,doc) => {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        var cartList = doc.cartList;
        var cartCount = 0;
        cartList.map((item) => {
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})
module.exports = router;
