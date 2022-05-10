import csv
import pickle
from os import system
from os.path import exists
from json import dumps, loads

SIZE_OF_ENTRY_INSTANCE = 270


class Entry:
	file_index = 0

	def __init__(self, modality, month, ncm, unit_code, country_code,
	state, mean_of_transport, quantity, gross_weight, transaction_value):
		self.index_code = str(Entry.file_index).zfill(7)
		Entry.file_index += 1
		self.modality = modality
		self.month = month
		self.ncm = ncm
		self.country_code = country_code
		self.state = state
		self.mean = mean_of_transport
		self.gross_weight = gross_weight.zfill(11)  # quilograms
		self.transaction_value = transaction_value.zfill(10)  # US dollars

		quantity = int(quantity)

		if unit_code in ('10', '19', '21', '22'):
			self.classification = 'n'  # net_weight
			if unit_code == '10':
				self.quantity = quantity / 1000
			elif unit_code == '19':
				self.quantity = quantity / 5000000
			elif unit_code == '22':
				self.quantity = quantity / 1000000
			else:
				self.quantity = quantity
			# self.unit = 'ton'
		
		elif unit_code in ('11', '12', '13', '20'):
			self.classification = 'm'  # amount
			if unit_code == '11':
				self.quantity = quantity / 100
			elif unit_code == '12':
				self.quantity = quantity * 10
			elif unit_code == '13':
				self.quantity = quantity * 2 / 100
			else:
				self.quantity = quantity * 12 / 100
			# self.unit = 'hundreds_of_units'
		
		elif unit_code == '14':
			self.classification = 'l'  # lenght
			self.quantity = quantity
			# self.unit = 'meter'
		
		elif unit_code == '15':
			self.classification = 'a'  # area
			self.quantity = quantity
			# self.unit = 'square_meter'
		
		elif unit_code in ('16', '17'):
			self.classification = 'v'  # volume
			if unit_code == '17':
				self.quantity = quantity / 1000
			else:
				self.quantity = quantity
			# self.unit = 'cubic_meter'
		
		elif unit_code == '18':
			self.classification = 'e'  # energy
			self.quantity = quantity
		
		self.quantity = str(self.quantity).zfill(16)


# WRITING database.bin
if not exists('db_files\\database.bin'):
	with open('planilhas\\EXP_AMOSTRA.csv', 'r') as exp_spreadsheet, open('planilhas\\IMP_AMOSTRA.csv', 'r') as imp_spreadsheet:
		with open('db_files\\database.bin', 'wb') as binary:
			parsed_sheet = csv.reader(exp_spreadsheet, delimiter = ';')
			next(parsed_sheet)
			
			for row in parsed_sheet:
				wr = Entry('exp', row[1], row[2], row[3], row[4], row[5], row[6], row[8], row[9], row[10])
				pickle.dump(wr, binary)
			
			parsed_sheet = csv.reader(imp_spreadsheet, delimiter = ';')
			next(parsed_sheet)
			
			for row in parsed_sheet:
				wr = Entry('imp', row[1], row[2], row[3], row[4], row[5], row[6], row[8], row[9], row[10])
				pickle.dump(wr, binary)


# generator to read a file with pickle binary entries
def pickle_bin_file_generator(arquivo):
	try:
		while True:
			yield pickle.load(arquivo)
	except EOFError:
		pass


# WRITING INVERTED FILES
if not exists('db_files\\.createdInvertedFiles'):
	system('type NUL > db_files\\.createdInvertedFiles')

	directories = {
		'exp': 'db_files\\exp\\',
		'imp': 'db_files\\imp\\'
	}

	with open('db_files\\database.bin', 'rb') as db:
		for entry in pickle_bin_file_generator(db):	
			entry_code = entry.index_code.encode('utf-8')
			with open(directories[entry.modality] + 'month_' + entry.month + '.bin', 'ab') as month_file:
				month_file.write(entry_code)
			
			with open(directories[entry.modality] + 'category_' + entry.ncm[:2] + '.bin', 'ab') as category_file:
				category_file.write(entry_code)
			
			with open(directories[entry.modality] + 'country_' + entry.country_code + '.bin', 'ab') as country_file:
				country_file.write(entry_code)
			
			with open(directories[entry.modality] + 'state_' + entry.state + '.bin', 'ab') as state_file:
				state_file.write(entry_code)
			
			with open(directories[entry.modality] + 'mean_' + entry.mean + '.bin', 'ab') as mean_file:
				mean_file.write(entry_code)


def read_inverted_file(directory):
	with open(directory, 'rb') as file:
		text = str(file.read())
		text = text[2:-1]
		entries = [text[i:i+7] for i in range(0, len(text), 7)]
		return entries


def search(form):
	direc = 'db_files\\' + form['modality'] + '\\'
	del form['modality']
	filters = [f for f in form if form[f] != 'any']
	entries = set()
	new_entries = set()
	for filter in filters:
		new_entries.update(read_inverted_file(direc + filter + '_' + form[filter] + '.bin'))
		if not len(entries):
			entries = new_entries.copy()
		else:
			entries = entries & new_entries
		new_entries.clear()
	
	return write_entries(entries)


def write_entries(entries):
	d = []
	
	with open('db_files\\database.bin', 'rb') as db:
		for entry in entries:
			db.seek(int(entry) * SIZE_OF_ENTRY_INSTANCE)
			e = pickle.load(db)
			d.append({
				'month': e.month,
				'ncm': e.ncm,
				'country_code': e.country_code,
				'state': e.state,
				'mean': e.mean,
				'quantity': float(e.quantity),
				'gross_weight': int(e.gross_weight),
				'transaction_value': int(e.transaction_value)
			})
	
	# turning representative codes into its respective values
	with (
		open('jsons\\month_names.json', 'r') as monthjson,
		open('jsons\\countries_names.json', 'r') as countryjson,
		open('jsons\\means.json', 'r') as meansjson,
		open('jsons\\categories_names.json', 'r') as catjsons
	):
		parsed_monthjson = loads(monthjson.read())
		parsed_countryjson = loads(countryjson.read())
		parsed_meansjson = loads(meansjson.read())
		parsed_catjsons = loads(catjsons.read())

		for entry in d:
			entry['month'] = parsed_monthjson[entry['month']]
			entry['country_code'] = parsed_countryjson[entry['country_code']]
			entry['mean'] = parsed_meansjson[entry['mean']]
			entry['ncm'] = parsed_catjsons[entry['ncm'][:2]]

	return dumps(d, ensure_ascii = False)
