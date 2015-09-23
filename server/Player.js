/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Entity = require('./Entity');
var Util = require('./Util');

/**
 * Constructor for a Player.
 * @constructor
 * @param {[number, number, number]} position The location of the player as
 *   a coordinate.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 */
function Player(position, horizontalLookAngle, verticalLookAngle, name, id) {
  this.position = position;
  this.horizontalLookAngle = horizontalLookAngle;
  this.verticalLookAngle = verticalLookAngle;
  this.name = name;
  this.id = id;

  this.velocity = [0, 0, 0];
  this.moveSpeed = Player.DEFAULT_MOVESPEED;

  this.lastUpdateTime = (new Date()).getTime();
  this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
  this.lastShotTime = 0;
  this.health = Player.MAX_HEALTH;

  this.kills = 0;
  this.deaths = 0;
}
require('./inheritable');
Player.inheritsFrom(Entity);

Player.DEFAULT_MOVESPEED = 0.1;
Player.DEFAULT_SHOT_COOLDOWN = 800;
Player.MAX_HEALTH = 10;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.generateNewPlayer = function(name, id) {
  // @todo: Util.getRandomWorldPoint()
  var point = [0, 0, 0];//Util.getRandomWorldPoint();
  return new Player(point, 0, 0, name, id);
};

/**
 * Updates this player given the the client's keyboard state and mouse angle
 * for setting the tank turret.
 * @param {Object} keyboardState A JSON Object storing the state of the
 *   client keyboard.
 * @param {number} turretAngle The angle of the client's mouse with respect
 *   to the tank.
 */
Player.prototype.updateOnInput = function(keyboardState, horizontalLookAngle,
                                          verticalLookAngle) {
  this.horizontalLookAngle = horizontalLookAngle;
  this.verticalLookAngle = verticalLookAngle;

  // Based on what keys are being pressed, the player will move at some angle
  // relative to THEIR CURRENT LOOKING ANGLE.
  var moveAngleRelativeToLookAngle = 0;

  if (keyboardState.up && keyboardState.right) {
    moveAngleRelativeToLookAngle = Math.PI / 4;
  } else if (keyboardState.up && keyboardState.left) {
    moveAngleRelativeToLookAngle = 7 * Math.PI / 4;
  } else if (keyboardState.down && keyboardState.left) {
    moveAngleRelativeToLookAngle = 5 * Math.PI / 4;
  } else if (keyboardState.down && keyboardState.right) {
    moveAngleRelativeToLookAngle = 3 * Math.PI / 4;
  } else if (keyboardState.up) {
    moveAngleRelativeToLookAngle = 0;
  } else if (keyboardState.left) {
    moveAngleRelativeToLookAngle = 3 * Math.PI / 2;
  } else if (keyboardState.down) {
    moveAngleRelativeToLookAngle = Math.PI;
  } else if (keyboardState.right) {
    moveAngleRelativeToLookAngle = Math.PI / 2;
  }

  if (!keyboardState.up && !keyboardState.down &&
      !keyboardState.left && !keyboardState.right) {
    this.velocity[0] = 0;
    this.velocity[2] = 0;
  } else {
    this.velocity[0] = Player.DEFAULT_MOVESPEED * Math.cos(
      this.horizontalLookAngle + moveAngleRelativeToLookAngle);
    this.velocity[2] = Player.DEFAULT_MOVESPEED * Math.sin(
      this.horizontalLookAngle + moveAngleRelativeToLookAngle);
  }
};

/**
 * Updates the player's position and powerup states.
 */
Player.prototype.update = function() {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - this.lastUpdateTime;
  for (var i = 0; i < this.position.length; ++i) {
    this.position[i] += this.velocity[i] * timeDifference;
  }

  this.lastUpdateTime = currentTime;
};

/**
 * Returns a boolean indicating if the player's shot cooldown has passed and
 * the player can shoot.
 * @return {boolean}
 */
Player.prototype.canShoot = function() {
  return (new Date()).getTime() >
    this.lastShotTime + this.shotCooldown;
};

/**
 * Used to determine if two objects have collided, factors in shields, since
 * they increase the player's hitbox. This collision detection method assumes
 * all objects have circular hitboxes.
 * @param {number} x The x-coordinate of the center of the object's circular
 *   hitbox.
 * @param {number} y The y-coordinate of the center of the object's circular
 *   hitbox.
 * @param {number} hitboxSize The radius of the object's circular
 *   hitbox.
 */
Player.prototype.isCollidedWith = function(x, y, hitboxSize) {
  throw new Error('unimplemented exception!');
};

/**
 * Returns a boolean determining if the player is dead or not.
 * @return {boolean}
 */
Player.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * Damages the player by the given amount.
 * @param {number} amount The amount to damage the player by.
 */
Player.prototype.damage = function(amount) {
  this.health -= amount;
};

module.exports = Player;
