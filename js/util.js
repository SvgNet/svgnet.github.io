function toBase64(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
}

function triggerDownload() {
	var html = 'data:text/attachment;base64,' + toBase64(document.getElementById('svg_wrapper').innerHTML);
	var evt = new MouseEvent('click', {
		view: window,
		bubbles: false,
		cancelable: true
	});

	var a = document.createElement('a');
	a.setAttribute('download', 'gs.svg');
	a.setAttribute('href', html);
	a.setAttribute('target', '_blank');

	a.dispatchEvent(evt);
}

var ur_pl = [];
var ur_ln = [];
var ur_popl = [];
var ur_lnpl = [];

function addPl() {
	ur_pl.push(new Plane(+document.getElementById("st").value, +document.getElementById("dd").value, "blue", 0.5, "user_plane" + ur_pl.length));
}

function addLn() {
	ur_ln.push(new Line(+document.getElementById("tr").value, +document.getElementById("pl").value, "red", "user_line" + ur_pl.length));
}

function addPoPl() {
	ur_popl.push(new PoletoPlane(new Plane(+document.getElementById("pst").value, +document.getElementById("pdd").value), "orange", "user_poletoplane" + ur_pl.length));
}

function addLnPl() {
	ur_lnpl.push(new LineonPlane(new Plane(+document.getElementById("rst").value, +document.getElementById("rdd").value), document.getElementById("rpi").value, document.getElementById("ropfl").checked, "teal", "user_lineonplane" + ur_pl.length));
}

function wuffOn() {

	if (document.getElementById("shownet").checked) {
		x = new WuffNet();
	} else {
		for (var i = 0; i < 45; i++) {
			document.getElementById("fig").removeChild(document.getElementById("gc" + i * 2));
			document.getElementById("fig").removeChild(document.getElementById("gc" + 90 + i * 2));
			document.getElementById("fig").removeChild(document.getElementById("sc" + 180 + i * 2));
			document.getElementById("fig").removeChild(document.getElementById("sc" + i * 2));
		}
		document.getElementById("fig").removeChild(document.getElementById("sc90"));
		document.getElementById("fig").removeChild(document.getElementById("gc90"));
	}
}

function rotateWuff() {
	if (document.getElementById("shownet").checked) {
		var deg = document.getElementById("rotatenet").value;
		document.getElementById("rotatenet").setAttribute("data-badge",deg)
		for (var i = 0; i < 45; i++) {
			document.getElementById("gc" + i * 2).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
			document.getElementById("gc" + 90 + i * 2).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
			document.getElementById("sc" + 180 + i * 2).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
			document.getElementById("sc" + i * 2).setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
		}
		document.getElementById("sc90").setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
		document.getElementById("gc90").setAttribute("transform", "rotate(" + deg + " " + center.x + " " + center.y + ")");
	}
}
