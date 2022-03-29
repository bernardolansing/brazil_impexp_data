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
	form['mean_of_transport'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-month');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['month'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-supercategory');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['supercategory'] = selectOption ? selectOption : 'any';

	selectObj = document.getElementById('select-category');
	selectOption = selectObj.options[selectObj.selectedIndex].getAttribute('name');
	form['category'] = selectOption ? selectOption : 'any';

	// send form to Python side
	eel.receive_form(JSON.stringify(form));
}


