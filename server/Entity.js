/**
 * Wrapper class for all entities on the server. This class operates on the
 * assumption that all entities have hitboxes that are axis-aligned bounding
 * boxes.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var add = require('vectors/add')(3);

var Util = require('../shared/Util');

/**
 * All entities will inherit from this class. All internal values are
 * 3-tuples which contain an x, y, and z component. Size is a half
 * measurement that determines half the size of the entity in that dimension.
 * The actual rendered size is [size[0] * 2, size[1] * 2, size[2] * 2].
 * @constructor
 * @param {[number, number, number]} position
 * @param {[number, number, number]} velocity
 * @param {[number, number, number]} acceleration
 * @param {[number, number, number]} size
 */
function Entity(position, velocity, acceleration, size) {
  this.position = position || [0, 0, 0];
  this.velocity = velocity || [0, 0, 0];
  this.acceleration = acceleration || [0, 0, 0];
  this.size = size || [0, 0, 0];

  this.lastUpdateTime = 0;
  this.updateTimeDifference = 0;
}

/**
 * Returns an array containing two opposite points on this entity's
 * bounding box.
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
 * Returns true if the given point is contained within this entity.
 * @param {[number, number, number]}
 */
Entity.prototype.containsPoint = function(point) {
  var cornerBounds = this.getCornerBounds();
  return Util.inBound(point[0], cornerBounds[0][0], cornerBounds[1][0]) &&
      Util.inBound(point[1], cornerBounds[0][1], cornerBounds[1][1]) &&
      Util.inBound(point[2], cornerBounds[0][2], cornerBounds[1][1]);
};

/**
 * This method operates under the assumption that all entities have
 * axis-aligned bounding boxes. Returns true if the given entity is touching
 * or intersecting with this entity.
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

  // If either the start or end point is contained with this entity, then we
  // can stop because it obviously intersects the entity.
  var intersects = this.containsPoint(p1) || this.containsPoint(p2);
  if (!intersects) {
    // This is a magic algorithm called the standard slab test based on a
    // paper by Jeffrey Mahovsky and Brian Wyvill on collision algorithm
    // efficiency comparison. However, this does not use their scheme of
    // Plucker coordinates.
    // A slab is the space between two parallel planes. We look at the
    // intersection of each pair of planes with the line and find the near and
    // far intersection for each pair. If the overall largest tNear value
    // (intersection with the near slab) is greater than the smallest tFar
    // value (intersection with the far slab) then the line misses, otherwise
    // we know that it hits the given axis-aligned bounding box.
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
    intersects = (tNearMax <= tFarMin);

    // If an intersection was detected, do the same calculation for y
    // and z to verify that the line actually intersects.
    if (intersects) {
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
      intersects = (tNearMax <= tFarMin);
    }

    if (intersects) {
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
      intersects = (tNearMax <= tFarMin);
    }
  }
  return intersects;
};

/**
 * Updates what's known to the Entity, namely the position, velocity, and
 * acceleration based on the time that has passed between the current and last
 * update call.
 */
Entity.prototype.update = function() {
  // Based on the amount of time that passed between the current update call
  // and the last update call, the entity will move a certain amount.
  var currentTime = (new Date()).getTime();
  if (this.lastUpdateTime == 0) {
    this.updateTimeDifference = 0;
  } else {
    this.updateTimeDifference = currentTime - this.lastUpdateTime;
  }

  for (var i = 0; i < this.position.length; ++i) {
    this.position[i] += this.velocity[i] * this.updateTimeDifference;
    this.velocity[i] += this.acceleration[i] * this.updateTimeDifference;
  }
  this.lastUpdateTime = currentTime;
};

module.exports = Entity;
