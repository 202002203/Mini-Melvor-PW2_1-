# Mini Melvor — teste de treino de Programação para a Web (client side)

Teste de treino para o 1.º teste de PW2, no formato dos testes do professor (Grupo II: classes, DOM, HTML, `fetch`, XML).
Cada pergunta corresponde a **um ficheiro** deste repositório, em que escreves a resposta.

- **Duração:** 2h00 · **Cotação:** 20 valores
- **Sem IA, sem autocomplete, sem frameworks.** Só JavaScript, HTML e CSS "puros".
- **Sem `innerHTML`:** o DOM constrói-se com os métodos das interfaces `Node` e `Element` (`createElement`, `append`, `appendChild`, `textContent`, ...).
- **Resolve primeiro sem correr o código** (em papel ou num editor simples). Só quando acabares (ou quando o tempo acabar) é que corres os testes.
- **Não alteres** `src/provided/`, `testes/`, `testes.html`, `referencia/` nem `styles/`.

## Como correr

Os ficheiros têm de ser servidos por HTTP (por causa do `fetch`). Na pasta do projeto:

```bash
npm start                       # serve em http://localhost:3000
# ou, sem npm:
python3 -m http.server 3000
```

| Endereço | O que mostra |
|---|---|
| <http://localhost:3000/> | O jogo |
| <http://localhost:3000/testes.html> | Autoverificação das respostas (✓/✗ por pergunta) |

Os testes verificam o **comportamento**; não substituem a correção. Algumas perguntas dependem de outras
(a 7 usa a 2 e a 5, por exemplo), por isso um erro pode vir de trás.

## Onde responder

| Pergunta | Ficheiro | Valores |
|---|---|---|
| 1 | `src/q1-base-class.js` | 2.0 |
| 2 | `src/q2-skill.js` | 3.0 |
| 3 | `src/q3-action-pre-es6.js` | 2.0 |
| 4 | `src/q4-funcoes.js` | 2.0 |
| 5 | `src/q5-tabela.js` | 3.0 |
| 6 | `index.html` (a seguir ao comentário `<!-- Pergunta 6 -->`) | 2.0 |
| 7 | `src/q7-game.js` | 3.0 |
| 8a | `src/q8-fetch.js` | 2.0 |
| 8b | `src/q8b-skills.xml` | 1.0 |

## Código fornecido

Já está escrito e não podes alterá-lo:

- **`Collection`** (`src/provided/collection.js`): guarda objetos de uma mesma classe.
  - `new Collection(Classe)` · propriedade `elementsClass` (a classe dos elementos) · `size`
  - `add(elemento)` · `clear()` · `find(id)` (devolve o objeto ou `null`)
  - `forEach(cb)` · `map(cb)` · `filter(cb)`: comportamento igual ao dos arrays (`map` e `filter` devolvem arrays).
- **`BaseClass.toTh(texto)`** (`src/provided/base-class-toth.js`): devolve um `<th>` com o texto dado.
- **`Collection.Skill`** (`src/provided/bootstrap.js`): a coleção com todas as skills, criada depois de a tua classe `Skill` existir.
- **`src/provided/main.js`**: ao carregar a página chama `Skill.fetchValues()`, guarda as skills em `Collection.Skill` e mostra a tabela.
- **`index.html`**, **`styles/styles.css`** (toda a formatação é feita com seletores de tipo, exceto a classe `bar`) e **`data/skills.json`**.

Ordem de carregamento dos scripts: `Collection` → `BaseClass` (P1) → `toTh` → `Skill` (P2) → funções (P4) → tabela (P5) → `Game` (P7) → `fetchValues` (P8) → `bootstrap` → `main`.

---

# Enunciado

Pretende-se desenvolver, no browser, um pequeno jogo de progressão ao estilo de *Melvor Idle*.
O jogador tem várias **skills** (*Mining*, *Woodcutting*, *Fishing*) que sobem de nível quando se realizam **ações**,
cada uma das quais dá *xp* à skill escolhida.

Regras do jogo:

- Cada **100 xp** valem **1 nível**: `nível = floor(xp / 100) + 1`, com um máximo de **99**.
- O **progresso** para o nível seguinte é `xp % 100` (em percentagem).

