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
        console.log(savedData[i].doc)
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

function clearcurTP() {
    cursorSym.setAttribute('transform', "translate(0,0)");
    document.getElementById("currTP").innerHTML = "tap or movemouse";
}

Svg_Net.gfx.svg_node.addEventListener("pointermove", onPointerMove, false);
Svg_Net.gfx.svg_node.addEventListener("touchmove", onPointerMove, false);
Svg_Net.gfx.svg_node.addEventListener("pointerdown", onPointerDown, false);
Svg_Net.gfx.svg_node.addEventListener("pointerup", onPointerUp, false);
Svg_Net.gfx.svg_node.addEventListener('pointercancel', onPointerUp, false);



function onPointerDown(e) {
    console.log(e.type)
    e.preventDefault();
    pointers[e.pointerId] = {
        x: e.clientX,
        y: e.clientY,
        pointerType: e.pointerType,
        pointerId: e.pointerId
    };
    showTP(e)
}

function onPointerMove(e) {
    console.log(e.type)
    console.log(e)
        //console.log(e)
        // Prevent the browser from doing its default thing (scroll, zoom)
    e.preventDefault();
    var pointer = pointers[e.pointerId];
    if (pointer) {
        pointer.clientX = e.clientX;
        pointer.clientX = e.clientY;
    }
    console.log(e)
    if (e.type = "touchmove") {
        showTP(e.touches[0])
    }
    showTP(e);
}

function onPointerUp(e) {
    console.log(e.type)
    delete pointers[e.pointerId];
}



function showTP(evt) {



    var pt = svg2cart(cursorPoint(evt));
    var pol = cart2pol(pt);
    //var pnt = pt.matrixTransform(Svg_Net.gfx.svg_node.getScreenCTM().inverse());

    if (pol.rad <= Svg_Net.radius_primitive) {
        cursorSym.setAttribute('transform', "translate(" + pt.x + "," + (-pt.y) + ")");
        var tp = pol2tp(pol);
        document.getElementById("currTP").innerHTML = Math.round(tp.plunge) + "&rarr;" + Math.round(tp.trend);
    }

}


function handlePin(evt) {

    var pt = svg2cart(cursorPoint(evt));
    var pol = cart2pol(pt);
    if (pol.rad <= Svg_Net.radius_primitive) {
        cursorSym.setAttribute('transform', "translate(" + pt.x + "," + (-pt.y) + ")");
        var tp = pol2tp(pol);

        addLn(tp.trend, tp.plunge)
            //document.getElementById("currTP").innerHTML = Math.round(tp.plunge) + "&rarr;" + Math.round(tp.trend);
    } else {
        clearcurTP()
    }
}
function togglePin() {
    if (document.getElementById("touchnet").checked) {
        Svg_Net.gfx.svg_node.addEventListener("pointerdown", handlePin, false);
    } else {
        Svg_Net.gfx.svg_node.removeEventListener("pointerdown", handlePin, false);
    }
}

//Svg_Net.gfx.svg_node.addEventListener("pointerleave", function (evt) {
//  clearcurTP();
//}, false)
