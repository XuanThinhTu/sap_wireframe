/* ===== tracking.js — SAP GUI Wireframe Style with ALV Actions ===== */
const Tracking = () => `
  <h2>Sales Document Management</h2>

  <!-- ===== Selection Criteria (Horizontal Filter Bar) ===== -->
  <div class="filter-frame" 
       style="border:1px solid #ccc; padding:10px; margin-top:10px; background:#fafafa; display:flex; align-items:center; gap:16px; flex-wrap:wrap;">

    <div class="filter-group">
      <label style="font-weight:bold; margin-right:5px;">Process Phase:</label>
      <select id="phaseFilter" style="min-width:160px;">
        <option value="ALL">All</option>
        <option value="ORDER">Order Processing</option>
        <option value="DELIVERY">Delivery Processing</option>
        <option value="INVOICE">Invoice Processing</option>
        <option value="ACCOUNT_COMPLETE">Accounting</option>
      </select>
    </div>

    <div class="filter-group">
      <label style="font-weight:bold; margin-right:5px;">Sales Doc Status:</label>
      <select id="soStatusFilter" style="min-width:160px;">
        <option value="ALL">All</option>
        <option value="INCOMPLETE">Incomplete</option>
        <option value="COMPLETE">Ordering Complete</option>
      </select>
    </div>

    <div class="filter-group">
      <label style="font-weight:bold; margin-right:5px;">Delivery Doc Status:</label>
      <select id="dlStatusFilter" style="min-width:160px;">
        <option value="ALL">All</option>
        <option value="READY_PGI">Ready to Post GI</option>
        <option value="PGI_POSTED">GI Posted</option>
      </select>
    </div>

    <div class="filter-group">
      <label style="font-weight:bold; margin-right:5px;">Billing Doc Status:</label>
      <select id="biStatusFilter" style="min-width:160px;">
        <option value="ALL">All</option>
        <option value="READY_BILLING">Ready to Billing</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="COMPLETED">Completed</option>
        <option value="TO_POST">To be Posted</option>
      </select>
    </div>

    <div style="margin-left:auto;">
      <button class="sap-btn primary" onclick="applyFilters()">Go</button>
    </div>
  </div>

  <!-- ===== Sales Document Block ===== -->
  <div class="alv-block" style="border:1px solid #ccc; margin-top:15px;">
    <div class="alv-header" 
         style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:#f3f3f3;">
      <h3 style="margin:0;">Sales Document</h3>
      <div class="alv-actions" style="display:flex; gap:8px;">
        <button class="sap-btn" onclick="massPostGI()">Post GI</button>
        <button class="sap-btn" onclick="massReverseGI()">Reverse GI</button>
        <button class="sap-btn" onclick="massCreateBilling()">Create Billing</button>
        <button class="sap-btn" onclick="massCancelBilling()">Cancel Billing</button>
      </div>
    </div>
    <div id="trackingTable">${renderTrackingTable()}</div>
  </div>
`;

/* ===== Apply Filter Logic ===== */
function applyFilters() {
  const phase = document.getElementById('phaseFilter').value;
  const soStatus = document.getElementById('soStatusFilter').value;
  const dlStatus = document.getElementById('dlStatusFilter').value;
  const biStatus = document.getElementById('biStatusFilter').value;
  renderTrackingTable({ phase, soStatus, dlStatus, biStatus });
}

/* ===== Render ALV Table ===== */
/* ===== Apply Filters (multi-criteria filtering) ===== */
function applyFilters() {
  const phase = document.getElementById('phaseFilter').value;
  const soStatus = document.getElementById('soStatusFilter').value;
  const dlStatus = document.getElementById('dlStatusFilter').value;
  const biStatus = document.getElementById('biStatusFilter').value;

  // Lưu lại bộ lọc hiện tại (để rerender không reset)
  window.activeFilters = { phase, soStatus, dlStatus, biStatus };

  rerender();
}

