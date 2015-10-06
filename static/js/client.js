/**
 * Client side script to initialize game canvases and objects.
 */

var socket = io();
var game = null;

$(document).ready(function() {

  $('.start').click(function() {
    Input.lockPointer();
  });

  socket.emit('new-player', {
    name: 'bob'
  });

  socket.on('initialize-game', function(data) {
    Input.applyEventHandlers();
    // todo: proper initialization
    game = Game.create(socket,
                       document.getElementById('game-container'),
                       [0, 0, 0],
                       JSON.parse(data.map));
    render();
  });

  socket.on('update', function(data) {
    game.receiveGameState(data.self, data.players);
  });
});

function render() {
  window.requestAnimFrame(render);
  game.update();
  game.render();
}
