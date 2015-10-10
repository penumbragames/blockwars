/**
 * This is a wrapper class for projectiles on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Entity = require('./Entity');

/**
 * Constructor for a Projectile.
 * @constructor
 * @param {[number, number, number]} position The coordinate of the position
 *   of the projectile.
 * @param {[number, number, number]} velocity The velocity components of
 *   the projectile.
 * @param {string} source The socket ID of the player that fired the
 *   projectile.
 */
function Projectile(position, velocity, size, source) {
  this.position = position || [0, 0, 0];
  this.velocity = velocity || [0, 0, 0];
  this.size = size || [0, 0, 0];

  this.source = source;

  this.shouldExist = true;
}
require('./inheritable');
Projectile.inheritsFrom(Entity);

/**
 * Calls the update() method defined in the Entity class to update what's known
 * to this entity.
 */
Projectile.prototype.update = function() {
  this.parent.update.call(this);
};

module.exports = Projectile;