/* ===== Render ALV Table (with filter logic applied) ===== */
function renderTrackingTable(filters = window.activeFilters || {}) {
  let {
    phase = 'ALL',
    soStatus = 'ALL',
    dlStatus = 'ALL',
    biStatus = 'ALL',
  } = filters;

  // Build dataset
  let data = [];
  DB.items.forEach((so) => {
    const dl = DB.deliveries.find((d) => d.soNo === so.so);
    const bi = DB.billings.find((b) => b.soNo === so.so);

    data.push({
      phase: mapPhase(so, dl, bi),
      soStatus: so.status,
      dlStatus: dl?.status || '-',
      biStatus: bi?.status || '-',
      soNo: so.so,
      dlNo: dl?.deliveryNo || '-',
      biNo: bi?.billingNo || '-',
      soType: so.orderType || 'OR',
      docDate: so.docDate || '-',
      salesArea: `${so.salesOrg || '1000'} / ${so.distChnl || '10'} / ${
        so.division || '00'
      }`,
      soldTo: so.soldTo || '-',
      netValue: so.netValue || '—',
      currency: so.currency || 'VND',
      reqDelivDate: so.reqDelivDate || '-',
    });
  });

  // === Filter logic ===
  data = data.filter((x) => {
    // 1️⃣ Filter by Process Phase
    if (phase !== 'ALL' && x.phase !== phase) return false;

    // 2️⃣ Filter by SO Status
    if (soStatus !== 'ALL' && x.soStatus !== soStatus) return false;

    // 3️⃣ Filter by Delivery Status
    if (dlStatus !== 'ALL' && x.dlStatus !== dlStatus) return false;

    // 4️⃣ Filter by Billing Status
    if (biStatus !== 'ALL' && x.biStatus !== biStatus) return false;

    return true;
  });

  // === Build table ===
  const rowsHTML = data.length
    ? data
        .map(
          (x) => `
        <tr>
          <td><input type="checkbox" class="chk-so" value="${x.soNo}"></td>
          <td>${renderPhase(x.phase)}</td>
          <td><a href="#/so/${x.soNo}" class="so-link">${x.soNo}</a></td>
          <td>${
            x.dlNo !== '-'
              ? `<a href="#/pgi/${x.dlNo}" class="so-link">${x.dlNo}</a>`
              : '-'
          }</td>
          <td>${
            x.biNo !== '-'
              ? `<a href="#/billing/${x.biNo}" class="so-link">${x.biNo}</a>`
              : '-'
          }</td>
          <td>${x.soType}</td>
          <td>${x.docDate}</td>
          <td>${x.salesArea}</td>
          <td>${x.soldTo}</td>
          <td>${x.netValue}</td>
          <td>${x.currency}</td>
          <td>${x.reqDelivDate}</td>
        </tr>`
        )
        .join('')
    : `<tr><td colspan="12" class="muted">No records match your criteria.</td></tr>`;

  return `
    <table class="table" style="width:100%; border-collapse:collapse;">
      <thead style="background:#f7f7f7;">
        <tr>
          <th><input type="checkbox" id="chkAllSO" title="Select All"></th>
          <th>Process Phase</th>
          <th>Sales Documents</th>
          <th>Delivery Documents</th>
          <th>Billing Documents</th>
          <th>Sales Order Type</th>
          <th>Document Date</th>
          <th>Sales Area</th>
          <th>Sold-to Party</th>
          <th>Net Value</th>
          <th>Currency</th>
          <th>Requested Delivery Date</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ===== Phase Mapping — exact per your description ===== */
function mapPhase(so, dl, bi) {
  const hasDL = !!dl;
  const hasBI = !!bi;

  // 1) Đã có Billing -> Accounting
  if (
    hasBI &&
    (bi.status === 'BILLED' ||
      bi.status === 'COMPLETED' ||
      bi.status === 'TO_POST')
  )
    return 'ACCOUNTING';

  // 2) Đã PGI nhưng chưa billing -> Invoice processing
  if (hasDL && dl.status === 'PGI_POSTED') return 'INVOICE';

  // 3) Có Delivery nhưng chưa PGI -> Delivery processing
  if (hasDL && (dl.status === 'DELIVERED' || dl.status === 'OPEN'))
    return 'DELIVERY';

  // 4) Còn lại -> Order processing
  return 'ORDER';
}

/* ===== Action: Post GI ===== */
function massPostGI() {
  const selected = getSelectedSOs();
  if (!selected.length) return alert('⚠️ Please select at least one SO.');

  selected.forEach((soNo) => {
    const so = DB.items.find((s) => s.so === soNo);
    if (!so) return;

    // Nếu chưa có Delivery thì không thể PGI → tự tạo DL trước (như SAP VL01N từ SO)
    let dl = DB.deliveries.find((d) => d.soNo === so.so);
    if (!dl) {
      // auto create DL giống function autoCreateDelivery trong db.js
      const newDL = {
        deliveryNo: nextDL(),
        soNo: so.so,
        salesOrg: so.salesOrg,
        distChnl: so.distChnl,
        division: so.division,
        soldTo: so.soldTo,
        shipTo: so.shipTo,
        custRef: so.custRef,
        date: so.reqDelivDate || new Date().toISOString().slice(0, 10),
        totalQty: so.totalQty,
        status: 'DELIVERED',
      };
      DB.deliveries.unshift(newDL);
      dl = newDL;
    }

    // PGI
    postGI(so); // set so.gi = true
    so.status = 'PGI_POSTED';
    dl.status = 'PGI_POSTED';
  });

  alert(`✅ PGI posted for ${selected.length} SO(s).`);
  rerender();
}

/* ===== Action: Reverse GI ===== */
function massReverseGI() {
  const selected = getSelectedSOs();
  if (!selected.length) return alert('⚠️ Please select at least one SO.');

  selected.forEach((soNo) => {
    const so = DB.items.find((s) => s.so === soNo);
    if (!so) return;
    const dl = DB.deliveries.find((d) => d.soNo === so.so);
    if (dl && dl.status === 'PGI_POSTED') dl.status = 'DELIVERED';
    so.status = 'DELIVERED';
    so.gi = false;
  });

  alert(`↩️ GI reversed for ${selected.length} SO(s).`);
  rerender();
}

/* ===== Action: Create Billing ===== */
function massCreateBilling() {
  const selected = getSelectedSOs();
  if (!selected.length) return alert('⚠️ Please select at least one SO.');

  let success = 0;
  selected.forEach((soNo) => {
    const so = DB.items.find((s) => s.so === soNo);
    if (!so) return;

    // Chỉ cho phép khi đã PGI
    const dl = DB.deliveries.find((d) => d.soNo === so.so);
    if (!dl || dl.status !== 'PGI_POSTED') return;

    // Tạo billing
    const ok = createBilling(so); // createBilling trong actions.js yêu cầu so.gi = true (đã được set khi Post GI)
    if (ok) {
      so.status = 'COMPLETED';
      const bi = DB.billings.find((b) => b.soNo === so.so);
      if (bi) bi.status = 'COMPLETED';
      success++;
    }
  });

  alert(`✅ Billing created for ${success} SO(s).`);
  rerender();
}

/* ===== Action: Cancel Billing ===== */
function massCancelBilling() {
  const selected = getSelectedSOs();
  if (!selected.length) return alert('⚠️ Please select at least one SO.');

  let cnt = 0;
  selected.forEach((soNo) => {
    const so = DB.items.find((s) => s.so === soNo);
    if (!so) return;

    const bi = DB.billings.find((b) => b.soNo === so.so);
    const dl = DB.deliveries.find((d) => d.soNo === so.so);

    if (bi) {
      bi.status = 'CANCELLED';
      // đưa SO/DL trở lại trạng thái sau PGI (để có thể re-bill)
      so.status = 'PGI_POSTED';
      if (dl) dl.status = 'PGI_POSTED';
      cnt++;
    }
  });

  alert(`❌ Billing cancelled for ${cnt} SO(s).`);
  rerender();
}

/* ===== Helpers ===== */
function getSelectedSOs() {
  return Array.from(document.querySelectorAll('.chk-so:checked')).map(
    (c) => c.value
  );
}

/* ===== Select All event ===== */
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'chkAllSO') {
    const checked = e.target.checked;
    document
      .querySelectorAll('.chk-so')
      .forEach((chk) => (chk.checked = checked));
  }
});

/* ===== Render Phase Pill (Process Phase visual) ===== */
function renderPhase(phase) {
  const phaseMap = {
    ORDER: {
      bg: '#fff3cd',
      color: '#856404',
      label: 'Order processing',
    },
    DELIVERY: {
      bg: '#d9edf7',
      color: '#31708f',
      label: 'Delivery processing',
    },
    INVOICE: {
      bg: '#dff0d8',
      color: '#3c763d',
      label: 'Invoice processing',
    },
    ACCOUNT_PARTIAL: {
      bg: '#e0e0e0',
      color: '#555',
      label: 'Accounting – Partial',
    },
    ACCOUNT_COMPLETE: {
      bg: '#c8e6c9',
      color: '#256029',
      label: 'Accounting – Complete',
    },
  };

  const p = phaseMap[phase] || {
    bg: '#eee',
    color: '#000',
    label: phase || '—',
  };

  return `
    <div style="
      background:${p.bg};
      color:${p.color};
      padding:4px 8px;
      border-radius:3px;
      font-weight:bold;
      text-align:center;
      min-width:140px;
      display:inline-block;">
      ${p.label}
    </div>`;
}
