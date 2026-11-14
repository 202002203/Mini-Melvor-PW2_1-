// CÓDIGO FORNECIDO — escrito "por outro programador". NÃO ALTERAR.
// Coleção genérica de objetos de uma mesma classe.
class Collection {
  // A coleção das skills é criada em bootstrap.js, depois de a classe Skill existir.
  static Skill = null;

  #elementsClass;
  #elements = [];

  constructor(elementsClass) {
    this.#elementsClass = elementsClass;
  }

  // Classe dos elementos da coleção (ex.: Skill)
  get elementsClass() {
    return this.#elementsClass;
  }

  get size() {
    return this.#elements.length;
  }

  add(element) {
    if (!(element instanceof this.#elementsClass)) {
      throw new Error(`Só pode adicionar ${this.#elementsClass.name}!`);
    }
    this.#elements.push(element);
    return this;
  }

  clear() {
    this.#elements.length = 0;
    return this;
  }

  // Recebe um id (número) e devolve o objeto respetivo, ou null.
  find(id) {
    return this.#elements.find((element) => element.id === id) ?? null;
  }

  forEach(callback) {
    this.#elements.forEach((element, index) => callback(element, index));
  }

  // Tal como nos arrays, devolve um array com os resultados.
  map(callback) {
    return this.#elements.map((element, index) => callback(element, index));
  }

  // Tal como nos arrays, devolve um array com os elementos que passam o teste.
  filter(callback) {
    return this.#elements.filter((element, index) => callback(element, index));
  }
}
