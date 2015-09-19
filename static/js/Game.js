/**
 * This client side class encapsulates the game and handles the interaction
 * between the various objects in the world.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * @constructor
 * @param {Element} container The container element for the game.
 */
function Game(container, socket, scene, renderer, uiCanvas, self) {
  this.container = container;
  this.socket = socket;

  /**
   * The render() method is called with the scene and camera as parameters
   * on the renderer object to draw the 3D scene.
   */
  this.scene = scene;

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh(geometry, material);
  this.scene.add(cube);

  this.renderer = renderer;
  this.renderer.setSize(800, 600);
  // @todo prepend renderer to container so that uiCanvas can be overlaid.
  this.container.appendChild(this.renderer.domElement);
  this.uiCanvas = uiCanvas;

  this.self = self;
}

Game.WIDTH = 800;

Game.HEIGHT = 600;

Game.create = function(parentElement, socket, id, position) {
  return new Game(parentElement, socket,
                  new THREE.Scene(),
                  new THREE.WebGLRenderer(),
                  null,
                  Player.create(id, position));
};

Game.prototype.update = function() {
  this.self.updateFromClient();
  this.renderer.render(this.scene, this.self.camera);
};

Game.prototype.render = function() {
};
