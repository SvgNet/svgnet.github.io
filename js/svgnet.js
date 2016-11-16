function Svg_obj(in_id, id, obj_center) {
    this.id = id;
    this.svg_node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg_node.setAttributeNS(null, "width", "100%");
    this.center = this.svg_node.createSVGPoint();
    this.center.x = obj_center.x, this.center.y = obj_center.y;
    this.svg_node.setAttributeNS(null, "viewBox", "-20 -20 " + 2 * (this.center.x + 20) + " " + 2 * (this.center.y + 20));

    this.svg_node.setAttributeNS(null, "id", this.id);
    this.svg_node.setAttributeNS(null, "preserveAspectRatio", "xMinYMin meet");
    this.svg_node.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.svg_node.setAttributeNS(null, "version", "1.1");
    document.getElementById(in_id).appendChild(this.svg_node);

}

var SchmidtNet_Flag = false;

function Pt(x_cord, y_cord) {
    this.x = x_cord, this.y = y_cord;
}


function svg2cart(svg_cords) {
    return (new Pt(
        svg_cords.x - Svg_Net.gfx.x,
        Svg_Net.gfx.y - svg_cords.y
    ));
}

function cart2pol(cart_cord) {
    distance = Math.sqrt(cart_cord.x * cart_cord.x + cart_cord.y * cart_cord.y);
    radians = Math.atan2(cart_cord.y, cart_cord.x); //This takes y first
    polarCord = {
        rad: distance,
        azh: radians
    };
    return polarCord
}

function pol2tp(pol) {

    var plunge = SchmidtNet_Flag ? todeg(Math.PI / 2 - 2 * Math.asin(pol.rad / (Svg_Net.radius_primitive * Math.SQRT2))) : todeg(Math.PI / 2 - 2 * Math.atan2(pol.rad, Svg_Net.radius_primitive));
    var trend = 90.0 - todeg(pol.azh);
    if (trend < 0.0)
        trend += 360.0;
    return {
        trend: trend,
        plunge: plunge
    }
}

function cart2svg(cart_cords) {
    return (new Pt(
        Svg_Net.gfx.center.x + cart_cords.x,
        Svg_Net.gfx.center.y - cart_cords.y
    ));
}

function torad(degrees) {
    return degrees * Math.PI / 180;
}

function todeg(radians) {
    return radians * 180 / Math.PI;
}

function linText(start, end) {
    return ('M' + cart2svg(start).x + ',' + cart2svg(start).y + 'L' + cart2svg(end).x + ',' + cart2svg(end).y);
}

function polytext(points) {
    var poltext = "M";
    for (var i = 0; i < points.length; i++)
        poltext += cart2svg(points[i]).x + "," + cart2svg(points[i]).y + " ";
    return (poltext);
}

function arcText(start_angle, radius, end_angle, ccw) {
    var x1 = Svg_Net.gfx.center.x + Svg_Net.radius_primitive * Math.sin(torad(start_angle)),
        y1 = Svg_Net.gfx.center.y - Svg_Net.radius_primitive * Math.cos(torad(start_angle)),

        x2 = Svg_Net.gfx.center.x + Svg_Net.radius_primitive * Math.sin(torad(end_angle)),
        y2 = Svg_Net.gfx.center.y - Svg_Net.radius_primitive * Math.cos(torad(end_angle));

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
        this.newpath.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
    Svg_Net.gfx.svg_node.appendChild(this.newpath);
    return this.newpath;
}

function Group_obj(stroke, stroke_wth, fill, id) {
    this.id = id;
    this.newgroup = Document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.newgroup.setAttributeNS(null, "stroke", stroke);
    this.newgroup.setAttributeNS(null, "stroke-width", stroke_wth);
    this.newgroup.setAttributeNS(null, "fill", fill);
    this.newgroup.setAttributeNS(null, "id", this.id);
    Svg_Net.gfx.svg_node.appendChild(this.newgroup);
}

