var http = require('http')

http.createServer(function(req,res){
  res.write('i am codin')
  res.end()
}).listen(8080)
