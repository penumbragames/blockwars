/**
 * This client side class encapsulates the game and handles the interaction
 * between the various objects in the world.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * @todo Document the fucking shit out of everything.
 */

/**
 * @constructor
 * @param {Element} container The container element for the game.
 */
function Game(socket, container, scene, map, renderer, uiCanvas, self) {
  this.container = container;
  this.socket = socket;

  /**
   * The render() method is called with the scene and camera as parameters
   * on the renderer object to draw the 3D scene.
   */
  this.scene = scene;
  this.drawing = new Drawing(scene);
  this.drawing.setMap(map);

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

Game.create = function(socket, parentElement, position, map) {
  // @todo: integrate map sending
  return new Game(socket,
                  parentElement,
                  new THREE.Scene(),
                  map,
                  new THREE.WebGLRenderer(),
                  null,
                  Player.create(position));
};

Game.prototype.update = function() {
  this.self.updateFromClient();

  this.socket.emit('client-intent', {
    keyboardState: {
      up: Input.UP,
      down: Input.DOWN,
      left: Input.LEFT,
      right: Input.RIGHT,
      space: Input.SPACE
    },
    horizontalLookAngle: this.self.horizontalLookAngle,
    verticalLookAngle: this.self.verticalLookAngle,
    shooting: Input.LEFT_CLICK,
    timestamp: (new Date()).getTime()
  });

  this.drawing.updatePlayers(this.players);
};

Game.prototype.receiveGameState = function(self, players) {
  this.self.updateFromServer(self.position);
  this.players = players;
};

Game.prototype.render = function() {
  this.renderer.render(this.scene, this.self.camera);
};
