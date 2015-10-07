/**
 * This class stores global constants for this project, and is available to the
 * client as well as the server modules.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
}

Constants.DEFAULT_EPSILON = 0.2;

Constants.GRAVITATIONAL_ACCELERATION = -0.005;

try {
  module.exports = Constants;
} catch (err) {}
