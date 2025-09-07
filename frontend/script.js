// ================== ADMIN FETCH STUDENTS ==================
async function fetchStudents() {
    try {
        const res = await fetch("http://localhost:5000/api/students");
        const students = await res.json();
        populateTable(students);
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

// Populate table with all subjects
function populateTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No students found.</td></tr>';
        return;
    }

    tbody.innerHTML = students.map((s, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${s.name}</td>
          <td>${s.rollNumber}</td>
          <td>${s.dob}</td>
          <td>${s.marks?.maths || 0}</td>
          <td>${s.marks?.physics || 0}</td>
          <td>${s.marks?.chemistry || 0}</td>
          <td>${s.marks?.computer || 0}</td>
          <td>${s.marks?.english || 0}</td>
          <td>${s.total || 0}</td>  
        </tr>
      `).join('');
}

// ----- Sidebar + role redirects helpers -----
function setupSidebarLinks() {
    // Teacher Area
    document.getElementById('link-teacher')?.addEventListener('click', (e) => {
        e.preventDefault();
        const teacher = JSON.parse(sessionStorage.getItem('teacher'));
        if (teacher) {
            window.location.href = 'teacher_dashboard.html';
        } else {
            window.location.href = 'teacher_login.html';
        }
    });

    // Student Area
    document.getElementById('link-student')?.addEventListener('click', (e) => {
        e.preventDefault();
        const student = JSON.parse(sessionStorage.getItem('student'));
        if (student) {
            window.location.href = 'student_dashboard.html';
        } else {
            window.location.href = 'student_login.html';
        }
    });
}

// ================== Auth Guard (Global) ==================
function requireLogin(role) {
    const data = JSON.parse(sessionStorage.getItem(role));
    if (!data) {
        if (role === "admin") window.location.href = "admin_login.html";
        if (role === "teacher") window.location.href = "teacher_login.html";
        if (role === "student") window.location.href = "student_login.html";
        return null;
    }
    return data;
}

// ================= Logout Helper (Global) =================
function setupLogout(role) {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem(role);   // सिर्फ उसी role का session हटे
            window.location.href = "home.html"; // हमेशा landing page पर redirect
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const langToggle = document.getElementById("languageToggle");

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") body.classList.add("dark");

    // Apply saved language
    const savedLang = localStorage.getItem("lang") || "en";
    if (langToggle) langToggle.value = savedLang;

    // Handle theme toggle
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark");
            localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
        });
    }

    // Handle language toggle
    if (langToggle) {
        langToggle.addEventListener("change", (e) => {
            const lang = e.target.value;
            localStorage.setItem("lang", lang);
            setLanguage(lang);
        });
    }

    const translations = {
        en: {
            siteTitle: "📚 Student Result Management",
            title: "Student Login",
            rollno: "Roll Number",
            dob: "Date of Birth",
            login: "Login",
            studentInfo: "Student Information",
            nameLabel: "Name:",
            rollLabel: "Roll Number:",
            dobLabel: "Date of Birth:",
            marksTitle: "Subject-wise Marks",
            subject: "Subject",
            marksCol: "Marks",
            maxMarksCol: "Max Marks",
            teacherTitle: "Teacher Dashboard",
            teacherWelcome: "Welcome, Teacher!",
            viewStudents: "View All Students",
            updateMarks: "Add / Update Marks",
            teacherLoginTitle: "Teacher Login",
            teacherId: "Teacher ID",
            password: "Password",
            LoginBtn: "Login",
            site: "Admin Dashboard",
            heading: "📊 All Students",
            name: "Name",
            roll: "Roll No",
            dob: "DOB",
            subject: "Subject",
            marks: "Marks",
            maths: "Maths",
            physics: "Physics",
            chemistry: "Chemistry",
            english: "English",
            computer: "Computer",
            total: "Total",
            download: "⬇️ Download CSV",
            addStudent: "➕ Add Student",
            welcomeTitle: "Welcome",
            welcomeTagline: "Manage students, teachers, and results — all in one place",
            studentLoginBtn: "🎓 Student Login",
            teacherLoginBtn: "👨‍🏫 Teacher Login",
            adminLoginBtn: "⚙️ Admin Login"
        },
        hi: {
            siteTitle: "📚छात्र परिणाम प्रणाली",
            title: "छात्र लॉगिन",
            rollno: "रोल नंबर",
            dob: "जन्म तिथि",
            login: "लॉगिन करें",
            studentInfo: "छात्र जानकारी",
            nameLabel: "नाम:",
            rollLabel: "रोल नंबर:",
            dobLabel: "जन्म तिथि:",
            marksTitle: "विषयवार अंक",
            subject: "विषय",
            marksCol: "प्राप्त अंक",
            maxMarksCol: "अधिकतम अंक",
            teacherTitle: "अध्यापक डैशबोर्ड",
            teacherWelcome: "स्वागत है, अध्यापक!",
            viewStudents: "सभी छात्रों को देखें",
            updateMarks: "अंक जोड़ें / अपडेट करें",
            teacherLoginTitle: "शिक्षक लॉगिन",
            teacherId: "शिक्षक आईडी",
            password: "पासवर्ड",
            LoginBtn: "लॉगिन करें",
            site: "प्रशासक डैशबोर्ड",
            heading: "📊 सभी छात्र",
            name: "नाम",
            roll: "रोल नंबर",
            dob: "जन्म तिथि",
            subject: "विषय",
            marks: "अंक",
            maths: "गणित",
            physics: "भौतिकी",
            chemistry: "रसायन",
            english: "अंग्रेज़ी",
            computer: "कंप्यूटर",
            total: "कुल",
            download: "⬇️ CSV डाउनलोड करें",
            addStudent: "➕ छात्र जोड़ें",
            welcomeTitle: "स्वागत है",
            welcomeTagline: "छात्र, अध्यापक और परिणाम — सब कुछ एक ही जगह",
            studentLoginBtn: "🎓 छात्र लॉगिन",
            teacherLoginBtn: "👨‍🏫 अध्यापक लॉगिन",
            adminLoginBtn: "⚙️ प्रशासक लॉगिन"
        }
    };

    function setLanguage(lang) {
        const t = translations[lang];

        // Shared
        if (document.getElementById("siteTitle")) document.getElementById("siteTitle").innerText = t.siteTitle;

        // Login Page
        if (document.getElementById("titleText")) document.getElementById("titleText").innerText = t.title;
        if (document.getElementById("rollnoLabel")) document.getElementById("rollnoLabel").innerText = t.rollno;
        if (document.getElementById("dobLabel")) document.getElementById("dobLabel").innerText = t.dob;
        if (document.getElementById("loginBtn")) document.getElementById("loginBtn").innerText = t.login;

        // Marks Dashboard (student marks view)
        if (document.getElementById("studentInfoTitle")) document.getElementById("studentInfoTitle").innerText = t.studentInfo;
        if (document.getElementById("nameLabel")) document.getElementById("nameLabel").innerText = t.nameLabel;
        if (document.getElementById("rollLabel")) document.getElementById("rollLabel").innerText = t.rollLabel;
        if (document.getElementById("dobLabel")) document.getElementById("dobLabel").innerText = t.dobLabel;
        if (document.getElementById("marksTitle")) document.getElementById("marksTitle").innerText = t.marksTitle;
        if (document.getElementById("subjectCol")) document.getElementById("subjectCol").innerText = t.subject;
        if (document.getElementById("marksCol")) document.getElementById("marksCol").innerText = t.marksCol;
        if (document.getElementById("maxMarksCol")) document.getElementById("maxMarksCol").innerText = t.maxMarksCol;

        // Teacher dashboard elements
        if (document.getElementById('teacherTitle')) document.getElementById('teacherTitle').innerText = t.teacherTitle;
        if (document.getElementById('teacherWelcome')) document.getElementById('teacherWelcome').innerText = t.teacherWelcome;
        if (document.getElementById('viewStudents')) document.getElementById('viewStudents').innerText = t.viewStudents;
        if (document.getElementById('updateMarks')) document.getElementById('updateMarks').innerText = t.updateMarks;

        // Teacher Login
        if (document.getElementById("titleTextTeacher")) document.getElementById("titleTextTeacher").innerText = t.teacherLoginTitle;
        if (document.getElementById("teacherIdLabel")) document.getElementById("teacherIdLabel").innerText = t.teacherId;
        if (document.getElementById("passwordLabel")) document.getElementById("passwordLabel").innerText = t.password;
        if (document.getElementById("LoginBtn")) document.getElementById("LoginBtn").innerText = t.teacherLoginBtn;

        if (document.getElementById('site')) document.getElementById('site').innerText = t.site;
        if (document.getElementById('headingMain')) document.getElementById('headingMain').innerText = t.heading;
        if (document.getElementById('nameHeader')) document.getElementById('nameHeader').innerText = t.name;
        if (document.getElementById('rollHeader')) document.getElementById('rollHeader').innerText = t.roll;
        if (document.getElementById('dobHeader')) document.getElementById('dobHeader').innerText = t.dob;
        if (document.getElementById('subjectHeader')) document.getElementById('subjectHeader').innerText = t.subject;
        if (document.getElementById('marksHeader')) document.getElementById('marksHeader').innerText = t.marks;
        if (document.getElementById('mathsHeader')) document.getElementById('mathsHeader').innerText = t.maths;
        if (document.getElementById('physicsHeader')) document.getElementById('physicsHeader').innerText = t.physics;
        if (document.getElementById('chemistryHeader')) document.getElementById('chemistryHeader').innerText = t.chemistry;
        if (document.getElementById('englishHeader')) document.getElementById('englishHeader').innerText = t.english;
        if (document.getElementById('computerHeader')) document.getElementById('computerHeader').innerText = t.computer;
        if (document.getElementById('totalHeader')) document.getElementById('totalHeader').innerText = t.total;
        if (document.getElementById('downloadCSV')) document.getElementById('downloadCSV').innerText = t.download;
        if (document.getElementById('addStudentBtn')) document.getElementById('addStudentBtn').innerText = t.addStudent;

        if (document.getElementById("welcomeTitle")) document.getElementById("welcomeTitle").innerText = t.welcomeTitle;
        if (document.getElementById("welcomeTagline")) document.getElementById("welcomeTagline").innerText = t.welcomeTagline;
        if (document.getElementById("studentLoginBtn")) document.getElementById("studentLoginBtn").innerText = t.studentLoginBtn;
        if (document.getElementById("teacherLoginBtn")) document.getElementById("teacherLoginBtn").innerText = t.teacherLoginBtn;
        if (document.getElementById("adminLoginBtn")) document.getElementById("adminLoginBtn").innerText = t.adminLoginBtn;
    }
    setLanguage(savedLang);

    // ================== 👨‍🎓 Student Login Page ==================
    const studentLoginForm = document.getElementById("loginForm");
    if (studentLoginForm) {
        studentLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const rollno = document.getElementById("rollno").value.trim();
            const dob = document.getElementById("dob").value;

            if (!rollno || !dob) {
                document.getElementById("loginStatus").innerText = "⚠️ Please fill all fields.";
                return;
            }

            try {
                // 👉 Backend call (student verify)
                const res = await fetch("http://localhost:5000/api/students/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rollNumber: rollno, dob })
                });

                if (!res.ok) throw new Error("Invalid login");

                const data = await res.json();

                // Save student data in localStorage
                sessionStorage.setItem("student", JSON.stringify(data.student));

                window.location.href = "student_dashboard.html";
            } catch (err) {
                document.getElementById("loginStatus").innerText = "❌ Invalid Roll No or DOB.";
            }
        });
    }

    // ================== Student Dashboard ==================
    if (window.location.pathname.includes("student_dashboard.html")) {
        if (typeof requireLogin === "function") requireLogin("student");
        if (typeof setupLogout === "function") setupLogout("student");

        const student = JSON.parse(sessionStorage.getItem("student"));
        console.log("Student in session:", student);
        if (student) {
            // basic info
            document.getElementById("studentName").innerText = student.name;
            document.getElementById("studentRoll").innerText = student.rollNumber;
            document.getElementById("studentDOB").innerText = student.dob;

            // fresh fetch from backend (always updated marks)
            fetch(`http://localhost:5000/api/students/${encodeURIComponent(student.rollNumber)}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch student data");
                    return res.json();
                })
                .then(data => {
                    const marks = data.marks || {};
                    const tbody = document.getElementById("marksBody");
                    tbody.innerHTML = `
                <tr><td>Maths</td><td>${marks.maths || 0}</td><td>100</td></tr>
                <tr><td>Physics</td><td>${marks.physics || 0}</td><td>100</td></tr>
                <tr><td>Chemistry</td><td>${marks.chemistry || 0}</td><td>100</td></tr>
                <tr><td>Computer</td><td>${marks.computer || 0}</td><td>100</td></tr>
                <tr><td>English</td><td>${marks.english || 0}</td><td>100</td></tr>
                <tr class="table-active">
                  <td><strong>Total</strong></td>
                  <td><strong>${(marks.maths || 0) + (marks.physics || 0) + (marks.chemistry || 0) + (marks.computer || 0) + (marks.english || 0)}</strong></td>
                  <td><strong>500</strong></td>
                </tr>
              `;
                })
                .catch(err => {
                    console.error("❌ Error fetching marks:", err);
                    document.getElementById("marksBody").innerHTML =
                        `<tr><td colspan="3" class="text-danger">❌ Error loading marks</td></tr>`;
                });
        }
    }

    // 👨‍🏫 Teacher Login
    const teacherLoginForm = document.getElementById("teacherLoginForm");
    if (teacherLoginForm) {
        teacherLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const teacherId = document.getElementById("teacherId").value.trim();
            const password = document.getElementById("password").value;

            if (!teacherId || !password) {
                document.getElementById("loginStatus").innerText = "⚠️ Please fill all fields.";
                return;
            }

            try {
                // 👉 Backend call (teacher verify)
                const res = await fetch("http://localhost:5000/api/teachers/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teacherId, password })
                });

                if (!res.ok) throw new Error("Invalid login");

                const data = await res.json();

                // Save teacher data in localStorage
                sessionStorage.setItem("teacher", JSON.stringify(data.teacher));

                window.location.href = "teacher_dashboard.html";
            } catch (err) {
                document.getElementById("loginStatus").innerText = "❌ Invalid Teacher ID or Password.";
            }
        });
    }

    // ================== Admin Login ==================
    const adminLoginForm = document.getElementById("adminLoginForm");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;

            if (!username || !password) {
                document.getElementById("loginStatus").innerText = "⚠️ Please fill all fields.";
                return;
            }

            try {
                // 👉 Backend call (admin verify)
                const res = await fetch("http://localhost:5000/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                if (!res.ok) throw new Error("Invalid login");

                const data = await res.json();

                // Save admin data in localStorage
                sessionStorage.setItem("admin", JSON.stringify(data.admin));

                window.location.href = "admin_dashboard.html";
            } catch (err) {
                document.getElementById("loginStatus").innerText = "❌ Invalid Username or Password.";
            }
        });
    }
    // Admin dashboard
    if (window.location.pathname.includes("admin_dashboard.html")) {
        if (typeof requireLogin === "function") requireLogin("admin");
        if (typeof setupLogout === "function") setupLogout("admin");
        if (typeof fetchStudents === "function") fetchStudents();
    }

    // ================== ADD STUDENT ==================
    const studentForm = document.getElementById("studentForm");
    if (studentForm) {
        studentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const student = {
                name: document.getElementById("name").value,
                rollNumber: document.getElementById("roll").value,
                dob: document.getElementById("dobInput")?.value || "2000-01-01",
                marks: {
                    maths: Number(document.getElementById("maths").value) || 0,
                    physics: Number(document.getElementById("physics").value) || 0,
                    chemistry: Number(document.getElementById("chemistry").value) || 0,
                    english: Number(document.getElementById("english").value) || 0,
                    computer: Number(document.getElementById("computer").value) || 0,
                }
            };

            try {
                const res = await fetch("http://localhost:5000/api/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(student),
                });

                const data = await res.json();
                if (res.ok) {
                    alert("✅ Student added successfully!");
                    fetchStudents();
                    studentForm.reset();
                } else {
                    alert("❌ Failed: " + data.message);
                }
            } catch {
                alert("Server error while adding student.");
            }
        });
    }

    // Sidebar Toggle
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("hidden"); // Sidebar hide/show
        });
    }
    if (typeof setupSidebarLinks === "function") {
        setupSidebarLinks();
    }

});

