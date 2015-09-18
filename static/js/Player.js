/**
 * This class encapsulates the client player's positional data on the client
 * side.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * @constructor
 */
function Player(id, camera, x, y) {
  this.id = id;
  this.camera = camera;

  this.x = x;
  this.y = y;
}

Player.create = function(id, position) {
  return new Player(id,
                    new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000),
                    position[0], position[1]);
};

Player.prototype.updateFromClient = function() {
  if (Input.LEFT) {
    this.camera.position.x -= 0.2;
  }
  if (Input.RIGHT) {
    this.camera.position.x += 0.2;
  }
  if (Input.UP) {
    this.camera.position.z -= 0.2;
  }
  if (Input.DOWN) {
    this.camera.position.z += 0.2;
  }
};

Player.prototype.updateFromServer = function() {
};
