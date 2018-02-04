// 有时候  node.js 需要作为客户端调用其他服务端的接口
const http = require('http');
http.get("http://www.imooc.com/u/card",(res) =>{
  let data = '';
  res.on('data',(chunk)=>{
    data += chunk;
  });
  res.on('end',()=>{
    // let result = JSON.parse(data);
    console.log("result:"+ data)
  });

})