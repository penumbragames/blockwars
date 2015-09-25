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
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = 9;
  cube.position.z = 10;
  var geometry2 = new THREE.BoxGeometry(1, 1, 2);
  var material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var cube2 = new THREE.Mesh(geometry2, material2);
  cube2.position.x = 10;
  cube2.position.z = 10;
  this.scene.add(cube);
  this.scene.add(cube2);

  this.renderer = renderer;
  this.renderer.setSize(Game.WIDTH, Game.HEIGHT);
  // @todo prepend renderer to container so that uiCanvas can be overlaid.
  this.container.appendChild(this.renderer.domElement);
  this.uiCanvas = uiCanvas;

  this.self = self;

  this.players = [];
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

  this.socket.emit('client-intent', {
    keyboardState: {
      up: Input.UP,
      down: Input.DOWN,
      left: Input.LEFT,
      right: Input.RIGHT
    },
    horizontalLookAngle: this.self.horizontalLookAngle,
    verticalLookAngle: this.self.verticalLookAngle,
    timestamp: (new Date()).getTime()
  });
};

Game.prototype.receiveGameState = function(self, players) {
  this.self.updateFromServer(self.position);
  this.players = players;
};

Game.prototype.render = function() {
  this.renderer.render(this.scene, this.self.camera);
};
