// Os livros ficam salvos no navegador.
const CHAVE_LIVROS = "cantinhoLivros";
const CHAVE_USUARIOS = "cantinhoUsuarios";
const livrosIniciais = [
  { id: 1, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", categoria: "Aventura" },
  { id: 2, titulo: "A Bolsa Amarela", autor: "Lygia Bojunga", categoria: "Infantil" },
  { id: 3, titulo: "O Hobbit", autor: "J. R. R. Tolkien", categoria: "Fantasia" },
  { id: 4, titulo: "Extraordinário", autor: "R. J. Palacio", categoria: "Ficção" }
];

function carregarLivros() {
  const dados = localStorage.getItem(CHAVE_LIVROS);

  if (dados === null) {
    salvarLivros(livrosIniciais);
    return livrosIniciais;
  }

  return JSON.parse(dados);
}

function salvarLivros(livros) {
  localStorage.setItem(CHAVE_LIVROS, JSON.stringify(livros));
}

function criarCartao(livro) {
  // Monta no HTML um cartão com o título, autor e categoria do livro.
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

function mostrarLivros(elemento, livros) {
  // Substitui o conteúdo da área de livros pelos cartões encontrados.
  elemento.innerHTML = "";

  if (livros.length === 0) {
    // Exibe uma mensagem no lugar dos cartões quando não há resultados.
    elemento.textContent = "Nenhum livro cadastrado.";
    return;
  }

  livros.forEach(function (livro) {
    elemento.appendChild(criarCartao(livro));
  });
}

const inicio = document.querySelector("#livros-inicio");
if (inicio) {
  // Na página inicial, mostra somente os quatro primeiros livros do acervo.
  mostrarLivros(inicio, carregarLivros().slice(0, 4));
}

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

  // Atualiza os cartões do catálogo conforme o texto digitado na busca.
  busca.addEventListener("input", buscarLivros);
  buscarLivros();
}

const formularioLivro = document.querySelector("#form-livro");
if (formularioLivro) {
  const lista = document.querySelector("#lista-gerenciar");

  function mostrarListaGerenciar() {
    const livros = carregarLivros();
    // Recria a lista de livros e seus botões de remoção na página.
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
        // Atualiza a lista exibida após remover o livro.
        mostrarListaGerenciar();
      });

      linha.append(nome, botao);
      lista.appendChild(linha);
    });

    // Atualiza no HTML o total de livros cadastrados.
    document.querySelector("#total-livros").textContent = livros.length + " livros";
  }

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
    // Limpa os campos do formulário e atualiza a lista exibida.
    mostrarListaGerenciar();
  });

  mostrarListaGerenciar();
}

const tabelaRelatorio = document.querySelector("#tabela-livros");
if (tabelaRelatorio) {
  const livros = carregarLivros();
  // Exibe a quantidade de livros e preenche a tabela com os dados do acervo.
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

const formularioCadastro = document.querySelector("#form-cadastro");
const formularioLogin = document.querySelector("#form-login");
const boasVindas = document.querySelector("#boas-vindas");

if (formularioCadastro && formularioLogin) {
  function mostrarBoasVindas(usuario) {
    // Esconde cadastro e login e mostra a saudação com o nome do usuário.
    formularioCadastro.hidden = true;
    formularioLogin.hidden = true;
    boasVindas.hidden = false;
    document.querySelector("#nome-usuario").textContent = "Olá, " + usuario.nome + "!";
  }

  formularioCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    const usuario = {
      nome: document.querySelector("#nome").value,
      email: document.querySelector("#email-cadastro").value.toLowerCase()
    };

    usuarios.push(usuario);
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
    mostrarBoasVindas(usuario);
  });

  formularioLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    const email = document.querySelector("#email-login").value.toLowerCase();
    const usuario = usuarios.find(function (item) {
      return item.email === email;
    });

    if (usuario) {
      mostrarBoasVindas(usuario);
    } else {
      // Informa no HTML quando o e-mail não está cadastrado.
      document.querySelector("#mensagem-login").textContent = "E-mail não cadastrado. Faça seu cadastro primeiro.";
    }
  });

  document.querySelector("#sair").addEventListener("click", function () {
    // Oculta a saudação e volta a exibir os formulários de conta.
    boasVindas.hidden = true;
    formularioCadastro.hidden = false;
    formularioLogin.hidden = false;
  });
}
