# Motion in a Plane

- Class: 11 Physics
- Chapter no.: 4
- Weightage: Very high

## Vectors & Scalars

1. Scalar: magnitude only, added by ordinary algebra (mass, time, energy). Vector: magnitude + direction and obeys the triangle (parallelogram) law of addition (displacement, force, velocity).

> Current has magnitude and direction but is not a vector, because currents meeting at a junction don't add by the triangle rule. Finite rotations are not vectors either.

2. Equality: two vectors are equal if both magnitude and direction are the same. A vector can be shifted parallel to itself.
3. Addition (triangle / parallelogram law). Magnitude and direction of the resultant for angle $\theta$ between $\vec a$ and $\vec b$:

$$|\vec a+\vec b|=\sqrt{a^2+b^2+2ab\cos\theta},\qquad \tan\alpha=\frac{b\sin\theta}{a+b\cos\theta}$$

4. Addition is commutative and associative. Subtraction: $\vec a-\vec b=\vec a+(-\vec b)$.

$$|\vec a-\vec b|=\sqrt{a^2+b^2-2ab\cos\theta}$$

$\vec a-\vec b$ runs from the tip of $\vec b$ to the tip of $\vec a$.

5. Special cases of the resultant: maximum $a+b$ at $\theta=0$, minimum $|a-b|$ at $\theta=180^\circ$, $\sqrt{a^2+b^2}$ at $90^\circ$. For two equal vectors: $R=2a\cos(\theta/2)$ (so $R=a$ when $\theta=120^\circ$).
6. Multiplying a vector by a number $k$ multiplies its magnitude by $|k|$ and reverses the direction if $k<0$.

## Resolution of Vectors

7. Any vector can be written along mutually perpendicular unit vectors $\hat i,\hat j,\hat k$. The component of $\vec a$ along a direction at angle $\theta$ is $a\cos\theta$.

$$\vec a=a_x\hat i+a_y\hat j+a_z\hat k,\qquad |\vec a|=\sqrt{a_x^2+a_y^2+a_z^2}$$

$$a_x=a\cos\theta,\qquad a_y=a\sin\theta$$

8. Unit vector along $\vec a$: $\hat a=\vec a/|\vec a|$. Direction cosines: $\cos\alpha=a_x/a$, etc., with $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$.

## Dot and Cross Products

9. Scalar (dot) product: commutative and distributive. $\vec a\cdot\vec b=0$ for perpendicular vectors. Work $W=\vec F\cdot\vec s$, power $P=\vec F\cdot\vec v$.

$$\vec a\cdot\vec b=ab\cos\theta=a_xb_x+a_yb_y+a_zb_z$$

$$\cos\theta=\frac{\vec a\cdot\vec b}{ab},\qquad \text{projection of }\vec a\text{ on }\vec b=\vec a\cdot\hat b$$

$\vec a\cdot\vec b=a\times(\text{projection of }\vec b\text{ on }\vec a)$.

10. Vector (cross) product: magnitude $ab\sin\theta$, direction ⊥ to both by the right-hand screw rule. $\vec a\times\vec b=-\vec b\times\vec a$ (anticommutative). $\vec a\times\vec a=0$. $|\vec a\times\vec b|$ = area of the parallelogram.

$$\vec a\times\vec b=\begin{vmatrix}\hat i&\hat j&\hat k\\a_x&a_y&a_z\\b_x&b_y&b_z\end{vmatrix}$$

11. Cyclic unit vectors: $\hat i\times\hat j=\hat k$, $\hat j\times\hat k=\hat i$, $\hat k\times\hat i=\hat j$ (reverse order gives a minus sign).

> Cross-product determinants are used in Lorentz force $q\vec v\times\vec B$, torque $\vec r\times\vec F$, angular momentum $\vec r\times\vec p$ and EM-wave direction $\vec E\times\vec B$. Practise these: many PYQs depend on them.

*Asked: 2026 • 2 Apr • Morning (uploaded paper); 2026 • 8 Apr • Evening*

## Motion in a Plane & Projectile Motion

12. Plane motion splits into two independent 1-D motions along $x$ and $y$. With constant $\vec a$, the vector equations hold component-wise.

$$\vec v=\vec u+\vec at,\qquad \vec r=\vec ut+\tfrac12\vec at^2$$

13. Projectile thrown with speed $u$ at angle $\theta$ above the horizontal: $a_x=0$, $a_y=-g$.

