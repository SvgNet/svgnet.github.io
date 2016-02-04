var headerCheckHandler = function (event) {
	var table = document.querySelector('table');
	var boxes = table.querySelectorAll('tbody .mdl-data-table__select');
	if (event.target.checked) {
		for (var i = 0, length = boxes.length; i < length; i++) {
			if (!boxes[i].querySelector('input').checked)
				boxes[i].querySelector('input').click();
		}
	} else {
		for (var i = 0, length = boxes.length; i < length; i++) {
			if (boxes[i].querySelector('input').checked)
				boxes[i].querySelector('input').click();
		}
	}
};
document.getElementById("selectall").addEventListener('change', headerCheckHandler);
//classList.toggle("content-hidden")

var x = document.querySelectorAll(".toggle-card--content")
for (var i = 0; i < x.length; i++) {
	x[i].addEventListener('click', function () {
		this.parentElement.classList.toggle("content-hidden");
	});
}
