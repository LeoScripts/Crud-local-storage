

'use strict'




//funções de clic e funcionamento do modal
const openModal = () => document.getElementById('modal')   
    .classList.add('active')
    

const closeModal = () => {
  //usando nossa função de limpar os campos
  clearFields()

  //fechando o modal de cadastro de clientes
  document.getElementById('modal').classList.remove('active');
  
}
//---------------------------------------------------------------------------------------







 //CRUD//----------------------------------------------------------------------------

  
  // aqui estramos lendo o que tem em local storage
  //  mas antes estamos trasfomando todo o resutado em json
  // as duas interrogaçoes sao uma condicioal de que verifica se esta vazio ou nao ai se tiver ela devolvera o array vazio logo apos
  //obs: estas funcioes estao separadas pois vao ser usadas varias vezes
  const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) ?? []
  
  
  // salvando os arquivos no local storage  o metodo json.stringify tranfoma jason em string
    //o pimeiro paramentro e a key 
    // o segumdo paramentro e o value
  //obs: estas funcioes estao separadas pois vao ser usadas varias vezes
  const setLocalStorage = (dbClient) => localStorage.setItem('dbClient', JSON.stringify(dbClient))
  
  
  //------------------------------------CREATE----------------------------------------------
  
  const createClient = (client) => {
  
  //aqui estramos lendo o que tem em local storage
  // mas antes estamos trasfomando todo o resutado em json
  //por fim armazenamos na variavel dbClient 
  // as duas interrogaçoes sao uma condicioal de que verifica se esta vazio ou nao ai se tiver ela devolvera o array vazio logo apos
  //que estao sendo trasido pela função getLocalStorage
    const dbClient = getLocalStorage()
  
    //adicionando o cliente dentro do array da variavel dbClient
    dbClient.push(client)
  
    // salvando os arquivos no local storage , o metodo json.stringify tranfoma jason em string
    setLocalStorage(dbClient)
  
  };
  
  
  //-------------------------------------READE---------------------------------------------
  //a letura dos banco aconse atravez do getLocalstorage que armazenado na execução da variavel readClient
  const readClient = () => getLocalStorage();
  
  
  
  //-----------------------------------UPDATE----------------------------------------------
  //faz a modificação ou atualiza dados
  
  //update recebe o indice=index e o client
  //recebendo os dados do banco na variavel dbclient vindo atravez do readclient
  //escolhendo o cliente a ser editado pelo indice dentro de dbclient
  //enviando arquivo modificado atravez do setlocalstorage
  const updateClient = (index,client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
  }
  
  //a execução sera a seguinte 
  // no console
  // updateClient(numro do indice, tempCliente)
  
  
  //-----------------------------------DELETE-----------------------------------------------
  
  const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
  }; 
    

//----------------------------------------------------------------------------








//--------------------------------------------------------------------------------------------
// validando o html salvar o cliente criado
const isValidFields = () =>{
    return document.getElementById('form').reportValidity();
};


//função de limpar os campos do madal
const clearFields = () => {
  //variavel que recebe todos os itens que tiverem com a classe modal-field
  // pegamos essa pois todos os inputs tem em em comun
  //o querySelectorAll pega todos caso nao tenha nenhum ele tras um array vazio
  const fields = document.querySelectorAll('.modal-field')

  //com o forEach vou varrear todos os campos e vou igualar a vazio
  //obs o field dentro do forEach e uma variavel e poderiamos ter colocado qualquer nome
  fields.forEach(field => field.value = "")
}



// função do salvar o cliente criado
const saveClient = () => {
    if (isValidFields()){

        //aqui receberems as informações do cliente que sera obtida de cada campo
        //e ser colocada no variavel client
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value,
        }

        
        const index = document.getElementById('nome').dataset.index

        if(index == 'new'){
          //aqui executamos a função arrou que cria o objeto, recebendo o objeto client la no DB
          createClient(client);
          
  
          //atualizando a tabela
          updateTable()

          //usando função de fechamento do modal
          closeModal();
            
        }else{
          updateClient(index,client)
          updateTable()
          closeModal()
        }
        
        
    }
    
};
   


//criando linhas na tabela com as informações--------------------------


const createRow = (client, index) => {
  //criei um linha vazia
  const newRow = document.createElement('tr')

  //prenchi com as td
              //ultilizamos este tipo por algum momento mas depois colocamos por id
              //deixei aqui comentado pois e muito bom saber de mais possibilidades
              //no html usamos atributos personalizados que sao cridos por nos mesmos
              //neste caso foi o data-action="editar" e com eles podemos capituralos no javascript
  

  //acabamos usando os id para descobrir em que botao haviamos clicado
  

  newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.telefone}</td>
    <td>${client.endereco}</td>
    <td>
      <button type="button" class="button green" id="edit-${index}">edit</button>
      <button type="button" class="button red" id="delete-${index}">delete</button>
    </td>
  `

  //inseri a linha com as td no tbody
  document.querySelector('#tableClient>tbody').appendChild(newRow);

}



//limpando linhas antes de inserir as informaçoes pra nao duplicar
const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

//ATUALIZAR TABELA AO  INICIAR O CARREGAMENTO
const updateTable = () => {
  //apagando antes de criar
  clearTable()
  //recebendo dados
  const dbClient = readClient()
  //lendo os dados e criando linha
  dbClient.forEach(createRow);

}


//editando e deletando

const fillFields = (client) => {
  document.getElementById('nome').value = client.nome
  document.getElementById('email').value = client.email
  document.getElementById('telefone').value = client.telefone
  document.getElementById('endereco').value = client.endereco
  document.getElementById('nome').dataset.index = client.index
} 

//identificado qual cliente 
const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

const editDelete = (event) => {
  //o target(alvo) indica onde cliclei
  //e estamos buscando por tipo pois o td nao tem um tipo
  if(event.target.type == 'button'){
    const [action, index] = event.target.id.split('-')

    if(action == 'edit'){
      editClient(index)
      
    }else{
      const client = readClient()[index]
      const response = confirm(`deseja realmente deletar o(a) cliente ${client.nome}`)
      if(response){
        deleteClient(index)
        updateTable()
      }
       
      
      
    }
  }
  
}


//executadando funçã de atualizar tabela
updateTable()


//evemtos-------------------------------------------------------

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)
    

document.getElementById('modalClose')
    .addEventListener('click', closeModal);


// evente de salvar o cliente criado

document.getElementById('salvar')
    .addEventListener('click', saveClient)
    

//evento dos botoes edite e delete----------
//aqui se obcervarmos toda vez que clicamo s item da linha
//ele trara um retorno pois estara ouvindo todos os clicks nessa linha
document.querySelector('#tableClient>tbody')
    .addEventListener('click',editDelete)    
