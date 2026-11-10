
/* =========================================================
   Admin Dashboard
   Plain JavaScript - No external libraries

   Sections:
   1. Data and storage
   2. Helper functions
   3. Table pages
   4. Dashboard
   5. Add and edit forms
   6. Page navigation
   7. Event listeners and start-up
   ========================================================= */


/* ---------------------------------------------------------
   1. DATA AND STORAGE
   --------------------------------------------------------- */

const STORE_KEY = "admin.dashboard.v1";

let db = loadDb();

function loadDb() {
    try {
        const saved = localStorage.getItem(STORE_KEY);

        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        // Storage may not be available.
    }

    return JSON.parse(JSON.stringify(DEFAULT_DB));
}

function saveDb() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(db));
    } catch (e) {
        // Ignore storage errors.
    }
}

function logActivity(text) {
    db.activity.unshift({
        text: text,
        time: new Date().toISOString()
    });

    db.activity = db.activity.slice(0, 8);
}

function nextId(list) {
    return list.reduce(function (m, r) {
        return Math.max(m, r.id);
    }, 0) + 1;
}

function lecturerName(id) {
    const lecturer = db.lecturers.filter(function (item) {
        return item.id === id;
    })[0];

    return lecturer ? lecturer.name : "Unassigned";
}


/* ---------------------------------------------------------
   2. HELPER FUNCTIONS
   --------------------------------------------------------- */

const view = document.getElementById("view");
const modal = document.getElementById("modal");

function esc(value) {
    // Escape special characters before inserting text into HTML.
    return String(value).replace(/[&<>"']/g, function (c) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c];
    });
}

function initials(name) {
    return name
        .replace(/^(Dr|Prof|Mr|Ms|Mrs)\.?\s+/i, "")
        .split(/\s+/)
        .slice(0, 2)
        .map(function (word) {
            return word[0];
        })
        .join("")
        .toUpperCase();
}

function ago(iso) {
    const mins = Math.round(
        (Date.now() - new Date(iso).getTime()) / 60000
    );

    if (mins < 1) {
        return "just now";
    }

    if (mins < 60) {
        return mins + " min ago";
    }

    if (mins < 60 * 24) {
        return Math.round(mins / 60) + " h ago";
    }

    return Math.round(mins / 1440) + " days ago";
}

let toastTimer;

function toast(message) {
    const t = document.getElementById("toast");

    t.textContent = message;
    t.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        t.classList.remove("show");
    }, 2200);
}

function badge(status) {
    const kind = status === "Active"
        ? "ok"
        : status === "Deferred"
            ? "warn"
            : "info";

    return '<span class="badge ' + kind + '">' +
        esc(status) +
        "</span>";
}

const ICON_SEARCH =
    '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 14 15.5l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>';

const ICON_PLUS =
    '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>';


/* ---------------------------------------------------------
   3. TABLE PAGES
   Students, lecturers and units share the same table code.
   --------------------------------------------------------- */

