torad = function (degrees) {
	return degrees * Math.PI / 180;
};

todeg = function (radians) {
	return radians * 180 / Math.PI;
};

create_path = function (path_str, stroke_clr, stroke_wth, fill_clr, id_name) {
	newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
	newpath.setAttributeNS(null, "d", path_str);
	newpath.setAttributeNS(null, "stroke", stroke_clr);
	newpath.setAttributeNS(null, "stroke-width", stroke_wth);
	newpath.setAttributeNS(null, "fill", fill_clr);
	newpath.setAttribute("id", id_name);
	document.getElementById("fig").appendChild(newpath);
};



crcText = function (x1, y1, rad, x2, y2, ccw) {
	return ('M' + x1 + ',' + y1 + 'A' + rad + ',' + rad + ' 0 0,' + ccw + ' ' + x2 + ',' + y2)
};

function pt(x_cord, y_cord) {
	this.x = x_cord;
	this.y = y_cord;
}

function st_plane(strike, dip) {
	this.strike = strike;
	this.dip = dip;
}

function path_obj(d, stroke, line_wth, fill, id) {
	this.d = d;
	this.stroke = stroke;
	this.stroke_wth = line_wth;
	this.fill = fill
	this.id = id;
	this.plotin = function (fig) {
		newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
		newpath.setAttributeNS(null, "d", this.d)
		newpath.setAttributeNS(null, "stroke", this.stroke)
		newpath.setAttributeNS(null, "stroke-width", this.stroke_wth)
		newpath.setAttributeNS(null, "fill", this.fill)
		newpath.setAttribute("id", this.id);
		document.getElementById(fig).appendChild(newpath);
	}
	this.rotate = function (deg, cen) {
		document.getElementById(this.id).setAttribute("transform", "rotate(" + deg + " " + cen.x + " " + cen.y + ")");
	}
}
