// Data awal proyek portofolio. Data baru dikelola di array ini selama halaman terbuka.
let projects = [
  { id: 1, title: "Sistem Inventaris Jaya Mandiri Motor", category: "Web App", budget: 2500000, completed: true },
  { id: 2, title: "Aplikasi Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
  { id: 3, title: "Portofolio Pribadi SofwanDev", category: "Web App", budget: 1500000, completed: false }
];

const projectForm = document.querySelector("#projectForm");
const titleInput = document.querySelector("#projectTitle");
const categoryInput = document.querySelector("#projectCategory");
const budgetInput = document.querySelector("#projectBudget");
const completedInput = document.querySelector("#projectCompleted");
const searchInput = document.querySelector("#projectSearch");
const projectList = document.querySelector("#projectList");
const formMessage = document.querySelector("#formMessage");

const rupiah = (amount) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(amount);

function renderStats() {
  const completed = projects.filter(project => project.completed).length;
  const totalBudget = projects.reduce((total, project) => total + project.budget, 0);
  document.querySelector("#totalProjects").textContent = projects.length;
  document.querySelector("#completedProjects").textContent = completed;
  document.querySelector("#ongoingProjects").textContent = projects.length - completed;
  document.querySelector("#totalBudget").textContent = rupiah(totalBudget);
}

function renderProjects(query = "") {
  const keyword = query.trim().toLowerCase();
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(keyword)
  );

  projectList.replaceChildren();
  document.querySelector("#resultCount").textContent =
    `${filteredProjects.length} proyek`;

  document.querySelector("#emptyState").hidden = filteredProjects.length !== 0;

  filteredProjects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";

    const top = document.createElement("div");
    top.className = "project-card-top";
    const category = document.createElement("span");
    category.className = "category-pill";
    category.textContent = project.category;
    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = `#${String(project.id).slice(-4)}`;
    top.append(category, number);

    const title = document.createElement("h3");
    title.textContent = project.title;
    const budgetLabel = document.createElement("p");
    budgetLabel.className = "budget-label";
    budgetLabel.textContent = "ESTIMASI ANGGARAN";
    const budget = document.createElement("p");
    budget.className = "project-budget";
    budget.textContent = rupiah(project.budget);

    const status = document.createElement("span");
    status.className = `status-pill ${project.completed ? "is-complete" : "is-progress"}`;
    status.textContent = project.completed ? "✓ Selesai" : "◷ Dalam Pengerjaan";

    const actions = document.createElement("div");
    actions.className = "project-actions";
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "btn btn-small btn-outline";
    toggleButton.textContent = project.completed ? "Ubah ke Pengerjaan" : "Ubah Status";
    toggleButton.addEventListener("click", () => {
      projects = projects.map(item => item.id === project.id
        ? { ...item, completed: !item.completed }
        : item);
      renderAll();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-small btn-danger";
    deleteButton.textContent = "Hapus Proyek";
    deleteButton.addEventListener("click", () => {
      const confirmed = window.confirm(`Hapus proyek "${project.title}"?`);
      if (!confirmed) return;
      projects = projects.filter(item => item.id !== project.id);
      renderAll();
    });

    actions.append(toggleButton, deleteButton);
    card.append(top, title, budgetLabel, budget, status, actions);
    projectList.append(card);
  });
}

function renderAll() {
  renderStats();
  renderProjects(searchInput.value);
}

projectForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const budget = Number(budgetInput.value);

  if (!title) {
    formMessage.textContent = "Masukkan judul proyek terlebih dahulu.";
    formMessage.className = "form-message error";
    titleInput.focus();
    return;
  }
  if (!Number.isFinite(budget) || budget <= 0) {
    formMessage.textContent = "Anggaran harus berupa angka yang lebih besar dari 0.";
    formMessage.className = "form-message error";
    budgetInput.focus();
    return;
  }

  const newProject = {
    id: Date.now(),
    title,
    category: categoryInput.value,
    budget,
    completed: completedInput.checked
  };

  projects = [...projects, newProject];
  projectForm.reset();
  formMessage.textContent = "Proyek berhasil ditambahkan.";
  formMessage.className = "form-message success";
  renderAll();
});

searchInput.addEventListener("input", event => renderProjects(event.target.value));
renderAll();
