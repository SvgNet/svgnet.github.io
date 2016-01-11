science.hypot = function(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  var max,
      min;
  if (x > y) { max = x; min = y; }
  else       { max = y; min = x; }
  var r = min / max;
  return max * Math.sqrt(1 + r * r);
};


// Symmetric Householder reduction to tridiagonal form.
function science_lin_decomposeTred2(d, e, V) {
  // This is derived from the Algol procedures tred2 by
  // Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
  // Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
  // Fortran subroutine in EISPACK.

  var n = V.length;

  for (var j = 0; j < n; j++) d[j] = V[n - 1][j];

  // Householder reduction to tridiagonal form.
  for (var i = n - 1; i > 0; i--) {
    // Scale to avoid under/overflow.

    var scale = 0,
        h = 0;
    for (var k = 0; k < i; k++) scale += Math.abs(d[k]);
    if (scale === 0) {
      e[i] = d[i - 1];
      for (var j = 0; j < i; j++) {
        d[j] = V[i - 1][j];
        V[i][j] = 0;
        V[j][i] = 0;
      }
    } else {
      // Generate Householder vector.
      for (var k = 0; k < i; k++) {
        d[k] /= scale;
        h += d[k] * d[k];
      }
      var f = d[i - 1];
      var g = Math.sqrt(h);
      if (f > 0) g = -g;
      e[i] = scale * g;
      h = h - f * g;
      d[i - 1] = f - g;
      for (var j = 0; j < i; j++) e[j] = 0;

      // Apply similarity transformation to remaining columns.

      for (var j = 0; j < i; j++) {
        f = d[j];
        V[j][i] = f;
        g = e[j] + V[j][j] * f;
        for (var k = j+1; k <= i - 1; k++) {
          g += V[k][j] * d[k];
          e[k] += V[k][j] * f;
        }
        e[j] = g;
      }
      f = 0;
      for (var j = 0; j < i; j++) {
        e[j] /= h;
        f += e[j] * d[j];
      }
      var hh = f / (h + h);
      for (var j = 0; j < i; j++) e[j] -= hh * d[j];
      for (var j = 0; j < i; j++) {
        f = d[j];
        g = e[j];
        for (var k = j; k <= i - 1; k++) V[k][j] -= (f * e[k] + g * d[k]);
        d[j] = V[i - 1][j];
        V[i][j] = 0;
      }
    }
    d[i] = h;
  }

  // Accumulate transformations.
  for (var i = 0; i < n - 1; i++) {
    V[n - 1][i] = V[i][i];
    V[i][i] = 1.0;
    var h = d[i + 1];
    if (h != 0) {
      for (var k = 0; k <= i; k++) d[k] = V[k][i + 1] / h;
      for (var j = 0; j <= i; j++) {
        var g = 0;
        for (var k = 0; k <= i; k++) g += V[k][i + 1] * V[k][j];
        for (var k = 0; k <= i; k++) V[k][j] -= g * d[k];
      }
    }
    for (var k = 0; k <= i; k++) V[k][i + 1] = 0;
  }
  for (var j = 0; j < n; j++) {
    d[j] = V[n - 1][j];
    V[n - 1][j] = 0;
  }
  V[n - 1][n - 1] = 1;
  e[0] = 0;
}

