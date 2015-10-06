/**
 * This class stores maps as objects to be serialized and sent to the client.
 * This should be improved later and factored out into a utility instead.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function Map() {
  this.objects = [];
}

Map.generate = function() {
  var map = new Map();
  map.addBlock([9, 0, 10], [1, 1, 1], 0x0000ff);
  map.addBlock([10, 0, 10], [1, 1, 2], 0x00ff00);
  map.addBlock([0, -1, 0], [1000, 1, 1000], 0xabcdef);
  return map;
};

Map.prototype.addBlock = function(position, size, color) {
  this.objects.push({
    position: position,
    size: size,
    color: color
  });
};

Map.prototype.getObjects = function() {
  return this.objects;
};

module.exports = Map;
