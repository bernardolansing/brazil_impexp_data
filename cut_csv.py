import csv

planexp = 'planilhas\\EXP_COMPLETA.csv'
cutplanexp = 'planilhas\\EXP_AMOSTRA.csv'
planimp = 'planilhas\\IMP_COMPLETA.csv'
cutplanimp = 'planilhas\\IMP_AMOSTRA.csv'

with open(planexp, 'r') as fplanexp, open(cutplanexp, 'w') as cut:
	parsed = csv.reader(fplanexp, delimiter = ';')
	cut.write(';'.join(next(parsed)))
	for row in parsed:
		if row[0] == '2021':
			cut.write(';'.join(row) + '\n')

with open(planimp, 'r') as fplanimp, open(cutplanimp, 'w') as cut:
	parsed = csv.reader(fplanimp, delimiter = ';')
	cut.write(';'.join(next(parsed)))
	for row in parsed:
		if row[0] == '2021':
			cut.write(';'.join(row) + '\n')
