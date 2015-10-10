/**
 * This is the server app script that is run on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000 / 60;

// Dependencies
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIO = require('socket.io');
var swig = require('swig');
var Game = require('./server/Game');

var app = express();
var game = new Game();
var server = http.Server(app);
var io = socketIO(server);

app.engine('html', swig.renderFile);

app.set('port', PORT_NUMBER);
app.set('view engine', 'html');

app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/bower_components',
        express.static(__dirname + '/bower_components'));
// @todo remove after deploy
app.use('/shared',
        express.static(__dirname + '/shared'));
app.use('/static',
        express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.render('index.html');
});

io.on('connection', function(socket) {

  socket.on('new-player', function(data) {
    data = {}
    game.addNewPlayer(socket, 'name');
    socket.emit('initialize-game', {
      map: JSON.stringify(game.getMap())
    });
  });

  socket.on('client-intent', function(data) {
    game.updatePlayer(socket.id,
                      data.keyboardState,
                      data.isShooting,
                      data.horizontalLookAngle,
                      data.verticalLookAngle,
                      data.timestamp);
  });

  socket.on('disconnect', function() {
    game.removePlayer(socket.id);
  });
});

setInterval(function() {
  game.update();
  game.sendState();
}, FRAME_RATE);

server.listen(PORT_NUMBER);
console.log('Starting server on port ' + PORT_NUMBER);

