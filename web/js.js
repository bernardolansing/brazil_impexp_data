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
	var rows = document.querySelectorAll('.innerRow');
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
			return Number(a.children[index].innerText) > Number(b.children[index].innerText) ? -1 : 1;
		
		return a.children[index].innerText > b.children[index].innerText ? 1 : -1;
	}

	var arrayOfSortedRows = Array.from(rows).sort(sorting);

	for (let row of rows)
		row.remove();
	
	if (att.endsWith('-r'))
		arrayOfSortedRows.reverse();
	
	var tbody = document.getElementById('search-results-table').querySelector('tbody');
		for (let row of arrayOfSortedRows)
		tbody.appendChild(row);
}

var tableData;

eel.expose(displaySearchResults);
function displaySearchResults(jsontext) {
	// benchmarking
	endTime = Date.now();
	document.getElementById('p-execution-time').textContent += String((endTime - startTime) / 1000) + 's.';

	tableData = JSON.parse(jsontext);
	var table = document.getElementById('search-results-table').querySelector('tbody');
	var newrow, cell;

	for (const entry of tableData) {
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

		if (table.children.length == 5001) {
			console.log('entrou');
			let headerText = document.getElementById('p-search-status');
			headerText.innerHTML = 'Atenção, a tabela foi truncada para apenas 5000 linhas.';
			headerText.appendChild(document.createElement('br'));
			headerText.innerHTML += 'O total de linhas seria de ' + String(tableData.length) + '.';
			break;
		}
	}

	// disable loading screen and show search table
	document.getElementById('div-loading').setAttribute('style', 'display: none;');
	document.getElementById('div-show-results').setAttribute('style', '');
}

function clearTable() {
	var currentRows = document.querySelectorAll('.innerRow');
	for (const row of currentRows) {
		row.remove();
	}
	document.getElementById('p-execution-time').innerText = 'Tempo de execução da pesquisa: ';
	document.getElementById('select-ranking').selectedIndex = 0;
}

function clearFilterSelections() {
	document.getElementById('select-ranking').selectedIndex = 0;
	document.getElementById('select-country').selectedIndex = 0;
	document.getElementById('select-state').selectedIndex = 0;
	document.getElementById('select-mean-of-transport').selectedIndex = 0;
	document.getElementById('select-month').selectedIndex = 0;
	document.getElementById('select-category').selectedIndex = 0;
}

function searchInTable() {
	var searchText = document.getElementById('search-bar').value.toLowerCase();
	var cells = document.querySelectorAll('#search-results-table td');
	var occurrences = 0;

	for (const cell of cells) {
		let inText = cell.innerText.toLowerCase();
		
		if (searchText && inText.includes(searchText)) {
			cell.style.background = 'lightyellow';
			occurrences++;
		}

		else {
			cell.style.background = 'white';
		}
	}

	document.getElementById('p-occurrences-number').innerText = 'Quantidade de ocorrências: ' + String(occurrences);
}

function askForRanking() {
	var select = document.getElementById('select-ranking');
	var theme = select.options[select.selectedIndex].getAttribute('name');
	var data = {};
	var indexes = {
		'ranking-categories-value': ['ncm', 'transaction_value'],
		'ranking-countries-value': ['country_code', 'transaction_value'],
		'ranking-states-value': ['state', 'transaction_value'],
		'ranking-months-value': ['month', 'transaction_value'],
		'ranking-categories-weight': ['ncm', 'gross_weight'],
		'ranking-countries-weight': ['country_code', 'gross_weight'],
		'ranking-states-weight': ['state', 'gross_weight'],
		'ranking-months-weight': ['month', 'gross_weight']
	}[theme];

	console.log(indexes)

	for (entry of tableData) {
		if (entry[indexes[0]] in data) {
			data[entry[indexes[0]]] += entry[indexes[1]];
		}

		else
			data[entry[indexes[0]]] = entry[indexes[1]];
	}

	eel.chart_request(data)
}
