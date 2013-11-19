
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , fs = require('fs');

// Config

// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');

// Middleware

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.limit('10mb'));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());

/**
 * CORS support.
 */

app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});


// Routes

app.get('/', function(req, res){
  res.redirect('index.html');
});



var CanvasModule = require('canvas');
var loadImage = function(imageData, callback){
  var Image = CanvasModule.Image;

  var img = new Image;
  img.onerror=function(){};
  img.onload = function(){
    console.log("img.onload");
    callback(img);
  };
  img.src = imageData;
}

var Canvas = {
  blend : function(image1, image2, operation, callback){
    loadImage(image1, function(img){
      var canvas = new CanvasModule(img.width, img.height);
      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, img.width, img.height);

      ctx.globalCompositeOperation = operation; // 'multiply'

      loadImage(image2, function(img2){
        ctx.drawImage(img2, 0, 0, img2.width, img2.height);

        canvas.toDataURL(function(err, imageResult){
          callback(imageResult);
        })
      })
    });
  }
} ;


app.post('/imageProcess/globalCompositeOperation', function(req, res, next){
  var op = req.body.op;
  console.log("CompositeOperation: " + op);

  var img1Str = req.body.img1;
  //console.log("InputImg1: " + img1Str);
  // fs.writeFile("img1.txt", img1Str,function(e){
  //     if(e)throw e;
  // })

  var img2Str = req.body.img2;
  //console.log("InputImg2: " + img2Str);
  // fs.writeFile("img2.txt", img2Str,function(e){
  //     if(e)throw e;
  // })

  Canvas.blend(img1Str, img2Str, op, function (str) {
    console.log("ResultImg: " + str);
      res.send({
        data: str
      });
  });
});

var port = parseInt(process.argv[2] || '5000', 10);
app.listen(port);
console.log('Test server listening on port %d', port);
