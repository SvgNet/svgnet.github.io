var input_Dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (!input_Dialog.showModal) {
    dialogPolyfill.registerDialog(input_Dialog);
}
showDialogButton.addEventListener('click', function () {
    input_Dialog.showModal();
});
input_Dialog.querySelector('.close').addEventListener('click', function () {
    input_Dialog.close();
    document.querySelector('.mdl-layout__content').style.overflowX = 'auto';
    document.querySelector('.mdl-layout__content').style.overflowX = '';
});

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

function formInputsHide() {
    var formInputs = document.getElementsByClassName("form_input");
    for (i = 0; i < formInputs.length; i++) {

        formInputs[i].classList.add("hidden")
    };
}

function formInputshow(id) {
    document.getElementById(id).classList.remove("hidden");
}
formInputsHide();

document.getElementById("input_type").onchange = function () {
    document.getElementById("form_error").innerHTML = "";
    var val = document.getElementById("input_type").value;
    console.log(val);
    formInputsHide();
    if (!(val == "NONE"))
        formInputshow(val + "_form");
}

document.getElementById("plot_input").onclick = function () {
    var plot_type = document.getElementById("input_type").value;

    if (plot_type == "pl")
        addPl();
    else if (plot_type == "ln")
        addLn();
    else if (plot_type == "popl")
        addPoPl();
    else if (plot_type == "lnpl")
        addLnPl();
    else {
        document.getElementById("form_error").innerHTML = "Please Select a Data Type";
    }

}



function showINP() {
    var inps = document.getElementsByName("optIn"),
        sel_in = {};

    for (i = 0; i < inps.length; i++) {
        console.log(inps[i])
        document.getElementById("in_" + inps[i].id.slice(6)).classList.add("hidden");
        if (inps[i].checked)
            document.getElementById("in_" + inps[i].id.slice(6)).classList.toggle("hidden");
        //else


    }


}

showINP()
