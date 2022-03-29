
function readJson(directory) {
	var file = new XMLHttpRequest();
	file.open('GET', directory, false);
	file.onreadystatechange = function () {
		if (file.readyState === 4) {
			var text = file.responseText;
		}
	}
	file.send()
	return JSON.parse(text);
}

eel.expose(fillSelectElements)
function fillSelectElements(arrayReads) {
	var selectObj;
	var appendObj;
	var appendText;

	var ids = [
		"select-category",
		"select-mean-of-transport",
		"select-state",
		"select-country"
	]

	for (const read of arrayReads) {
		selectObj = document.getElementById(ids.pop());
		t = JSON.parse(read);
		for (const item of Object.values(t)) {
			appendObj = document.createElement('option');
			appendText = document.createTextNode(item);
			appendObj.appendChild(appendText);
			selectObj.appendChild(appendObj);
	}
	}
}

eel.expose(teste);
function teste() {
	document.getElementById('button-filter').innerText = 'ANTEDEGUEMON';
}

