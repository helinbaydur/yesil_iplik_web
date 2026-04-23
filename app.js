/* =============================================
   YEŞİL İPLİK — Kumaş Takip Sistemi
   app.js
   ============================================= */

// ── Veri Tabanı ──────────────────────────────────────────────────────────────
const FABRIC_DB = {
  "IST-001": {
    title: "Pembe Pazen Gelinlik Kumaşı",
    story: "\"Annemin 1992'deki düğününden kalan kumaş. Yıllarca sandıkta bekledi, şimdi yeni bir hayat kazansın.\" — Selin T., İstanbul",
    city: "İstanbul",
    type: "Pamuklu / Pazen",
    product: "Clutch Çanta",
    water: "12.000 litre",
    statusLabel: "Atölyede Üretimde",
    statusStep: 3,
  },
  "IZMR-042": {
    title: "Ege Çiçekli Keten Perde",
    story: "\"Büyükannemin evinin perdeleriydi. Dokuma motiflerini çok severdim.\" — Deniz A., İzmir",
    city: "İzmir",
    type: "Keten / Organik",
    product: "Tote Çanta",
    water: "9.400 litre",
    statusLabel: "Kalite Kontrolde",
    statusStep: 4,
  },
  "ANK-017": {
    title: "Yün Kilim Parçası",
    story: "\"Dedem dokumacıydı. Bu kilim parçası onun son işiydi.\" — Meral K., Ankara",
    city: "Ankara",
    type: "Yün / El Dokuma",
    product: "Yüz Havlusu",
    water: "15.200 litre",
    statusLabel: "Teslime Hazır",
    statusStep: 5,
  },
};

// ── Adımlar Tanımı ────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Bağış\nAlındı", icon: "🤝" },
  { label: "ID\nAtandı", icon: "🏷️" },
  { label: "Atölyeye\nUlaştı", icon: "🚐" },
  { label: "Üretimde", icon: "✂️" },
  { label: "Kalite\nKontrol", icon: "✅" },
  { label: "Tamamlandı", icon: "🛍️" },
];

// ── DOM Refs ──────────────────────────────────────────────────────────────────
const trackingInput = document.getElementById("trackingInput");
const trackBtn = document.getElementById("trackBtn");
const resultPanel = document.getElementById("resultPanel");
const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultStory = document.getElementById("resultStory");
const resultStatus = document.getElementById("resultStatus");
const trackSteps = document.getElementById("trackSteps");
const dcType = document.getElementById("dcType");
const dcCity = document.getElementById("dcCity");
const dcProduct = document.getElementById("dcProduct");
const dcWater = document.getElementById("dcWater");

// ── Tracking Logic ────────────────────────────────────────────────────────────
function doTrack(code) {
  const key = code.trim().toUpperCase();
  const data = FABRIC_DB[key];

  if (!data) {
    showNotFound(key);
    return;
  }

  // Fill info
  resultBadge.textContent = key;
  resultTitle.textContent = data.title;
  resultStory.textContent = data.story;
  resultStatus.querySelector(".status-text").textContent = data.statusLabel;
  dcType.textContent = data.type;
  dcCity.textContent = data.city;
  dcProduct.textContent = data.product;
  dcWater.textContent = data.water;

  // Build steps
  buildSteps(data.statusStep);

  // Show panel
  resultPanel.classList.remove("hidden");
  setTimeout(() => {
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

function buildSteps(activeStep) {
  trackSteps.innerHTML = "";
  STEPS.forEach((step, i) => {
    const stepEl = document.createElement("div");
    const stepNum = i + 1;
    const isDone = stepNum < activeStep;
    const isActive = stepNum === activeStep;

    stepEl.className = "track-step" +
      (isDone ? " done" : "") +
      (isActive ? " active" : "");

    stepEl.innerHTML = `
      <div class="ts-dot">${isDone ? "✓" : step.icon}</div>
      <div class="ts-label">${step.label.replace("\n", "<br/>")}</div>
    `;
    trackSteps.appendChild(stepEl);
  });
}

function showNotFound(code) {
  resultBadge.textContent = code;
  resultTitle.textContent = "Kod bulunamadı";
  resultStory.textContent = `"${code}" koduna ait kayıt sistemde bulunamadı. Lütfen kodu kontrol edin veya karavan ekibiyle iletişime geçin.`;
  resultStatus.querySelector(".status-text").textContent = "Bilinmiyor";
  dcType.textContent = dcCity.textContent = dcProduct.textContent = dcWater.textContent = "—";
  buildSteps(0);
  resultPanel.classList.remove("hidden");
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Events ────────────────────────────────────────────────────────────────────
trackBtn.addEventListener("click", () => {
  doTrack(trackingInput.value);
});

trackingInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doTrack(trackingInput.value);
});

document.querySelectorAll(".demo-tag").forEach(btn => {
  btn.addEventListener("click", () => {
    const code = btn.dataset.code;
    trackingInput.value = code;
    doTrack(code);
  });
});

// ── Animated Counters ─────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString("tr-TR");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe stat section to trigger counters
const statNums = document.querySelectorAll(".stat-num");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => observer.observe(el));

// ── Input Auto-uppercase ──────────────────────────────────────────────────────
trackingInput.addEventListener("input", (e) => {
  const pos = e.target.selectionStart;
  e.target.value = e.target.value.toUpperCase();
  e.target.setSelectionRange(pos, pos);
});

// ── BAĞIŞ MODAL ──────────────────────────────────────────────────────────────
let selectedFabric = "";
let currentStep = 1;

// Açma / Kapama
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.textContent.trim() === 'Bağış Yap') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openDonateModal();
    });
  }
});

