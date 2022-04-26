eel.expose(fillSelectElements)
function fillSelectElements(arrayReads) {
	var selectObj;
	var appendObj;
	var appendText;

	var ids = [
		'select-month',
		'select-category',
		'select-mean-of-transport',
		'select-state',
		'select-country'
	];

	for (const read of arrayReads) {
		selectObj = document.getElementById(ids.pop());
		t = JSON.parse(read);
		for (const [key, value] of Object.entries(t)) {	
			// cannot import from or export to Brazil
			if (key != '105') {
				appendObj = document.createElement('option');
				appendText = document.createTextNode(value);
				appendObj.appendChild(appendText);
				appendObj.setAttribute('name', key);
				selectObj.appendChild(appendObj);
			}
		}
	}
}

function sendForm() {
	var form = {};

	// start loading screen and hide previous search results table
	document.getElementById('div-loading').setAttribute('style', '');
	document.getElementById('div-show-results').setAttribute('style', 'display: none;');

	var selectObj = document.getElementById('select-import-export');
	var selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['modality'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-country');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['country'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-state');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['state'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-mean-of-transport');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['mean'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-month');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['month'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-category');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['category'] = selectOption ? selectOption : 'any';

	// send form to Python side
	eel.receive_form(JSON.stringify(form));
}

function searchEntriesSortingFunction(a, b, attribute) {
	return a[attribute] - b[attribute];
}

eel.expose(displaySearchResults);
function displaySearchResults(jsontext) {
	var j = JSON.parse(jsontext);
	j.sort(searchEntriesSortingFunction(attribute = 'quantity'));
	var table = document.getElementById('search-results-table');
	var newrow, cell;

	for (const entry of j) {
		newrow = document.createElement('tr');
		newrow.className = 'innerRow';
		for (const att of Object.values(entry)) {
			cell = document.createElement('td');
			cell.appendChild((document.createTextNode(att)));
			newrow.appendChild(cell);
		}
		table.appendChild(newrow);
	}

	// disable loading screen and show search table
	document.getElementById('div-loading').setAttribute('style', 'display: none;');
	document.getElementById('div-show-results').setAttribute('style', '');
}