function Line_obj(start, end, str, id) {
    this.id = id;
    this.newpath = document.createElementNS('http://www.w3.org/2000/svg', "line");
    this.newpath.setAttributeNS(null, "x1", start.x);
    this.newpath.setAttributeNS(null, "x2", end.x);
    this.newpath.setAttributeNS(null, "y1", start.y);
    this.newpath.setAttributeNS(null, "y2", end.y);
    this.newpath.setAttributeNS(null, "stroke", str.color);
    this.newpath.setAttributeNS(null, "stroke-width", str.width);
    this.newpath.setAttributeNS(null, "id", this.id);
    Svg_Net.gfx.svg_node.appendChild(this.newpath);
    return this.newpath;
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
        this.newpath.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
    Svg_Net.gfx.svg_node.appendChild(this.newpath);
    return this.newpath;
}

function Wtp2cart(plunge, trend) {
    return (new Pt(
        Svg_Net.radius_primitive * Math.tan(Math.PI / 4 - 0.5 * torad(plunge)) * Math.sin(torad(trend)),
        Svg_Net.radius_primitive * Math.tan(Math.PI / 4 - 0.5 * torad(plunge)) * Math.cos(torad(trend))
    ));
}

function Stp2cart(plunge, trend) {
    return (new Pt(
        Math.SQRT2 * Svg_Net.radius_primitive * Math.sin(Math.PI / 4 - 0.5 * torad(plunge)) * Math.sin(torad(trend)),
        Math.SQRT2 * Svg_Net.radius_primitive * Math.sin(Math.PI / 4 - 0.5 * torad(plunge)) * Math.cos(torad(trend))
    ));
}

function Ssdr2cart(strike, dip, rake, op_flag) {
    if ((op_flag === true) && rake != 90) {
        strike += 180;
        rake = 180 - rake;
    }
    var Temp_Pl = Math.asin(Math.sin(torad(dip)) * Math.sin(torad(rake))),
        Temp_Tr = torad(strike) + Math.atan(Math.cos(torad(dip)) * Math.tan(torad(rake)));
    return (new Pt(
        Math.SQRT2 * Svg_Net.radius_primitive * Math.sin(Math.PI / 4 - 0.5 * Temp_Pl) * Math.sin(Temp_Tr),
        Math.SQRT2 * Svg_Net.radius_primitive * Math.sin(Math.PI / 4 - 0.5 * Temp_Pl) * Math.cos(Temp_Tr)
    ));
}

function Plane(strike, dip, clr, lwidth, id) {
    this.strike = strike;
    this.dip = dip;
    this.clr = clr;
    this.lwidth = lwidth;
    this.draw = function () {
        if (this.dip !== 90) {

            if (SchmidtNet_Flag) {
                gsp = [];
                for (i = 0; i <= 90; i += 5) gsp.push(Ssdr2cart(this.strike, this.dip, i, false));
                for (i = 85; i >= 0; i -= 5) gsp.push(Ssdr2cart(this.strike, this.dip, i, true));
                this.plot = new Path_obj(polytext(gsp), this.clr, this.lwidth, "none", 0, id);
            } else {
                this.plot = new Path_obj(
                    arcText(
                        this.strike, Svg_Net.radius_primitive / Math.cos(torad(this.dip)), 180 + this.strike, 1),
                    this.clr, this.lwidth, "none", 0, id);
            }
        } else {
            this.plot = new Path_obj(
                linText(
                    new Pt(Svg_Net.radius_primitive * Math.sin(torad(this.strike)), Svg_Net.radius_primitive * Math.cos(torad(this.strike))),
                    new Pt(Svg_Net.radius_primitive * Math.sin(torad(this.strike + 180)), Svg_Net.radius_primitive * Math.cos(torad(this.strike + 180)))
                ), this.clr, this.lwidth, "none", 0, id);
        }
    }

    if (clr != undefined)
        this.draw();
}

function Line(trend, plunge, clr, id, rad, fill) {
    this.trend = trend;
    this.plunge = plunge;
    this.clr = clr;
    this.fill = fill == undefined ? "none" : fill
    this.rad = rad == undefined ? 3 : rad
    this.draw = function () {
        if (SchmidtNet_Flag)
            this.plot = new Circ_obj(new Stp2cart(this.plunge, this.trend), 2, this.clr, this.rad, this.fill, 0, id);
        else
            this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, this.clr, this.rad, this.fill, 0, id);
    }

    if (clr !== undefined) {
        this.draw();
    }
}

