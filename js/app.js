// BLOCO 1 — Chaves e dados iniciais
/*
 * As constantes guardam os nomes usados para salvar livros e usuários no navegador.
 * A lista abaixo contém os livros padrão, usada quando ainda não existe um acervo salvo.
 * Cada livro é um objeto com identificador, título, autor e categoria.
 */
const CHAVE_LIVROS = "cantinhoLivros";
const CHAVE_USUARIOS = "cantinhoUsuarios";

const livrosIniciais = [
  { id: 1, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", categoria: "Aventura" },
  { id: 2, titulo: "A Bolsa Amarela", autor: "Lygia Bojunga", categoria: "Infantil" },
  { id: 3, titulo: "O Hobbit", autor: "J. R. R. Tolkien", categoria: "Fantasia" },
  { id: 4, titulo: "Extraordinário", autor: "R. J. Palacio", categoria: "Ficção" }
];

// BLOCO 2 — Carregar e salvar livros

/*
 * carregarLivros busca os dados no localStorage. Se não houver dados, salva e retorna
 * a lista inicial; caso já existam, converte o texto JSON para objetos JavaScript.
 */
function carregarLivros() {
  const dados = localStorage.getItem(CHAVE_LIVROS);

  if (dados === null) {
    salvarLivros(livrosIniciais);
    return livrosIniciais;
  }

  return JSON.parse(dados);
}

// Converte a lista de livros em texto JSON e a salva no armazenamento do navegador.
function salvarLivros(livros) {
  localStorage.setItem(CHAVE_LIVROS, JSON.stringify(livros));
}

// BLOCO 3 — Criar e exibir cartões de livros

/*
 * criarCartao monta um <article> com título, autor e categoria e o retorna pronto
 * para ser inserido na página.
 */
function criarCartao(livro) {
  const cartao = document.createElement("article");
  cartao.className = "cartao";

  const titulo = document.createElement("h3");
  titulo.textContent = livro.titulo;

  const autor = document.createElement("p");
  autor.textContent = "Autor: " + livro.autor;

  const categoria = document.createElement("p");
  categoria.textContent = "Categoria: " + livro.categoria;

  cartao.append(titulo, autor, categoria);
  return cartao;
}

/*
 * mostrarLivros limpa a área recebida e exibe uma mensagem se a lista estiver vazia.
 * Caso contrário, cria e adiciona um cartão para cada livro.
 */
function mostrarLivros(elemento, livros) {
  elemento.innerHTML = "";

  if (livros.length === 0) {
    elemento.textContent = "Nenhum livro cadastrado.";
    return;
  }

  livros.forEach(function (livro) {
    elemento.appendChild(criarCartao(livro));
  });
}

// BLOCO 4 — Livros da página inicial

/* Se a página tiver a área de destaque, mostra nela os quatro primeiros livros do acervo. */
const inicio = document.querySelector("#livros-inicio");
if (inicio) {
  mostrarLivros(inicio, carregarLivros().slice(0, 4));
}

// BLOCO 5 — Busca no catálogo

/*
 * Na página do catálogo, a busca compara o texto digitado com título, autor e categoria,
 * sem diferenciar maiúsculas de minúsculas, e atualiza os cartões com os resultados.
 */
const catalogo = document.querySelector("#lista-livros");
if (catalogo) {
  const busca = document.querySelector("#busca");

  function buscarLivros() {
    const termo = busca.value.toLowerCase();
    const livros = carregarLivros().filter(function (livro) {
      return (livro.titulo + livro.autor + livro.categoria).toLowerCase().includes(termo);
    });

    mostrarLivros(catalogo, livros);
  }

  // Atualiza os resultados ao digitar e também mostra o catálogo ao abrir a página.
  busca.addEventListener("input", buscarLivros);
  buscarLivros();
}

// BLOCO 6 — Adicionar e remover livros

/*
 * Na página de gerenciamento, esta função reconstrói a lista e o total de livros.
 * Cada botão remove seu livro do acervo salvo e atualiza a exibição.
 */
const formularioLivro = document.querySelector("#form-livro");
if (formularioLivro) {
  const lista = document.querySelector("#lista-gerenciar");

  function mostrarListaGerenciar() {
    const livros = carregarLivros();
    lista.innerHTML = "";

    livros.forEach(function (livro) {
      const linha = document.createElement("div");
      linha.className = "linha-livro";

      const nome = document.createElement("span");
      nome.textContent = livro.titulo + " — " + livro.autor + " (" + livro.categoria + ")";

      const botao = document.createElement("button");
      botao.textContent = "Remover";
      botao.type = "button";
      botao.addEventListener("click", function () {
        const atualizados = carregarLivros().filter(function (item) {
          return item.id !== livro.id;
        });
        salvarLivros(atualizados);
        mostrarListaGerenciar();
      });

      linha.append(nome, botao);
      lista.appendChild(linha);
    });

    document.querySelector("#total-livros").textContent = livros.length + " livros";
  }

  /*
   * Ao enviar o formulário, impede o recarregamento, acrescenta os dados digitados
   * ao acervo, salva a lista, limpa os campos e atualiza a página.
   */
  formularioLivro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const livros = carregarLivros();
    livros.push({
      id: Date.now(),
      titulo: document.querySelector("#titulo").value,
      autor: document.querySelector("#autor").value,
      categoria: document.querySelector("#categoria").value
    });

    salvarLivros(livros);
    formularioLivro.reset();
    mostrarListaGerenciar();
  });

  // Exibe o acervo atual ao abrir a página de gerenciamento.
  mostrarListaGerenciar();
}

