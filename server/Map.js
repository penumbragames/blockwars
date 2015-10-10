/**
 * This class stores maps as objects to be serialized and sent to the client.
 * This should be improved later and factored out into a utility instead.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Entity = require('./Entity');

function Map() {
  this.objects = [];
}

Map.generate = function() {
  var map = new Map();
  map.addBlock([9, 0, 10], [1, 1, 1], 0x0000FF);
  map.addBlock([10, 0, 10], [1, 1, 2], 0x00FF00);
  map.addBlock([0, -1, 0], [1000, 0.5, 1000], 0xABCDEF);
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