const ENTITIES = {

    students: {
        title: "Students",
        one: "student",

        columns: [
            {
                key: "name",
                label: "Student",
                render: function (r) {
                    return '<div class="person"><span class="avatar">' +
                        esc(initials(r.name)) +
                        "</span>" +
                        esc(r.name) +
                        "</div>";
                }
            },
            {
                key: "regNo",
                label: "Reg. number",
                render: function (r) {
                    return '<span class="mono">' +
                        esc(r.regNo) +
                        "</span>";
                }
            },
            { key: "programme", label: "Programme" },
            { key: "year", label: "Year" },
            {
                key: "status",
                label: "Status",
                render: function (r) {
                    return badge(r.status);
                }
            }
        ],

        fields: [
            { name: "name", label: "Full name", required: true },
            { name: "regNo", label: "Registration number", required: true },
            {
                name: "programme",
                label: "Programme",
                options: function () {
                    return PROGRAMMES;
                }
            },
            {
                name: "year",
                label: "Year of study",
                options: function () {
                    return ["1", "2", "3", "4"];
                },
                number: true
            },
            {
                name: "status",
                label: "Status",
                options: function () {
                    return STATUSES;
                }
            }
        ]
    },

    lecturers: {
        title: "Lecturers",
        one: "lecturer",

        columns: [
            {
                key: "name",
                label: "Lecturer",
                render: function (r) {
                    return '<div class="person"><span class="avatar">' +
                        esc(initials(r.name)) +
                        "</span>" +
                        esc(r.name) +
                        "</div>";
                }
            },
            { key: "department", label: "Department" },
            { key: "email", label: "Email" },
            {
                key: "units",
                label: "Units taught",
                value: function (r) {
                    return db.units.filter(function (u) {
                        return u.lecturerId === r.id;
                    }).length;
                }
            }
        ],

        fields: [
            { name: "name", label: "Full name", required: true },
            {
                name: "department",
                label: "Department",
                options: function () {
                    return DEPARTMENTS;
                }
            },
            {
                name: "email",
                label: "Email",
                type: "email",
                required: true
            }
        ]
    },

    units: {
        title: "Units",
        one: "unit",

        columns: [
            {
                key: "code",
                label: "Code",
                render: function (r) {
                    return "<strong>" + esc(r.code) + "</strong>";
                }
            },
            { key: "name", label: "Unit name" },
            { key: "department", label: "Department" },
            { key: "credits", label: "Credits" },
            {
                key: "lecturerId",
                label: "Lecturer",
                value: function (r) {
                    return lecturerName(r.lecturerId);
                }
            }
        ],

        fields: [
            { name: "code", label: "Unit code", required: true },
            { name: "name", label: "Unit name", required: true },
            {
                name: "department",
                label: "Department",
                options: function () {
                    return DEPARTMENTS;
                }
            },
            {
                name: "credits",
                label: "Credit hours",
                options: function () {
                    return ["1", "2", "3", "4", "6"];
                },
                number: true
            },
            {
                name: "lecturerId",
                label: "Lecturer",
                number: true,
                options: function () {
                    return [["0", "Unassigned"]].concat(
                        db.lecturers.map(function (l) {
                            return [String(l.id), l.name];
                        })
                    );
                }
            }
        ]
    }
};

// Keeps search text and sorting settings for each table.
const tableState = {};

function cellValue(col, row) {
    return col.value ? col.value(row) : row[col.key];
}

function visibleRows(name) {
    const cfg = ENTITIES[name];
    const st = tableState[name];
    const q = st.query.trim().toLowerCase();

    let rows = db[name].filter(function (r) {
        return !q || cfg.columns.some(function (c) {
            return String(cellValue(c, r)).toLowerCase().indexOf(q) > -1;
        });
    });

    const col = cfg.columns.filter(function (c) {
        return c.key === st.sortKey;
    })[0];

    if (col) {
        rows = rows.slice().sort(function (a, b) {
            const x = cellValue(col, a);
            const y = cellValue(col, b);

            const result =
                typeof x === "number" && typeof y === "number"
                    ? x - y
                    : String(x).localeCompare(String(y));

            return result * st.dir;
        });
    }

    return rows;
}

function rowsHtml(name) {
    const cfg = ENTITIES[name];
    const rows = visibleRows(name);

    if (!rows.length) {
        return '<tr><td class="empty" colspan="' +
            (cfg.columns.length + 1) +
            '">Nothing matches your search.</td></tr>';
    }

    return rows.map(function (r) {
        const cells = cfg.columns.map(function (c) {
            return "<td>" +
                (c.render ? c.render(r) : esc(cellValue(c, r))) +
                "</td>";
        }).join("");

        return "<tr>" + cells +
            '<td class="actions">' +
            '<button class="link-btn" data-act="edit" data-entity="' +
            name + '" data-id="' + r.id + '">Edit</button>' +
            '<button class="link-btn danger" data-act="delete" data-entity="' +
            name + '" data-id="' + r.id + '">Delete</button>' +
            "</td></tr>";
    }).join("");
}