// Symmetric tridiagonal QL algorithm.
function science_lin_decomposeTql2(d, e, V) {
  // This is derived from the Algol procedures tql2, by
  // Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
  // Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
  // Fortran subroutine in EISPACK.

  var n = V.length;

  for (var i = 1; i < n; i++) e[i - 1] = e[i];
  e[n - 1] = 0;

  var f = 0;
  var tst1 = 0;
  var eps = 1e-12;
  for (var l = 0; l < n; l++) {
    // Find small subdiagonal element
    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
    var m = l;
    while (m < n) {
      if (Math.abs(e[m]) <= eps*tst1) { break; }
      m++;
    }

    // If m == l, d[l] is an eigenvalue,
    // otherwise, iterate.
    if (m > l) {
      var iter = 0;
      do {
        iter++;  // (Could check iteration count here.)

        // Compute implicit shift
        var g = d[l];
        var p = (d[l + 1] - g) / (2 * e[l]);
        var r = science.hypot(p, 1);
        if (p < 0) r = -r;
        d[l] = e[l] / (p + r);
        d[l + 1] = e[l] * (p + r);
        var dl1 = d[l + 1];
        var h = g - d[l];
        for (var i = l+2; i < n; i++) d[i] -= h;
        f += h;

        // Implicit QL transformation.
        p = d[m];
        var c = 1;
        var c2 = c;
        var c3 = c;
        var el1 = e[l + 1];
        var s = 0;
        var s2 = 0;
        for (var i = m - 1; i >= l; i--) {
          c3 = c2;
          c2 = c;
          s2 = s;
          g = c * e[i];
          h = c * p;
          r = science.hypot(p,e[i]);
          e[i + 1] = s * r;
          s = e[i] / r;
          c = p / r;
          p = c * d[i] - s * g;
          d[i + 1] = h + s * (c * g + s * d[i]);

          // Accumulate transformation.
          for (var k = 0; k < n; k++) {
            h = V[k][i + 1];
            V[k][i + 1] = s * V[k][i] + c * h;
            V[k][i] = c * V[k][i] - s * h;
          }
        }
        p = -s * s2 * c3 * el1 * e[l] / dl1;
        e[l] = s * p;
        d[l] = c * p;

        // Check for convergence.
      } while (Math.abs(e[l]) > eps*tst1);
    }
    d[l] = d[l] + f;
    e[l] = 0;
  }

  // Sort eigenvalues and corresponding vectors.
  for (var i = 0; i < n - 1; i++) {
    var k = i;
    var p = d[i];
    for (var j = i + 1; j < n; j++) {
      if (d[j] < p) {
        k = j;
        p = d[j];
      }
    }
    if (k != i) {
      d[k] = d[i];
      d[i] = p;
      for (var j = 0; j < n; j++) {
        p = V[j][i];
        V[j][i] = V[j][k];
        V[j][k] = p;
      }
    }
  }
}
var N = 3; //Global variable, dimension of matrix.

function pythag(a, b)
{ // Returns the square root of (a*a + b*b) without overflow or destructive underflow

 var p, r, s, t, u;

 t = Math.abs(a);
 u = Math.abs(b);

 p = ((t >= u) ? t : u);
 if (p > 0){
  r = ((t <= u) ? t : u);
  r /= p;
  r *= r;
  t = 4.0 + r;

  while (t > 4.0){
   s = r/t;
   u = 1.0 + 2.0*s;
   p = u*p;
   t = s/u;
   r *= t*t;
   t = 4.0 + r;
  } // while (t > 4.0)
 } // End if (p > 0)

 return p;
} // End pythag

