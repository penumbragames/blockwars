/**
 * Wrapper class for all entities on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * All entities will inherit from this class. All internal values are
 * 3-tuples which contain an x, y, and z component. Size is a half
 * measurement that determines.. @todo
 * @constructor
 * @param {[number, number, number]} position
 * @param {[number, number, number]} velocity
 * @param {[number, number, number]} acceleration
 * @param {[number, number, number]} size
 */
function Entity(position, velocity, acceleration, size) {
  this.position = position;
  this.velocity = velocity;
  this.acceleration = acceleration;

  this.size = size;
}

module.exports = Entity;