function countText(name) {
    const shown = visibleRows(name).length;
    const total = db[name].length;

    return shown === total
        ? total + " " + ENTITIES[name].title.toLowerCase()
        : shown + " of " + total;
}

function renderTablePage(name) {
    const cfg = ENTITIES[name];

    if (!tableState[name]) {
        tableState[name] = {
            query: "",
            sortKey: "",
            dir: 1
        };
    }

    const st = tableState[name];

    const heads = cfg.columns.map(function (c) {
        const arrow = st.sortKey === c.key
            ? (st.dir === 1 ? " ▲" : " ▼")
            : "";

        return '<th><button data-act="sort" data-entity="' +
            name + '" data-key="' + c.key + '">' +
            esc(c.label) + arrow +
            "</button></th>";
    }).join("");

    return '<div class="page-head">' +
        '<div><h2>' + cfg.title + '</h2>' +
        '<p>Add, edit and remove ' + cfg.title.toLowerCase() + '.</p></div>' +
        '<button class="btn" data-act="add" data-entity="' + name + '">' +
        ICON_PLUS + "Add " + cfg.one + "</button></div>" +

        '<div class="card">' +
        '<div class="toolbar">' +
        '<label class="search">' + ICON_SEARCH +
        '<input type="search" data-search="' + name +
        '" placeholder="Search ' + cfg.title.toLowerCase() +
        '…" value="' + esc(st.query) +
        '" aria-label="Search ' + cfg.title.toLowerCase() + '"></label>' +
        '<span class="count" id="count">' + countText(name) + "</span>" +
        "</div>" +

        '<div class="table-wrap">' +
        "<table><thead><tr>" +
        heads +
        '<th class="actions"><span class="count">Actions</span></th>' +
        "</tr></thead><tbody id=\"rows\">" +
        rowsHtml(name) +
        "</tbody></table></div></div>";
}


/* ---------------------------------------------------------
   4. DASHBOARD
   Statistics and charts displayed on the overview page.
   --------------------------------------------------------- */

function barChart(items) {
    const W = 440;
    const H = 220;
    const left = 30;
    const right = 8;
    const top = 14;
    const bottom = 30;

    const max = Math.max(
        4,
        Math.ceil(
            Math.max.apply(null, items.map(function (i) {
                return i.value;
            })) / 2
        ) * 2
    );

    const innerW = W - left - right;
    const innerH = H - top - bottom;
    const slot = innerW / items.length;
    const bw = Math.min(54, slot * 0.55);

    let svg = '<svg class="chart" viewBox="0 0 ' +
        W + " " + H +
        '" role="img" aria-label="Students per year of study">';

    [0, max / 2, max].forEach(function (t) {
        const y = top + innerH - (t / max) * innerH;

        svg += '<line class="grid" x1="' + left +
            '" x2="' + (W - right) +
            '" y1="' + y + '" y2="' + y + '"/>' +
            '<text class="ax" x="' + (left - 6) +
            '" y="' + (y + 4) +
            '" text-anchor="end">' + t + "</text>";
    });

    items.forEach(function (it, i) {
        const h = (it.value / max) * innerH;
        const x = left + slot * i + (slot - bw) / 2;
        const y = top + innerH - h;

        svg += '<rect class="bar" x="' + x +
            '" y="' + y +
            '" width="' + bw +
            '" height="' + h +
            '" rx="6"/>' +

            '<text class="val" x="' + (x + bw / 2) +
            '" y="' + (y - 6) +
            '" text-anchor="middle">' + it.value + "</text>" +

            '<text class="ax" x="' + (x + bw / 2) +
            '" y="' + (H - 9) +
            '" text-anchor="middle">' + esc(it.label) + "</text>";
    });

    return svg + "</svg>";
}

