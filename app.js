// ==============================================================
// শিক্ষানোভা (SikkhaNova) - Standalone Core Engine & Local Database
// Website: sikkhanova.com | YouTube: @ShikkhaNova | Facebook: @ShikkhaNova
// Master Admin: robiulnil101@gmail.com | Password: RABIUL@20
// ==============================================================

// Initial Mock Students for Classes 5 to 10
const INITIAL_STUDENTS = {
  5: generateStudents(5, 20),
  6: generateStudents(6, 20),
  7: generateStudents(7, 20),
  8: generateStudents(8, 20),
  9: generateStudents(9, 20),
  10: generateStudents(10, 20),
};

function generateStudents(grade, count) {
  const names = [
    'রাকিবুল হাসান', 'সাদিয়া সুলতানা', 'আরিফুল ইসলাম', 'তানজিলা আক্তার',
    'মাহমুদুল করিম', 'ফারহানা ইয়াসমিন', 'নাজমুল হুদা', 'সুমাইয়া জাহান',
    'জাহিদ হাসান', 'ফাতেমা তুজ জোহরা', 'হাসিবুর রহমান', 'নুসরাত জাহান',
    'ইমরান হোসেন', 'রুমানা আফরোজ', 'মেহেদী হাসান', 'জান্নাতুল ফেরদৌস',
    'শাকিল আহমেদ', 'তাসনিম আক্তার', 'রায়হান কবীর', 'আয়েশা সিদ্দিকা'
  ];
  return Array.from({ length: count }, (_, i) => ({
    roll: i + 1,
    name: names[i % names.length],
    class: grade,
    phone: `0171${Math.floor(1000000 + Math.random() * 9000000)}`,
  }));
}

// Initial PDF Handnotes Catalog
const PDF_CATALOG = [
  {
    id: 'pdf-1',
    title: '৭ম শ্রেণি সাধারণ গণিত ১ম সাময়িক স্পেশাল হ্যান্ডনোট ও সূত্রাবলি',
    description: 'বীজগণিতীয় রাশি, জ্যামিতির মৌলিক নিয়মাবলি ও ১০০% কমন উপযোগী সৃজনশীল সমাধান।',
    classGrade: 7,
    subject: 'গণিত (Mathematics)',
    price: 50,
    fileUrl: 'assets/pdfs/class-7-math-special.pdf',
  },
  {
    id: 'pdf-2',
    title: '৮ম শ্রেণি সাধারণ বিজ্ঞান ফাইনাল মডেল টেস্ট ও এক্সক্লুসিভ সাজেশন',
    description: 'পদার্থের প্রকৃতি, জীব ও পরিবেশ অধ্যায়ের পূর্ণাঙ্গ ব্যাখ্যাসহ সৃজনশীল প্রশ্নব্যাংক।',
    classGrade: 8,
    subject: 'বিজ্ঞান (Science)',
    price: 60,
    fileUrl: 'assets/pdfs/class-8-science.pdf',
  },
  {
    id: 'pdf-3',
    title: '৯ম-১০ম শ্রেণি পদার্থবিজ্ঞান গাণিতিক সমস্যার শর্টকাট কৌশল ও সমাধান',
    description: 'গতি ও বল অধ্যায়ের সকল গাণিতিক সূত্র, গ্রাফ বিশ্লেষণ ও প্র্যাকটিস শিট।',
    classGrade: 9,
    subject: 'পদার্থবিজ্ঞান (Physics)',
    price: 80,
    fileUrl: 'assets/pdfs/class-9-physics.pdf',
  },
  {
    id: 'pdf-4',
    title: '১০ম শ্রেণি এসএসসি ইংরেজি ২য় পত্র গ্রামার ও রাইটিং পার্ট স্পেশাল শিট',
    description: 'Right form of verbs, Tag questions, Completing Sentences ও প্যারাগ্রাফ সাজেশন।',
    classGrade: 10,
    subject: 'ইংরেজি (English)',
    price: 100,
    fileUrl: 'assets/pdfs/class-10-english.pdf',
  },
  {
    id: 'pdf-5',
    title: '৫ম শ্রেণি প্রাথমিক গণিত ভগ্নাংশ, দশমিক ও পরিমাপ সহজ হ্যান্ডনোট',
    description: 'প্রাথমিক শিক্ষার্থীদের জন্য সহজ নিয়মে সমাধান ও রঙিন ছবিযুক্ত শিট।',
    classGrade: 5,
    subject: 'গণিত (Mathematics)',
    price: 40,
    fileUrl: 'assets/pdfs/class-5-math.pdf',
  },
  {
    id: 'pdf-6',
    title: '৬ষ্ঠ শ্রেণি তথ্য ও যোগাযোগ প্রযুক্তি (ICT) সম্পূর্ণ প্রশ্নব্যাংক',
    description: 'আইসিটি ১ম থেকে ৫ম অধ্যায়ের সংক্ষিপ্ত, নৈর্ব্যক্তিক ও বর্ণনামূলক প্রশ্নোত্তর।',
    classGrade: 6,
    subject: 'আইসিটি (ICT)',
    price: 40,
    fileUrl: 'assets/pdfs/class-6-ict.pdf',
  },
];

