// let user = require('./User');
// const path = require('path');
// let myPath3 = path.resolve(__dirname,'./img/so')
// console.log(`userName:${user.userName}`);
// console.log(`I'm ${user.userName},${user.sayHello()}`);
// console.log(myPath3)
const http = require('http');
const url = require('url');
const util = require('util');

const server = http.createServer((req,res)=>{
  res.statusCode = 200;

  res.setHeader("content-Type","text/plain; charset = utf-8");
 /* 
  * util.inspect() 把对象的每个key，value转换成字符串进行输出
  * node.js 无法解析完整的url 解决办法
  * res.end( util.inspect(url.parse("http://localhost:3000/?name=123&age=20#11")))
  * 或者通过express 
 */
  console.log(res.url);
  console.log(url.parse(req.url));
  res.end( util.inspect(url.parse(req.url)))
})

server.listen(3000,'127.0.0.1', ()=>{
  console.log("服务器已经运行")
})