/**
 * This class stores global constants on the server, such as environment
 * size. The client will maintain its own version of this, so it's important
 * that if we change it server side, we also change it client side.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * @todo Find a better way to maintain constants between the client and server.
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
}

module.exports = Constants;
