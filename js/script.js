const elementoAno = document.querySelector("#ano-atual");

if (elementoAno) {
  elementoAno.textContent = new Date().getFullYear();
}
