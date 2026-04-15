const STORAGE_KEY = "sistemaAcademicoData";

const defaultData = {
  counters: { carrera: 0, anio: 0, clase: 0, alumno: 0 },
  carreras: [],
  anios: [],
  clases: [],
  alumnos: [],
};

let data = loadData();

const $ = (id) => document.getElementById(id);

const views = {
  configBtn: $("btn-config"),
  mainBtn: $("btn-main"),
  configSection: $("config-section"),
  mainSection: $("main-section"),
};

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultData);

  try {
    return { ...structuredClone(defaultData), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function nextId(type) {
  data.counters[type] += 1;
  return `${type}-${data.counters[type]}`;
}

function switchPanel(panel) {
  const isConfig = panel === "config";
  views.configSection.classList.toggle("active", isConfig);
  views.mainSection.classList.toggle("active", !isConfig);
  views.configBtn.classList.toggle("active", isConfig);
  views.mainBtn.classList.toggle("active", !isConfig);
}

function setupNavigation() {
  views.configBtn.addEventListener("click", () => switchPanel("config"));
  views.mainBtn.addEventListener("click", () => switchPanel("main"));
}

function setupForms() {
  $("carrera-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("carrera-nombre").value.trim();
    const descripcion = $("carrera-descripcion").value.trim();
    if (!nombre || !descripcion) return;

    data.carreras.push({ id: nextId("carrera"), nombre, descripcion });
    e.target.reset();
    commitAndRender();
  });

  $("anio-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("anio-nombre").value.trim();
    if (!nombre) return;

    data.anios.push({ id: nextId("anio"), nombre, carreraId: null });
    e.target.reset();
    commitAndRender();
  });

  $("clase-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("clase-nombre").value.trim();
    const creditos = Number($("clase-creditos").value);
    if (!nombre || !creditos) return;

    data.clases.push({ id: nextId("clase"), nombre, creditos, anioId: null });
    e.target.reset();
    commitAndRender();
  });

  $("alumno-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("alumno-nombre").value.trim();
    const apellido = $("alumno-apellido").value.trim();
    const email = $("alumno-email").value.trim();
    const fechaNacimiento = $("alumno-fecha").value;

    if (!nombre || !apellido || !email || !fechaNacimiento) return;

    data.alumnos.push({
      id: nextId("alumno"),
      nombre,
      apellido,
      email,
      fechaNacimiento,
      anioId: null,
    });
    e.target.reset();
    commitAndRender();
  });

  $("asoc-carrera-anio-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const carreraId = $("asoc-carrera").value;
    const anioId = $("asoc-anio-carrera").value;

    const anio = data.anios.find((item) => item.id === anioId);
    if (!anio) return;

    anio.carreraId = carreraId;
    commitAndRender();
  });

  $("asoc-anio-clase-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const anioId = $("asoc-anio-clase").value;
    const claseId = $("asoc-clase").value;

    const clase = data.clases.find((item) => item.id === claseId);
    if (!clase) return;

    clase.anioId = anioId;
    commitAndRender();
  });

  $("asoc-alumno-anio-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const alumnoId = $("asoc-alumno").value;
    const anioId = $("asoc-anio-alumno").value;

    const alumno = data.alumnos.find((item) => item.id === alumnoId);
    if (!alumno) return;

    alumno.anioId = anioId;
    commitAndRender();
  });
}

function populateSelect(id, items, labelFn, placeholder) {
  const select = $(id);
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = labelFn(item);
    select.appendChild(option);
  });
}

function renderLists() {
  $("carreras-list").innerHTML = data.carreras
    .map((c) => `<li><strong>${c.nombre}</strong>: ${c.descripcion}</li>`)
    .join("");

  $("anios-list").innerHTML = data.anios
    .map((a) => `<li>${a.nombre}</li>`)
    .join("");

  $("clases-list").innerHTML = data.clases
    .map((c) => `<li>${c.nombre} (${c.creditos} créditos)</li>`)
    .join("");

  $("alumnos-list").innerHTML = data.alumnos
    .map((a) => `<li>${a.nombre} ${a.apellido} - ${a.email}</li>`)
    .join("");
}

function renderPrincipal() {
  populateSelect("asoc-carrera", data.carreras, (item) => item.nombre, "Seleccione carrera");
  populateSelect("asoc-anio-carrera", data.anios, (item) => item.nombre, "Seleccione año");

  populateSelect("asoc-anio-clase", data.anios, (item) => item.nombre, "Seleccione año");
  populateSelect("asoc-clase", data.clases, (item) => item.nombre, "Seleccione clase");

  populateSelect("asoc-alumno", data.alumnos, (item) => `${item.nombre} ${item.apellido}`, "Seleccione alumno");
  populateSelect("asoc-anio-alumno", data.anios, (item) => item.nombre, "Seleccione año");

  const body = $("resumen-body");
  body.innerHTML = data.alumnos
    .map((alumno) => {
      const anio = data.anios.find((item) => item.id === alumno.anioId);
      const carrera = anio ? data.carreras.find((item) => item.id === anio.carreraId) : null;

      return `<tr>
        <td>${alumno.nombre} ${alumno.apellido}</td>
        <td>${carrera?.nombre ?? "Sin asignar"}</td>
        <td>${anio?.nombre ?? "Sin asignar"}</td>
      </tr>`;
    })
    .join("");
}

function commitAndRender() {
  saveData();
  renderLists();
  renderPrincipal();
}

setupNavigation();
setupForms();
commitAndRender();
