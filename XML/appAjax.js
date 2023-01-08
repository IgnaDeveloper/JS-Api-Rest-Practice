// VARIABLES
const d = document,
  // -
  $title = d.querySelector(".crud-title");
($table = d.querySelector(".crud-table")),
  ($form = d.querySelector(".crud-form")),
  ($molde = d.getElementById("crud-template").content),
  ($fragment = d.createDocumentFragment());

// FUNCION AJAX
const ajax = (options) => {
  //
  let { url, method, success, error, data } = options;
  //
  const xhr = new XMLHttpRequest();
  //
  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      //
      success(json);
      //
    } else {
      let message = xhr.statusText || "Ocurrió un error";
      error(`Error ${xhr.status}: ${message}`);
    }
  });
  //
  xhr.open(method || "GET", url);
  //
  xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  //
  xhr.send(JSON.stringify(data));
};

// OBTENER TODOS LOS SANTOS
const getSantos = () => {
  ajax({
    method: "GET",
    url: "http://localhost:5000/santos",
    // EXITO
    success: (res) => {
      console.log(res);

      res.forEach((el) => {
        $molde.querySelector(".edit").dataset.id = el.id;
        $molde.querySelector(".edit").dataset.name = el.nombre;
        $molde.querySelector(".edit").dataset.constellation = el.constelacion;
        $molde.querySelector(".delete").dataset.id = el.id;
        $molde.querySelector(".delete").dataset.name = el.nombre;
        $molde.querySelector(".name").textContent = el.nombre;
        $molde.querySelector(".constellation").textContent = el.constelacion;

        let $clone = d.importNode($molde, true);
        $fragment.appendChild($clone);
      });

      $table.querySelector("tbody").appendChild($fragment);
    },
    error: (err) => {
      console.log(err);
      $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
    },
  });
};
// GET TODOS LOS SANTOS
d.addEventListener("DOMContentLoaded", getSantos);

d.addEventListener("submit", (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //POST CREATE
      ajax({
        url: "http://localhost:5000/santos",
        method: "POST",
        success: (res) => {
          location.reload();
        },
        error: (err) => {
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
        },
      });
    } else {
      //PUT UPDATE
      ajax({
        url: `http://localhost:5000/santos/${$form.id.value}`,
        method: "PUT",
        success: (res) => {
          location.reload();
        },
        error: (err) => {
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
        },
      });
    }
  }
});

d.addEventListener("click", (e) => {
  //PUT UPDATE
  if (e.target.matches(".edit")) {
    $title.innerText = "Editar Santo";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }
  //DELETE
  if (e.target.matches(".delete")) {
    let confirmDelete = confirm(
      `Estas seguro de querer eliminar el santo ${e.target.dataset.name}?`
    );
    if (confirmDelete) {
      ajax({
        url: `http://localhost:5000/santos/${e.target.dataset.id}`,
        method: "DELETE",
        success: (res) => {
          location.reload();
        },
        error: (err) => {
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
      });
    }
  }
});
