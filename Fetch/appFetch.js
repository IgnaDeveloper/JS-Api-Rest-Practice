const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const getData = async () => {
  try {
    let res = await fetch("http://localhost:5000/santos"),
      json = await res.json();

    json.forEach((el) => {
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.constellation = el.constelacion;
      $template.querySelector(".delete").dataset.id = el.id;
      $template.querySelector(".delete").dataset.name = el.nombre;
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".constellation").textContent = el.constelacion;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    //
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentHTML(
      "afterend",
      `<p> <b>${err.status}: ${message}</b></p> `
    );
  }
};

d.addEventListener("DOMContentLoaded", getData);

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //POST CREATE
      try {
        let options = {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value,
          }),
        };
        let res = await fetch("http://localhost:5000/santos", options),
          json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
        //
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML(
          "afterend",
          `<p> <b>${err.status}: ${message}</b></p> `
        );
      }
    } else {
      //PUT UPDATE
      try {
        let options = {
          method: "PUT",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value,
          }),
        };
        let res = await fetch(
            `http://localhost:5000/santos/${$form.id.value}`,
            options
          ),
          json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
        //
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML(
          "afterend",
          `<p> <b>${err.status}: ${message}</b></p> `
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.innerText = "Editar Santo";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }
  if (e.target.matches(".delete")) {
    let confirmDelete = confirm(
      `Estas seguro de querer eliminar el santo ${e.target.dataset.name}?`
    );
    if (confirmDelete) {
      try {
        let options = {
          method: "DELETE",
          headers: { "Content-Type": "application/json; charset=utf-8" },
        };
        let res = await fetch(
            `http://localhost:5000/santos/${e.target.dataset.id}`,
            options
          ),
          json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
        //
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML(
          "afterend",
          `<p> <b>${err.status}: ${message}</b></p> `
        );
      }
    }
  }
});
