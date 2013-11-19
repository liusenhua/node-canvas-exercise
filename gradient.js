
/**
 * Module dependencies.
 */

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(200, 200)
  , ctx = canvas.getContext('2d')
  , fs = require('fs');

ctx.fillStyle = 'rgba(0,0,255,0.6)';
ctx.fillRect(0,0,100,100);
ctx.globalCompositeOperation = 'multiply';
var grad = ctx.createRadialGradient(80,80,5,60,60,60);
grad.addColorStop(0, 'yellow');
grad.addColorStop(0.2, 'red');
grad.addColorStop(1, 'black');
ctx.fillStyle = grad;
ctx.arc(80,80,50,0,Math.PI * 2,false);
ctx.fill();

var img = new Image;
img.src = canvas.toBuffer();
ctx.drawImage(img, 0, 0, img.width, img.height);

var out = fs.createWriteStream(__dirname + '/images/gradient-output.png')
  , stream = canvas.createPNGStream();

stream.on('data', function(chunk){
  out.write(chunk);
});

