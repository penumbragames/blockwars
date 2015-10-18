/**
 * Client side script to initialize game canvases and objects.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var socket = io();
var game = null;

$(document).ready(function() {

  $('#name-prompt-entry').focus()

  $('#game-resume').click(function() {
    Input.lockPointer();
    console.log('resume');
  });

  $('#name-prompt-entry').submit(function() {
    Input.lockPointer();
    var name = $('#name-prompt-entry').val();

    socket.emit('new-player', {
      name: name
    });
  });

  $('#name-prompt-submit').click(function() {
    Input.lockPointer();
    var name = $('#name-prompt-entry').val();

    socket.emit('new-player', {
      name: name
    });
  });

  socket.on('initialize-game', function(data) {
    $('#name-prompt-overlay').fadeOut(1000);
    game = Game.create(socket,
                       document.getElementById('game-container'),
                       [0, 0, 0],
                       JSON.parse(data.map));
    Input.applyEventHandlers();
    render();
  });

  socket.on('update', function(data) {
    game.receiveGameState(data.self, data.players, data.projectiles);
  });
});

function render() {
  window.requestAnimFrame(render);
  game.update();
  game.render();
}
