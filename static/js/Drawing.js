/**
 * This class handles the rendering of all 3D objects on the scene.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var limit = 1;

/**
 * @constructor
 * Constructor for the Drawing object. Takes a scene which it should modify.
 * @param {THREE.Scene} scene
 */
function Drawing(scene, uiCanvas) {
  this.scene = scene;
  this.uiCanvas = uiCanvas;
  this.uiCanvasContext = this.uiCanvas.getContext('2d');

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

Drawing.prototype.redrawPlayers = function(players) {
  for (var i = 0; i < this.players.length; ++i) {
    this.scene.remove(this.players[i]);
  }
  this.players = [];
  for (var i = 0; i < players.length; ++i) {
    var playerGeometry = new THREE.BoxGeometry(players[i].size[0] * 2,
                                               players[i].size[1] * 2,
                                               players[i].size[2] * 2);
    var playerMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF0000
    });
    var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.x = players[i].position[0];
    playerMesh.position.y = players[i].position[1];
    playerMesh.position.z = players[i].position[2];
    this.scene.add(playerMesh);
    this.players.push(playerMesh);
  }
};

Drawing.prototype.redrawProjectiles = function(projectiles) {
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
      color: 0xCCCCCC
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

Drawing.prototype.redrawUI = function(health) {
  this.uiCanvasContext.clearRect(0, 0, 800, 600);

  this.uiCanvasContext.save();

  this.uiCanvasContext.font="20px Georgia";
  this.uiCanvasContext.fillStyle = 'white';
  this.uiCanvasContext.fillText("Health Points", 5, 560);
  this.uiCanvasContext.beginPath();
  this.uiCanvasContext.strokeStyle = 'white';
  this.uiCanvasContext.moveTo(350, 300);
  this.uiCanvasContext.lineTo(450, 300);
  this.uiCanvasContext.stroke();
  this.uiCanvasContext.moveTo(400, 250);
  this.uiCanvasContext.lineTo(400, 350);
  this.uiCanvasContext.stroke();

  this.uiCanvasContext.fillStyle = 'red';
  this.uiCanvasContext.fillRect(5, 570, 20 * health, 20);
  this.uiCanvasContext.restore();
};
