function Pt(cord_x, cord_y) {
    this.x = cord_x;
    this.y = cord_y;
}

function cart2svg(cart_cords, origin_coords) {
    return (new Pt(origin_coords.x + cart_cords.x, origin_coords.y - cart_cords.y));
}

function svgNet(net_props) {
    this.svgOrigin = net_props.center === undefined ? new Pt(net_props.radius_primitive, net_props.radius_primitive) : net_props.center;
    this.radius_primitive = net_props.radius_primitive ? net_props.radius_primitive : 256;
    this.Svg_obj = function (in_id, id, obj_center) {
        this.id = id;
        this.svg_node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg_node.setAttributeNS(null, "height", "100%");
        this.svg_node.setAttributeNS(null, "viewBox", "-10 -10 " + 2 * (obj_center.x + 10) + " " + 2 * (obj_center.y + 10));
        this.svg_node.setAttributeNS(null, "id", this.id);
        this.svg_node.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.svg_node.setAttributeNS(null, "version", "1.1");
        document.getElementById(in_id).appendChild(this.svg_node);
    };
    this.Circ_obj = function (cen, radius, stroke, stroke_wth, fill, deg, id) {
        this.id = id;
        var _cent = cart2svg(cen, _svgOrigin);
        this.path_node = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        this.path_node.setAttributeNS(null, "cx", _cent.x);
        this.path_node.setAttributeNS(null, "cy", _cent.y);
        this.path_node.setAttributeNS(null, "r", radius);
        this.setParams({
            stroke: stroke
            , strokeWidth: stroke_wth
            , fill: fill
        });
        if (deg !== 0) {
            this.path_node.setAttribute("transform", "rotate(" + deg + " " + _cent.x + " " + _cent.y + ")");
        }
        _svg_node.appendChild(this.path_node);
    }
    this.Path_obj = function (d, stroke, stroke_wth, fill, deg, id) {
        this.id = id;
        this.path_node = document.createElementNS('http://www.w3.org/2000/svg', "path");
        this.path_node.setAttributeNS(null, "d", d);
        this.setParams({
            stroke: stroke
            , stroke_width: stroke_wth
            , fill: fill
        });
        if (deg !== 0) {
            this.path_node.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
        }
        _svg_node.appendChild(this.newpath);
    }
    this.Path_obj.prototype.setParams = this.Circ_obj.prototype.setParams = function (attrParams) {
        this.path_node.setAttributeNS(null, "stroke", attrParams.stroke);
        this.path_node.setAttributeNS(null, "stroke-width", attrParams.strokeWidth);
        this.path_node.setAttributeNS(null, "fill", attrParams.fill == undefined ? "none" : attrParams.fill);
        this.path_node.setAttributeNS(null, "id", this.id);
    }
    this.gfx = new this.Svg_obj("Svgnet_Container", "fig", new Pt(this.radius_primitive, this.radius_primitive))
    var _svg_node = this.gfx.svg_node;
    var _svgOrigin = this.svgOrigin;
    this.primitiveCircle = new this.Circ_obj(new Pt(0, 0), this.radius_primitive, "#ccc", "2", "#FFF", 0, "prim_circ", this.gfx.svg_node)
}
Svg_Net = new svgNet({
    radius_primitive: 512
    , center: {
        x: 512
        , y: 512
    }
});
/*
var SchmidtNet_Flag = false;
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



function Group_obj(stroke, stroke_wth, fill, id) {
    this.id = id;
    this.newgroup = Document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.newgroup.setAttributeNS(null, "stroke", stroke);
    this.newgroup.setAttributeNS(null, "stroke-width", stroke_wth);
    this.newgroup.setAttributeNS(null, "fill", fill);
    this.newgroup.setAttributeNS(null, "id", this.id);
    Svg_Net.gfx.svg_node.appendChild(this.newgroup);
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

    this.draw = function () {
        if (this.dip !== 90) {

            if (SchmidtNet_Flag) {
                gsp = [];
                for (i = 0; i <= 90; i += 5)
                    gsp.push(Ssdr2cart(this.strike, this.dip, i, false));
                for (i = 85; i >= 0; i -= 5)
                    gsp.push(Ssdr2cart(this.strike, this.dip, i, true));
                this.plot = new Path_obj(polytext(gsp), clr, lwidth, "none", 0, id);
            } else {
                this.plot = new Path_obj(
                    arcText(
                        this.strike, Svg_Net.radius_primitive / Math.cos(torad(this.dip)), 180 + this.strike, 1),
                    clr, lwidth, "none", 0, id);
            }
        } else {
            this.plot = new Path_obj(
                linText(
                    new Pt(Svg_Net.radius_primitive * Math.sin(torad(this.strike)), Svg_Net.radius_primitive * Math.cos(torad(this.strike))),
                    new Pt(Svg_Net.radius_primitive * Math.sin(torad(this.strike + 180)), Svg_Net.radius_primitive * Math.cos(torad(this.strike + 180)))
                ), clr, lwidth, "none", 0, id);
        }
    }

    if (clr != undefined)
        this.draw();
}

function Line(trend, plunge, clr, id) {
    this.trend = trend;
    this.plunge = plunge;

    this.draw = function () {
        if (SchmidtNet_Flag)
            this.plot = new Circ_obj(new Stp2cart(this.plunge, this.trend), 2, clr, 3, "none", 0, id);
        else
            this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, clr, 3, "none", 0, id);
    }

    if (clr !== undefined) {
        this.draw();
    }
}

function LineonPlane(onPlane, pitch, op_flag, clr, id) {
    if ((op_flag === true) && pitch != 90) {
        onPlane.strike += 180;
        pitch = 180 - pitch;
    }
    this.plunge = todeg(Math.asin(Math.sin(torad(onPlane.dip)) * Math.sin(torad(pitch))));
    this.trend = (onPlane.strike + todeg(Math.atan(Math.cos(torad(onPlane.dip)) * Math.tan(torad(pitch))))) % 360;

    this.draw = function () {
        if (SchmidtNet_Flag)
            this.plot = new Circ_obj(new Stp2cart(this.plunge, this.trend), 2, "red", 1.5, clr, 0, id);
        else
            this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, "red", 1.5, clr, 0, id);
    };

    if (clr !== undefined) {
        this.draw();
    }

}

function PoletoPlane(ofPlane, clr, id) {
    this.plunge = 90 - ofPlane.dip;
    this.trend = (ofPlane.strike + 270) % 360;

    this.draw = function () {
        if (SchmidtNet_Flag)
            this.plot = new Circ_obj(new Stp2cart(this.plunge, this.trend), 2, "blue", 1.5, clr, 0, id);
        else
            this.plot = new Circ_obj(new Wtp2cart(this.plunge, this.trend), 2, "blue", 1.5, clr, 0, id);
    };

    if (clr !== undefined) {
        this.draw();
    }
}

Plane.prototype.modify = Line.prototype.modify = PoletoPlane.prototype.modify = LineonPlane.prototype.modify = function () {
    this.plot.newpath.parentNode.removeChild(this.plot.newpath);
    this.draw();
};

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
        if (k % 5)
            sw = 0.1;

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
        if (dd % 5)
            sw = 0.1;

        gsp = [];
        for (i = 0; i <= 90; i += 5)
            gsp.push(Ssdr2cart(0, dd, i, false));
        for (i = 85; i >= 0; i -= 5)
            gsp.push(Ssdr2cart(0, dd, i, true));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "gc" + dd);

        gsp = [];
        for (i = 0; i <= 90; i += 5)
            gsp.push(Ssdr2cart(180, dd, i, true));
        for (i = 85; i >= 0; i -= 5)
            gsp.push(Ssdr2cart(180, dd, i, false));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "gc" + 90 + dd);

    }

    for (var pp = 0; pp < 90; pp += 2) {
        sw = 0.5;
        if (pp % 5)
            sw = 0.1;

        gsp = [];
        for (i = 0; i <= 90; i += 5)
            gsp.push(Ssdr2cart(0, i, pp, false));
        for (i = 85; i >= 0; i -= 5)
            gsp.push(Ssdr2cart(180, i, pp, true));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "sc" + pp);

        gsp = [];
        for (i = 0; i <= 90; i += 5)
            gsp.push(Ssdr2cart(180, i, pp, false));
        for (i = 85; i >= 0; i -= 5)
            gsp.push(Ssdr2cart(0, i, pp, true));
        y = new Path_obj(polytext(gsp), "black", sw, "none", 0, "sc" + 90 + pp);

    }
    Plane(0, 90, "black", 0.5, "gc90");
    Plane(90, 90, "black", 0.5, "sc90");
}
*/
