if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

function toBase64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function triggerDownload() {
    var svg_file = 'data:image/svg+xml;base64,' + toBase64(document.getElementById('svg_wrapper').innerHTML);
    var dn_link = document.getElementById('pdl');
    dn_link.setAttribute('download', 'SvgNet_export.svg');
    dn_link.setAttribute('href', svg_file);
}

function triggerDownloadPNG() {
    var svg = document.querySelector("svg");
    var svgData = new XMLSerializer().serializeToString(svg);
    var canvas = document.createElement("canvas");
    canvas.height = 2 * Svg_Net.gfx.center.y;
    canvas.width = 2 * Svg_Net.gfx.center.x;
    var ctx = canvas.getContext("2d");
    var img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    ctx.drawImage(img, 0, 0);
    var canvasdata = canvas.toDataURL("image/png");
    var dn_link = document.getElementById('PNGdl');
    dn_link.setAttribute('download', 'SvgNet_export.png');
    dn_link.setAttribute('href', canvasdata);
}
var ur_pl = [];
var ur_ln = [];
var ur_popl = [];
var ur_lnpl = [];
var ur_selected = [];

function SelectThis(event) {
    var targetElement = event.target;
    if (targetElement.checked) {
        ur_selected.push(eval(targetElement.id.slice(3)));
        document.getElementById(targetElement.id).parentElement.parentElement.parentElement.classList.add("is-selected");
        console.log(targetElement.id.slice(3));
    } else {
        ur_selected.splice(ur_selected.lastIndexOf(eval(targetElement.id.slice(3))), 1);
        document.getElementById(targetElement.id).parentElement.parentElement.parentElement.classList.toggle("is-selected");
    }
}

function DeleteSelected() {
    if (ur_selected.length) {
        for (var i = 0; i < ur_selected.length; i++) {
            console.log()
            var delID=ur_selected[i].plot.id
            ur_selected[i].plot.remove();
            var DelID = ur_selected[i].plot.id
            if (ur_pl.lastIndexOf(ur_selected[i]) > -1) ur_pl.splice(ur_pl.lastIndexOf(ur_selected[i]), 1);
            if (ur_ln.lastIndexOf(ur_selected[i]) > -1) ur_ln.splice(ur_ln.lastIndexOf(ur_selected[i]), 1);
            if (ur_popl.lastIndexOf(ur_selected[i]) > -1) ur_popl.splice(ur_popl.lastIndexOf(ur_selected[i]), 1);
            if (ur_lnpl.lastIndexOf(ur_selected[i]) > -1) ur_lnpl.splice(ur_lnpl.lastIndexOf(ur_selected[i]), 1);
            SvgNet_db.get(delID).then(function (doc) {
                SvgNet_db.remove(doc);
            });
        };

        ur_selected = [];
        if (document.getElementById("selectall").checked) {
            document.getElementById("selectall").click();
        }
        updateData();
    }
}

function AngleSelected() {
    var res = "Select 2 Data";
    if (ur_selected.length == 2) {
        res = AngDist(ur_selected[0], ur_selected[1]);
    }
    document.getElementById("Angdat").innerHTML = res;
}

function updateData() {
    document.getElementById("dataout").getElementsByTagName('tbody')[0].innerHTML = "";
    if (ur_pl.length)
        for (var i = 0; i < ur_pl.length; i++) insertdata(ur_pl[i]);
    if (ur_ln.length)
        for (var i = 0; i < ur_ln.length; i++) insertdata(ur_ln[i]);
    if (ur_popl.length)
        for (var i = 0; i < ur_popl.length; i++) insertdata(ur_popl[i]);
    if (ur_lnpl.length)
        for (var i = 0; i < ur_lnpl.length; i++) insertdata(ur_lnpl[i]);
}

