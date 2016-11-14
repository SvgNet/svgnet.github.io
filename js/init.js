function svgNet(radius_primitive) {
    this.gfx = new Svg_obj("svg_wrapper", "fig", {
        x: (radius_primitive),
        y: (radius_primitive)
    });
    this.radius_primitive = radius_primitive;
    this.Draw_primitiveCircle = function () {
        return new Circ_obj({
            x: 0,
            y: 0
        }, this.radius_primitive, "#ccc", "2", "#FFF", 0, "prim_circ");
    };
}

Svg_Net = new svgNet(400);

Svg_Net.Draw_primitiveCircle();



var SvgNet_db = new PouchDB('userData');
var remoteCouch = false;

function drawSaved() {
    document.getElementById("dataout").getElementsByTagName('tbody')[0].innerHTML = "";
    ur_ln = [];
    ur_pl = [];
    ur_lnpl = [];
    ur_popl = [];
    ur_selected = [];
    SvgNet_db.allDocs({
        include_docs: true,
        descending: true
    }, function (err, doc) {
        draw_offlineData(doc.rows);
    });
}

drawSaved();

function draw_offlineData(savedData) {
    for (var i = 0; i < savedData.length; i++) {
        // console.log(savedData[i].doc)
        if (savedData[i].doc.orientType == "Plane") {
            ur_pl.push(new Plane(savedData[i].doc.strike, savedData[i].doc.dip, "blue", 1, savedData[i].id));
            insertdata(ur_pl[ur_pl.length - 1]);
        } else if (savedData[i].doc.orientType == "Line") {
            ur_ln.push(new Line(savedData[i].doc.trend, savedData[i].doc.plunge, "red", savedData[i].id));
            insertdata(ur_ln[ur_ln.length - 1]);
        } else if (savedData[i].doc.orientType == "PoletoPlane") {
            ur_popl.push(new PoletoPlane());
            ur_popl[ur_popl.length - 1].trend = savedData[i].doc.trend;
            ur_popl[ur_popl.length - 1].plunge = savedData[i].doc.plunge;
            ur_popl[ur_popl.length - 1].id = savedData[i].id;
            ur_popl[ur_popl.length - 1].draw();
            insertdata(ur_popl[ur_popl.length - 1]);
        } else if (savedData[i].doc.orientType == "LineonPlane") {
            ur_lnpl.push(new LineonPlane());
            ur_lnpl[ur_lnpl.length - 1].trend = savedData[i].doc.trend;
            ur_lnpl[ur_lnpl.length - 1].plunge = savedData[i].doc.plunge;
            ur_lnpl[ur_lnpl.length - 1].id = savedData[i].id;
            ur_lnpl[ur_lnpl.length - 1].draw();
            insertdata(ur_lnpl[ur_lnpl.length - 1]);

        }

    }
}

var pt = Svg_Net.gfx.svg_node.createSVGPoint();


function cursorPoint(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(Svg_Net.gfx.svg_node.getScreenCTM().inverse());
}



function svg2cart(svg_cords) {
    return (new Pt(
        svg_cords.x - Svg_Net.gfx.center.x,
        Svg_Net.gfx.center.y - svg_cords.y
    ));
}



var cursorSym = new Path_obj(linText({
    x: -30,
    y: 0
}, {
    x: 30,
    y: 0
}) + linText({
    x: 0,
    y: 30
}, {
    x: 0,
    y: -30
}), "black", 1.1, "none", 0, "cursor")
var pointers = {};

var linSymbol = new Circ_obj(new Pt(0, 0), 50, "#00b468", 4, "none", 0)


function clearcurTP() {
    cursorSym.setAttribute('transform', "translate(0,0)");
    document.getElementById("currTP").innerHTML = "tap or movemouse";
}

Svg_Net.gfx.svg_node.addEventListener("touchmove", onPointerMove, false);
Svg_Net.gfx.svg_node.addEventListener("mousemove", onPointerMove, false);
//Svg_Net.gfx.svg_node.addEventListener("mousedown", onPointerDown, false);
//Svg_Net.gfx.svg_node.addEventListener("touchdown", onPointerDown, false);
//Svg_Net.gfx.svg_node.addEventListener("touchemd", onPointerUp, false);
//Svg_Net.gfx.svg_node.addEventListener("mouseleave", onPointerUp, false);


var curPL = new Plane(0, 90, "rgba(255, 255, 255, 0)", 2, "curpl");
//var curLN = new Line(0, 90, "white", "curln")
var curXY = {};


function onPointerMove(e) {

    e.preventDefault();

    if (e.type === "touchmove") {
        curXY = e.touches[0];
    } else
        curXY = e;
    showTP(curXY)
}




function onPointerUp(e) {
    clearcurTP()
}

lineDash = new Line_obj({
    x: 0,
    y: 0
}, {
    x: 100,
    y: 100
}, {
    color: "gray",
    width: 3
}, "lineDash")
lineDash.setAttribute("stroke-dasharray", "10, 5")

