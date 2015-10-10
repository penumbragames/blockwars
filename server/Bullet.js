/**
 * This class encapsulates the state of a bullet on the server and handles its
 * updating as well as its collision.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var copy = require('shallow-copy');

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
function Bullet(position, velocity, size, source) {
  this.position = position;
  this.velocity = velocity;
  this.size = size;

  this.source = source;

  this.distanceTraveled = 0;

  this.shouldExist = true;
}
require('./inheritable');
Bullet.inheritsFrom(Entity);

Bullet.VELOCITY_MAGNITUDE = 0.1;
Bullet.DEFAULT_DAMAGE = 1;
Bullet.MAX_TRAVEL_DISTANCE = 10000;
Bullet.SIZE = [0.1, 0.1, 0.1];

/**
 * Factory method to create a bullet, intended to be called from the context
 * of a Player object.
 * @param {string} id The socket ID of the player that fired this bullet.
 * @param {[number, number, number]} The starting position of the bullet.
 * @param {number} horizontalAngle The horizontal looking angle of the player
 *   that fired this bullet.
 * @param {number} verticalAngle The vertical looking angle of the player that
 *   fired this bullet.
 */
Bullet.create = function(id, position, horizontalAngle, verticalAngle) {
  var velocity = [
    Bullet.VELOCITY_MAGNITUDE * Math.sin(verticalAngle) *
        Math.cos(horizontalAngle),
    Bullet.VELOCITY_MAGNITUDE * Math.cos(verticalAngle),
    Bullet.VELOCITY_MAGNITUDE * Math.sin(verticalAngle) *
        Math.sin(horizontalAngle)
  ];
  return new Bullet(position, velocity, Bullet.SIZE, id);
};

Bullet.prototype.update = function(clients) {
  var lastPosition = copy(this.position);
  this.parent.update.call(this);

  // For less intensive process, we will add Manhattan distance instead.
  for (var i = 0; i < this.position.length; ++i) {
    this.distanceTraveled += Math.abs(this.position[i] - lastPosition[i]);
  }

  this.shouldExist = this.distanceTraveled <= Bullet.MAX_TRAVEL_DISTANCE;

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.lineIntersects(lastPosition, this.position) &&
        this.source != players[i].id) {
      // @todo
//      players[i].damage(1);
//      if (players[i].isDead()) {
//        players[i].respawn();
//        var killingPlayer = clients.get(this.source);
//        killingPlayer.kills++;
//      }
//      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Bullet;
