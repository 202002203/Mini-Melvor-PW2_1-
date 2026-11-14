"use strict";
// NÃO ALTERAR — autoverificação das respostas.

const PONTOS = { 1: 2, 2: 3, 3: 2, 4: 2, 5: 3, 6: 2, 7: 3, 8: 3 };
const TITULOS = {
  1: "BaseClass",
  2: "Skill",
  3: "Action e TimedAction (pré ES6)",
  4: "totalXp e icon",
  5: "Tabela (tHead, toTr, toTable)",
  6: "Formulário HTML",
  7: "Game.start()",
  8: "fetchValues e XML"
};

const queue = [];
const T = (q, name, fn, opts = {}) => queue.push({ q, name, fn, bonus: !!opts.bonus });

// ---------- auxiliares ----------
const fmt = (v) => (typeof v === "string" ? JSON.stringify(v) : String(v));
const assert = (cond, msg = "Asserção falhou") => {
  if (!cond) throw new Error(msg);
};
const eq = (got, expected, msg = "Valor inesperado") => {
  if (!Object.is(got, expected)) throw new Error(`${msg}: esperado ${fmt(expected)}, obtido ${fmt(got)}`);
};
const throwsMsg = (fn, msg) => {
  try {
    fn();
  } catch (e) {
    eq(e.message, msg, "Mensagem de erro");
    return;
  }
  throw new Error(`Devia gerar o erro "${msg}", mas não gerou nenhum erro`);
};
const need = (cond, msg) => assert(cond, msg);
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const stripStrings = (code) => code.replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
const noVS = (s) => String(s).replace(/\uFE0F/g, "");
const text = (el) => (el?.textContent ?? "").trim();
const getText = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Não consegui ler ${url} (HTTP ${r.status}). Estás a servir a pasta por HTTP?`);
  return r.text();
};

// ================= PERGUNTA 1 — BaseClass =================
T(1, "cria objetos com id e description", () => {
  need(typeof BaseClass !== "undefined", "BaseClass não está definida");
  const b = new BaseClass(7, "Mining");
  eq(b.id, 7, "id");
  eq(b.description, "Mining", "description");
});
T(1, "os setters aceitam valores válidos", () => {
  const b = new BaseClass(1, "a");
  b.id = 9;
  b.description = "Fishing";
  eq(b.id, 9, "id");
  eq(b.description, "Fishing", "description");
});
T(1, 'id inválido gera "Tem de indicar um id!"', () => {
  throwsMsg(() => new BaseClass("7", "x"), "Tem de indicar um id!");
  throwsMsg(() => new BaseClass(undefined, "x"), "Tem de indicar um id!");
  throwsMsg(() => { new BaseClass(1, "x").id = "abc"; }, "Tem de indicar um id!");
});
T(1, 'description inválida gera "Tem de indicar uma descrição!"', () => {
  throwsMsg(() => new BaseClass(1, ""), "Tem de indicar uma descrição!");
  throwsMsg(() => new BaseClass(1, 5), "Tem de indicar uma descrição!");
  throwsMsg(() => { new BaseClass(1, "x").description = ""; }, "Tem de indicar uma descrição!");
});
T(1, "usa propriedades privadas (#): nenhuma propriedade pública própria", () => {
  eq(Object.keys(new BaseClass(1, "a")).length, 0, "Número de propriedades públicas do objeto");
});

// ================= PERGUNTA 2 — Skill =================
const mk = (xp) => new Skill(1, "Mining", xp);
T(2, "herda de BaseClass e reaproveita a validação", () => {
  need(typeof Skill !== "undefined", "Skill não está definida");
  assert(mk(0) instanceof BaseClass, "Skill devia herdar de BaseClass");
  throwsMsg(() => new Skill("x", "Mining", 0), "Tem de indicar um id!");
  throwsMsg(() => new Skill(1, "", 0), "Tem de indicar uma descrição!");
});
T(2, "xp por omissão é 0", () => eq(new Skill(1, "Mining").xp, 0, "xp"));
T(2, "xp inválido ou negativo fica a 0", () => {
  eq(mk(-10).xp, 0, "xp com -10");
  eq(mk("abc").xp, 0, 'xp com "abc"');
  eq(mk(NaN).xp, 0, "xp com NaN");
  const s = mk(50);
  s.xp = -1;
  eq(s.xp, 0, "xp depois de s.xp = -1");
  s.xp = 120;
  eq(s.xp, 120, "xp depois de s.xp = 120");
});
T(2, "maxLevel é propriedade de classe e vale 99", () => {
  eq(Skill.maxLevel, 99, "Skill.maxLevel");
  assert(!("maxLevel" in mk(0)), "maxLevel não devia existir nas instâncias");
});
T(2, "level = floor(xp / 100) + 1", () => {
  eq(mk(0).level, 1, "level com 0 xp");
  eq(mk(99).level, 1, "level com 99 xp");
  eq(mk(100).level, 2, "level com 100 xp");
  eq(mk(250).level, 3, "level com 250 xp");
});
T(2, "level limitado por Skill.maxLevel", () => {
  eq(mk(1000000).level, 99, "level com 1000000 xp");
  const old = Skill.maxLevel;
  try {
    Skill.maxLevel = 5;
    eq(mk(1000).level, 5, "level com maxLevel = 5 (deves usar Skill.maxLevel, não o número 99)");
  } finally {
    Skill.maxLevel = old;
  }
});
T(2, "progress = xp % 100", () => {
  eq(mk(250).progress, 50, "progress com 250 xp");
  eq(mk(300).progress, 0, "progress com 300 xp");
  eq(mk(99).progress, 99, "progress com 99 xp");
});
T(2, "addXp soma xp e devolve this (method chaining)", () => {
  const s = mk(0);
  assert(s.addXp(25) === s, "addXp devia devolver this");
  s.addXp(10).addXp(15);
  eq(s.xp, 50, "xp depois de somar 25, 10 e 15");
});
T(2, 'toString devolve "Mining (nível 3)"', () => {
  eq(String(mk(250)), "Mining (nível 3)", "toString");
  eq(`${mk(0)}`, "Mining (nível 1)", "toString com template string");
});
T(2, "usa propriedades privadas (#): nenhuma propriedade pública própria", () => {
  eq(Object.keys(mk(5)).length, 0, "Número de propriedades públicas do objeto");
});

// ================= PERGUNTA 3 — pré ES6 =================
class RefBase { constructor(id, d) { this.id = id; this.description = d; } }
class RefAction extends RefBase {
  #xp;
  constructor(id, d, xp) { super(id, d); this.xp = xp; }
  get xp() { return this.#xp; }
  set xp(v) { this.#xp = Math.max(0, Number(v) || 0); }
  toString() { return `${this.description}: ${this.xp} xp`; }
}
class RefTimed extends RefAction {
  constructor(id, d, xp, seconds = 1) { super(id, d, xp); this.seconds = seconds; }
  toString() { return super.toString() + ` (${this.seconds}s)`; }
}
let q3cache;
async function loadQ3() {
  if (q3cache) return q3cache;
  const code = await getText("src/q3-action-pre-es6.js");
  function LegacyBase(id, description) { this.id = id; this.description = description; }
  const factory = new Function(
    "BaseClass",
    `${code}\nreturn { Action: typeof Action === "undefined" ? undefined : Action, TimedAction: typeof TimedAction === "undefined" ? undefined : TimedAction };`
  );
  const { Action, TimedAction } = factory(LegacyBase);
  return (q3cache = { code, LegacyBase, Action, TimedAction });
}
T(3, "Action e TimedAction existem como funções construtoras", async () => {
  const { Action, TimedAction } = await loadQ3();
  need(typeof Action === "function", "Action não está definida");
  need(typeof TimedAction === "function", "TimedAction não está definida");
  assert(!/^class\b/.test(Action.toString()) && !/^class\b/.test(TimedAction.toString()), "Tens de usar funções construtoras, não class");
});
T(3, "não usa as palavras-chave class nem extends", async () => {
  const { code, Action } = await loadQ3();
  need(typeof Action === "function", "Action não está definida");
  const src = stripStrings(stripComments(code));
  assert(!/\bclass\b/.test(src), "Encontrei a palavra class no código");
  assert(!/\bextends\b/.test(src), "Encontrei a palavra extends no código");
});
T(3, "Action: id, description e toString como na versão ES6", async () => {
  const { Action } = await loadQ3();
  const a = new Action(1, "Mining", 50);
  eq(a.id, 1, "id");
  eq(a.description, "Mining", "description");
  eq(String(a), String(new RefAction(1, "Mining", 50)), "toString");
});
T(3, "xp validado (setter e construtor) como na versão ES6", async () => {
  const { Action } = await loadQ3();
  for (const v of [-5, "abc", "7", 30, undefined, NaN, 12.5]) {
    eq(new Action(1, "a", v).xp, new RefAction(1, "a", v).xp, `xp inicial ${fmt(v)}`);
    const a = new Action(1, "a", 10);
    const r = new RefAction(1, "a", 10);
    a.xp = v;
    r.xp = v;
    eq(a.xp, r.xp, `xp depois de atribuir ${fmt(v)}`);
  }
});
T(3, "TimedAction: seconds (por omissão 1) e toString", async () => {
  const { TimedAction } = await loadQ3();
  eq(String(new TimedAction(1, "Mining", 50, 3)), String(new RefTimed(1, "Mining", 50, 3)), "toString com 3 s");
  eq(String(new TimedAction(1, "Mining", 50)), String(new RefTimed(1, "Mining", 50)), "toString com seconds por omissão");
  eq(new TimedAction(1, "M", 5).seconds, 1, "seconds por omissão");
});
T(3, "cadeia de protótipos correta", async () => {
  const { Action, TimedAction, LegacyBase } = await loadQ3();
  const t = new TimedAction(1, "M", 5, 2);
  assert(t instanceof TimedAction && t instanceof Action && t instanceof LegacyBase, "instanceof (TimedAction → Action → BaseClass)");
  eq(Object.getPrototypeOf(TimedAction.prototype), Action.prototype, "protótipo de TimedAction.prototype");
  eq(Object.getPrototypeOf(Action.prototype), LegacyBase.prototype, "protótipo de Action.prototype");
  eq(TimedAction.prototype.constructor, TimedAction, "TimedAction.prototype.constructor");
  eq(Action.prototype.constructor, Action, "Action.prototype.constructor");
  eq(t.id, 1, "id (passou pela BaseClass)");
});

// ================= PERGUNTA 4 — funções =================
T(4, "totalXp soma o xp das skills recebidas", () => {
  need(typeof totalXp === "function", "totalXp não está definida");
  eq(totalXp({ xp: 10 }, { xp: 20 }, { xp: 5 }), 35, "soma");
  eq(totalXp(), 0, "totalXp() sem argumentos");
  eq(totalXp({ xp: 7 }), 7, "uma só skill");
  if (typeof Skill !== "undefined") eq(totalXp(new Skill(1, "a", 10), new Skill(2, "b", 15)), 25, "com objetos Skill");
});
T(4, "totalXp usa reduce", () => {
  assert(/\.reduce\s*\(/.test(totalXp.toString()), "O enunciado obriga a usar reduce");
});
T(4, "icon devolve o ícone certo", () => {
  need(typeof icon === "function", "icon não está definida");
  eq(noVS(icon("mining")), "⛏", "icon(mining)");
  eq(icon("woodcutting"), "🪓", "icon(woodcutting)");
  eq(icon("fishing"), "🎣", "icon(fishing)");
});
T(4, 'icon devolve "?" para nomes inválidos', () => {
  eq(icon("xyz"), "?", 'icon("xyz")');
  eq(icon(undefined), "?", "icon(undefined)");
  eq(icon(""), "?", 'icon("")');
});
T(4, "icon não usa if, switch nem operador ternário", () => {
  const src = stripStrings(stripComments(icon.toString())).replace(/\?\?|\?\./g, "");
  assert(!/\bif\b/.test(src), "Encontrei um if");
  assert(!/\bswitch\b/.test(src), "Encontrei um switch");
  assert(!/\?/.test(src), "Encontrei o operador ternário ?:");
});
T(4, 'icon("constructor") devolve "?" (cuidado com o protótipo dos objetos)', () => {
  eq(icon("constructor"), "?", 'icon("constructor")');
}, { bonus: true });

// ================= PERGUNTA 5 — tabela =================
const noHtml = (fn, label) => assert(!/innerHTML|outerHTML|insertAdjacentHTML/.test(fn.toString()), `${label} não pode usar innerHTML/outerHTML/insertAdjacentHTML`);
T(5, "Skill.tHead() devolve <thead> com uma linha e 3 <th>", () => {
  need(typeof Skill.tHead === "function", "Skill.tHead não está definido (método de classe)");
  const thead = Skill.tHead();
  eq(thead.tagName, "THEAD", "tagName");
  eq(thead.querySelectorAll("tr").length, 1, "número de <tr>");
  const ths = [...thead.querySelectorAll("th")].map(text);
  eq(ths.join("|"), "Skill|Nível|Progresso", "cabeçalhos");
});
T(5, "toTr() devolve <tr> com 3 células: descrição, nível, barra", () => {
  need(typeof Skill.prototype.toTr === "function", "Skill.prototype.toTr não está definido (método de instância)");
  const tr = new Skill(1, "Mining", 250).toTr();
  eq(tr.tagName, "TR", "tagName");
  eq(tr.cells.length, 3, "número de células");
  eq(text(tr.cells[0]), "Mining", "1.ª célula");
  eq(text(tr.cells[1]), "3", "2.ª célula (nível)");
});
T(5, "toTr(): <span class=\"bar\"> com width e texto iguais ao progresso", () => {
  const span = new Skill(1, "Mining", 250).toTr().cells[2].querySelector("span.bar");
  need(span, "Na 3.ª célula devia existir um <span class=\"bar\">");
  eq(span.style.width, "50%", "width da barra");
  eq(text(span), "50%", "texto da barra");
  const zero = new Skill(2, "Fishing", 300).toTr().cells[2].querySelector("span.bar");
  eq(zero.style.width, "0%", "width com progresso 0");
  eq(text(zero), "0%", "texto com progresso 0");
});
T(5, "Collection.prototype.toTable() devolve a tabela completa", () => {
  need(typeof Collection.prototype.toTable === "function", "Collection.prototype.toTable não está definido");
  const c = new Collection(Skill);
  c.add(new Skill(1, "Mining", 250)).add(new Skill(2, "Woodcutting", 40));
  const table = c.toTable();
  eq(table.tagName, "TABLE", "tagName");
  eq(table.querySelectorAll("thead").length, 1, "número de <thead>");
  eq(table.querySelectorAll("tbody").length, 1, "número de <tbody>");
  eq(table.querySelectorAll("tbody tr").length, 2, "linhas no <tbody>");
  eq(text(table.querySelector("tbody tr td")), "Mining", "1.ª célula da 1.ª linha");
});
T(5, "toTable é genérico: usa elementsClass.tHead() e elemento.toTr()", () => {
  class Foo {
    static tHead() { const t = document.createElement("thead"); t.dataset.foo = "1"; return t; }
    toTr() { return document.createElement("tr"); }
  }
  const c = new Collection(Foo);
  c.add(new Foo());
  const table = c.toTable();
  assert(table.querySelector("thead[data-foo='1']"), "O cabeçalho devia vir de this.elementsClass.tHead()");
  eq(table.querySelectorAll("tbody tr").length, 1, "linhas no <tbody>");
});
T(5, "sem innerHTML (só métodos de Node e Element)", () => {
  noHtml(Skill.tHead, "tHead");
  noHtml(Skill.prototype.toTr, "toTr");
  noHtml(Collection.prototype.toTable, "toTable");
});

// ================= PERGUNTA 6 — HTML =================
let q6doc;
const loadIndex = async () => (q6doc ??= new DOMParser().parseFromString(await getText("index.html"), "text/html"));
const clean = (s) => (s ?? "").replace(/\s+/g, "");
T(6, "existe um <form>", async () => {
  const doc = await loadIndex();
  need(doc.querySelector("form"), "Não encontrei nenhum <form> no index.html (a seguir ao comentário da Pergunta 6)");
});
T(6, "select#skill com as opções 1-Mining, 2-Woodcutting, 3-Fishing", async () => {
  const doc = await loadIndex();
  const sel = doc.querySelector("form select#skill");
  need(sel, "Falta um <select id=\"skill\"> dentro do form");
  const opts = [...sel.options].filter((o) => o.value !== "").map((o) => `${o.value}-${text(o)}`);
  eq(opts.join("|"), "1-Mining|2-Woodcutting|3-Fishing", "opções (value-texto)");
});
T(6, "input#quantity: numérico com mínimo 1", async () => {
  const doc = await loadIndex();
  const q = doc.querySelector("form input#quantity");
  need(q, "Falta um <input id=\"quantity\"> dentro do form");
  eq(q.getAttribute("type"), "number", "type");
  eq(q.getAttribute("min"), "1", "min");
});
T(6, "usa elementos label ligados com for", async () => {
  const doc = await loadIndex();
  need(doc.querySelector("label[for='skill']"), "Falta <label for=\"skill\">");
  need(doc.querySelector("label[for='quantity']"), "Falta <label for=\"quantity\">");
});
T(6, 'botão "Iniciar" executa Game.start()', async () => {
  const doc = await loadIndex();
  const btn = [...doc.querySelectorAll("form button, form input")].find((e) => /Game\.start\(\)/.test(clean(e.getAttribute("onclick"))));
  need(btn, "Não encontrei nenhum botão com onclick=\"Game.start()\"");
  eq(text(btn) || btn.getAttribute("value"), "Iniciar", "texto do botão");
  assert(btn.getAttribute("type") !== "submit", "Com submit a página recarregava: usa type=\"button\"");
});
T(6, 'botão "Limpar" é do tipo reset', async () => {
  const doc = await loadIndex();
  const btn = doc.querySelector("form [type='reset']");
  need(btn, "Não encontrei nenhum botão type=\"reset\" dentro do form");
  eq(text(btn) || btn.getAttribute("value"), "Limpar", "texto do botão");
});

// ================= PERGUNTA 7 — Game.start() =================
async function withGame(fn) {
  const box = document.createElement("div");
  box.innerHTML = `<form><select id="skill"><option value=""></option><option value="1">Mining</option><option value="2">Woodcutting</option><option value="3">Fishing</option></select><input id="quantity" type="number" min="1"></form><p id="message"></p><div id="skills"></div>`;
  document.body.append(box);
  const saved = { si: window.setInterval, ci: window.clearInterval, col: Collection.Skill };
  const timers = [];
  const cleared = [];
  window.setInterval = (f, ms) => { timers.push({ f, ms }); return 100 + timers.length; };
  window.clearInterval = (id) => { cleared.push(id); };
  Collection.Skill = new Collection(Skill);
  Collection.Skill.add(new Skill(1, "Mining", 80)).add(new Skill(2, "Woodcutting", 0)).add(new Skill(3, "Fishing", 40));
  const ctx = {
    timers,
    cleared,
    message: () => text(document.getElementById("message")),
    skills: () => Collection.Skill,
    set(skill, quantity) {
      document.getElementById("skill").value = skill;
      document.getElementById("quantity").value = quantity;
    },
    start() { Game.start(); },
    tick() { timers[timers.length - 1].f(); }
  };
  try {
    return await fn(ctx);
  } finally {
    try {
      for (let i = 0; i < 30 && timers.length && cleared.length < timers.length; i++) timers[timers.length - 1].f();
    } catch (e) { /* limpeza */ }
    window.setInterval = saved.si;
    window.clearInterval = saved.ci;
    Collection.Skill = saved.col;
    box.remove();
  }
}
T(7, 'sem skill válida ou sem quantidade escreve "Faltam dados!"', () => withGame((g) => {
  need(typeof Game !== "undefined" && typeof Game.start === "function", "Game.start não está definido");
  g.set("", "3"); g.start();
  eq(g.message(), "Faltam dados!", "sem skill");
  g.set("2", ""); g.start();
  eq(g.message(), "Faltam dados!", "sem quantidade");
  g.set("9", "3"); g.start();
  eq(g.message(), "Faltam dados!", "skill inexistente");
  eq(g.timers.length, 0, "Não devia ter criado nenhum temporizador");
}));
T(7, "inicia um temporizador com setInterval de 1 segundo", () => withGame((g) => {
  g.set("1", "3"); g.start();
  eq(g.timers.length, 1, "número de chamadas a setInterval");
  eq(g.timers[0].ms, 1000, "intervalo em ms");
}));
T(7, "cada segundo: +25 xp na skill escolhida e mensagem \"Ação n/total\"", () => withGame((g) => {
  g.set("1", "3"); g.start();
  g.tick();
  eq(g.skills().find(1).xp, 105, "xp do Mining ao fim de 1 tick");
  eq(g.message(), "Ação 1/3", "mensagem no 1.º tick");
  g.tick();
  eq(g.skills().find(1).xp, 130, "xp do Mining ao fim de 2 ticks");
  eq(g.message(), "Ação 2/3", "mensagem no 2.º tick");
  eq(g.skills().find(2).xp, 0, "xp do Woodcutting (não devia mudar)");
}));
T(7, "cada segundo: o <div id=\"skills\"> passa a ter a tabela atualizada", () => withGame((g) => {
  g.set("1", "3"); g.start();
  g.tick();
  const table = document.querySelector("#skills table");
  need(table, "Não encontrei nenhuma <table> dentro de #skills");
  eq(table.querySelectorAll("tbody tr").length, 3, "linhas da tabela");
  eq(text(table.querySelector("tbody tr").cells[1]), "2", "nível do Mining (105 xp)");
  g.tick();
  eq(document.querySelectorAll("#skills table").length, 1, "tabelas dentro de #skills (deves substituir, não acrescentar)");
}));
T(7, 'não permite duas ações ao mesmo tempo: "Ação em curso!"', () => withGame((g) => {
  g.set("1", "3"); g.start();
  g.tick();
  g.set("2", "2"); g.start();
  eq(g.message(), "Ação em curso!", "mensagem");
  eq(g.timers.length, 1, "não devia criar um segundo temporizador");
  eq(g.skills().find(2).xp, 0, "a segunda ação não devia ter começado");
}));
T(7, 'no fim: clearInterval e mensagem "Concluído!"', () => withGame((g) => {
  g.set("1", "2"); g.start();
  g.tick();
  eq(g.cleared.length, 0, "clearInterval antes do fim");
  g.tick();
  eq(g.cleared.length, 1, "chamadas a clearInterval no fim");
  eq(g.cleared[0], 101, "o id passado a clearInterval tem de ser o devolvido por setInterval");
  eq(g.message(), "Concluído!", "mensagem final");
  eq(g.skills().find(1).xp, 130, "xp final (80 + 2×25)");
}));
T(7, "depois de concluir, pode iniciar uma nova ação", () => withGame((g) => {
  g.set("1", "1"); g.start();
  g.tick();
  eq(g.message(), "Concluído!", "fim da 1.ª ação");
  g.start();
  eq(g.timers.length, 2, "devia ter criado um novo temporizador");
  assert(g.message() !== "Ação em curso!", "Depois de concluir, o estado 'em curso' tem de ser limpo");
}));

// ================= PERGUNTA 8 — fetch e XML =================
const fakeResponse = (data, ok = true) => ({ ok, status: ok ? 200 : 500, json: async () => data });
T(8, "Skill.fetchValues é async e pede data/skills.json", async () => {
  need(typeof Skill.fetchValues === "function", "Skill.fetchValues não está definido");
  assert(Skill.fetchValues.constructor.name === "AsyncFunction", "fetchValues tem de ser uma função async");
  const saved = window.fetch;
  let url;
  window.fetch = async (u) => { url = u; return fakeResponse([{ id: 1, description: "Mining", xp: 250 }, { id: 2, description: "Woodcutting", xp: 175 }]); };
  try {
    const r = await Skill.fetchValues();
    assert(/(^|\/)data\/skills\.json$/.test(String(url)), `URL pedido: ${url}`);
    assert(Array.isArray(r), "devia devolver um array");
    eq(r.length, 2, "número de skills");
    assert(r.every((s) => s instanceof Skill), "os elementos têm de ser objetos Skill (new Skill(...))");
    eq(r[0].description, "Mining", "description da 1.ª");
    eq(r[1].xp, 175, "xp da 2.ª");
    eq(r[1].id, 2, "id da 2.ª");
  } finally {
    window.fetch = saved;
  }
});
T(8, "em caso de erro (rede ou HTTP) devolve um array vazio", async () => {
  const saved = window.fetch;
  try {
    window.fetch = async () => { throw new Error("sem rede"); };
    let r = await Skill.fetchValues();
    assert(Array.isArray(r) && r.length === 0, "com falha de rede devia devolver []");
    window.fetch = async () => fakeResponse([], false);
    r = await Skill.fetchValues();
    assert(Array.isArray(r) && r.length === 0, "com response.ok = false devia devolver []");
  } finally {
    window.fetch = saved;
  }
});
T(8, "XML bem formado com o conteúdo de skills.json", async () => {
  const xml = await getText("src/q8b-skills.xml");
  const json = JSON.parse(await getText("data/skills.json"));
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  need(!doc.querySelector("parsererror"), "XML mal formado (ou ainda vazio). Lembra-te de que só pode haver um elemento raiz");
  const items = [...doc.documentElement.children];
  eq(items.length, json.length, "número de elementos dentro do elemento raiz");
  json.forEach((s, i) => {
    const el = items[i];
    for (const k of ["id", "description", "xp"]) {
      const child = [...el.children].find((c) => c.tagName === k);
      need(child, `Falta o elemento <${k}> na skill ${i + 1}`);
      eq(text(child), String(s[k]), `<${k}> da skill ${i + 1}`);
    }
  });
});
T(8, "o XML começa com a declaração <?xml ... ?>", async () => {
  assert(/^\s*<\?xml\s/.test(await getText("src/q8b-skills.xml")), "Falta a declaração XML no início");
}, { bonus: true });

// ================= execução e apresentação =================
(async function run() {
  const byQ = {};
  for (const t of queue) {
    let error = null;
    try {
      await t.fn();
    } catch (e) {
      error = e;
    }
    (byQ[t.q] ??= []).push({ ...t, error });
  }
  const out = document.getElementById("resultados");
  let ok = 0, total = 0, bOk = 0, bTotal = 0;
  for (const q of Object.keys(PONTOS)) {
    const list = byQ[q] ?? [];
    const main = list.filter((t) => !t.bonus);
    const passed = main.filter((t) => !t.error).length;
    ok += passed;
    total += main.length;
    list.filter((t) => t.bonus).forEach((t) => { bTotal++; if (!t.error) bOk++; });
    const h = document.createElement("h2");
    h.textContent = `Pergunta ${q} (${PONTOS[q]} val.) — ${TITULOS[q]}: ${passed}/${main.length}`;
    const ul = document.createElement("ul");
    for (const t of list) {
      const li = document.createElement("li");
      const mark = document.createElement("span");
      mark.className = t.error ? (t.bonus ? "bonus" : "ko") : "ok";
      mark.textContent = t.error ? "✗ " : "✓ ";
      li.append(mark, `${t.bonus ? "(bónus) " : ""}${t.name}`);
      if (t.error) {
        const e = document.createElement("span");
        e.className = "erro";
        e.textContent = `${t.error.name === "Error" ? "" : t.error.name + ": "}${t.error.message}`;
        li.append(e);
      }
      ul.append(li);
    }
    out.append(h, ul);
  }
  document.getElementById("resumo").textContent =
    `Testes passados: ${ok}/${total}` + (bTotal ? ` · bónus: ${bOk}/${bTotal}` : "");
  window.__testsDone = { ok, total, bOk, bTotal, byQ };
})();
