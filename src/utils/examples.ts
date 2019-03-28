
export const validValue = `Start
1 : circle, 45.2, green
6 : rectangle, 32.1, 35.1, blue
2 : triangle, 3.1, 5.0, 35.1, blue
3 : paral, 3.3, 5.6, 4.2, 42.2, red
1 ; circle : s = 3.14 * 3 ^2  ,
2 ; triangle : p = 3.3 + 4.2 + 5.1,
3 ; paral : s = 3.3 *4.2 /2 + 5.6 *4.2 /2
Stop`;

const pt1 = `                       Begin
  Real A215 B3Z5
  Integer 5 8 3 1
  2:A215=(2+3)*2^2
  B3Z5=-7+4-(2+3)*3
End                       `;

const pt2 = `Begin
  Real Z333
  Z333=2*0
End`;

const pt3 = `Begin
  Integer 72 5 0
  Real C250=2+3
  1: C256=3+4
End`;

const pt4 = `Begin
  Real Z555
  1:Z555=5*0
End`;

const pt5 = `Begin
  Integer 0
  1:Z555=5*0
End`;