// BLOCO 7 — Relatório de livros

/*
 * Se a tabela do relatório existir, exibe o total de livros e cria uma linha para
 * cada livro, com células para título, autor e categoria.
 */
const tabelaRelatorio = document.querySelector("#tabela-livros");
if (tabelaRelatorio) {
  const livros = carregarLivros();
  document.querySelector("#total-relatorio").textContent = livros.length;

  livros.forEach(function (livro) {
    const linha = document.createElement("tr");

    [livro.titulo, livro.autor, livro.categoria].forEach(function (dado) {
      const coluna = document.createElement("td");
      coluna.textContent = dado;
      linha.appendChild(coluna);
    });

    tabelaRelatorio.appendChild(linha);
  });
}

// BLOCO 8 — Cadastro e login de usuários

/*
 * Localiza os elementos da conta e configura cadastro, login e saída somente
 * quando os formulários estão presentes na página.
 */
const formularioCadastro = document.querySelector("#form-cadastro");
const formularioLogin = document.querySelector("#form-login");
const boasVindas = document.querySelector("#boas-vindas");

if (formularioCadastro && formularioLogin) {
  // Esconde os formulários e mostra uma saudação com o nome do usuário.
  function mostrarBoasVindas(usuario) {
    formularioCadastro.hidden = true;
    formularioLogin.hidden = true;
    boasVindas.hidden = false;
    document.querySelector("#nome-usuario").textContent = "Olá, " + usuario.nome + "!";
  }

  /*
   * O cadastro lê os campos, adiciona o usuário à lista salva no navegador
   * e mostra a saudação após concluir.
   */
  formularioCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    const usuario = {
      nome: document.querySelector("#nome").value,
      email: document.querySelector("#email-cadastro").value.toLowerCase(),
      senha: document.querySelector("#senha-cadastro").value
    };

    usuarios.push(usuario);
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
    mostrarBoasVindas(usuario);
  });

  /*
   * O login procura um usuário com e-mail e senha correspondentes; se encontrar,
   * mostra a saudação. Caso contrário, informa que os dados estão incorretos.
   */
  formularioLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    const email = document.querySelector("#email-login").value.toLowerCase();
    const senha = document.querySelector("#senha-login").value;
    const usuario = usuarios.find(function (item) {
      return item.email === email && item.senha === senha;
    });

    if (usuario) {
      mostrarBoasVindas(usuario);
    } else {
      document.querySelector("#mensagem-login").textContent = "E-mail ou senha incorretos. Tente novamente.";
    }
  });

  // O botão de saída esconde a saudação e volta a exibir os formulários.
  document.querySelector("#sair").addEventListener("click", function () {
    boasVindas.hidden = true;
    formularioCadastro.hidden = false;
    formularioLogin.hidden = false;
  });
}
