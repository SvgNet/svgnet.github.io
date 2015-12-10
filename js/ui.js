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
