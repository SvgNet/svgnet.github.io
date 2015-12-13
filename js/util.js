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
	canvas.height = 512;
	canvas.width = 512;
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

function AngleSelected() {
	var res = "Select only two Data";
	if (ur_selected.length == 2) {
		res = AngDist(ur_selected[0], ur_selected[1]);
	}
	document.getElementById("Angdat").innerHTML = res;
}

function insertdata(ur_in) {

	var table = document.getElementById("dataout").getElementsByTagName('tbody')[0];

	var row = table.insertRow(table.rows.length);

	var cell1 = row.insertCell(0);
	cell1.innerHTML = '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="' + "sl" + ur_in.plot.id + '"><input type="checkbox" id="' + "sl" + ur_in.plot.id + '" class="mdl-checkbox__input" /></label>'
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	cell2.className = 'mdl-data-table__cell--non-numeric';

	var dataType = "";
	if (ur_in instanceof Line)
		dataType = "Line";
	else if (ur_in instanceof Plane)
		dataType = "Plane";
	else if (ur_in instanceof PoletoPlane)
		dataType = "Pole to Plane";
	else if (ur_in instanceof LineonPlane)
		dataType = "Line on Plane";
	else
		dataType = "error";

	cell2.innerHTML = dataType;
	if (ur_in instanceof Plane) {
		cell3.innerHTML = ur_in.strike;
		cell4.innerHTML = ur_in.dip;
	} else {
		cell3.innerHTML = ur_in.trend;
		cell4.innerHTML = ur_in.plunge;
	}

	componentHandler.upgradeElement(row);
	componentHandler.upgradeElement(document.getElementById("sl" + ur_in.plot.id));
	document.getElementById("sl" + ur_in.plot.id).addEventListener("change", function (event) {
		SelectThis(event);
	});
	componentHandler.upgradeDom();

}

function addPl() {
	ur_pl.push(new Plane(+document.getElementById("st").value, +document.getElementById("dd").value, "blue", 1, "Pur_pl[" + ur_pl.length + "]"));
	insertdata(ur_pl[ur_pl.length - 1]);
	if (document.getElementById("poto").checked) {
		ur_popl.push(new PoletoPlane(ur_pl[ur_pl.length - 1], "orange", "Pur_popl[" + ur_popl.length + "]"));
		insertdata(ur_popl[ur_popl.length - 1]);
	}
}

function addLn() {
	ur_ln.push(new Line(+document.getElementById("tr").value, +document.getElementById("pl").value, "red", "Pur_ln[" + ur_ln.length + "]"));
	insertdata(ur_ln[ur_ln.length - 1]);
}

function addPoPl() {
	ur_popl.push(new PoletoPlane(new Plane(+document.getElementById("pst").value, +document.getElementById("pdd").value), "orange", "Pur_popl[" + ur_popl.length + "]"));
	insertdata(ur_popl[ur_popl.length - 1]);
}

function addLnPl() {
	ur_lnpl.push(new LineonPlane(new Plane(+document.getElementById("rst").value, +document.getElementById("rdd").value), document.getElementById("rpi").value, document.getElementById("ropfl").checked, "teal", "Pur_lnpl[" + ur_lnpl.length + "]"));
	insertdata(ur_lnpl[ur_lnpl.length - 1])
}

function netOn() {
	if (document.getElementById("shownet").checked) {
		document.getElementById("rotatenet").removeAttribute("disabled");
		document.getElementById("fadenet").removeAttribute("disabled");
		if (SchmidtNet_Flag)
			var net = new SchmidtNet();
		else
			var net = new WulffNet();
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
		for (var i = 0; i < ur_pl.length; i++)
			document.getElementById(ur_pl[i].plot.id).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
	if (ur_ln.length) {
		for (var i = 0; i < ur_ln.length; i++)
			document.getElementById(ur_ln[i].plot.id).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
	if (ur_popl.length) {
		for (var i = 0; i < ur_popl.length; i++)
			document.getElementById(ur_popl[i].plot.id).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
	if (ur_lnpl.length) {
		for (var i = 0; i < ur_lnpl.length; i++)
			document.getElementById(ur_lnpl[i].plot.id).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
}

function rotateNet() {
	var deg = document.getElementById("rotatenet").value;

	document.getElementById("rotatenet").setAttribute("data-badge", deg);
	for (var i = 0; i < 90; i += 2) {
		document.getElementById("gc" + i).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
		document.getElementById("gc" + 90 + i).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
		document.getElementById("sc" + i).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
		document.getElementById("sc" + 90 + i).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");

	}
	document.getElementById("sc90").setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	document.getElementById("gc90").setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
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