// App State
let currentTab = 'home';
let currentAttendanceClass = 7;
let attendanceRecords = {};
let currentPdfToBuy = null;
let selectedPaymentMethod = 'BKASH';

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set today's date in attendance input
  const dateInput = document.getElementById('attendanceDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Load saved attendance from localStorage
  const savedAtt = localStorage.getItem('sikkhanova_attendance');
  if (savedAtt) {
    try {
      attendanceRecords = JSON.parse(savedAtt);
    } catch (e) {
      attendanceRecords = {};
    }
  }

  // Render initial attendance table
  renderAttendanceList();
  renderPdfsList('all');
});

// Tab Switcher
function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.tab-pane').forEach((el) => el.classList.add('hidden'));

  const activePane = document.getElementById(`tab-${tabName}`);
  if (activePane) {
    activePane.classList.remove('hidden');
  }

  // Update navigation styling
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach((btn) => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('text-brand-700', 'bg-brand-50');
      btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
    } else {
      btn.classList.remove('text-brand-700', 'bg-brand-50');
      btn.classList.add('text-slate-600');
    }
  });

  // Re-create icons if tab changed
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Attendance Logic
function selectClassForAttendance(grade) {
  currentAttendanceClass = grade;
  const selectEl = document.getElementById('attendanceClassSelect');
  if (selectEl) selectEl.value = grade;
  switchTab('attendance');
  renderAttendanceList();
}

function renderAttendanceList() {
  const classSelect = document.getElementById('attendanceClassSelect');
  if (classSelect) {
    currentAttendanceClass = parseInt(classSelect.value);
  }

  const dateInput = document.getElementById('attendanceDate');
  const dateKey = `${currentAttendanceClass}_${dateInput ? dateInput.value : 'today'}`;

  let currentList = attendanceRecords[dateKey];
  if (!currentList) {
    const students = INITIAL_STUDENTS[currentAttendanceClass] || [];
    currentList = students.map((s) => ({
      roll: s.roll,
      name: s.name,
      class: s.class,
      phone: s.phone,
      status: 'PRESENT',
    }));
    attendanceRecords[dateKey] = currentList;
  }

  populateAttendanceTable(currentList);
}

