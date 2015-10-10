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
  this.projectiles = [];
}

/**
 * Given the array of objects in the map during initialization, this
 * function adds them all to the scene so that they do not have to be
 * redrawn later. When we create the BoxGeometry, we use double the
 * sizes in the x, y, and z dimensions because the states stored on the
 * server store the half-width, half-height, and half-length.
 * @param {Array.<Object>} map
 */
Drawing.prototype.setMap = function(map) {
  for (var i = 0; i < map.length; ++i) {
    var newGeometry = new THREE.BoxGeometry(map[i].size[0] * 2,
                                            map[i].size[1] * 2,
                                            map[i].size[2] * 2);
    var newMaterial = new THREE.MeshBasicMaterial({
      color: map[i].color
    });
    var newMesh = new THREE.Mesh(newGeometry, newMaterial);
    newMesh.position.x = map[i].position[0];
    newMesh.position.y = map[i].position[1];
    newMesh.position.z = map[i].position[2];
    this.map.push(newMesh);
    this.scene.add(newMesh);
  }
}

Drawing.prototype.updatePlayers = function(players) {
  for (var i = 0; i < this.players.length; ++i) {
    this.scene.remove(this.players[i]);
  }
  this.players = [];
  for (var i = 0; i < players.length; ++i) {
    var playerGeometry = new THREE.BoxGeometry(players[i].size[0] * 2,
                                               players[i].size[1] * 2,
                                               players[i].size[2] * 2);
    var playerMaterial = new THREE.MeshBasicMaterial({
      color: 0xFBABFC
    });
    var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.x = players[i].position[0];
    playerMesh.position.y = players[i].position[1];
    playerMesh.position.z = players[i].position[2];
    this.scene.add(playerMesh);
    this.players.push(playerMesh);
  }
};

Drawing.prototype.updateProjectiles = function(projectiles) {
  for (var i = 0; i < this.projectiles.length; ++i) {
    this.scene.remove(this.projectiles[i]);
  }
  this.projectiles = [];
  for (var i = 0; i < projectiles.length; ++i) {
    var projectileGeometry = new THREE.BoxGeometry(
        projectiles[i].size[0] * 2,
        projectiles[i].size[1] * 2,
        projectiles[i].size[2] * 2
    );
    var projectileMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF
    });
    var projectileMesh = new THREE.Mesh(projectileGeometry,
                                        projectileMaterial);
    projectileMesh.position.x = projectiles[i].position[0];
    projectileMesh.position.y = projectiles[i].position[1];
    projectileMesh.position.z = projectiles[i].position[2];
    this.scene.add(projectileMesh);
    this.projectiles.push(projectileMesh);
  }
};
