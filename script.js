// Load data from LocalStorage or use defaults
let residents = JSON.parse(localStorage.getItem('barangay_db')) || [
    {},
    {}
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderTable();
    updateDashboard();
});

// Navigation
function switchView(view) {
    document.getElementById('view-dashboard').classList.toggle('hidden', view !== 'dashboard');
    document.getElementById('view-records').classList.toggle('hidden', view !== 'records');
    document.getElementById('nav-dashboard').classList.toggle('active', view === 'dashboard');
    document.getElementById('nav-records').classList.toggle('active', view === 'records');
    lucide.createIcons();
}

// Modal handling
function openModal() { document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

// Save Data
document.getElementById('resident-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        id: `2026-${String(residents.length + 1).padStart(4, '0')}`,
        name: document.getElementById('form-name').value,
        gender: document.getElementById('form-gender').value,
        dob: document.getElementById('form-dob').value,
        status: document.getElementById('form-status').value,
        contact: document.getElementById('form-contact').value
    };

    residents.push(newEntry);
    localStorage.setItem('barangay_db', JSON.stringify(residents));
    
    renderTable();
    updateDashboard();
    closeModal();
    e.target.reset();
});

// Delete Resident
function deleteResident(id) {
    if(confirm('Are you sure you want to delete this record?')) {
        residents = residents.filter(r => r.id !== id);
        localStorage.setItem('barangay_db', JSON.stringify(residents));
        renderTable();
        updateDashboard();
    }
}

function renderTable() {
    const tbody = document.getElementById('resident-table-body');
    const countText = document.getElementById('record-count-subtitle');
    tbody.innerHTML = '';
    
    residents.forEach(res => {
        const initials = res.name.split(' ').map(n => n).join('').substring(0,2);
        const row = `
            <tr class="hover:bg-slate-50/50">
                <td class="id-link">#${res.id}</td>
                <td>
                    <div class="flex items-center gap-3">
                        <div class="avatar ${res.gender === 'Male' ? 'blue' : 'orange'}">${initials.toUpperCase()}</div>
                        <span class="font-semibold text-slate-700">${res.name}</span>
                    </div>
                </td>
                <td><span class="pill ${res.gender === 'Male' ? 'blue' : 'pink'}">${res.gender}</span></td>
                <td class="text-slate-500">${res.dob}</td>
                <td><span class="pill blue">${res.status}</span></td>
                <td class="text-slate-500">${res.contact}</td>
                <td>
                    <button onclick="deleteResident('${res.id}')" class="text-slate-400 hover:text-red-600 transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
    countText.innerText = `${residents.length} active members across 7 Puroks`;
    lucide.createIcons();
}

function updateDashboard() {
    const totalEl = document.getElementById('dash-total-residents');
    if(totalEl) totalEl.innerText = residents.length.toLocaleString();
}