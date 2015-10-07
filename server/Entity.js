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

/**
 * This method will operate under the assumption that all entities are
 * cubic and perpendicular to the coordinate planes. Returns true when
 * two entities have collided with each other.
 * @param {Entity} other
 */
Entity.prototype.isCollidedWith = function(other) {
  return Math.abs(this.position[0] - other.position[0]) <=
      this.size[0] + other.size[0] &&
      Math.abs(this.position[1] - other.position[1]) <=
      this.size[1] + other.size[1] &&
      Math.abs(this.position[2] - other.position[2]) <=
      this.size[2] + other.size[2];
}

module.exports = Entity;
