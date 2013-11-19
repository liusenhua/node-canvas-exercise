
/**
 * Module dependencies.
 */

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(1024, 768)
  , ctx = canvas.getContext('2d')
  , fs = require('fs');

var input1 = fs.readFileSync(__dirname + '/images/Desert.png');
img = new Image;
img.src = input1;
ctx.drawImage(img, 0, 0, img.width, img.height);

ctx.globalCompositeOperation = 'multiply';

var input2 = fs.readFileSync(__dirname + '/images/Penguins.png');
img2 = new Image;
img2.src = input2;
ctx.drawImage(img2, 0, 0, img2.width, img2.height);

// output the base64 data url
console.log('<img src="' + canvas.toDataURL() + '" />');

var out = fs.createWriteStream(__dirname + '/images/composite-output.png')
  , stream = canvas.createPNGStream();

stream.on('data', function(chunk){
  out.write(chunk);
});