No projeto existem, entre outras, as classes `BaseClass`, `Skill` e `Collection`.
A coleção com todas as skills está acessível através de `Collection.Skill`.

---

### 1. (2.0 valores) Ficheiro `src/q1-base-class.js`

Defina, usando a notação pós ES6, a classe `BaseClass`, que tem as propriedades `id` e `description`.
Esta deve guardar a informação em **propriedades privadas** e disponibilizar acessos públicos através de *getters/setters*.
O construtor recebe `(id, description)`.

Os valores introduzidos devem ser validados: o `id` deve ser um valor numérico e a `description` deve ser uma `string`, não vazia.
Se tal não acontecer devem ser gerados erros com as mensagens `"Tem de indicar um id!"` e `"Tem de indicar uma descrição!"`, respetivamente.

### 2. (3.0 valores) Ficheiro `src/q2-skill.js`

Defina, usando a notação pós ES6, a classe `Skill`, que **herda** de `BaseClass`. O construtor recebe `(id, description, xp = 0)`.

- Tem a propriedade privada `xp`, com *getter/setter*. O valor nunca pode ser negativo: se o valor for inválido (não numérico) ou negativo, o `xp` fica a `0`.
- Tem a **propriedade de classe** `maxLevel`, igual a `99`.
- Tem o *getter* `level`, que devolve o nível (nunca superior a `Skill.maxLevel`).
- Tem o *getter* `progress`, que devolve o progresso para o nível seguinte.
- Tem o método de instância `addXp(amount)`, que soma `amount` ao xp e permite a abordagem de *method chaining*.
- Tem o método `toString`, que devolve, por exemplo, `"Mining (nível 3)"`.

### 3. (2.0 valores) Ficheiro `src/q3-action-pre-es6.js`

Considere as classes seguintes (também em `referencia/action-es6.js`):

```js
class Action extends BaseClass {
  #xp;
  constructor(id, description, xp) {
    super(id, description);
    this.xp = xp;
  }
  get xp() { return this.#xp; }
  set xp(v) { this.#xp = Math.max(0, Number(v) || 0); }
  toString() { return `${this.description}: ${this.xp} xp`; }
}

class TimedAction extends Action {
  constructor(id, description, xp, seconds = 1) {
    super(id, description, xp);
    this.seconds = seconds;
  }
  toString() { return super.toString() + ` (${this.seconds}s)`; }
}
```

Reescreva `Action` e `TimedAction` na **notação pré ES6**, com funções construtoras e `prototype`.
A propriedade `xp` deve manter a validação (use `Object.defineProperty`).
Assuma que a `BaseClass` já está definida em pré ES6: **não a defina**, limite-se a usá-la.

### 4. (2.0 valores) Ficheiro `src/q4-funcoes.js`

**a)** Crie a função `totalXp`, que **obrigatoriamente usará o método `reduce`** dos *arrays*. Esta função recebe várias skills
e devolve a soma do `xp` delas. Por exemplo, para skills com 10, 20 e 5 de xp, devolve `35`.

**b)** Sem utilizar as instruções `if`, `switch` ou o operador ternário `?:`, escreva a função `icon`, que recebe o nome de uma skill
(`"mining"`, `"woodcutting"` ou `"fishing"`) e devolve, respetivamente, `⛏`, `🪓` ou `🎣`, ou o carácter `"?"` caso não seja um nome válido.

### 5. (3.0 valores) Ficheiro `src/q5-tabela.js`

A apresentação das skills é feita numa tabela de três colunas:

| Skill | Nível | Progresso |
|---|---|---|
| Mining | 3 | `[██████ 50%]` |
| Woodcutting | 2 | `[█████████ 75%]` |
| Fishing | 1 | `[████ 40%]` |

Assuma que as classes `Skill` e `Collection` foram criadas por outro programador e se encontram definidas noutros ficheiros:
ou seja, **não podem ser alteradas dentro da definição da classe, tem de lhes ser acrescentados os métodos**.
Assuma que toda a formatação é baseada nos seletores CSS de tipo, sendo apenas necessário indicar a classe `"bar"` para o `span` que representa a barra.
Assuma ainda que existe o método de classe `BaseClass.toTh`, que recebe um texto e devolve uma célula `<th>` para o cabeçalho da tabela.
Use apenas os métodos das interfaces `Node` e `Element`.