function populateAttendanceTable(list) {
  const tbody = document.getElementById('attendanceTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  let presentCount = 0;
  let absentCount = 0;

  list.forEach((st) => {
    if (st.status === 'PRESENT') presentCount++;
    if (st.status === 'ABSENT') absentCount++;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

    tr.innerHTML = `
      <td class="py-3.5 px-4 text-center font-black text-brand-700">
        <span class="inline-block w-8 h-8 rounded-lg bg-brand-50 leading-8">${st.roll}</span>
      </td>
      <td class="py-3.5 px-4 font-bold text-slate-800">${st.name}</td>
      <td class="py-3.5 px-4 text-slate-500 font-medium">Class ${st.class}</td>
      <td class="py-3.5 px-4 text-slate-500 font-mono text-xs">${st.phone}</td>
      <td class="py-3.5 px-4 text-center">
        <div class="inline-flex items-center gap-1.5">
          <button onclick="setStudentStatus(${st.roll}, 'PRESENT')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            st.status === 'PRESENT'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
          }">Present</button>
          <button onclick="setStudentStatus(${st.roll}, 'ABSENT')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            st.status === 'ABSENT'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
          }">Absent</button>
          <button onclick="setStudentStatus(${st.roll}, 'LATE')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            st.status === 'LATE'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
          }">Late</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Update statistics
  const totalEl = document.getElementById('statTotalStudents');
  const presEl = document.getElementById('statPresentStudents');
  const absEl = document.getElementById('statAbsentStudents');

  if (totalEl) totalEl.textContent = list.length;
  if (presEl) presEl.textContent = presentCount;
  if (absEl) absEl.textContent = absentCount;
}

function setStudentStatus(roll, status) {
  const dateInput = document.getElementById('attendanceDate');
  const dateKey = `${currentAttendanceClass}_${dateInput ? dateInput.value : 'today'}`;
  const list = attendanceRecords[dateKey];
  if (list) {
    const student = list.find((s) => s.roll === roll);
    if (student) {
      student.status = status;
      populateAttendanceTable(list);
    }
  }
}

function markAllAttendance(status) {
  const dateInput = document.getElementById('attendanceDate');
  const dateKey = `${currentAttendanceClass}_${dateInput ? dateInput.value : 'today'}`;
  const list = attendanceRecords[dateKey];
  if (list) {
    list.forEach((s) => (s.status = status));
    populateAttendanceTable(list);
    showToast(`সকল শিক্ষার্থীকে ${status} করা হয়েছে!`);
  }
}

function saveAttendanceData() {
  localStorage.setItem('sikkhanova_attendance', JSON.stringify(attendanceRecords));
  showToast('হাজিরা সফলভাবে ডিভাইসে সংরক্ষিত হয়েছে!');
}

function filterAttendanceList() {
  const searchInput = document.getElementById('attendanceRollSearch');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const dateInput = document.getElementById('attendanceDate');
  const dateKey = `${currentAttendanceClass}_${dateInput ? dateInput.value : 'today'}`;
  const list = attendanceRecords[dateKey] || [];

  const filtered = list.filter((s) =>
    query ? s.roll.toString().includes(query) || s.name.toLowerCase().includes(query) : true
  );

  populateAttendanceTable(filtered);
}

// Result Search Logic
function searchResult() {
  const classSelect = document.getElementById('resultClassSelect');
  const rollInput = document.getElementById('resultRollInput');

  if (!rollInput || !rollInput.value) {
    alert('দয়া করে রোল নম্বর প্রবেশ করান');
    return;
  }

  const grade = classSelect ? parseInt(classSelect.value) : 7;
  const roll = parseInt(rollInput.value);

  const students = INITIAL_STUDENTS[grade] || [];
  const student = students.find((s) => s.roll === roll) || {
    name: 'মো: আব্দুল্লাহ আল মামুন',
    roll: roll,
    class: grade,
  };

  const marksheetContainer = document.getElementById('marksheetContainer');
  const placeholder = document.getElementById('noResultPlaceholder');

  if (placeholder) placeholder.classList.add('hidden');
  if (marksheetContainer) marksheetContainer.classList.remove('hidden');

  // Fill Marksheet Data
  document.getElementById('marksheetName').textContent = student.name;
  document.getElementById('marksheetClass').textContent = `Class ${grade}`;
  document.getElementById('marksheetRoll').textContent = `রোল ${student.roll}`;

  // Subject Marks Calculation
  const baseMarks = Math.max(70, 95 - roll * 2);
  const subjects = [
    { name: 'বাংলা ১ম ও ২য় পত্র', full: 100, got: Math.min(100, baseMarks + 2), grade: 'A+', gpa: '5.00' },
    { name: 'ইংরেজি ১ম ও ২য় পত্র', full: 100, got: Math.min(100, baseMarks - 3), grade: 'A', gpa: '4.00' },
    { name: 'সাধারণ গণিত', full: 100, got: Math.min(100, baseMarks + 4), grade: 'A+', gpa: '5.00' },
    { name: 'সাধারণ বিজ্ঞান', full: 100, got: Math.min(100, baseMarks), grade: 'A+', gpa: '5.00' },
  ];

  let totalFull = 0;
  let totalGot = 0;

  const tbody = document.getElementById('marksheetTableBody');
  tbody.innerHTML = '';

  subjects.forEach((sub) => {
    totalFull += sub.full;
    totalGot += sub.got;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="py-2.5 px-4 border border-slate-300 font-bold text-slate-800">${sub.name}</td>
      <td class="py-2.5 px-4 border border-slate-300 text-center">${sub.full}</td>
      <td class="py-2.5 px-4 border border-slate-300 text-center font-bold text-slate-900">${sub.got}</td>
      <td class="py-2.5 px-4 border border-slate-300 text-center font-bold text-emerald-700">${sub.grade}</td>
      <td class="py-2.5 px-4 border border-slate-300 text-center font-bold text-brand-700">${sub.gpa}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('marksheetTotalFull').textContent = totalFull;
  document.getElementById('marksheetTotalObtained').textContent = totalGot;

  const finalGrade = totalGot >= 320 ? 'A+' : totalGot >= 280 ? 'A' : 'A-';
  const finalGPA = totalGot >= 320 ? '5.00' : totalGot >= 280 ? '4.00' : '3.50';

  document.getElementById('marksheetFinalGrade').textContent = finalGrade;
  document.getElementById('marksheetFinalGPA').textContent = finalGPA;

  showToast(`রোল ${roll}-এর রেজাল্ট সফলভাবে লোড হয়েছে!`);
}

// PDF Catalog & TrxID Payment Logic
function renderPdfsList(filterClass) {
  const container = document.getElementById('pdfCatalogGrid');
  if (!container) return;

  container.innerHTML = '';
  const filtered = PDF_CATALOG.filter((p) =>
    filterClass === 'all' ? true : p.classGrade.toString() === filterClass
  );

  filtered.forEach((pdf) => {
    const card = document.createElement('div');
    card.className =
      'bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4';
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-start gap-2">
          <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
            Class ${pdf.classGrade} • ${pdf.subject}
          </span>
          <span class="text-lg font-black text-nova-600 bg-nova-50 px-2.5 py-0.5 rounded-xl border border-nova-200">
            ৳${pdf.price}
          </span>
        </div>
        <h4 class="text-base font-bold text-slate-800 leading-snug">${pdf.title}</h4>
        <p class="text-xs text-slate-500 leading-relaxed">${pdf.description}</p>
      </div>
      <div class="pt-3 border-t border-slate-100">
        <button onclick="openPdfModal('${pdf.id}')" class="w-full py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2">
          <span>৳${pdf.price} দিয়ে কিনুন (TrxID দিন)</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openPdfModal(pdfId) {
  currentPdfToBuy = PDF_CATALOG.find((p) => p.id === pdfId);
  if (!currentPdfToBuy) return;

  const modal = document.getElementById('pdfPurchaseModal');
  if (modal) {
    document.getElementById('modalPdfTitle').textContent = currentPdfToBuy.title;
    document.getElementById('modalPdfPrice').textContent = `৳${currentPdfToBuy.price}`;
    document.getElementById('instructionAmount').textContent = `৳${currentPdfToBuy.price}`;
    modal.classList.remove('hidden');
  }
}

function closePdfModal() {
  const modal = document.getElementById('pdfPurchaseModal');
  if (modal) modal.classList.add('hidden');
}

function submitTrxPayment(e) {
  if (e) e.preventDefault();
  const phoneInput = document.getElementById('senderPhoneInput');
  const trxInput = document.getElementById('trxIdInput');

  if (!phoneInput || !phoneInput.value || !trxInput || !trxInput.value) {
    alert('দয়া করে ফোন নম্বর এবং TrxID পূরণ করুন');
    return;
  }

  closePdfModal();
  showToast('আপনার TrxID সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাই করার পর পিডিএফ ডাউনলোড লিংক ওপেন হবে।');
}

// Toast Notification Helper
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
  }
}