document.getElementById("downloadCSV")?.addEventListener("click", () => {
    window.location.href = "http://localhost:5000/api/students/download/csv";
});

// ================== ADMIN: top Edit Panel (fetch/update/delete student) ==================
(function adminEditPanelInit() {
    if (!window.location.pathname.includes("admin_dashboard.html")) return;

    // Bind controls
    const rollInput = document.getElementById("admin-roll-input");
    const fetchBtn = document.getElementById("admin-fetch-student");
    const clearBtn = document.getElementById("admin-clear-panel");
    const fieldsWrap = document.getElementById("admin-edit-fields");
    const nameInput = document.getElementById("admin-edit-name");

    const mathsInput = document.getElementById("admin-edit-maths");
    const physicsInput = document.getElementById("admin-edit-physics");
    const chemistryInput = document.getElementById("admin-edit-chemistry");
    const englishInput = document.getElementById("admin-edit-english");
    const computerInput = document.getElementById("admin-edit-computer");

    const updateBtn = document.getElementById("admin-update-btn");
    const deleteBtn = document.getElementById("admin-delete-btn");

    const topStatus = document.getElementById("edit-status-top");
    const statusEl = document.getElementById("admin-edit-status");

    // helper to show/hide fields
    function clearPanel() {
        fieldsWrap.style.display = "none";
        rollInput.value = "";
        rollInput.readOnly = false;   // ✅ Clear करने पर फिर से editable
        nameInput.value = "";
        mathsInput.value = physicsInput.value = chemistryInput.value = englishInput.value = computerInput.value = "";
        statusEl.textContent = "";
        topStatus.textContent = "";
    }

    clearBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        clearPanel();
    });

    // Fetch student by roll
    fetchBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        const roll = (rollInput.value || "").trim();
        if (!roll) {
            topStatus.textContent = "⚠️ Enter roll number";
            return;
        }
        topStatus.textContent = "⏳ Fetching…";

        try {
            const res = await fetch(`http://localhost:5000/api/students/${encodeURIComponent(roll)}`);
            if (!res.ok) {
                const d = await res.json().catch(() => ({ message: "Not found" }));
                topStatus.textContent = "❌ " + (d.message || "Student not found");
                fieldsWrap.style.display = "none";
                return;
            }
            const student = await res.json();
            // ✅ Roll no को fix कर दो
            rollInput.value = student.rollNumber;
            rollInput.readOnly = true;
            // populate fields
            nameInput.value = student.name || "";
            mathsInput.value = student.marks?.maths ?? 0;
            physicsInput.value = student.marks?.physics ?? 0;
            chemistryInput.value = student.marks?.chemistry ?? 0;
            englishInput.value = student.marks?.english ?? 0;
            computerInput.value = student.marks?.computer ?? 0;

            fieldsWrap.style.display = "block";
            topStatus.textContent = `✳️ Loaded: ${student.name}`;
            statusEl.textContent = "";
        } catch (err) {
            console.error("Fetch student error:", err);
            topStatus.textContent = "❌ Server error";
        }
    });
    function resetEditModal() {
        rollInput.value = "";
        rollInput.readOnly = false;
        fieldsWrap.style.display = "none";
        topStatus.textContent = "";
        statusEl.textContent = "";

        [nameInput, mathsInput, physicsInput, chemistryInput, englishInput, computerInput]
            .forEach(el => el.value = "");
    }

    const editModal = document.getElementById("editStudentModal");
    if (editModal) {
        editModal.addEventListener("hidden.bs.modal", resetEditModal);
    }

    // Update student (name + marks)
    updateBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        statusEl.textContent = "";

        const roll = (rollInput.value || "").trim();
        if (!roll) { statusEl.textContent = "⚠️ Missing roll"; return; }

        const name = (nameInput.value || "").trim();
        const marks = {
            maths: Number(mathsInput.value) || 0,
            physics: Number(physicsInput.value) || 0,
            chemistry: Number(chemistryInput.value) || 0,
            english: Number(englishInput.value) || 0,
            computer: Number(computerInput.value) || 0
        };

        // Basic validation
        for (const [k, v] of Object.entries(marks)) {
            if (!v || isNaN(v) || v < 0 || v > 100) {
                statusEl.textContent = `⚠️ Invalid ${k} marks`;
                return;
            }
        }
        statusEl.textContent = "⏳ Updating…";

        try {
            const res = await fetch(`http://localhost:5000/api/students/${encodeURIComponent(roll)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, marks })
            });
            const data = await res.json();
            if (res.ok) {
                statusEl.textContent = "✅ " + (data.message || "Updated");
                // refresh table
                if (typeof fetchStudents === "function") fetchStudents();
            } else {
                statusEl.textContent = "❌ " + (data.message || "Failed to update");
            }
        } catch (err) {
            console.error("Update error:", err);
            statusEl.textContent = "❌ Server error";
        }
    });

    // Delete student
    deleteBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        const roll = (rollInput.value || "").trim();
        if (!roll) { statusEl.textContent = "⚠️ Missing roll"; return; }

        if (!confirm(`Delete student with roll ${roll}? This cannot be undone.`)) return;

        statusEl.textContent = "⏳ Deleting…";
        try {
            const res = await fetch(`http://localhost:5000/api/students/${encodeURIComponent(roll)}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                statusEl.textContent = "✅ Deleted";
                if (typeof fetchStudents === "function") fetchStudents();
                // clear panel after small delay
                setTimeout(clearPanel, 700);
            } else {
                statusEl.textContent = "❌ " + (data.message || "Delete failed");
            }
        } catch (err) {
            console.error("Delete error:", err);
            statusEl.textContent = "❌ Server error";
        }
    });

})();

