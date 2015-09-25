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
    game = Game.create(document.getElementById('game-container'),
                       socket, 'blah', [0, 0]);
    render();
  });

  socket.on('update', function(data) {
    game.receiveGameState(data.self, data.players);
  });
});

function render() {
  requestAnimationFrame(render);
  game.update();
  game.render();
}
