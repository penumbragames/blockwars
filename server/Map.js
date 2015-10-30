/**
 * This class stores maps as objects to be serialized and sent to the client.
 * This should be improved later and factored out into a utility instead.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

function Map() {
  this.objects = [];
}

Map.generate = function() {
  var map = new Map();
  map.addBlock([2, 0, 2], [1, 1, 1], 0x0000FF);
  map.addBlock([-2, 0, -2], [1, 1, 2], 0x00FF00);
  map.addBlock([0, -1, 0], [1000, 0.5, 1000], 0xABCDEF);
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i*0.7, 0, i], [1,0.5+(2*Math.random()),1], 0xFF00FF);
     map.addBlock([-i, 0, -i*1.3], [1,0.5+(2*Math.random()),1], 0xFF00FF);
     map.addBlock([i*2, 0, i], [1,0.5+(2*Math.random()),1], 0x0000FF);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i-13, 0.01*i, -i], [1,0.25+1.1*Math.random(),1], 0xFF00FF);
     map.addBlock([-i+13, 0.3*i, i], [1,0.11+1.1*Math.random(),1], 0xAB21CD);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i-10, 0.2*i, -i], [1,0.6+1.1*Math.random(),1], 0x0FC123);
     map.addBlock([-i+20, 0, i], [1,0.05+1.1*Math.random(),1], 0x52FCC1);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i+10, 0.1*i, 15], [1,0.08+1.1*Math.random(),1], 0x0FC123);
     map.addBlock([i+30, 0.15*i, 30], [1,0.24+1.1*Math.random(),1], 0x52FCC1);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i-30, 0.1*i, -15], [1,0.15+1.1*Math.random(),1], 0x0F21CA);
     map.addBlock([i-15, 0.15*i, -30], [1,0.71+1.1*Math.random(),1], 0x5AFCA1);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i-40, 0.1*i, -5], [1,0.03+1.1*Math.random(),1], 0x1F16CA);
     map.addBlock([i+5, 0.15*i, 5], [1,0.01+1.1*Math.random(),1], 0x5111A1);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([-5, 0.1*i, i], [1,0.9+1.1*Math.random(),1], 0x1F16CA);
     map.addBlock([5, 0.15*i, i], [1,0.4+1.1*Math.random(),1], 0x5111A1);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([-15, 0.1*i, i], [1,0.1+1.1*Math.random(),1], 0x0F21CA);
     map.addBlock([-30, 0.15*i, i], [1,0.95+1.1*Math.random(),1], 0x5AFCA1);
   }
   for (var i = 6; i < 40; i=i+5){
     map.addBlock([i, 0, 2], [1,0.2+1.1*Math.random(),1], 0x0FBBCB);
     map.addBlock([-2, 0, i], [1,0.2+1.1*Math.random(),1], 0x5ABAAF);
   }
  return map;
};


Map.prototype.addBlockHelper = function(lowerCorner, size, color) {
  this.addBlock(
      [lowerCorner[0] + size[0] / 2,
       lowerCorner[1] + size[1] / 2,
       lowerCorner[2] + size[2] / 2],
      [size[0] / 2,
       size[1] / 2,
       size[2] / 2],
      color);
};

Map.prototype.addBlock = function(position, size, color) {
  var block = new Entity(position, null, null, size);
  block.color = color;
  this.objects.push(block);
};

/**
 * Returns the objects in the map for serialization so that it can be
 * sent to the client.
 */
Map.prototype.getObjects = function() {
  return this.objects;
};

module.exports = Map;