function donutChart(items, total) {
    const r = 54;
    const c = 2 * Math.PI * r;

    let offset = 0;
    let segs = "";

    items.forEach(function (it) {
        const len = total ? (it.value / total) * c : 0;

        segs += '<circle class="seg" cx="75" cy="75" r="' +
            r + '" stroke="' + it.color +
            '" stroke-width="18" stroke-dasharray="' +
            len + " " + (c - len) +
            '" stroke-dashoffset="' + (-offset) +
            '" transform="rotate(-90 75 75)"/>';

        offset += len;
    });

    return '<svg class="donut" viewBox="0 0 150 150" role="img" aria-label="Students by status">' +
        '<circle class="track" cx="75" cy="75" r="' +
        r + '" stroke-width="18"/>' +
        segs +
        '<text class="big" x="75" y="77" text-anchor="middle">' +
        total + '</text>' +
        '<text class="small" x="75" y="95" text-anchor="middle">students</text>' +
        "</svg>";
}

function statCard(icon, cls, number, label) {
    return '<div class="card stat">' +
        '<span class="stat-icon ' + cls + '">' + icon + "</span>" +
        "<div>" +
        '<div class="num">' + number + "</div>" +
        '<div class="lbl">' + label + "</div>" +
        "</div></div>";
}

function renderDashboard() {
    const s = db.students;

    const active = s.filter(function (x) {
        return x.status === "Active";
    }).length;

    const byYear = [1, 2, 3, 4].map(function (y) {
        return {
            label: "Year " + y,
            value: s.filter(function (x) {
                return x.year === y;
            }).length
        };
    });

    const colors = {
        Active: "var(--accent)",
        Deferred: "var(--amber)",
        Graduated: "var(--green)"
    };

    const byStatus = STATUSES.map(function (st) {
        return {
            label: st,
            value: s.filter(function (x) {
                return x.status === st;
            }).length,
            color: colors[st]
        };
    });

    const load = db.lecturers.map(function (l) {
        return {
            name: l.name,
            n: db.units.filter(function (u) {
                return u.lecturerId === l.id;
            }).length
        };
    }).sort(function (a, b) {
        return b.n - a.n;
    });

    const maxLoad = Math.max(1, load[0] ? load[0].n : 1);

    const icons = {
        students: '<svg viewBox="0 0 24 24"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8z"/></svg>',

        lecturers: '<svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h7v-2.5a4.6 4.6 0 0 1 1.7-3.4A10 10 0 0 0 8 13zm8 0c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>',

        units: '<svg viewBox="0 0 24 24"><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4zm14 3h2v13a2 2 0 0 1-2 2v-2V7z"/></svg>',

        active: '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>'
    };

    return '<div class="page-head">' +
        '<div><h2>Overview</h2>' +
        '<p>A quick look at students, lecturers and units.</p></div>' +
        "</div>" +

        '<div class="stats">' +
        statCard(icons.students, "", s.length, "Students") +
        statCard(icons.lecturers, "amber", db.lecturers.length, "Lecturers") +
        statCard(icons.units, "rose", db.units.length, "Units") +
        statCard(icons.active, "green", active, "Active students") +
        "</div>" +

        '<div class="grid-2">' +
        '<div class="card card-pad">' +
        '<h3>Students per year</h3>' +
        '<p class="sub">Number of students in each year of study</p>' +
        barChart(byYear) +
        "</div>" +

        '<div class="card card-pad">' +
        '<h3>Student status</h3>' +
        '<p class="sub">Active, deferred and graduated</p>' +
        '<div class="donut-wrap">' +
        donutChart(byStatus, s.length) +

        '<ul class="legend">' +
        byStatus.map(function (b) {
            return '<li><i style="background:' + b.color +
                '"></i>' + b.label + "<b>" + b.value + "</b></li>";
        }).join("") +
        "</ul></div></div></div>" +

        '<div class="grid-2 even">' +
        '<div class="card card-pad">' +
        '<h3>Lecturer workload</h3>' +
        '<p class="sub">Units assigned to each lecturer</p>' +
        '<ul class="load">' +

        load.map(function (l) {
            return '<li><div class="row"><span>' +
                esc(l.name) + "</span><span>" +
                l.n + (l.n === 1 ? " unit" : " units") +
                '</span></div><div class="meter"><i style="width:' +
                (l.n / maxLoad) * 100 +
                '%"></i></div></li>';
        }).join("") +

        "</ul></div>" +

        '<div class="card card-pad">' +
        '<h3>Recent activity</h3>' +
        '<p class="sub">Latest changes made in this panel</p>' +
        '<ul class="feed">' +

        (db.activity.length
            ? db.activity.map(function (a) {
                return "<li><div>" + esc(a.text) +
                    "<small>" + ago(a.time) + "</small></div></li>";
            }).join("")
            : '<li><div>No activity yet.</div></li>') +

        "</ul></div></div>";
}


