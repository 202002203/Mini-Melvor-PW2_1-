// CÓDIGO FORNECIDO — NÃO ALTERAR.
// Método de classe (acrescentado à BaseClass) que devolve uma célula de cabeçalho.
BaseClass.toTh = function (text) {
  const th = document.createElement("th");
  th.textContent = text;
  return th;
};
