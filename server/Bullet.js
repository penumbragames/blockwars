/**
 * This class encapsulates the state of a bullet on the server and handles its
 * updating as well as its collision.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var shallowCopy = require('shallow-copy');

var Entity = require('./Entity');

/**
 * Constructor for a Bullet.
 * @constructor
 * @param {[number, number, number]} position The coordinate of the position
 *   of the bullet.
 * @param {[number, number, number]} velocity The velocity components of
 *   the bullet.
 * @param {string} source The socket ID of the player that fired the
 *   bullet.
 */
function Bullet(source, position, velocity, size) {
  this.source = source;

  this.position = position;
  this.velocity = velocity;
  this.size = size;


  this.distanceTraveled = 0;

  this.shouldExist = true;
}
require('./inheritable');
Bullet.inheritsFrom(Entity);

/**
 * VELOCITY_MAGNITUDE is in distance units per millisecond.
 * MAX_TRAVEL_DISTANCE is in distance units.
 * SIZE is a 3-tuple of distance units.
 */
Bullet.VELOCITY_MAGNITUDE = 0.2;
Bullet.DEFAULT_DAMAGE = 1;
Bullet.MAX_TRAVEL_DISTANCE = 100;
Bullet.SIZE = [0.1, 0.1, 0.1];

/**
 * Factory method to create a bullet, intended to be called from the context
 * of a Player object.
 * @param {string} source The socket ID of the player that fired this bullet.
 * @param {[number, number, number]} The starting position of the bullet.
 * @param {number} horizontalAngle The horizontal looking angle of the player
 *   that fired this bullet.
 * @param {number} verticalAngle The vertical looking angle of the player that
 *   fired this bullet.
 */
Bullet.create = function(source, position, horizontalAngle, verticalAngle) {
  var velocity = [
    Bullet.VELOCITY_MAGNITUDE * Math.sin(verticalAngle) *
        Math.cos(horizontalAngle),
    Bullet.VELOCITY_MAGNITUDE * Math.cos(verticalAngle),
    Bullet.VELOCITY_MAGNITUDE * Math.sin(verticalAngle) *
        Math.sin(horizontalAngle)
  ];
  return new Bullet(source, position, velocity, Bullet.SIZE);
};

/**
 * Updates this bullet's position and internal state.
 */
Bullet.prototype.update = function(clients, mapObjects) {
  var lastPosition = shallowCopy(this.position);
  this.parent.update.call(this);

  this.distanceTraveled += Bullet.VELOCITY_MAGNITUDE *
      this.updateTimeDifference;
  this.shouldExist = this.distanceTraveled <= Bullet.MAX_TRAVEL_DISTANCE;

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.source != players[i].id &&
        players[i].lineIntersects(lastPosition, this.position)) {
      players[i].damage(1);
      if (players[i].isDead()) {
        players[i].respawn();
        var killingPlayer = clients.get(this.source);
        killingPlayer.kills++;
      }
      this.shouldExist = false;
      return;
    }
  }

  for (var i = 0; i < mapObjects.length; ++i) {
    if (this.isCollidedWith(mapObjects[i])) {
      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Bullet;
