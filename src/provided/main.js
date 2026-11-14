// CÓDIGO FORNECIDO — NÃO ALTERAR.
// Arranque da aplicação: pede as skills ao servidor, guarda-as na coleção e mostra a tabela.
document.addEventListener("DOMContentLoaded", async () => {
  const message = document.getElementById("message");
  try {
    Collection.Skill.clear();
    (await Skill.fetchValues()).forEach((skill) => Collection.Skill.add(skill));
    document.getElementById("skills").replaceChildren(Collection.Skill.toTable());
    message.textContent = "Pronto! Escolhe uma ação.";
  } catch (error) {
    message.textContent = `Erro no arranque: ${error.message}`;
    console.error(error);
  }
});