/* ---------------------------------------------------------
   5. FORMS
   Add and edit students, lecturers and units.
   --------------------------------------------------------- */

function openForm(name, id) {
    const cfg = ENTITIES[name];

    const row = id
        ? db[name].filter(function (r) {
            return r.id === id;
        })[0]
        : null;

    const inputs = cfg.fields.map(function (f) {
        const value = row
            ? String(row[f.name] === null ? 0 : row[f.name])
            : "";

        let control;

        if (f.options) {
            control = '<select id="f_' + f.name +
                '" name="' + f.name + '">' +

                f.options().map(function (o) {
                    const v = Array.isArray(o) ? o[0] : o;
                    const label = Array.isArray(o) ? o[1] : o;

                    return '<option value="' + esc(v) + '"' +
                        (v === value ? " selected" : "") +
                        ">" + esc(label) + "</option>";
                }).join("") +

                "</select>";
        } else {
            control = '<input id="f_' + f.name +
                '" name="' + f.name +
                '" type="' + (f.type || "text") +
                '" value="' + esc(value) + '"' +
                (f.required ? " required" : "") +
                ' autocomplete="off">';
        }

        return '<div class="field">' +
            '<label for="f_' + f.name + '">' + f.label + "</label>" +
            control +
            "</div>";
    }).join("");

    modal.innerHTML =
        '<form id="form">' +
        '<h3>' + (row ? "Edit " : "Add ") + cfg.one + "</h3>" +
        inputs +

        '<div class="form-actions">' +
        '<button type="button" class="btn ghost" data-act="close">Cancel</button>' +
        '<button type="submit" class="btn">Save</button>' +
        "</div></form>";

    modal.showModal();

    const first = modal.querySelector("input,select");

    if (first) {
        first.focus();
    }

    document.getElementById("form").addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {};

        cfg.fields.forEach(function (f) {
            let v = document.getElementById("f_" + f.name).value.trim();

            if (f.number) {
                v = Number(v);
            }

            if (f.name === "lecturerId" && v === 0) {
                v = null;
            }

            data[f.name] = v;
        });

        if (row) {
            Object.assign(row, data);

            logActivity(
                cfg.title.slice(0, -1) + " " +
                (data.name || data.code) +
                " was updated"
            );

            toast("Changes saved");
        } else {
            data.id = nextId(db[name]);
            db[name].push(data);

            logActivity(
                "New " + cfg.one + " " +
                (data.name || data.code) +
                " was added"
            );

            toast(
                cfg.one[0].toUpperCase() +
                cfg.one.slice(1) + " added"
            );
        }

        saveDb();
        modal.close();
        route();
    });
}

