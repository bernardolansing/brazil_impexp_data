import csv
from json import dumps
from os.path import exists

if not exists('jsons'):
	with open('planilhas\\CO_PAIS.csv', 'r', encoding = 'utf8') as arquivo:
		parsed = csv.reader(arquivo, delimiter = ';')
		next(parsed)  # discards the header line
		d = dict()
		for linha in parsed:
			d.update({str(linha[0]): linha[3]})
		
		j = dumps(d, ensure_ascii = False)

		with open('jsons\\countries_names.json', 'w') as new_json:
			new_json.write(j)

	with open('planilhas\\CO_VIA.csv', 'r', encoding = 'utf8') as arquivo:
		parsed = csv.reader(arquivo, delimiter = ';')
		next(parsed)  # discards the header line

		d = {cod: name.lower().capitalize() for cod, name in (row for row in parsed)}
		j = dumps(d, ensure_ascii = False)

		with open('jsons\\vias.json', 'w') as new_json:
			new_json.write(j)
