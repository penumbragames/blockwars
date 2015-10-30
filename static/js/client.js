/**
 * Client side script to initialize game canvases and objects.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var socket = io();
var game = null;

$(document).ready(function() {

  $('#name-prompt-entry').focus()

  $('#game-resume').click(function() {
    Input.lockPointer();
  });

  function send_name() {
    Input.lockPointer();
    var name = $('#name-prompt-entry').val();
    if (name && name.length < 20 && name != '') {
      $('#name-prompt-container').fadeOut(500);

      socket.emit('new-player', {
        name: name
      });
    } else {
      window.alert('Your name cannot be blank or over 20 characters!');
    }
    return false;
  }

  $('#name-prompt-form').submit(send_name);
  $('#name-prompt-submit').click(send_name);

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
