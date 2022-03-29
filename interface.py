import eel

eel.init('web')


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

	eel.fillSelectElements([rcountries, rstates, rmeans, rcategories])


def assemble():
	fill_selects()	
	eel.start('index.html', size = (1280, 720), blocked = False)


assemble()
