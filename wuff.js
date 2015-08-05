function Pt(x_cord, y_cord) {
	this.x = x_cord;
	this.y = y_cord;
}

var center = new Pt(256, 256);
var radius_primitive = 250;

function cart2svg(cart_cords) {
	return (new Pt(
		center.x + cart_cords.x,
		center.y - cart_cords.y
	));
}

function torad(degrees) {
	return degrees * Math.PI / 180;
}

function todeg(radians) {
	return radians * 180 / Math.PI;
}

function Wtp2cart(plunge, trend) {
	return (new Pt(
		radius_primitive * Math.tan(Math.PI / 4 - 0.5 * plunge) * Math.sin(trend),
		radius_primitive * Math.tan(Math.PI / 4 - 0.5 * plunge) * Math.cos(trend)
	));
}

function linText(start, end) {
	return ('M' + cart2svg(start).x + ',' + cart2svg(start).y + 'L' + cart2svg(end).x + ',' + cart2svg(end).y);
}

function pathtext(point) {
	return ("M" + point.x + "," + point.y);
}

function arcText(start_angle, radius, end_angle, ccw) {
	var x1 = center.x + radius_primitive * Math.sin(torad(start_angle)),
		y1 = center.y - radius_primitive * Math.cos(torad(start_angle)),

		x2 = center.x + radius_primitive * Math.sin(torad(end_angle)),
		y2 = center.y - radius_primitive * Math.cos(torad(end_angle));

	return ('M' + x1 + ',' + y1 + 'A' + radius + ',' + radius + ' 0 0,' + ccw + ' ' + x2 + ',' + y2);
}

function Path_obj(d, stroke, stroke_wth, fill, deg, id) {
	this.id = id;
	this.newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
	this.newpath.setAttributeNS(null, "d", d);
	this.newpath.setAttributeNS(null, "stroke", stroke);
	this.newpath.setAttributeNS(null, "stroke-width", stroke_wth);
	this.newpath.setAttributeNS(null, "fill", fill);
	this.newpath.setAttributeNS(null, "id", this.id);
	if (deg !== 0) {
		this.newpath.setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
	document.getElementById("fig").appendChild(this.newpath);
}

function Circ_obj(cen, radius, stroke, stroke_wth, fill, deg, id) {
	this.id = id;
	this.newpath = document.createElementNS('http://www.w3.org/2000/svg', "circle");
	this.newpath.setAttributeNS(null, "cx", cart2svg(cen).x);
	this.newpath.setAttributeNS(null, "cy", cart2svg(cen).y);
	this.newpath.setAttributeNS(null, "r", radius);
	this.newpath.setAttributeNS(null, "stroke", stroke);
	this.newpath.setAttributeNS(null, "stroke-width", stroke_wth);
	this.newpath.setAttributeNS(null, "fill", fill);
	this.newpath.setAttributeNS(null, "id", this.id);
	if (deg !== 0) {
		this.newpath.setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
	document.getElementById("fig").appendChild(this.newpath);
}

function Plane(strike, dip, clr, lwidth, id) {
	this.strike = strike;
	this.dip = dip;

	this.draw = function () {
		if (this.dip !== 90) {
			this.plot = new Path_obj(
				arcText(
					this.strike, radius_primitive / Math.cos(torad(this.dip)), 180 + this.strike, 1),
				clr, lwidth, "none", 0, id);
		} else {
			this.plot = new Path_obj(
				linText(
					new Pt(radius_primitive * Math.sin(torad(this.strike)), radius_primitive * Math.cos(torad(this.strike))),
					new Pt(radius_primitive * Math.sin(torad(this.strike + 180)), radius_primitive * Math.cos(torad(this.strike + 180)))
				), clr, lwidth, "none", 0, id);
		}
	}
	if (clr != undefined)
		this.draw();

	this.modify = function () {
		this.plot.newpath.parentNode.removeChild(this.plot.newpath);
		this.draw();
	}
}

function Line(trend, plunge, clr, id) {
	this.trend = trend;
	this.plunge = plunge;
	if (clr !== undefined) {
		this.plot = new Circ_obj(new Wtp2cart(torad(plunge), torad(trend)), 2, clr, 3, "none", 0, id);
	}
	this.modify = function () {
		this.plot.newpath.parentNode.removeChild(this.plot.newpath);
		this.plot = new Circ_obj(new Wtp2cart(torad(plunge), torad(trend)), 2, clr, 3, "none", 0, id);

	};
}

function LineonPlane(onPlane, pitch, op_flag, clr, id) {
	if ((op_flag === 1) && pitch != 90) {
		onPlane.strike += 180;
		pitch = 180 - pitch;
	}
	this.plunge = Math.asin(Math.sin(torad(onPlane.dip)) * Math.sin(torad(pitch)));
	this.trend = torad(onPlane.strike) + Math.atan(Math.cos(torad(onPlane.dip)) * Math.tan(torad(pitch)));
	if (clr !== undefined) {
		this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, clr, 0, clr, 0, id);
	}
}

function PoletoPlane(ofPlane, clr, id) {
	this.plunge = 90 - ofPlane.dip;
	this.trend = ofPlane.strike + 270;
	if (clr !== undefined) {
		this.plot = new Circ_obj(new Wtp2cart(torad(this.plunge), torad(this.trend)), 2, clr, 0, clr, 0, id);
	}
}


function WuffNet() {
	var k = 0;
	for (k = 0; k < 45; k++) {
		var sw = 0.5;
		if (k % 5) {
			sw = 0.1;
		}
		Plane(0, k * 2, "black", sw, "gc" + k);
		Plane(180, k * 2, "black", sw, "gc" + 90 + k);
		Path_obj(arcText(k * 2, radius_primitive * Math.tan(torad(k * 2)), 360 - k * 2, 1), "black", sw, "none", 0, "sc" + k * 2);
		Path_obj(arcText(180 + k * 2, radius_primitive * Math.tan(torad(k * 2)), 180 - k * 2, 1), "black", sw, "none", 0, "sc" + 180 + k * 2);

	}
	Plane(0, 90, "black", 0.5, "plane0by90");
	Plane(90, 90, "black", 0.5, "plane90by90");
	this.cls = function () {
		document.getElementById("fig").innerHTML = "";
	};

}
