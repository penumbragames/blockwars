/**
 * This class manages the helper functions needed on the client side.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function Util() {}

Util.linearScale = function(valueA, minA, maxA, minB, maxB) {
  return minB + (maxB - minB) * ((valueA - minA) / (maxA - minA));
};
