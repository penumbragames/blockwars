/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require('hashmap');
var Map = require('./Map');
var Player = require('./Player');

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects
 * in the game.
 * @constructor
 */
function Game() {
  this.map = Map.generate();

  /**
   * This is a hashmap containing all the connected socket ids and socket
   * instances as well as the packet number of the socket and their latency.
   */
  this.clients = new HashMap();

  /**
   * This is a hashmap containing all the connected socket ids and the players
   * associated with them. This should always be parallel with sockets.
   */
  this.players = new HashMap();

  /**
   * These arrays contain entities in the game world. They do not need to be
   * stored in a hashmap because they do not have a unique id.
   */
  this.projectiles = [];
}

/**
 * Creates a new player with the given name and ID.
 * @param {Object} The socket object of the player.
 * @param {string} The display name of the player.
 */
Game.prototype.addNewPlayer = function(socket, name) {
  this.clients.set(socket.id, {
    socket: socket,
    latency: 0
  });
  this.players.set(socket.id, Player.create(socket.id, name));
};

/**
 * Removes the player with the given socket ID.
 * @param {string} The socket ID of the player to remove.
 */
Game.prototype.removePlayer = function(id) {
  if (this.clients.has(id)) {
    this.clients.remove(id);
  }
  if (this.players.has(id)) {
    var player = this.players.get(id);
    this.players.remove(id);
  }
};

/**
 * Updates the player with the given ID according to the
 * input state sent by that player's client.
 * @param {string} id The socket ID of the player to update.
 * @param {Object} keyboardState The state of the player's keyboard.
 * @param {boolean} isShooting The state of the player's left click. If it
 *   is true, then the player is considered to be shooting.
 * @param {number} horizontalLookAngle The horizontal looking angle of the
 *   player in radians.
 * @param {number} verticalLookAngle The vertical looking angle of the player
 *   in radians.
 * @param {number} packetNumber The number of the packet being sent.
 * @param {number} timestamp The timestamp of the packet sent.
 */
Game.prototype.updatePlayer = function(id,
                                       keyboardState,
                                       isShooting,
                                       horizontalLookAngle,
                                       verticalLookAngle,
                                       timestamp) {
  var player = this.players.get(id);
  var client = this.clients.get(id);
  if (player) {
    player.updateOnInput(keyboardState, horizontalLookAngle,
                         verticalLookAngle);
    if (isShooting && player.canShoot()) {
      this.projectiles.push(player.getProjectileShot());
    }
  }
  if (client) {
    client.latency = (new Date()).getTime() - timestamp;
  }
};

/**
 * Returns an array of the currently active players.
 * @return {Array.<Player>}
 */
Game.prototype.getPlayers = function() {
  return this.players.values();
};

/**
 * Returns the array of JSON objects that represents the map the game is played
 * on.
 * @return {Array.<Object>}
 */
Game.prototype.getMap = function() {
  return this.map.getObjects();
};

/**
 * Updates the state of all the objects in the game.
 */
Game.prototype.update = function() {
  // Update all the players.
  var players = this.getPlayers();
  for (var i = 0; i < players.length; ++i) {
    players[i].update(this.map.getObjects());
  }

  for (var i = 0; i < this.projectiles.length; ++i) {
    if (this.projectiles[i].shouldExist) {
      this.projectiles[i].update(this.players, this.map.getObjects());
    } else {
      var removedProjectile = this.projectiles.splice(i, 1);
      i--;
    }
  }
};

/**
 * Sends the state of the game to all the connected sockets after
 * filtering them appropriately.
 */
Game.prototype.sendState = function() {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    var currentPlayer = this.players.get(ids[i]);
    var currentClient = this.clients.get(ids[i]);
    currentClient.socket.emit('update', {
      self: currentPlayer,
      players: this.players.values().filter(function(player) {
        return player.id != currentPlayer.id;
      }),
      projectiles: this.projectiles,
      latency: currentClient.latency
    });
  }
};

module.exports = Game;
