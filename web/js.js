var startTime, endTime;

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
	clearTable();

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
	startTime = Date.now();
	eel.receive_form(JSON.stringify(form));
}

function sortTable() {
	let s = document.getElementById('select-order');
	var att = s.options[s.selectedIndex].getAttribute('name');
	var attributes = ['month', 'category', 'country', 'state', 'mean', 'quantity', 'gross-weight', 'transaction-value'];
	var index = 0;

	for (index; true; index++) {
		if (att.startsWith(attributes[index]))
			break;
	}

	sorting = function(a, b) {
		if (index >= 5)
			return Number(a.children[index].innerText) > Number(b.children[index].innerText) ? 1 : -1;
		
		return a.children[index].innerText > b.children[index].innerText ? 1 : -1;
	}

	var rows = document.querySelectorAll('.innerRow');
	var arrayOfSortedRows = Array.from(rows).sort(sorting);

	for (let row of rows)
		row.remove();
	
	if (att.endsWith('-r'))
		arrayOfSortedRows.reverse();
	
	for (let row of arrayOfSortedRows)
		document.getElementById('search-results-table').querySelector('tbody').appendChild(row);
}

eel.expose(displaySearchResults);
function displaySearchResults(jsontext) {
	// benchmarking
	endTime = Date.now();
	document.getElementById('p-execution-time').textContent += String((endTime - startTime) / 1000) + 's.';

	var j = JSON.parse(jsontext);
	// j.sort(searchEntriesSortingFunction('quantity', false))
	var table = document.getElementById('search-results-table').querySelector('tbody');
	var newrow, cell;

	for (const entry of j) {
		newrow = document.createElement('tr');
		newrow.className = 'innerRow';
		for (const [index, att] of Object.values(entry).entries()) {
			cell = document.createElement('td');
			cell.appendChild((document.createTextNode(att)));
			newrow.appendChild(cell);
			if (index >= 5)
				cell.className = 'numberCell';
		}
		table.appendChild(newrow);
	}

	// disable loading screen and show search table
	document.getElementById('div-loading').setAttribute('style', 'display: none;');
	document.getElementById('div-show-results').setAttribute('style', '');
}

function clearTable() {
	currentRows = document.querySelectorAll('.innerRow');
	for (const row of currentRows) {
		row.remove();
	}
	document.getElementById('p-execution-time').innerText = 'Tempo de execução da pesquisa: ';
}