**a)** Defina o método de classe `Skill.tHead()`, que devolve o `<thead>` com as colunas **Skill**, **Nível** e **Progresso**.

**b)** Defina o método de instância `Skill.prototype.toTr()`, que devolve uma linha (`<tr>`) com a descrição, o nível e,
na 3.ª coluna, um `<span class="bar">` com a **largura** (`width`) igual ao progresso em percentagem e o **texto** igual a essa percentagem (por exemplo `"50%"`).

**c)** Defina o método `Collection.prototype.toTable()`, que devolve a tabela completa (`<table>`, com `<thead>` e `<tbody>`).
Assuma que a coleção tem a propriedade `elementsClass`, que contém a classe dos elementos da coleção (para conseguir executar o `tHead` da alínea a),
e que cada elemento tem disponível o método `toTr`. O método deve funcionar para qualquer coleção, não só para a das skills.

### 6. (2.0 valores) Ficheiro `index.html`

Escreva, em HTML, o formulário para iniciar uma ação (no local assinalado com `<!-- Pergunta 6 -->`):

- uma *DropDownList* com `id="skill"`, com as opções `1 - Mining`, `2 - Woodcutting` e `3 - Fishing` (o `value` de cada `option` é o respetivo número);
- uma caixa de texto numérica com `id="quantity"`, que só aceita valores iguais ou superiores a 1;
- o botão **Iniciar**, que executa o método de classe `Game.start()` quando clicado (não deve submeter o formulário);
- o botão **Limpar**, que apaga os valores do formulário.

Deve usar elementos `label`.

### 7. (3.0 valores) Ficheiro `src/q7-game.js`

Defina a classe `Game` e, nela, o método de classe `start()` (associado ao botão **Iniciar**), que:

1. Lê a skill escolhida e a quantidade do formulário. A skill obtém-se com `Collection.Skill.find` (o `find` recebe o `id` como **número**).
   Se faltar alguma informação, ou se a skill não existir, escreve `"Faltam dados!"` no `<p id="message">` e termina.
2. Se já houver uma ação em curso (guarde o identificador do temporizador numa propriedade de classe privada),
   escreve `"Ação em curso!"` no `message` e termina.
3. Caso contrário, **a cada segundo** (`setInterval`):
   - soma **25 xp** à skill escolhida;
   - substitui o conteúdo do `<div id="skills">` pela tabela atualizada (`Collection.Skill.toTable()`);
   - escreve no `message` o ponto da situação, por exemplo `"Ação 2/5"`.
4. Quando completar a quantidade pedida, termina o temporizador (`clearInterval`), deixa de haver ação em curso e escreve `"Concluído!"` no `message`.

### 8. (3.0 valores)

**a) (2.0 valores) Ficheiro `src/q8-fetch.js`.** Defina o método de classe assíncrono `Skill.fetchValues()` que, através da API `fetch`,
executa o pedido a `/data/skills.json` e devolve um *array* com **objetos da classe `Skill`** criados a partir da resposta. Em caso de erro devolve um *array* vazio.
Como a `Skill` está noutro ficheiro, acrescente o método com `Skill.fetchValues = async function () { ... }`.

O ficheiro `data/skills.json` tem o formato:

```json
[{ "id": 1, "description": "Mining", "xp": 250 }, { "id": 2, "description": "Woodcutting", "xp": 175 }, { "id": 3, "description": "Fishing", "xp": 40 }]
```

**b) (1.0 valor) Ficheiro `src/q8b-skills.xml`.** Apresente a mesma informação do ficheiro `data/skills.json`, mas em formato **XML**.

---

## Depois de terminares

1. Corre `testes.html` e corrige o que falhar.
2. Abre o jogo (`/`), escolhe uma skill e uma quantidade, e vê as barras a crescer.
3. Envia-me os ficheiros `src/q*.js`, `src/q8b-skills.xml` e `index.html` para eu corrigir como o professor, com a nota por pergunta.
