/**
 * Wrapper class for all entities on the server. This class operates on the
 * assumption that all entities have hitboxes that are axis-aligned bounding
 * boxes.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * All entities will inherit from this class. All internal values are
 * 3-tuples which contain an x, y, and z component. Size is a half
 * measurement that determines half the size of the entity in that dimension.
 * @constructor
 * @param {[number, number, number]} position
 * @param {[number, number, number]} velocity
 * @param {[number, number, number]} acceleration
 * @param {[number, number, number]} size
 */
function Entity(position, velocity, acceleration, size) {
  this.position = position;
  this.velocity = velocity;
  this.acceleration = acceleration;

  this.size = size;
}

/**
 * Returns an array containing two opposite points on this
 * cubic entity.
 * @return {Array.<[number, number, number]>}
 */
Entity.prototype.getCornerBounds = function() {
  return [
    [this.position[0] - this.size[0],
     this.position[1] - this.size[1],
     this.position[2] - this.size[2]
    ],
    [this.position[0] + this.size[0],
     this.position[1] + this.size[1],
     this.position[2] + this.size[2]
    ]
  ];
};

/**
 * Returns true if the given point is contained within this
 * entity.
 * @param {[number, number, number]}
 */
Entity.prototype.containsPoint = function(point) {
  var cornerBounds = this.getCornerBounds();
  return Util.inBound(point[0], cornerBounds[0][0], cornerBounds[1][0]) &&
      Util.inBound(point[1], cornerBounds[0][1], cornerBounds[1][1]) &&
      Util.inBound(point[2], cornerBounds[0][2], cornerBounds[1][1]);
};

/**
 * This method will operate under the assumption that all entities are
 * cubic and perpendicular to the coordinate planes. Returns true when
 * two entities have collided with each other.
 * @param {Entity} other
 */
Entity.prototype.isCollidedWith = function(other) {
  return Math.abs(this.position[0] - other.position[0]) <=
      this.size[0] + other.size[0] &&
      Math.abs(this.position[1] - other.position[1]) <=
      this.size[1] + other.size[1] &&
      Math.abs(this.position[2] - other.position[2]) <=
      this.size[2] + other.size[2];
};

/**
 * This method returns true if the line described by the two given endpoints
 * intersects this entity.
 * @param {number} p1 The first endpoint of the given line.
 * @param {number} p2 The second endpoint of the given line.
 */
Entity.prototype.lineIntersects = function(p1, p2) {
  var cornerBounds = this.getCornerBounds();

  var intersects = this.containsPoint(p1);
  if (!intersects) {
    var tNearMax = Number.MIN_VALUE;
    var tFarMin = Number.MAX_VALUE;

    var div = 1 / p2[0];
    var tNear = (cornerBounds[0][0] - p1[0]) * div;
    var tFar = (cornerBounds[1][0] - p1[0]) * div;
    if (tNear > tFar) {
      var tmp = tNear;
      tNear = tFar;
      tFar = tmp;
    }
    tNearMax = Math.max(tNearMax, tNear);
    tFarMin = Math.min(tFarMin, tFar);
    intersect = (tNearMax <= tFarMin);

    // If an intersection was detected, do the same calculation for y
    // and z.
    if (intersect) {
      div = 1 / p2[1];
      tNear = (cornerBounds[0][1] - p1[1]) * div;
      tFar = (cornerBounds[1][1] - p1[1]) * div;
      if (tNear > tFar) {
        var tmp = tNear;
        tNear = tFar;
        tFar = tmp;
      }
      tNearMax = Math.max(tNearMax, tNear);
      tFarMin = Math.min(tFarMin, tFar);
      intersect = (tNearMax <= tFarMin);
    }

    if (intersect) {
      div = 1 / p2[2];
      tNear = (cornerBounds[0][2] - p1[2]) * div;
      tFar = (cornerBounds[1][2] - p1[2]) * div;
      if (tNear > tFar) {
        var tmp = tNear;
        tNear = tFar;
        tFar = tmp;
      }
      tNearMax = Math.max(tNearMax, tNear);
      tFarMin = Math.min(tFarMin, tFar);
      intersect = (tNearMax <= tFarMin);
    }
  }
  return intersect;
};

module.exports = Entity;