document.getElementById('modalClose').addEventListener('click', closeDonateModal);
document.getElementById('donateModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeDonateModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDonateModal();
});

function openDonateModal() {
  document.getElementById('donateModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  goStep(1);
}

function closeDonateModal() {
  document.getElementById('donateModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Kumaş tipi seçimi
document.querySelectorAll('.fabric-type-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.fabric-type-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedFabric = card.dataset.type;
  });
});

// Step navigasyonu
function goStep(n) {
  // Validate step 1
  if (n === 2 && currentStep === 1) {
    const name  = document.getElementById('f_name').value.trim();
    const email = document.getElementById('f_email').value.trim();
    const city  = document.getElementById('f_city').value;
    if (!name || !email || !city) {
      shakeForm();
      return;
    }
  }

  // Validate step 2
  if (n === 3 && currentStep === 2) {
    if (!selectedFabric) {
      document.querySelectorAll('.fabric-type-card').forEach(c => {
        c.style.animation = 'none';
        setTimeout(() => c.style.animation = '', 10);
      });
      shakeForm();
      return;
    }
    // Fill summary
    document.getElementById('s_name').textContent     = document.getElementById('f_name').value;
    document.getElementById('s_city').textContent     = document.getElementById('f_city').value;
    document.getElementById('s_fabric').textContent   = selectedFabric;
    const delivery = document.querySelector('input[name="delivery"]:checked');
    document.getElementById('s_delivery').textContent = delivery ? delivery.value : '—';
  }

  currentStep = n;

  // Show/hide steps
  [1,2,3,4].forEach(i => {
    document.getElementById('step' + i).classList.toggle('hidden', i !== n);
  });

  // Update step bar
  document.querySelectorAll('.msb-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === n) el.classList.add('active');
    if (s < n)  el.classList.add('done');
  });
}

function shakeForm() {
  const box = document.querySelector('.modal-box');
  box.style.animation = 'none';
  box.style.transform = 'translateX(-8px)';
  setTimeout(() => { box.style.transform = 'translateX(8px)'; }, 80);
  setTimeout(() => { box.style.transform = 'translateX(0)'; }, 160);
}

function submitDonation() {
  // Generate unique code
  const city   = document.getElementById('f_city').value;
  const prefix = city.slice(0,3).toUpperCase().replace('İ','I').replace('Ş','S').replace('Ğ','G');
  const num    = String(Math.floor(Math.random() * 900) + 100);
  const code   = prefix + '-' + num;

  document.getElementById('ty_code').textContent          = code;
  document.getElementById('s_email_confirm').textContent  = document.getElementById('f_email').value;

  // Add to local DB so it's immediately trackable
  const delivery = document.querySelector('input[name="delivery"]:checked');
  FABRIC_DB[code] = {
    title: selectedFabric + ' Kumaşı',
    story: document.getElementById('f_story').value || '"Bağışçı hikâyesini paylaşmadı."',
    city: document.getElementById('f_city').value,
    type: selectedFabric,
    product: 'Belirleniyor',
    water: '—',
    statusLabel: 'Bağış Alındı',
    statusStep: 1,
  };

  goStep(4);
}
