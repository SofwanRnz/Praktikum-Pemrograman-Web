// File: script.js

document.addEventListener("DOMContentLoaded", () => {

    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    // 2. Fungsi membaca dan menyimpan data LocalStorage
    const getTasks = () => {
        return JSON.parse(localStorage.getItem("todo_tasks")) || [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    // Fitur 1: Perbarui ringkasan jumlah tugas
    const updateCounter = (tasks) => {
        const total = tasks.length;
        const selesai = tasks.filter((task) => task.completed).length;
        const belumSelesai = total - selesai;

        taskCounter.textContent =
            `Total: ${total} Tugas | Selesai: ${selesai} | Belum Selesai: ${belumSelesai}`;

        // Tombol bersihkan hanya aktif jika ada tugas selesai
        clearCompletedBtn.disabled = selesai === 0;
    };

    // 3. Fungsi menampilkan daftar tugas
    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";
        updateCounter(tasks);

        if (tasks.length === 0) {
            todoList.innerHTML = `
                <li style="text-align: center; color: #64748b; font-size: 13px; padding: 10px;">
                    Belum ada tugas tersimpan.
                </li>
            `;
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            const taskText = document.createElement("span");
            taskText.className = "todo-text";
            taskText.textContent = task.text;

            const actions = document.createElement("div");
            actions.className = "todo-actions";

            const completeBtn = document.createElement("button");
            completeBtn.type = "button";
            completeBtn.className = "action-btn complete-btn";
            completeBtn.dataset.index = index;
            completeBtn.textContent = task.completed ? "Batal" : "Selesai";

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "action-btn delete-btn";
            deleteBtn.dataset.index = index;
            deleteBtn.textContent = "Hapus";

            actions.appendChild(completeBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(actions);

            todoList.appendChild(li);
        });
    };

    // 4. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();

        // Validasi input
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }

        // Hilangkan pesan error
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru
        const tasks = getTasks();

        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        taskInput.value = "";

        renderTasks();
    });

    // 5. Menangani tombol Selesai dan Hapus
    todoList.addEventListener("click", (e) => {
        const target = e.target;

        const index = target.dataset.index;

        if (index === undefined) {
            return;
        }

        const tasks = getTasks();
        const taskIndex = Number(index);

        if (target.classList.contains("complete-btn")) {

            // Mengubah status tugas
            tasks[taskIndex].completed = !tasks[taskIndex].completed;

            saveTasks(tasks);
            renderTasks();

        } else if (target.classList.contains("delete-btn")) {

            // Fitur 3: Konfirmasi sebelum menghapus tugas
            const yakin = confirm("Apakah Anda yakin ingin menghapus tugas ini?");

            if (!yakin) {
                return;
            }

            tasks.splice(taskIndex, 1);

            saveTasks(tasks);
            renderTasks();
        }
    });

    // Fitur 2: Hapus semua tugas yang sudah selesai
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        // Simpan hanya tugas yang belum selesai
        const remainingTasks = tasks.filter((task) => !task.completed);

        saveTasks(remainingTasks);
        renderTasks();
    });

    // 6. Render pertama kali saat halaman dimuat
    renderTasks();

});