function LineonPlane(onPlane, pitch, op_flag, clr, id) {
    if (onPlane !== undefined) {
        this.clr = clr;
        this.id = id;
        if ((op_flag === true) && pitch != 90) {
            onPlane.strike += 180;
            pitch = 180 - pitch;
        }
        this.plunge = todeg(Math.asin(Math.sin(torad(onPlane.dip)) * Math.sin(torad(pitch))));
        this.trend = (onPlane.strike + todeg(Math.atan(Math.cos(torad(onPlane.dip)) * Math.tan(torad(pitch))))) % 360;
    }

    this.draw = function () {
        if (SchmidtNet_Flag)
            this.plot = new Circ_obj(new Stp2cart(this.plunge, this.trend), 2, "red", 1.5, this.clr, 0, this.id);
        else
            this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, "red", 1.5, this.clr, 0, this.id);
    };

    if (this.clr !== undefined) {
        this.draw();
    }

}

function PoletoPlane(ofPlane, clr, id) {
    if (ofPlane !== undefined) {
        this.id = id;
        this.clr = clr;
        this.plunge = 90 - ofPlane.dip;
        this.trend = (ofPlane.strike + 270) % 360;
    }

    this.draw = function () {
        if (SchmidtNet_Flag)
            this.plot = new Circ_obj(new Stp2cart(this.plunge, this.trend), 2, "blue", 1.5, this.clr, 0, this.id);
        else
            this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, "blue", 1.5, this.clr, 0, this.id);
    };


    if (this.clr !== undefined) {
        this.draw();
    }
}

Plane.prototype.modify = Line.prototype.modify = PoletoPlane.prototype.modify = LineonPlane.prototype.modify = function () {
    this.plot.remove();
    this.draw();
};

Plane.prototype.LocData = Line.prototype.LocData = PoletoPlane.prototype.LocData = LineonPlane.prototype.LocData = {}

function AngDist(InA, InB) {

    if ((InA instanceof Plane) && (InB instanceof Plane)) {
        var InA = new PoletoPlane(InA),
            InB = new PoletoPlane(InB);
    } else
    if (InA instanceof Plane)
        var InA = new PoletoPlane(InA);
    else if (InB instanceof Plane)
        InB = new PoletoPlane(InB);
    return todeg(Math.acos(Math.cos(torad(InA.trend - InB.trend)) * Math.cos(torad(InA.plunge)) * Math.cos(torad(InB.plunge)) + Math.sin(torad(InA.plunge)) * Math.sin(torad(InB.plunge))));
}

function WulffNet() {
    var k = 0;
    for (k = 0; k < 90; k += 2) {
        var sw = 0.5;
        if (k % 5) sw = 0.1;

        Path_obj(arcText(0, Svg_Net.radius_primitive / Math.cos(torad(k)), 180, 1), "black", sw, "none", 0, "gc" + k);
        Path_obj(arcText(0, Svg_Net.radius_primitive / Math.cos(torad(k)), 180, 0), "black", sw, "none", 0, "gc" + 90 + k);

        Path_obj(arcText(k, Svg_Net.radius_primitive * Math.tan(torad(k)), 360 - k, 1), "black", sw, "none", 0, "sc" + k);
        Path_obj(arcText(180 + k, Svg_Net.radius_primitive * Math.tan(torad(k)), 180 - k, 1), "black", sw, "none", 0, "sc" + 90 + k);

    }
    Plane(0, 90, "black", 0.5, "gc90");
    Plane(90, 90, "black", 0.5, "sc90");
}