// ================= TEACHER DASHBOARD LOGIC =================
(async function teacherDashboardInit() {
    if (!window.location.pathname.includes("teacher_dashboard.html")) return;
    if (typeof requireLogin === "function") requireLogin("teacher");
    if (typeof setupLogout === "function") setupLogout("teacher");
    // 1) Show subject badge
    const teacher = JSON.parse(sessionStorage.getItem("teacher"));

    const subjectBadge = document.getElementById("teacherSubjectBadge");
    if (subjectBadge) subjectBadge.textContent = teacher.subject.toUpperCase();

    // 2) Load all students (reuse populateTable from Admin)
    async function loadStudentsForTeacher() {
        try {
            const res = await fetch("http://localhost:5000/api/students");
            if (!res.ok) throw new Error("Failed to fetch students");
            const students = await res.json();
            populateTable(students); // वही function जो admin में है
        } catch (e) {
            console.error("❌ Error loading students:", e);
            const tbody = document.getElementById("studentTableBody");
            if (tbody) tbody.innerHTML = `<tr><td colspan="10" class="text-danger">❌ Server error</td></tr>`;
        }
    }
    await loadStudentsForTeacher();

    // 3) Update marks (only teacher's subject)
    const updateBtn = document.getElementById("td-update-btn");
    const rollInput = document.getElementById("td-roll");
    const marksInput = document.getElementById("td-marks");
    const statusEl = document.getElementById("td-status");

    if (updateBtn) {
        updateBtn.addEventListener("click", async () => {
            statusEl.textContent = "";

            const rollNumber = (rollInput.value || "").trim();
            const marks = Number(marksInput.value);

            if (!rollNumber) {
                statusEl.textContent = "⚠️ Please enter roll number.";
                return;
            }
            if (!marks || Number.isNaN(marks) || marks < 0 || marks > 100) {
                statusEl.textContent = "⚠️ Enter valid marks (0–100).";
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:5000/api/teachers/students/${encodeURIComponent(rollNumber)}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "x-teacher-id": teacher.teacherId
                        },
                        body: JSON.stringify({ marks })
                    }
                );

                const data = await res.json();
                if (res.ok) {
                    statusEl.textContent = "✅ " + data.message;
                    await loadStudentsForTeacher(); // reload table
                    marksInput.value = "";
                    rollInput.value = "";
                } else {
                    statusEl.textContent = "❌ " + (data.message || "Failed to update");
                }
            } catch (err) {
                console.error("❌ Error updating marks:", err);
                statusEl.textContent = "❌ Server error while updating marks.";
            }
        });

    }
})();
