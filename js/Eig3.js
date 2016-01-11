var N = 3;

function cdivA(ar, ai, br, bi, A, in1, in2, in3) {
	var s, ars, ais, brs, bis;
	s = Math.abs(br) + Math.abs(bi);
	ars = ar / s;
	ais = ai / s;
	brs = br / s;
	bis = bi / s;
	s = brs * brs + bis * bis;
	A[in1][in2] = (ars * brs + ais * bis) / s;
	A[in1][in3] = (-(ars * bis) + ais * brs) / s;
	return;
}

function hqr2(A, B, low, igh, wi, wr, ierr) {
	var norm = 0.0,
		p, q, ra, s, sa, t = 0.0,
		tst1, tst2, vi, vr, w, x, y, zz;
	var k = 0,
		l, m, mp2, en = igh,
		incrFlag = 1,
		its, itn = 30 * N,
		enm2, na, notlas;
	for (var i = 0; i < N; i++) {
		for (var j = k; j < N; j++) norm += Math.abs(A[i][j]);
		k = i;
		if ((i < low) || (i > igh)) {
			wi[i] = 0.0;
			wr[i] = A[i][i];
		}
	}
	while (en >= low) {
		if (incrFlag) {
			its = 0;
			na = en - 1;
			enm2 = na - 1;
		} else
			incrFlag = 1;
		for (var i = low; i <= en; i++) {
			l = en + low - i;
			if (l == low) break;
			s = Math.abs(A[l - 1][l - 1]) + Math.abs(A[l][l]);
			if (s == 0.0) s = norm;
			tst1 = s;
			tst2 = tst1 + Math.abs(A[l][l - 1]);
			if (tst2 == tst1) break;
		}
		x = A[en][en];
		if (l == en) {
			wr[en] = A[en][en] = x + t;
			wi[en] = 0.0;
			en--;
			continue;
		}
		y = A[na][na];
		w = A[en][na] * A[na][en];
		if (l == na) {
			p = (-x + y) / 2;
			q = p * p + w;
			zz = Math.sqrt(Math.abs(q));
			x = A[en][en] = x + t;
			A[na][na] = y + t;
			if (q >= 0.0) {
				zz = ((p < 0.0) ? (-zz + p) : (p + zz));
				wr[en] = wr[na] = x + zz;
				if (zz != 0.0) wr[en] = -(w / zz) + x;
				wi[en] = wi[na] = 0.0;
				x = A[en][na];
				s = Math.abs(x) + Math.abs(zz);
				p = x / s;
				q = zz / s;
				r = Math.sqrt(p * p + q * q);
				p /= r;
				q /= r;
				for (var j = na; j < N; j++) {
					zz = A[na][j];
					A[na][j] = q * zz + p * A[en][j];
					A[en][j] = -(p * zz) + q * A[en][j];
				}
				for (var j = 0; j <= en; j++) {
					zz = A[j][na];
					A[j][na] = q * zz + p * A[j][en];
					A[j][en] = -(p * zz) + q * A[j][en];
				}
				for (var j = low; j <= igh; j++) {
					zz = B[j][na];
					B[j][na] = q * zz + p * B[j][en];
					B[j][en] = -(p * zz) + q * B[j][en];
				}
			} else {
				wr[en] = wr[na] = x + p;
				wi[na] = zz;
				wi[en] = -zz;
			}
			en--;
			en--;
			continue;
		}
		if (itn == 0) {
			ierr = en + 1;
			return;
		}
		if ((its == 10) || (its == 20)) {
			t += x;
			for (var i = low; i <= en; i++) A[i][i] += -x;
			s = Math.abs(A[en][na]) + Math.abs(A[na][enm2]);
			y = x = 0.75 * s;
			w = -(0.4375 * s * s);
		}
		its++;
		itn--;
		for (m = enm2; m >= l; m--) {
			zz = A[m][m];
			r = -zz + x;
			s = -zz + y;
			p = (-w + r * s) / A[m + 1][m] + A[m][m + 1];
			q = -(zz + r + s) + A[m + 1][m + 1];
			r = A[m + 2][m + 1];
			s = Math.abs(p) + Math.abs(q) + Math.abs(r);
			p /= s;
			q /= s;
			r /= s;
			if (m == l) break;
			tst1 = Math.abs(p) * (Math.abs(A[m - 1][m - 1]) + Math.abs(zz) + Math.abs(A[m + 1][m + 1]));
			tst2 = tst1 + Math.abs(A[m][m - 1]) * (Math.abs(q) + Math.abs(r));
			if (tst1 == tst2) break;
		}
		mp2 = m + 2;
		for (var i = mp2; i <= en; i++) {
			A[i][i - 2] = 0.0;
			if (i == mp2) continue;
			A[i][i - 3] = 0.0;
		}
		for (var i = m; i <= na; i++) {
			notlas = ((i != na) ? 1 : 0);
			if (i != m) {
				p = A[i][i - 1];
				q = A[i + 1][i - 1];
				r = ((notlas) ? A[i + 2][i - 1] : 0.0);
				x = Math.abs(p) + Math.abs(q) + Math.abs(r);
				if (x == 0.0) continue;
				p /= x;
				q /= x;
				r /= x;
			}
			s = Math.sqrt(p * p + q * q + r * r);
			if (p < 0.0) s = -s;
			if (i != m) A[i][i - 1] = -(s * x);
			else {
				if (l != m) A[i][i - 1] = -A[i][i - 1];
			}
			p += s;
			x = p / s;
			y = q / s;
			zz = r / s;
			q /= p;
			r /= p;
			k = ((i + 3 < en) ? i + 3 : en);
			if (notlas) {
				for (var j = i; j < N; j++) {
					p = A[i][j] + q * A[i + 1][j] + r * A[i + 2][j];
					A[i][j] += -(p * x);
					A[i + 1][j] += -(p * y);
					A[i + 2][j] += -(p * zz);
				}
				for (var j = 0; j <= k; j++) {
					p = x * A[j][i] + y * A[j][i + 1] + zz * A[j][i + 2];
					A[j][i] += -p;
					A[j][i + 1] += -(p * q);
					A[j][i + 2] += -(p * r);
				}
				for (var j = low; j <= igh; j++) {
					p = x * B[j][i] + y * B[j][i + 1] + zz * B[j][i + 2];
					B[j][i] += -p;
					B[j][i + 1] += -(p * q);
					B[j][i + 2] += -(p * r);
				}
			} else {
				for (var j = i; j < N; j++) {
					p = A[i][j] + q * A[i + 1][j];
					A[i][j] += -(p * x);
					A[i + 1][j] += -(p * y);
				}
				for (var j = 0; j <= k; j++) {
					p = x * A[j][i] + y * A[j][i + 1];
					A[j][i] += -p;
					A[j][i + 1] += -(p * q);
				}
				for (var j = low; j <= igh; j++) {
					p = x * B[j][i] + y * B[j][i + 1];
					B[j][i] += -p;
					B[j][i + 1] += -(p * q);
				}
			}
		}
		incrFlag = 0;
	}
	if (norm == 0.0) return;
	for (en = (N - 1); en >= 0; en--) {
		p = wr[en];
		q = wi[en];
		na = en - 1;
		if (q > 0.0) continue;
		if (q == 0.0) {
			m = en;
			A[en][en] = 1.0;
			for (var j = na; j >= 0; j--) {
				w = -p + A[j][j];
				r = 0.0;
				for (var ii = m; ii <= en; ii++) r += A[j][ii] * A[ii][en];
				if (wi[j] < 0.0) {
					zz = w;
					s = r;
				} else {
					m = j;
					if (wi[j] == 0.0) {
						t = w;
						if (t == 0.0) {
							t = tst1 = norm;
							do {
								t *= 0.01;
								tst2 = norm + t;
							} while (tst2 > tst1);
						}
						A[j][en] = -(r / t);
					} else {
						x = A[j][j + 1];
						y = A[j + 1][j];
						q = (-p + wr[j]) * (-p + wr[j]) + wi[j] * wi[j];
						A[j][en] = t = (-(zz * r) + x * s) / q;
						A[j + 1][en] = ((Math.abs(x) > Math.abs(zz)) ? -(r + w * t) / x : -(s + y * t) / zz);
					}
					t = Math.abs(A[j][en]);
					if (t == 0.0) continue;
					tst1 = t;
					tst2 = tst1 + 1.0 / tst1;
					if (tst2 > tst1) continue;
					for (var ii = j; ii <= en; ii++) A[ii][en] /= t;
				}
			}
		} else {
			m = na;
			if (Math.abs(A[en][na]) <= Math.abs(A[na][en])) cdivA(0.0, -A[na][en], -p + A[na][na], q, A, na, na, en);
			else {
				A[na][na] = q / A[en][na];
				A[na][en] = -(-p + A[en][en]) / A[en][na];
			}
			A[en][na] = 0.0;
			A[en][en] = 1.0;
			for (var j = (na - 1); j >= 0; j--) {
				w = -p + A[j][j];
				sa = ra = 0.0;
				for (var ii = m; ii <= en; ii++) {
					ra += A[j][ii] * A[ii][na];
					sa += A[j][ii] * A[ii][en];
				}
				if (wi[j] < 0.0) {
					zz = w;
					r = ra;
					s = sa;
					continue;
				}
				m = j;
				if (wi[j] == 0.0) cdivA(-ra, -sa, w, q, A, j, na, en);
				else {
					x = A[j][j + 1];
					y = A[j + 1][j];
					vr = -(q * q) + (-p + wr[j]) * (-p + wr[j]) + wi[j] * wi[j];
					vi = (-p + wr[j]) * 2.0 * q;
					if ((vr == 0.0) && (vi == 0.0)) {
						tst1 = norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(zz));
						vr = tst1;
						do {
							vr *= 0.01;
							tst2 = tst1 + vr;
						} while (tst2 > tst1);
					}
					cdivA(-(zz * ra) + x * r + q * sa, -(zz * sa + q * ra) + x * s, vr, vi, A, j, na, en);
					if (Math.abs(x) > (Math.abs(zz) + Math.abs(q))) {
						A[j + 1][na] = (-(ra + w * A[j][na]) + q * A[j][en]) / x;
						A[j + 1][en] = -(sa + w * A[j][en] + q * A[j][na]) / x;
					} else
						cdivA(-(r + y * A[j][na]), -(s + y * A[j][en]), zz, q, A, j + 1, na, en);
				}
				t = ((Math.abs(A[j][na]) >= Math.abs(A[j][en])) ? Math.abs(A[j][na]) : Math.abs(A[j][en]));
				if (t == 0.0) continue;
				tst1 = t;
				tst2 = tst1 + 1.0 / tst1;
				if (tst2 > tst1) continue;
				for (var ii = j; ii <= en; ii++) {
					A[ii][na] /= t;
					A[ii][en] /= t;
				}
			}
		}
	}
	for (var i = 0; i < N; i++) {
		if ((i < low) || (i > igh)) {
			for (var j = i; j < N; j++) B[i][j] = A[i][j];
		}
	}
	for (var i = (N - 1); i >= low; i--) {
		m = ((i < igh) ? i : igh);
		for (var ii = low; ii <= igh; ii++) {
			zz = 0.0;
			for (var jj = low; jj <= m; jj++) zz += B[ii][jj] * A[jj][i];
			B[ii][i] = zz;
		}
	}
	return;
}

