/**
 * This class handles the rendering of all 3D objects on the scene.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * @constructor
 * Constructor for the Drawing object. Takes a scene which it should modify.
 * @param {THREE.Scene} scene
 */
function Drawing(scene) {
  this.scene = scene;

  this.map = [];
  this.players = [];
}

Drawing.prototype.updatePlayers = function(players) {
  for (var i = 0; i < this.players.length; ++i) {
    this.scene.remove(this.players[i]);
  }
  this.players = [];
  for (var i = 0; i < players.length; ++i) {
    var playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    var playerMaterial = new THREE.MeshBasicMaterial({ color: 0xabcdef });
    var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.x = players[i].position[0];
    playerMesh.position.y = players[i].position[1];
    playerMesh.position.z = players[i].position[2];
    this.scene.add(playerMesh);
    this.players.push(playerMesh);
  }
};