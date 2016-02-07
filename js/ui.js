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

function hideOthers(element) {
	if (!element.classList.contains("content-current")) {
		element.classList.add("content-hidden");
	}
}

function toggleCard() {
	this.parentElement.classList.add("content-current");
	[].forEach.call(document.querySelectorAll(".mdl-card"), hideOthers);
	this.parentElement.classList.toggle("content-hidden");
	this.parentElement.classList.remove("content-current");
}

function attachToggler(element, index, array) {
	element.addEventListener('click', toggleCard);
}
[].forEach.call(document.querySelectorAll(".toggle-card--content"), attachToggler);
