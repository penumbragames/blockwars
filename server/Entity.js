/**
 * Wrapper class for all entities on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {[number, number, number]} position
 */
function Entity(position, velocity, acceleration) {
  this.position = position;
  this.velocity = velocity;
  this.acceleration = acceleration;
}

module.exports = Entity;
