/**
 * Wrapper class for all entities on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Constants = require('./Constants');
var Util = require('./Util');

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {[number, number, number]} position
 */
function Entity(position) {
  this.position = position;
}

module.exports = Entity;
