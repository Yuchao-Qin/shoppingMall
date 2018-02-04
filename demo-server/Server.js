let url = require('url')
let util = require('util')
let http = require('http')
let fs = require('fs')

let server = http.createServer((req,res) => {
  res.statusCode = 200;
  res.setHeader = ("Content-type","text/plain; charset = utf-8");

  const pathName = url.parse(req.url).pathname;
  fs.readFile(pathName.substring(1),(err,data)=>{
    if(err){
      res.writeHead(404,{
        "Content-type":"text/html"
      });
    }else {
      res.writeHead(200,{
        "Content-type":"text/html"
      })
      res.write(data.toString())  
    }
    res.end()
  });
  
})
server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器已启动")
})