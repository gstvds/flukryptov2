# Flukrypto

## Login / Sign Up / Logout

As telas de login e signup foram criadas com o auxílio do Redux e do Firebase. Para logar, o app envia uma ação por dispatch contendo os dados de email e password inseridos no TextInput pelo usuário. Essa ação verifica no Firebase se o usuário existe.

- Caso não exista, dispara um erro dizendo que o email não está cadastrado no sistema
- Caso exista, ele verifica a senha do usuário
- Se a senha não for a mesma da cadastrada anteriormente, dispara um erro dizendo que a senha é inválida
- Se a senha for a mesma, dispara a ação de Login e navega o usuário para dentro da tela principal com um switchNavigator, impossibilitando o usuário de voltar para a tela de login com um botão de Back.

Caso o usuário não possua um email cadastrado, existe a opção de clicar no botão Criar uma conta, que navega o usuário para uma segunda tela de cadastro. Nesta tela o usuário tem a opção de criar uma nova conta com email e senha. Ao clicar em cadastrar, uma ação é disparada para verificar as credencias do cadastro.

- Caso o email já exista, um erro é disparado dizendo que o email já está cadastrado.
- Caso o email não exista, dispara a ação de criar uma conta, cadastrando o usuário em um banco de dados e navegando-o para a tela de Login, onde deverá inserir os dados cadastrados para logar.

O estado inicial do reducer é passado com valores nulos. Para o usuário realizar um logout, dispara a ação de logout que returna o estado para o estado inicial, removendo o userId e o token do usuário e o logando novamente para a tela de Login.

As telas de Login e Signup possuem um componente criado separadamente chamado Card, o qual renderiza um Card estilizado que recebe os inputs e os botões.

## Tela Principal

Na tela principal optei por renderizar uma lista contendo as 10 principais criptomoedas de acordo com seu volume total em dólares, bem como seus valores atuais em dólar e euro.
Para isso, é utilizada a API do cryptocompare que retorna tais dados. O retorno dessa api é armazenado em uma constante que, posteriormente é passada para uma array de dados com as chaves (nome da cada criptomoeda) com o auxílio de um push dentro de um for.
Posteriormente, para obter os valores em dólar e em euro (principais moedas do mercado) dessas moedas, chama-se outra API utilizando o array de criptomoedas anteriormente criado e USD,EUR como parametros de moedas a serem obtidos. Com os dados retornados, utilizo de outro for para obter cada valor separadamente e,
com o uso de toFixed(2), defino os valores com apenas 2 casas decimais, para ficar como estrutura de moeda. Para armazenar esses dados de forma que o FlatList entenda, é necessário construir um array de objetos para que seja renderizado. Para isso, criei um modelo com o nome de Initial, que recebe os dados de DATA, USD e EUR, referentes à chave da criptomoeda, seu valor em dólar e seu valor em euro, respectivamente. Passo esses dados para uma outra array com o auxilio de um .push e por fim utilizo um useState para armazenar esse array em um estado que possa ser modificado.
O FlatList recebe esse dado do useState e renderiza em um componente criado chamado List, que recebe os 3 valores dos objetos e renderiza em forma de lista.

Para realizar as chamadas à API, é utilizado os métodos .get do axios, passando a API_KEY como um segundo parâmetros dentro do axios, onde é passado o headers.

Para garantir que a lista só seja renderizada após os dados serem carregados, utilizo de um outro estado chamado isLoading, o qual recebe um boolean que é atualizado no momento que o App é iniciado para true, indicando que o App está carregando, e ao fim de todo processo de carregamento para false, indicando que o App terminou de carregar. Para que o estado seja emitido assim que o app inicia, utilizo do hook useEffect com um parâmetro em branco [], fazendo com que ele opere da mesma forma de um componentDidMount. Por fim, um outro useEffect é utilizado para disparar a função de logout para o Header, onde se encontra o botão de logout. Isto é feito utilizando um setParams e uma ação de dispatch.

## Segunda Tela

Na segunda tela o usuário tem a opção de escolher uma criptomoeda especifica para ver mais dados, em qual valor ele deseja ver esses dados e de quanto tempo ele deseja que esses dados sejam. As opções são mostradas com um Picker, onde ele pode escolher dentre as 50 principais criptomoedas do mercado.
A escolha do Picker foi feita para tentar auxiliar o usuário, uma vez que este pode não se lembrar o nome da criptomoeda a qual deseja buscar ou até mesmo escrever de forma errada. Sendo assim, com um picker ele pode selecionar diretamente dentro de uma vasta opção qual moeda ele gostaria de fazer uma busca.
Dentre as opções de conversão estão as 20 moedas mais utilizadas no mundo, mais o REAL, visto que é a moeda local. E dentre as opções de dados, o usuário pode escolher entre o dia anterior, 7 dias atrás, 15 dias atrás, 30 dias atrás e do último ano.

Ao selecionar os valores nos pickers, seus respectivos valores são definidos em estados, os quais são utilizados na API. Quando o usuário clica no botão de Pesquisar, a função que chama a API é disparada utilizando os valores dos estados e retornando uma resposta. A partir dessa resposta, cada data é recebida como um timestamp do tipo UNIX, a qual é convertido para dias e meses com o auxílio de new Date(), getDate() e getMonth(). Os valores de máximo, mínimo, abertura e fechamento do mercado são convertidos em 2 casas decimais e todos os dados são passados para uma array de objetos com o auxílio de outro modelo chamado Search. Essa array é então passada como valor para um estado, a qual armazena como forma de array de objetos. Além disso, após o final da chamada da API, informações dos títulos de cada barra é repassada para novos estados para que sejam renderizado de forma dinâmica na tela. Os dados da array são passados como fonte de dados de uma FlatList, para que possa ser renderizado na tela após o clique de Pesquisa. Para que a FlatList entenda que deve ser re-renderizada após o clique do botão, é utilizado o parâmetro extraData, que indica que os dados recebidos e atualizados deverão ser renderizados.

Por fim, o usuário tem a opção de clicar no botão de Limpar, onde todos os estados são retornados ao estado padrão e a tela fica em branco novamente.

Semelhante ao que foi realizado na tela principal, o estado de isLoading é atualizado para true quando o App inicia e para false quando termina de carregar.
Como para carregar os dados do primeiro picker (que contém os dados das principais criptomoedas) é utilizado Redux, que invoca a API, recebe os dados e os dispara pela função fetchData(), o estado isLoading só é atualizado quando o dispatch dessa função termina de ser carregado.
