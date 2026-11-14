// REFERÊNCIA (pergunta 3) — NÃO é carregado pela aplicação.
// Versão ES6 das classes Action e TimedAction, que tens de reescrever em pré ES6.
class Action extends BaseClass {
  #xp;
  constructor(id, description, xp) {
    super(id, description);
    this.xp = xp;
  }
  get xp() {
    return this.#xp;
  }
  set xp(v) {
    this.#xp = Math.max(0, Number(v) || 0);
  }
  toString() {
    return `${this.description}: ${this.xp} xp`;
  }
}

class TimedAction extends Action {
  constructor(id, description, xp, seconds = 1) {
    super(id, description, xp);
    this.seconds = seconds;
  }
  toString() {
    return super.toString() + ` (${this.seconds}s)`;
  }
}
