import eel
from json import loads
import db_dealer
from db_dealer import Entry
from matplotlib import pyplot

eel.init('web')


@eel.expose
def receive_form(form):
	form = loads(form)
	results = db_dealer.search(form)
	eel.displaySearchResults(results)


@eel.expose
def chart_request(data):
	sorted_data = {key: value for key, value in sorted(data.items(), key = lambda item: item[1], reverse = True)}
	labels = [label for label in list(sorted_data)[:10]]
	amounts = [amount for amount in list(sorted_data.values())[:10]]

	pyplot.pie(amounts, labels = labels, autopct = '%.2f%%')
	pyplot.show()


def fill_selects():
	fcountries = open('jsons\\countries_names.json', 'r')
	rcountries = fcountries.read()
	fcountries.close()

	fmeans = open('jsons\\means.json', 'r')
	rmeans = fmeans.read()
	fmeans.close()

	fcategories = open('jsons\\categories_names.json', 'r')
	rcategories = fcategories.read()
	fcategories.close()

	fstates = open('jsons\\states.json')
	rstates = fstates.read()
	fstates.close()

	fmonths = open('jsons\\month_names.json')
	rmonths = fmonths.read()
	fmonths.close()

	eel.fillSelectElements([rcountries, rstates, rmeans, rcategories, rmonths])


def assemble():
	fill_selects()	
	eel.start('index.html', size = (1280, 720), blocked = False)


assemble()