function norVecC(Z, wi) {
	var scale, ssq, absxi, dummy, norm;
	for (var j = 0; j < N; j++) {
		scale = 0.0;
		ssq = 1.0;
		for (var i = 0; i < N; i++) {
			if (Z[i][j] != 0) {
				absxi = Math.abs(Z[i][j]);
				dummy = scale / absxi;
				if (scale < absxi) {
					ssq = 1.0 + ssq * dummy * dummy;
					scale = absxi;
				} else
					ssq += 1.0 / dummy / dummy;
			}
		}
		if (wi[j] != 0) {
			for (var i = 0; i < N; i++) {
				if (Z[i][j + 1] != 0) {
					absxi = Math.abs(Z[i][j + 1]);
					dummy = scale / absxi;
					if (scale < absxi) {
						ssq = 1.0 + ssq * dummy * dummy;
						scale = absxi;
					} else
						ssq += 1.0 / dummy / dummy;
				}
			}
		}
		norm = scale * Math.sqrt(ssq);
		for (var i = 0; i < N; i++) Z[i][j] /= norm;
		if (wi[j] != 0) {
			j++;
			for (var i = 0; i < N; i++) Z[i][j] /= norm;
		}
	}
	return;
}

function Eig3Solve(dataForm) {
	var dataFormElements = dataForm.elements;
	var A = new Array(N);
	var B = new Array(N);
	for (var i = 0; i < N; i++) {
		A[i] = new Array(N);
		B[i] = new Array(N);
	}
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			A[i][j] = parseFloat(dataFormElements[i * N + j].value);
		}
	}
	var wi = new Array(N);
	var wr = new Array(N);
	var scale = new Array(N);
	var trace = new Array(N);
	var radix = 2;
	var c, f, g, r, s, b2 = radix * radix;
	var ierr = -1,
		igh, low, k = 0,
		l = N - 1,
		noconv;
	noconv = l;
	while (noconv >= 0) {
		r = 0;
		for (var j = 0; j <= l; j++) {
			if (j == noconv) continue;
			if (A[noconv][j] != 0.0) {
				r = 1;
				break;
			}
		}
		if (r == 0) {
			scale[l] = noconv;
			if (noconv != l) {
				for (var i = 0; i <= l; i++) {
					f = A[i][noconv];
					A[i][noconv] = A[i][l];
					A[i][l] = f;
				}
				for (var i = 0; i < N; i++) {
					f = A[noconv][i];
					A[noconv][i] = A[l][i];
					A[l][i] = f;
				}
			}
			if (l == 0) break;
			noconv = --l;
		} else
			noconv--;
	}
	if (l > 0) {
		noconv = 0;
		while (noconv <= l) {
			c = 0;
			for (var i = k; i <= l; i++) {
				if (i == noconv) continue;
				if (A[i][noconv] != 0.0) {
					c = 1;
					break;
				}
			}
			if (c == 0) {
				scale[k] = noconv;
				if (noconv != k) {
					for (var i = 0; i <= l; i++) {
						f = A[i][noconv];
						A[i][noconv] = A[i][k];
						A[i][k] = f;
					}
					for (var i = k; i < N; i++) {
						f = A[noconv][i];
						A[noconv][i] = A[k][i];
						A[k][i] = f;
					}
				}
				noconv = ++k;
			} else
				noconv++;
		}
		for (var i = k; i <= l; i++) scale[i] = 1.0;
		do {
			noconv = 0;
			for (var i = k; i <= l; i++) {
				c = r = 0.0;
				for (var j = k; j <= l; j++) {
					if (j == i) continue;
					c += Math.abs(A[j][i]);
					r += Math.abs(A[i][j]);
				}
				if ((c == 0.0) || (r == 0.0)) continue;
				g = r / radix;
				f = 1.0;
				s = c + r;
				while (c < g) {
					f *= radix;
					c *= b2;
				}
				g = r * radix;
				while (c >= g) {
					f /= radix;
					c /= b2;
				}
				if ((c + r) / f < 0.95 * s) {
					g = 1.0 / f;
					scale[i] *= f;
					noconv = 1;
					for (var j = k; j < N; j++) A[i][j] *= g;
					for (var j = 0; j <= l; j++) A[j][i] *= f;
				}
			}
		} while (noconv);
	}
	low = k;
	igh = l;
	for (var i = (low + 1); i < igh; i++) {
		k = i;
		c = 0.0;
		for (var j = i; j <= igh; j++) {
			if (Math.abs(A[j][i - 1]) > Math.abs(c)) {
				c = A[j][i - 1];
				k = j;
			}
		}
		trace[i] = k;
		if (k != i) {
			for (var j = (i - 1); j < N; j++) {
				r = A[k][j];
				A[k][j] = A[i][j];
				A[i][j] = r;
			}
			for (var j = 0; j <= igh; j++) {
				r = A[j][k];
				A[j][k] = A[j][i];
				A[j][i] = r;
			}
		}
		if (c != 0.0) {
			for (var m = (i + 1); m <= igh; m++) {
				r = A[m][i - 1];
				if (r != 0.0) {
					r = A[m][i - 1] = r / c;
					for (var j = i; j < N; j++) A[m][j] += -(r * A[i][j]);
					for (var j = 0; j <= igh; j++) A[j][i] += r * A[j][m];
				}
			}
		}
	}
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) B[i][j] = 0.0;
		B[i][i] = 1.0;
	}
	for (var i = (igh - 1); i >= (low + 1); i--) {
		k = trace[i];
		for (var j = (i + 1); j <= igh; j++) B[j][i] = A[j][i - 1];
		if (i == k) continue;
		for (var j = i; j <= igh; j++) {
			B[i][j] = B[k][j];
			B[k][j] = 0.0;
		}
		B[k][i] = 1.0;
	}
	hqr2(A, B, low, igh, wi, wr, ierr);
	dataForm.lam1Re.value = wr[0];
	dataForm.lam1Im.value = wi[0];
	dataForm.lam2Re.value = wr[1];
	dataForm.lam2Im.value = wi[1];
	dataForm.lam3Re.value = wr[2];
	dataForm.lam3Im.value = wi[2];
	dataForm.erCode.value = ierr;
	if (ierr == -1) {
		if (low != igh) {
			for (var i = low; i <= igh; i++) {
				s = scale[i];
				for (var j = 0; j < N; j++) B[i][j] *= s;
			}
		}
		for (var i = (low - 1); i >= 0; i--) {
			k = scale[i];
			if (k != i) {
				for (var j = 0; j < N; j++) {
					s = B[i][j];
					B[i][j] = B[k][j];
					B[k][j] = s;
				}
			}
		}
		for (var i = (igh + 1); i < N; i++) {
			k = scale[i];
			if (k != i) {
				for (var j = 0; j < N; j++) {
					s = B[i][j];
					B[i][j] = B[k][j];
					B[k][j] = s;
				}
			}
		}
		norVecC(B, wi);
		k = 16;
		for (var i = 0; i < N; i++) {
			for (var j = 0; j < N; j++) {
				dataFormElements[k + i * N + j].value = B[i][j];
			}
		}
	}
	return;
}