function Eig3RSSolve(dataForm){

var dataFormElements = dataForm.elements; // Reference to the form elements array.

var A = new Array(N);
var fv1 = new Array(N);
wr = new Array(N);

var ii, ierr = -1, j, k, l, l1, l2;
var c, c2, c3, dl1, el1, f, g, h, p, r, s, s2, scale, tst1, tst2;

for (var i = 0; i < N; i++)
 A[i] = new Array(N);

//Input data from the 6 data fields, then reflect them across the diagonal

A[0][0] = parseFloat(dataForm.a11.value);

A[1][0] = parseFloat(dataForm.a21.value);
A[1][1] = parseFloat(dataForm.a22.value);

A[2][0] = parseFloat(dataForm.a31.value);
A[2][1] = parseFloat(dataForm.a32.value);
A[2][2] = parseFloat(dataForm.a33.value);

// Reflect the appropriate entries across the diagonal

A[0][1] = A[1][0];
A[0][2] = A[2][0];
A[1][2] = A[2][1];

// ======BEGINNING OF TRED1 ===================================

ii = N - 1;
  for (var i = 0; i < ii; i++){
    wr[i] = A[ii][i];
	A[ii][i] = A[i][i];
  }//End for i
  wr[ii] = A[ii][ii];					// Take last assignment out of loop

  for (var i = (N - 1); i >= 0; i--){

	l = i - 1;
	scale = h = 0.0;

	if (l < 0){
      fv1[i] = 0.0;
      continue;
	} // End if (l < 0)

	for (j = 0; j <= l; j++)
      scale += Math.abs(wr[j]);

	if (scale == 0.0){
      for (j = 0; j <= l; j++){
        wr[j] = A[l][j];
		A[l][j] = A[i][j];
		A[i][j] = 0.0;
	  }//End for j

      fv1[i] = 0.0;
      continue;
    } // End if (scale == 0.0)

    for (j = 0; j <= l; j++){
      wr[j] /= scale;
	  h += wr[j]*wr[j];
	}//End for j

    f = wr[l];
	g = ((f >= 0) ? -Math.sqrt(h) : Math.sqrt(h));
	fv1[i] = g*scale;
	h -= f*g;
	wr[l] = f - g;

	if (l != 0){

      for (j = 0; j <= l; j++)
        fv1[j] = 0.0;

      for (j = 0; j <= l; j++){
        f = wr[j];
	    g = fv1[j] + f*A[j][j];
		for (ii = (j + 1); ii <= l; ii++){
          g += wr[ii]*A[ii][j];
		  fv1[ii] += f*A[ii][j];
        } // End for ii
		fv1[j] = g;
	  }//End for j

	  // Form p

	  f = 0.0;
	  for (j = 0; j <= l; j++){
        fv1[j] /= h;
	    f += fv1[j]*wr[j];
      }//End for j

	  h = f/(h*2);

	  // Form q

      for (j = 0; j <= l; j++)
        fv1[j] -= h*wr[j];

      // Form reduced A

	  for (j = 0; j <= l; j++){
        f = wr[j];
		g = fv1[j];

		for (ii = j; ii <= l; ii++)
          A[ii][j] -= f*fv1[ii] + g*wr[ii];

      }//End for j

	} // End if (l != 0)

    for (j = 0; j <= l; j++){
      f = wr[j];
	  wr[j] = A[l][j];
      A[l][j] = A[i][j];
	  A[i][j] = f*scale;
	}//End for j

  }//End for i

  // ======END OF TRED1 =========================================

  // ======BEGINNING OF TQL1 ===================================

  for (var i = 1; i < N; i++)
    fv1[i - 1] = fv1[i];

  fv1[N - 1] = tst1 = f = 0.0;

  for (l = 0; l < N; l++){

    j = 0;
	h = Math.abs(wr[l]) + Math.abs(fv1[l]);

	tst1 = ((tst1 < h) ? h : tst1);

	// Look for small sub-diagonal element

	for (k = l; k < N; k++){
        tst2 = tst1 + Math.abs(fv1[k]);
		if (tst2 == tst1) break; // fv1[N-1] is always 0, so there is no exit through the bottom of the loop
    }//End for k

	if (k != l){

	  do {

      if (j == 30){
		ierr = l;
	    break;
	  } // End if (j == 30)

	  j++;

	  // Form shift

	  l1 = l + 1;
	  l2 = l1 + 1;
	  g = wr[l];
	  p = (wr[l1] - g)/(2.0*fv1[l]);
	  r = pythag(p, 1.0);
	  scale = ((p >= 0) ? r : -r);   // Use scale as a dummy variable
	  scale += p;
	  wr[l] = fv1[l]/scale;
	  dl1 = wr[l1] = fv1[l]*scale;
	  h = g - wr[l];

      for (var i = l2; i < N; i++)
        wr[i] -= h;

	  f += h;

	  // q1 transformation

	  p = wr[k];
	  c2 = c = 1.0;
	  el1 = fv1[l1];
	  s = 0.0;

	  // Look for i = k - 1 until l in steps of -1

	  for (var i = (k - 1); i >= l; i--){
          c3 = c2;
		  c2 = c;
		  s2 = s;
		  g = c*fv1[i];
		  h = c*p;
		  r = pythag(p, fv1[i]);
		  fv1[i + 1] = s*r;
		  s = fv1[i]/r;
		  c = p/r;
		  p = c*wr[i] - s*g;
		  wr[i + 1] = h + s*(c*g + s*wr[i]);
	  }//End for i

	  p = -s*s2*c3*el1*fv1[l]/dl1;
	  fv1[l] = s*p;
	  wr[l] = c*p;
	  tst2 = tst1 + Math.abs(fv1[l]);
	  } while (tst2 > tst1);  // End do-while loop

	} // End if (k != l)

	if (ierr >= 0)  //This check required to ensure we break out of for loop too, not just do-while loop
	  break;

	p = wr[l] + f;

	  // Order eigenvalues

	  // For i = l to 1, in steps of -1
      for (var i = l; i >= 1; i--){
		  if (p >= wr[i - 1])
			break;
		  wr[i] = wr[i - 1];
	  }//End for i

	  wr[i] = p;

  }//End for l

dataForm.lam1Re.value = wr[0] ;
dataForm.lam2Re.value = wr[1] ;
dataForm.lam3Re.value = wr[2] ;

dataForm.erCode.value = ierr + 1 ;

return;
}  //End of Eig3RSSolve
