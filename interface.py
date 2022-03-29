import eel
from json import loads, dumps


class Search:
	def __init__(self, form):
		self.json_form = loads(form)
	
	def execute(self):
		pass


eel.init('web')


@eel.expose
def receive_form(form):
	new_search = Search(form)
	new_search.execute()


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
