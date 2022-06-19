Trabalho final da disciplina de classificação e pesquisa de dados. O objetivo era criar uma aplicação que lesse dados brutos de um arquivo,
processasse as suas informações, guardasse estas informações num banco de dados próprio feito de arquivos binários e possibilitasse
ao usuário classificar e pesquisar entre estes dados.

Eu escolhi o tema de importações e exportações do Brasil no ano de 2021. O app cria arquivos invertidos de todas as possíveis
classificações contidas na amostra (dados brutos) que podem ser baixadas no site da Siscomex, bem como um grande arquivo binário
que contém todas as entradas.

A interface foi construída em HTML + CSS + JavaScript e é controlada pelo Python. A comunicação entre o front-end e back-end
é intermediada pelo módulo [eel](https://github.com/ChrisKnott/Eel).

# Demonstração

Esta é a página inicial, onde vemos as opções de pesquisa.

<p align="center">
<img src="https://i.imgur.com/MJwGgN6.png" width=800>
</p>

Depois de concluída, será mostrada uma tabela com resultados:

<p align="center">
<img src="https://i.imgur.com/4BGQWYx.png" width=800>
</p>

Aqui, o usuário tem a opção de ordenar por cada uma das colunas, fazer uma busca textual e ainda gerar um gráfico de top 10 de acordo com as seguintes modalidades:

<p align="center">
<img src="https://i.imgur.com/ilc27mc.png">
</p>

Exemplo, top 10 estados exportadores para o Cazaquistão em 2021:

<p align="center">
<img src="https://i.imgur.com/rjrkc19.png">
</p>

Estes gráficos são gerados pela biblioteca *Matplotlib* do Python.
