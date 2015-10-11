# 10/7/2015

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

# 10/9/2015

Instead of making bullets an instant shot upon click, it's better for animation
to create a Bullet class and have it update in discrete steps, but still fast
enough for it to hit almost instantly. The only problem this presents client
side is that objects are constantly being added and removed from the
THREE.Scene. To solve the problem of the bullet skipping over a player entity,
we will calculate if the line connecting its position before and after update
intersects any entity's axis-aligned bounding box.

# 10/11/2015

Upon further reflection, updating bullets in discrete steps is very
computationally expensive. However, users can easily see the bullets they fire.
After implementing muzzle flash and recoil, we should implement an a priori
system where a shot happens instantly when a player clicks. After adding the
slab test line-box intersection algorithm to the Entity class, this should be
trivial. This removes the need for a Bullet class since this computation can
happen inside the Player class. Bullet spread should be easy to implement
on top of this.