function SchmidtNet() {
    var i = 0;
    var sw = 0;

    for (var dd = 0; dd < 90; dd += 2) {
        sw = 0.5;
        if (dd % 5) sw = 0.1;

        gsp = [];
        for (i = 0; i <= 90; i += 5) gsp.push(Ssdr2cart(0, dd, i, false));
        for (i = 85; i >= 0; i -= 5) gsp.push(Ssdr2cart(0, dd, i, true));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "gc" + dd);

        gsp = [];
        for (i = 0; i <= 90; i += 5) gsp.push(Ssdr2cart(180, dd, i, true));
        for (i = 85; i >= 0; i -= 5) gsp.push(Ssdr2cart(180, dd, i, false));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "gc" + 90 + dd);

    }

    for (var pp = 0; pp < 90; pp += 2) {
        sw = 0.5;
        if (pp % 5) sw = 0.1;

        gsp = [];
        for (i = 0; i <= 90; i += 5) gsp.push(Ssdr2cart(0, i, pp, false));
        for (i = 85; i >= 0; i -= 5) gsp.push(Ssdr2cart(180, i, pp, true));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "sc" + pp);

        gsp = [];
        for (i = 0; i <= 90; i += 5) gsp.push(Ssdr2cart(180, i, pp, false));
        for (i = 85; i >= 0; i -= 5) gsp.push(Ssdr2cart(0, i, pp, true));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "sc" + 90 + pp);

    }
    Plane(0, 90, "black", 0.5, "gc90");
    Plane(90, 90, "black", 0.5, "sc90");
}
/*Vector stuff*/

function att2dc(tp_in) {
    if (tp_in instanceof Plane)
        var tp = new PoletoPlane(tp_in);
    else
        var tp = tp_in;
    // console.log(tp,tp_in)
    n = Math.sin(torad(tp.plunge));
    l = Math.cos(torad(tp.plunge)) * Math.cos(torad(tp.trend));
    m = Math.sin(torad(tp.trend)) * Math.cos(torad(tp.plunge));
    return {
        l: l,
        m: m,
        n: n
    }
}

function dc2tp(dirCosine) {

    var plunge = todeg(Math.asin(dirCosine.n));


    var trend = todeg(Math.atan2(dirCosine.m, dirCosine.l));
    if (trend < 0)
        trend = trend + 360;


    if (plunge < 0) {
        plunge = -1 * plunge;
        trend += 180;
        if (trend > 360)
            trend = trend - 360;
    }
    return {
        trend: trend,
        plunge: plunge
    }
}

function dcmat(dcArray) {
    var n = dcArray.length;
    /*
      0  1  2
    0 ll lm ln
    1 lm mm mn
    2 ln mn nn
    */
    var dcm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (var i = 0; i < n; i++) {
        dcm[0][0] = dcm[0][0] + dcArray[i].l * dcArray[i].l;
        dcm[0][1] = dcm[0][1] + dcArray[i].l * dcArray[i].m;
        dcm[0][2] = dcm[0][2] + dcArray[i].l * dcArray[i].n;

        dcm[1][1] = dcm[1][1] + dcArray[i].m * dcArray[i].m;
        dcm[1][2] = dcm[1][2] + dcArray[i].m * dcArray[i].n;

        dcm[2][2] = dcm[2][2] + dcArray[i].n * dcArray[i].n;
    }
    dcm[1][0] = dcm[0][1];
    dcm[2][0] = dcm[0][2];
    dcm[2][1] = dcm[1][2];
    return dcm;

}

function eigen_Data(dataIn) {
    if (dataIn.length) {
        var dca = [];
        for (var i = 0; i < dataIn.length; i++) dca[i] = att2dc(dataIn[i]);
        var DcMat = dcmat(dca);
        var evs = evDecom(DcMat);
        var e1 = dc2tp({
            l: evs.V[0][0],
            m: evs.V[1][0],
            n: evs.V[2][0]
        });
        var e2 = dc2tp({
            l: evs.V[0][1],
            m: evs.V[1][1],
            n: evs.V[2][1]
        });
        var e3 = dc2tp({
            l: evs.V[0][2],
            m: evs.V[1][2],
            n: evs.V[2][2]
        });




        return {
            values: [evs.D[2][1] / dataIn.length, evs.D[1][1] / dataIn.length, evs.D[0][0] / dataIn.length],
            e1: e3,
            e2: e2,
            e3: e1
        }
    } else return -1
}
