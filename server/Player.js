/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var shallowCopy = require('shallow-copy');

var Bullet = require('./Bullet');
var Entity = require('./Entity');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * Constructor for a Player.
 * @constructor
 * @param {[number, number, number]} position The location of the player as
 *   a coordinate.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @todo Implement cooldown on the jumping to prevent wall-running.
 */
function Player(id, name, position, horizontalLookAngle, verticalLookAngle) {
  this.id = id;
  this.name = name;
  this.position = position;
  this.horizontalLookAngle = horizontalLookAngle;
  this.verticalLookAngle = verticalLookAngle;

  this.velocity = [0, 0, 0];
  this.acceleration = [0, Constants.GRAVITATIONAL_ACCELERATION, 0];
  this.moveSpeed = Player.DEFAULT_MOVESPEED;

  this.size = Player.DEFAULT_SIZE;

  this.isJumping = false;
  this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
  this.lastShotTime = 0;
  this.health = Player.MAX_HEALTH;

  this.kills = 0;
  this.deaths = 0;
}
require('./inheritable');
Player.inheritsFrom(Entity);

Player.DEFAULT_SIZE = [0.5, 1, 0.5];
Player.DEFAULT_MOVESPEED = 0.01;
Player.DEFAULT_JUMPSPEED = 0.01;
Player.DEFAULT_SHOT_COOLDOWN = 750;
Player.MAX_HEALTH = 10;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.create = function(id, name) {
  // @todo: Util.getRandomWorldPoint()
  var point = [0, 0, 0];
  return new Player(id, name, point, 0, 0);
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

  // The player will jump if a space keystroke was received.
  if (keyboardState.space && !this.isJumping) {
    this.velocity[1] = Player.DEFAULT_JUMPSPEED;
    this.isJumping = true;
  }
};

/**
 * Updates the player's position.
 * @param {Array.<Object>} mapObjects
 */
Player.prototype.update = function(mapObjects) {
  // Calculate collisions and reconcile the player objects.
  for (var i = 0; i < mapObjects.length; ++i) {
    var currentObject = mapObjects[i];
    // Iterate throught the objects in the map, if we have collided with one
    // we will set the x and z velocities accordingly.
    if (this.isCollidedWith(currentObject)) {
      // The x and z velocities will be set to zero upon collision.
      if (Util.almostEqual(
          Math.abs(this.position[0] - currentObject.position[0]),
          this.size[0] + currentObject.size[0])) {
        if (currentObject.position[0] > this.position[0]) {
          this.velocity[0] = Math.min(0, this.velocity[0]);
        } else {
          this.velocity[0] = Math.max(0, this.velocity[0]);
        }
      }
      if (Util.almostEqual(
          Math.abs(this.position[2] - currentObject.position[2]),
          this.size[2] + currentObject.size[2])) {
        if (currentObject.position[2] > this.position[2]) {
          this.velocity[2] = Math.min(0, this.velocity[2]);
        } else {
          this.velocity[2] = Math.max(0, this.velocity[2]);
        }
      }

      // The y velocity will be treated differently so that a player can land
      // on top of an object.
      if (Util.almostEqual(
          Math.abs(this.position[1] - currentObject.position[1]),
          this.size[1] + currentObject.size[1]), 0.2) {
        this.velocity[1] = Math.max(0, this.velocity[1]);
        this.isJumping = false;
      }
    }
  }

  this.parent.update.call(this);
  this.position[1] = Math.max(0, this.position[1]);
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
 * Returns a projectile shot based on the player's current position and angle.
 * This function assumes that all cooldown checks have passed and the player
 * can shoot.
 * @todo After implementing recoil and muzzle flash, we should use a priori
 *   calculation that happens instantaneously when the player shoots instead
 *   of having a bullet that updates in discrete quantities.
 */
Player.prototype.getProjectileShot = function() {
  this.lastShotTime = (new Date()).getTime();
  return Bullet.create(this.id,
                       shallowCopy(this.position),
                       shallowCopy(this.horizontalLookAngle),
                       shallowCopy(this.verticalLookAngle));
};

/**
 * Returns a boolean determining if the player is dead or not.
 * @return {boolean}
 */
Player.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * Takes care of respawning this player. If this is called, it is assumed
 * that death checks have been performed and the player actually is dead.
 */
Player.prototype.respawn = function() {
  this.position = [Util.randRangeInt(-25, 25),
                   Util.randRangeInt(-25, 25),
                   Util.randRangeInt(-25, 25)];
  this.health = Player.MAX_HEALTH;
};

/**
 * Damages the player by the given amount.
 * @param {number} amount The amount to damage the player by.
 */
Player.prototype.damage = function(amount) {
  this.health -= amount;
};

module.exports = Player;
