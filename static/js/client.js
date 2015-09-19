/**
 * Client side script to initialize game canvases and objects.
 */

var socket = io();
var game = null;

$(document).ready(function() {

  $('.start').click(function() {
    Input.lockPointer();
  });

  socket.emit('new-player');

  socket.on('initialize-game', function(data) {
    console.log(data);
    Input.applyEventHandlers();
    // @todo receive player position
    game = Game.create(document.getElementById('game-container'),
                       socket, 'blah', [0, 0]);
    render();
  });
});

function render() {
  requestAnimationFrame(render);
  game.update();
}

//var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera(
//    75, window.innerWidth / window.innerHeight, 0.1, 1000);
//
//var renderer = new THREE.WebGLRenderer();
//renderer.setSize(800, 600);
//document.body.appendChild(renderer.domElement);
//
//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
//
//camera.position.z = 5;
//
//var render = function () {
//  requestAnimationFrame(render);
//  renderer.render(scene, camera);
//};
//
//render();