function showTP(evt) {
    var showlin = function () {
        linSymbol.setAttribute('transform', "translate(" + pt.x + "," + (-pt.y) + ")");
        EnD = cart2svg({
            x: Svg_Net.radius_primitive * Math.cos(pol.azh),
            y: Svg_Net.radius_primitive * Math.sin(pol.azh)
        }, Svg_Net.svgOrigin)
        lineDash.setAttribute('x1', Svgxy.x);
        lineDash.setAttribute('x2', EnD.x);
        lineDash.setAttribute('y1', Svgxy.y);
        lineDash.setAttribute('y2', EnD.y)
    }
    var Svgxy = cursorPoint(evt)
    if (document.getElementById("optin_lnpl").checked) {
        Svgxy.y -= 100
    }
    var pt = svg2cart(Svgxy);

    var pol = cart2pol(pt);
    //var pnt = pt.matrixTransform(Svg_Net.gfx.svg_node.getScreenCTM().inverse());

    if (pol.rad <= Svg_Net.radius_primitive) {

        cursorSym.setAttribute('transform', "translate(" + pt.x + "," + (-pt.y) + ")");
        var tp = pol2tp(pol);


        if (document.getElementById("optin_ln").checked) {
            curPL.clr = "rgba(255, 255, 255, 0)";
            curPL.modify();
            //showlin()


            document.getElementById("currType").innerHTML = "Line:";
            document.getElementById("currTP").innerHTML = Math.round(tp.plunge) + "&rarr;" + Math.round(tp.trend);
        }
        if (document.getElementById("optin_pl").checked) {
            curPL.plot.remove();
            document.getElementById("currType").innerHTML = "Plane:";
            curPL.strike = (tp.trend + 90) % 360;
            curPL.dip = 90 - tp.plunge;
            curPL.clr = "#00d4d4";
            document.getElementById("currTP").innerHTML = Math.round(curPL.strike) + "/" + Math.round(curPL.dip);
            curPL.modify();
        }
        if (document.getElementById("optin_lnpl").checked) {
            curPL.clr = "#00d4d4";


            //document.getElementById("currTP").innerHTML = Math.round(curPL.strike) + "/" + Math.round(curPL.dip);

            curPL.modify();
            showlin();
            var plnlang = AngDist(tp, curPL);
            if (plnlang < 88 || plnlang > 92) {
                linSymbol.setAttribute('stroke', "#ff2525")
                console.log("red")
            } else
                linSymbol.setAttribute('stroke', "#00b468")
            linSymbol.setAttribute('transform', "translate(" + pt.x + "," + (-pt.y) + ")");
            ang = AngDist(new Line(curPL.strike, 0), tp);;
            document.getElementById("currTP").innerHTML = Math.round(curPL.strike) + "/" + Math.round(curPL.dip) + " Rake:" +
                (ang > 90 ?
                    (180 - Math.round(ang)) + "from" + ((Math.round(curPL.strike) + 180) % 360) : Math.round(ang) + "from" + Math.round(curPL.strike));
        }



    } else {
        clearcurTP()
    }

}



function handlePin(evt) {

    var pt = svg2cart(cursorPoint(evt));
    if (document.getElementById("optin_lnpl").checked) pt.y += 100
    var pol = cart2pol(pt);
    if (pol.rad <= Svg_Net.radius_primitive) {
        cursorSym.setAttribute('transform', "translate(" + pt.x + "," + (-pt.y) + ")");

        var tp = pol2tp(pol);
        if (document.getElementById("touchnet").checked)
            addLn(tp.trend, tp.plunge);

        //document.getElementById("currTP").innerHTML = Math.round(tp.plunge) + "&rarr;" + Math.round(tp.trend);
    } else {
        clearcurTP()
    }
}
Svg_Net.gfx.svg_node.addEventListener("touchdown", handlePin, false);
Svg_Net.gfx.svg_node.addEventListener("mousedown", handlePin, false);

function togglePin() {
    if (document.getElementById("touchnet").checked) {

    } else {
        Svg_Net.gfx.svg_node.removeEventListener("touchdown", handlePin, false);
        Svg_Net.gfx.svg_node.removeEventListener("mousedown", handlePin, false);
    }
}
document.querySelector("#toggleQip").addEventListener("change", function () {
    document.querySelector("#quickInput").classList.toggle("hidden")
})

//Svg_Net.gfx.svg_node.addEventListener("pointerleave", function (evt) {
//  clearcurTP();
//}, false)
var evDecom = science.lin.decompose()
    /*var dca = [];
    for (var i = 0; i < ur_ln.length; i++) dca[i] = att2dc(ur_ln[i]);
    var DcMat = dcmat(dca)
    var evs = evDecom(DcMat);*/


function eigenSelected_Data() {
    var _eigV = eigen_Data(ur_selected);
    var _ShowData = document.getElementById("Eigdat")
    if (_eigV == -1) {
        _ShowData.innerHTML = "Select Data First"
    } else {
        _ShowData.innerHTML =
            "e1:" + Math.round(_eigV.e3.plunge) + "&rarr;" + Math.round(_eigV.e3.trend) + "<br>" + "e2:" + Math.round(_eigV.e2.plunge) + "&rarr;" + Math.round(_eigV.e2.trend) + "<br>" + "e3:" + Math.round(_eigV.e1.plunge) + "&rarr;" + Math.round(_eigV.e1.trend) + "<br>";
    }
    console.log(_eigV)
}
