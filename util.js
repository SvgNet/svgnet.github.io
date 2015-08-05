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

function addPl() {
	ur_pl.push(new Plane(+document.getElementById("st").value, +document.getElementById("dd").value, "red", 0.5, "user_plane" + ur_pl.length));
}