function insertdata(ur_in) {
    var table = document.getElementById("dataout").getElementsByTagName('tbody')[0];
    var row = table.insertRow(table.rows.length);
    var idf = "slP";
    var dataType = "";
    if (ur_in instanceof Line) {
        dataType = "Line";
        idf += "ur_ln[" + ur_ln.lastIndexOf(ur_in) + "]";
    } else if (ur_in instanceof Plane) {
        dataType = "Plane";
        idf += "ur_pl[" + ur_pl.lastIndexOf(ur_in) + "]";
    } else if (ur_in instanceof PoletoPlane) {
        dataType = "Pole to Plane";
        idf += "ur_popl[" + ur_popl.lastIndexOf(ur_in) + "]";
    } else if (ur_in instanceof LineonPlane) {
        dataType = "Line on Plane";
        idf += "ur_lnpl[" + ur_lnpl.lastIndexOf(ur_in) + "]";
    } else {
        dataType = "error";
        idf += "error"
    }
    var cell1 = row.insertCell(0);
    cell1.className = "mdl-data-table__cell--checkbox";
    cell1.innerHTML = '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="' + idf + '"><input type="checkbox" id="' + idf + '" class="mdl-checkbox__input" /></label>'
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell2.className = 'mdl-data-table__cell--non-numeric';
    cell2.innerHTML = dataType;
    if (ur_in instanceof Plane) {
        cell3.innerHTML = Math.round(ur_in.strike);
        cell4.innerHTML = Math.round(ur_in.dip);
    } else {
        cell3.innerHTML = Math.round(ur_in.trend);
        cell4.innerHTML = Math.round(ur_in.plunge);
    }
    componentHandler.upgradeElement(row);
    componentHandler.upgradeElement(document.getElementById(idf));
    document.getElementById(idf).addEventListener("change", function (event) {
        SelectThis(event);
    });
    componentHandler.upgradeDom();
}

function addPl() {
    var mob_input = input_Dialog.open ? "mob_" : "";
    ur_pl.push(new Plane(+document.getElementById(mob_input + "st").value, +document.getElementById(mob_input + "dd").value, "blue", 1, "Pur_pl[" + ur_pl.length + "]"));

    SvgNet_db.put({
        _id: "Pur_pl[" + (ur_pl.length - 1) + "]",
        orientType: "Plane",
        strike: ur_pl[ur_pl.length - 1].strike,
        dip: ur_pl[ur_pl.length - 1].dip
    }, function callback(err, result) {
        if (!err) {

            insertdata(ur_pl[ur_pl.length - 1]);
        } else(console.error(err))
    });
    if (document.getElementById(mob_input + "poto").checked) {
        ur_popl.push(new PoletoPlane(ur_pl[ur_pl.length - 1], "orange", "Pur_popl[" + ur_popl.length + "]"));
        SvgNet_db.put({
            _id: "Pur_popl[" + (ur_popl.length - 1) + "]",
            orientType: "PoletoPlane",
            trend: ur_popl[ur_popl.length - 1].trend,
            plunge: ur_popl[ur_popl.length - 1].plunge
        }, function callback(err, result) {
            if (!err) {
                insertdata(ur_popl[ur_popl.length - 1]);
            } else(console.error(err))
        });
    }
     updateData()
}

function addLn() {
    var mob_input = input_Dialog.open ? "mob_" : "";
    ur_ln.push(new Line(+document.getElementById(mob_input + "tr").value, +document.getElementById(mob_input + "pl").value, "red", "Pur_ln[" + ur_ln.length + "]"));
    SvgNet_db.put({
        _id: "Pur_ln[" +(ur_ln.length - 1) + "]",
        orientType: "Line",
        trend: ur_ln[ur_ln.length - 1].trend,
        plunge: ur_ln[ur_ln.length - 1].plunge
    }, function callback(err, result) {
        if (!err) {
            insertdata(ur_ln[ur_ln.length - 1])
        } else(console.error(err))
    });
     updateData()
}

function addPoPl() {
    var mob_input = input_Dialog.open ? "mob_" : "";
    ur_popl.push(new PoletoPlane(new Plane(+document.getElementById(mob_input + "pst").value, +document.getElementById(mob_input + "pdd").value), "orange", "Pur_popl[" + ur_popl.length + "]"));
    SvgNet_db.put({
        _id: "Pur_ln[" +(ur_ln.length - 1) + "]",
        orientType: "PoletoPlane",
        trend: ur_popl[ur_popl.length - 1].trend,
        plunge: ur_popl[ur_popl.length - 1].plunge
    }, function callback(err, result) {
        if (!err) {
            insertdata(ur_popl[ur_popl.length - 1]);
        } else(console.error(err))
    });
     updateData()
}