$$T=\frac{2u\sin\theta}{g},\qquad H=\frac{u^2\sin^2\theta}{2g},\qquad R=\frac{u^2\sin2\theta}{g}$$

$$y=x\tan\theta-\frac{gx^2}{2u^2\cos^2\theta}\quad\text{(parabola)}$$

14. Results: $R_{max}=u^2/g$ at $45^\circ$. Angles $\theta$ and $90^\circ-\theta$ give the same range. At the highest point $v=u\cos\theta$ (horizontal) and KE $=K\cos^2\theta$.

$$R=4H\cot\theta,\qquad T_1T_2=\frac{2R}{g}\ \text{(complementary angles)}$$

15. Projected horizontally from height $h$: $t=\sqrt{2h/g}$, range $=u\sqrt{2h/g}$. On an inclined plane (angle $\alpha$), resolve $g$ along and perpendicular to the incline. (Horizontal launch: $x$ uniform, $y$ free fall.)

> Most asked in this topic: range ratios for two angles, $R=nH$, flight-time product for equal ranges, angle of velocity at time $t$. Some questions measure the angle from the vertical, so read carefully.

*Asked: 2026 • 4 Apr • Morning; 2025 • 3 Apr • Evening; 2026 • 8 Apr • Evening; 2023 • 6 Apr • Morning*

## Change of Frame (Relative Motion)

16. If frame S′ moves with velocity $\vec v_{S'S}$ relative to S, then for particle P:

$$\vec v_{P,S}=\vec v_{P,S'}+\vec v_{S',S}\quad\Leftrightarrow\quad \vec v_{AB}=\vec v_A-\vec v_B$$

$\vec v_{AB}=\vec v_A-\vec v_B$ is the velocity of A as seen from B.

17. River crossing (river width $d$, river speed $u$, swimmer speed $v$ relative to water). Minimum time: swim straight across, $t=d/v$, drift $=ud/v$. Shortest path (if $v>u$): head upstream at $\sin\theta=u/v$, $t=\dfrac{d}{\sqrt{v^2-u^2}}$.
18. Differentiating again gives relative acceleration. If S′ moves with uniform velocity, $\vec a_{S'S}=0$ and the acceleration is the same in both frames.

$$\vec a_{P,S}=\vec a_{P,S'}+\vec a_{S',S}$$

Assumption: time and length mean the same in both frames. This holds only when the relative speed is much less than $c$; otherwise relativity applies.

19. Rain–man problems: the umbrella is held along $\vec v_{rain}-\vec v_{man}$. $\tan\theta=v_{man}/v_{rain}$: tilt the umbrella forward.

> Relative-velocity questions (cars overtaking, stone thrown between moving cars, river crossing) appear 1–2 times a year. Convert km/h to m/s by multiplying by 5/18.

*Asked: 2026 • 21 Jan • Evening; 2025 • 2 Apr • Morning; 2026 • 4 Apr • Evening*

## Angular Variables

20. Angular position $\theta$ (rad), angular velocity $\omega=d\theta/dt$, angular acceleration $\alpha=d\omega/dt$. Linear and angular quantities are related by:

$$s=r\theta,\qquad v=r\omega,\qquad a_t=r\alpha$$

21. For constant $\alpha$ the equations look like linear kinematics.

$$\omega=\omega_0+\alpha t,\qquad \theta=\omega_0t+\tfrac12\alpha t^2,\qquad \omega^2=\omega_0^2+2\alpha\theta$$

22. Uniform circular motion: $T=2\pi/\omega$, frequency $\nu=1/T$, $\omega=2\pi\nu$.

## Unit Vectors & Acceleration in Circular Motion

23. Use the radial unit vector $\hat e_r$ (outward) and the tangential unit vector $\hat e_t$ (direction of motion). Differentiating $\vec v=v\hat e_t$ gives two components:

$$\vec a=-\frac{v^2}{r}\hat e_r+\frac{dv}{dt}\hat e_t$$

$$a_c=\frac{v^2}{r}=\omega^2r,\qquad a_t=\frac{dv}{dt},\qquad a=\sqrt{a_c^2+a_t^2}$$

24. In uniform circular motion $a_t=0$, the speed is constant, and the acceleration $v^2/r$ always points to the centre (its direction keeps changing).

> Uniform circular motion is accelerated motion. The velocity changes in direction even though the speed is constant. The magnitude of the average acceleration over half a circle is $2v^2/(\pi r)$, not $v^2/r$.