function deleteRow(name, id) {
    const cfg = ENTITIES[name];

    const row = db[name].filter(function (r) {
        return r.id === id;
    })[0];

    if (!row || !window.confirm(
        "Delete " + (row.name || row.code) +
        "? This cannot be undone."
    )) {
        return;
    }

    db[name] = db[name].filter(function (r) {
        return r.id !== id;
    });

    if (name === "lecturers") {
        db.units.forEach(function (u) {
            if (u.lecturerId === id) {
                u.lecturerId = null;
            }
        });
    }

    logActivity(
        cfg.one[0].toUpperCase() +
        cfg.one.slice(1) + " " +
        (row.name || row.code) +
        " was deleted"
    );

    saveDb();
    toast("Deleted");
    route();
}


/* ---------------------------------------------------------
   6. PAGE NAVIGATION
   --------------------------------------------------------- */

const PAGES = {
    dashboard: {
        title: "Dashboard",
        render: renderDashboard
    },

    students: {
        title: "Students",
        render: function () {
            return renderTablePage("students");
        }
    },

    lecturers: {
        title: "Lecturers",
        render: function () {
            return renderTablePage("lecturers");
        }
    },

    units: {
        title: "Units",
        render: function () {
            return renderTablePage("units");
        }
    }
};

function route() {
    const key = location.hash.slice(1);
    const page = PAGES[key] ? key : "dashboard";

    view.innerHTML = PAGES[page].render();

    document.getElementById("pageTitle").textContent = PAGES[page].title;

    document.title = PAGES[page].title + " · Admin Dashboard";

    document.querySelectorAll(".nav a").forEach(function (a) {
        a.classList.toggle("active", a.dataset.page === page);
    });

    document.querySelector(".app").classList.remove("open");
}


/* ---------------------------------------------------------
   7. EVENT LISTENERS AND START-UP
   --------------------------------------------------------- */

// Handle buttons inside the main content.
view.addEventListener("click", function (e) {
    const b = e.target.closest("[data-act]");

    if (!b) {
        return;
    }

    const name = b.dataset.entity;
    const act = b.dataset.act;

    if (act === "add") {
        openForm(name);
    }

    if (act === "edit") {
        openForm(name, Number(b.dataset.id));
    }

    if (act === "delete") {
        deleteRow(name, Number(b.dataset.id));
    }

    if (act === "sort") {
        const st = tableState[name];

        if (st.sortKey === b.dataset.key) {
            st.dir = -st.dir;
        } else {
            st.sortKey = b.dataset.key;
            st.dir = 1;
        }

        route();
    }
});


// Update the table as the user types in the search box.
view.addEventListener("input", function (e) {
    const name = e.target.dataset.search;

    if (!name) {
        return;
    }

    tableState[name].query = e.target.value;

    document.getElementById("rows").innerHTML = rowsHtml(name);
    document.getElementById("count").textContent = countText(name);
});


// Close the modal when clicking outside it or pressing Cancel.
modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest('[data-act="close"]')) {
        modal.close();
    }
});


// Open the mobile navigation menu.
document.getElementById("menuBtn").addEventListener("click", function () {
    document.querySelector(".app").classList.add("open");
});


// Close the mobile navigation menu.
document.getElementById("scrim").addEventListener("click", function () {
    document.querySelector(".app").classList.remove("open");
});


// Switch between light and dark themes.
document.getElementById("themeBtn").addEventListener("click", function () {
    const root = document.documentElement;

    const dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;

    root.dataset.theme = dark ? "light" : "dark";

    try {
        localStorage.setItem("admin.theme", root.dataset.theme);
    } catch (e) {
        // Ignore storage errors.
    }
});


// Restore the sample data when Reset Data is clicked.
document.getElementById("resetBtn").addEventListener("click", function () {
    if (!window.confirm("Reset all data back to the sample data?")) {
        return;
    }

    db = JSON.parse(JSON.stringify(DEFAULT_DB));

    saveDb();
    route();
    toast("Sample data restored");
});


// Load the saved theme when the page opens.
try {
    const t = localStorage.getItem("admin.theme");

    if (t) {
        document.documentElement.dataset.theme = t;
    }
} catch (e) {
    // Ignore storage errors.
}


// Listen for page changes and load the dashboard.
window.addEventListener("hashchange", route);

route();
