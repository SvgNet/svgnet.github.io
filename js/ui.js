function add_design(tag_mdl, class_mdl, addclass_mdl) {
	var elements = document.getElementsByTagName(tag_mdl);
	var len = elements.length;
	for (var i = 0; i < len; i++) {
		if (elements[i].className === "mdl-card__title-text") {
			elements[i].classList.add(addclass_mdl);
		}
	}
}

add_design("h2", "mdl-card__title-text", "mdl-color-text--white");


var headerCheckHandler = function (event) {
	var table = document.querySelector('table');
	var headerCheckbox = table.querySelector('thead .mdl-data-table__select input');
	var boxes = table.querySelectorAll('tbody .mdl-data-table__select');

	if (event.target.checked) {

		for (var i = 0, length = boxes.length; i < length; i++) {
			boxes[i].MaterialCheckbox.check();
		}
	} else {
		for (var i = 0, length = boxes.length; i < length; i++) {
			boxes[i].MaterialCheckbox.uncheck();
		}
	}
};
document.querySelector('thead .mdl-data-table__select input').addEventListener('change', headerCheckHandler);
