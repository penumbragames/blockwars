/**
 * This class encapsulates the state of a bullet on the server and handles its
 * updating as well as its collision.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Entity = require('./Entity');

function Bullet() {
}
require('./inheritable');
Bullet.inheritsFrom(Entity);

Bullet.prototype.update = function() {
};
