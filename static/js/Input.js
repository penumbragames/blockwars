/**
 * This class keeps track of the user input in global variables.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Empty constructor for the Input object.
 * @constructor
 */
function Input() {}

Input.LEFT_CLICK = false;
Input.RIGHT_CLICK = false;
Input.MOUSE_LOCKED = false;
Input.RECENT_MOUSE_MOVEMENTS = [];
Input.LEFT = false;
Input.UP = false;
Input.RIGHT = false;
Input.DOWN = false;
Input.SPACE = false;

Input.onMouseDown = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = true;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = true;
  }
};

Input.onMouseUp = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = false;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = false;
  }
};

Input.onMouseMove = function(e) {
  Input.RECENT_MOUSE_MOVEMENTS.push([
      e.movementX || e.mozMovementX || e.webkitMoveMentX || 0,
      e.movementY || e.mozMovementY || e.webkitMovementY || 0
  ]);
};

Input.onKeyDown = function(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      Input.LEFT = true;
      break;
    case 38:
    case 87:
      Input.UP = true;
      break;
    case 39:
    case 68:
      Input.RIGHT = true;
      break;
    case 40:
    case 83:
      Input.DOWN = true;
      break;
    case 32:
      Input.SPACE = true;
      break;
  };
};

Input.onKeyUp = function(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      Input.LEFT = false;
      break;
    case 38:
    case 87:
      Input.UP = false;
      break;
    case 39:
    case 68:
      Input.RIGHT = false;
      break;
    case 40:
    case 83:
      Input.DOWN = false;
      break;
    case 32:
      Input.SPACE = false;
      break;
  };
};

/**
 * This is the only function that needs to be called in the client-side
 * script. This should be called during initialization to allow the Input
 * class to track user input.
 */
Input.applyEventHandlers = function() {
  element = document.getElementById('game-container');
  element.requestPointerLock = element.requestPointerLock ||
     element.mozRequestPointerLock ||
     element.webkitRequestPointerLock;

  window.addEventListener('mousedown', Input.onMouseDown);
  window.addEventListener('mouseup', Input.onMouseUp);
  window.addEventListener('mousemove', Input.onMouseMove);
  window.addEventListener('keyup', Input.onKeyUp);
  window.addEventListener('keydown', Input.onKeyDown);

  function pointerLockCallback() {
    Input.MOUSE_LOCKED = !!(
        document.pointerLockElement == element ||
        document.mozPointerLockElement == element ||
        document.webkitPointerLockElement == element);
  }
  document.addEventListener('pointerlockchange', pointerLockCallback);
  document.addEventListener('mozpointerlockchange', pointerLockCallback);
  document.addEventListener('webkitpointerlockchange', pointerLockCallback);
};

Input.lockPointer = function() {
  document.getElementById('game-container').requestPointerLock();
};