function addLnPl() {
    var mob_input = input_Dialog.open ? "mob_" : "";
    ur_lnpl.push(new LineonPlane(new Plane(+document.getElementById(mob_input + "rst").value, +document.getElementById(mob_input + "rdd").value), document.getElementById(mob_input + "rpi").value, document.getElementById(mob_input + "ropfl").checked, "teal", "Pur_lnpl[" + ur_lnpl.length + "]"));
    SvgNet_db.put({
        _id: "Pur_lnpl[" + (ur_lnpl.length-1) + "]",
        orientType: "LineonPlane",
        trend: ur_lnpl[ur_lnpl.length - 1].trend,
        plunge: ur_lnpl[ur_lnpl.length - 1].plunge
    }, function callback(err, result) {
        if (!err) {
            insertdata(ur_lnpl[ur_lnpl.length - 1])
        } else(console.error(err))
    });

}

function netOn() {
    if (document.getElementById("shownet").checked) {
        document.getElementById("rotatenet").removeAttribute("disabled");
        document.getElementById("fadenet").removeAttribute("disabled");
        if (SchmidtNet_Flag) var net = new SchmidtNet();
        else var net = new WulffNet();
    } else {
        clearNet();
    }
}

function clearNet() {
    var fig = document.getElementById("fig")
    for (var i = 0; i < 90; i += 2) {
        fig.removeChild(document.getElementById("gc" + i));
        fig.removeChild(document.getElementById("gc" + 90 + i));
        fig.removeChild(document.getElementById("sc" + i));
        fig.removeChild(document.getElementById("sc" + 90 + i));
    }
    fig.removeChild(document.getElementById("sc90"));
    fig.removeChild(document.getElementById("gc90"));
    document.getElementById("rotatenet").setAttribute("disabled", true);
    document.getElementById("fadenet").setAttribute("disabled", true)
}

function rotateOl() {
    var deg = document.getElementById("rotateol").value;
    document.getElementById("rotateol").setAttribute("data-badge", deg);
    if (ur_pl.length) {
        for (var i = 0; i < ur_pl.length; i++) ur_pl[i].plot.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
    if (ur_ln.length) {
        for (var i = 0; i < ur_ln.length; i++) ur_ln[i].plot.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
    if (ur_popl.length) {
        for (var i = 0; i < ur_popl.length; i++) ur_popl[i].plot.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
    if (ur_lnpl.length) {
        for (var i = 0; i < ur_lnpl.length; i++) ur_lnpl[i].plot.setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
}

function rotateNet() {
    var deg = document.getElementById("rotatenet").value;
    document.getElementById("rotatenet").setAttribute("data-badge", deg);
    for (var i = 0; i < 90; i += 2) {
        document.getElementById("gc" + i).setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
        document.getElementById("gc" + 90 + i).setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
        document.getElementById("sc" + i).setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
        document.getElementById("sc" + 90 + i).setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    }
    document.getElementById("sc90").setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
    document.getElementById("gc90").setAttribute("transform", "rotate(" + deg + " " + Svg_Net.gfx.center.x + " " + Svg_Net.gfx.center.y + ")");
}

function fadeNet() {
    var opa = document.getElementById("fadenet").value;
    document.getElementById("fadenet").setAttribute("data-badge", opa);
    for (var i = 0; i < 90; i += 2) {
        document.getElementById("gc" + i).setAttribute("opacity", opa / 100);
        document.getElementById("gc" + 90 + i).setAttribute("opacity", opa / 100);
        document.getElementById("sc" + i).setAttribute("opacity", opa / 100);
        document.getElementById("sc" + 90 + i).setAttribute("opacity", opa / 100);
    }
    document.getElementById("sc90").setAttribute("opacity", opa / 100);
    document.getElementById("gc90").setAttribute("opacity", opa / 100);
}

function modifyPlots() {
    if (ur_pl.length)
        for (var i = 0; i < ur_pl.length; i++) ur_pl[i].modify();
    if (ur_ln.length)
        for (var i = 0; i < ur_ln.length; i++) ur_ln[i].modify();
    if (ur_popl.length)
        for (var i = 0; i < ur_popl.length; i++) ur_popl[i].modify();
    if (ur_lnpl.length)
        for (var i = 0; i < ur_lnpl.length; i++) ur_lnpl[i].modify();
}

function switchNet() {
    if (document.getElementById("toschmidt").checked) {
        SchmidtNet_Flag = true;
        modifyPlots();
    }
    if (document.getElementById("towuff").checked) {
        SchmidtNet_Flag = false;
        modifyPlots();
    }
    if (document.getElementById("shownet").checked) {
        clearNet()
        netOn();
    }
}
