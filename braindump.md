Ugh, so we're using a posteriori collision detection, where the internal game
state is updated in discrete steps every time the game loop updates. Every
tick, the positions of the objects are updated by their velocities, etc.
We use the AABB method to detect when the objects have collided during each
update step, which works well for detecting IF the objects have collided.

To know which face has collided, we check if the difference between two
objects' x-coordinates is ALMOST equal to the sum of their widths (x-length)
within some threshold epsilon. This ensures that those two sides are actually
the sides that are touching. The same process is used for the z-axis. This
is problematic for corner-to-corner contact. Also this cannot be used for
resting contact in the case where one object is on top of the other. In the
case of the player being on top of a box, the player can occasionally fall
through the box if their downward velocity is too high and they jump through
the epsilon threshold. If we increase the epsilon threshold, then collision
becomes very weird.
