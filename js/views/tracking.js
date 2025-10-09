/* ===== tracking.js (chuẩn SAP wireframe) ===== */
const Tracking = () => `
  <h2>Sales Document Management</h2>

  <!-- Filter buttons -->
  <div class="status-tabs">
    <button onclick="filterStatus('ALL')" class="tab-btn active">All</button>
    <button onclick="filterStatus('INCOMPLETE')" class="tab-btn">Incomplete</button>
    <button onclick="filterStatus('CREATED')" class="tab-btn">Created</button>
    <button onclick="filterStatus('DELIVERED')" class="tab-btn">Delivery Created</button>
    <button onclick="filterStatus('PGI_POSTED')" class="tab-btn">PGI Posted</button>
    <button onclick="filterStatus('BILLED')" class="tab-btn">Billed</button>
    <button onclick="filterStatus('CANCELLED')" class="tab-btn">Cancellation</button>
  </div>

  <div id="trackingTable">${renderTrackingTable('ALL')}</div>
`;
/* ===== Render Table (with Mass PGI & Mass Billing) ===== */
function renderTrackingTable(view) {
  const isDeliveryView = view === 'DELIVERED';
  const isPGIView = view === 'PGI_POSTED';
  const isBilledView = view === 'BILLED';

  // --- CHỌN NGUỒN DỮ LIỆU ---
  let data = [];
  if (isDeliveryView) {
    data = DB.deliveries.filter((x) => x.status === 'DELIVERED');
  } else if (isPGIView) {
    data = DB.deliveries.filter((x) => x.status === 'PGI_POSTED');
  } else if (isBilledView) {
    data = DB.billings.filter((x) => x.status === 'BILLED');
  } else {
    data = DB.items.filter((x) => x.so);
  }

  // --- HEADER LABEL ---
  const headerLabel = isDeliveryView
    ? 'Outbound Delivery Document'
    : isPGIView
    ? 'PGI Number'
    : isBilledView
    ? 'Billing Document'
    : 'Sales Doc.';

  // --- ROWS ---
  const rowsHTML = data.length
    ? data
        .map((x) => {
          if (isBilledView) {
            return `
              <tr data-status="${x.status}">
                <td><a href="#/billing/${x.billingNo}" class="so-link">${
              x.billingNo
            }</a></td>
                <td>${x.salesOrg || '-'}</td>
                <td>${x.distChnl || '-'}</td>
                <td>${x.division || '-'}</td>
                <td>${x.soldTo || '-'}</td>
                <td>${x.shipTo || '-'}</td>
                <td>${x.custRef || '-'}</td>
                <td>${x.date || '-'}</td>
                <td>${x.totalQty || 0}</td>
                <td>${x.netValue || 0} VND</td>
                <td>${x.tax || 0} VND</td>
                <td>${renderStatus(x.status)}</td>
              </tr>`;
          } else if (isPGIView) {
            return `
    <tr data-status="${x.status}">
      <td><input type="checkbox" class="chk-pgi" value="${x.deliveryNo}"></td>
      <td><a href="#/pgi/${
        x.deliveryNo
      }" class="so-link">${x.deliveryNo.replace('DL', 'PGI')}</a></td>
      <td>${x.salesOrg}</td>
      <td>${x.distChnl}</td>
      <td>${x.division}</td>
      <td>${x.soldTo}</td>
      <td>${x.shipTo}</td>
      <td>${x.custRef}</td>
      <td>${x.date}</td>
      <td>${x.totalQty}</td>
      <td>${(x.totalQty * 0.68).toFixed(1)} KG</td>
      <td>${(x.totalQty * 0.2).toFixed(2)} m³</td>
      <td>${renderStatus(x.status)}</td>
    </tr>`;
          } else if (isDeliveryView) {
            return `
              <tr data-status="${x.status}">
                <td><input type="checkbox" class="chk-dl" value="${
                  x.deliveryNo
                }"></td>
                <td><a href="#/pgi/${x.deliveryNo}" class="so-link">${
              x.deliveryNo
            }</a></td>
                <td>${x.salesOrg}</td>
                <td>${x.distChnl}</td>
                <td>${x.division}</td>
                <td>${x.soldTo}</td>
                <td>${x.shipTo}</td>
                <td>${x.custRef}</td>
                <td>${x.date}</td>
                <td>${x.totalQty}</td>
                <td>${(x.totalQty * 0.68).toFixed(1)} KG</td>
                <td>${(x.totalQty * 0.2).toFixed(2)} m³</td>
                <td>${renderStatus(x.status)}</td>
              </tr>`;
          } else {
            return `
              <tr data-status="${x.status}">
                <td><a href="#/so/${x.so}" class="so-link">${x.so}</a></td>
                <td>${x.salesOrg}</td>
                <td>${x.distChnl}</td>
                <td>${x.division}</td>
                <td>${x.soldTo}</td>
                <td>${x.shipTo}</td>
                <td>${x.custRef}</td>
                <td>${x.docDate}</td>
                <td>${x.noItems || 1}</td>
                <td>${x.totalQty}</td>
                <td>${x.netValue}</td>
                <td>${renderStatus(x.status)}</td>
              </tr>`;
          }
        })
        .join('')
    : `<tr><td colspan="12" class="muted">No ${headerLabel}s available.</td></tr>`;

  // --- TABLE STRUCTURE ---
  let tableHTML = `
    <table class="table" id="statusTable" style="width:100%;">
      <thead>
        <tr>
          ${
            isDeliveryView
              ? `<th><input type="checkbox" id="chkAllDL" title="Select all"></th>`
              : isPGIView
              ? `<th><input type="checkbox" id="chkAllPGI" title="Select all"></th>`
              : ''
          }
          <th>${headerLabel}</th>
          <th>Sales Org.</th>
          <th>Dist. Chnl</th>
          <th>Division</th>
          <th>Sold-to Party</th>
          <th>Ship-to Party</th>
          <th>Cust. Ref.</th>
          <th>Date</th>
          <th>Qty</th>
          <th>${isBilledView ? 'Net Value' : 'Weight'}</th>
          <th>${isBilledView ? 'Tax' : 'Volume'}</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;

  // --- MASS ACTION BUTTONS ---
  if (isDeliveryView && data.length > 0) {
    tableHTML += `
      <div style="margin-top:10px; text-align:right;">
        <button id="btnMassPGI" class="sap-btn">Post Goods Issue</button>
      </div>`;
  } else if (isPGIView && data.length > 0) {
    tableHTML += `
      <div style="margin-top:10px; text-align:right;">
        <button id="btnMassBilling" class="sap-btn">Post to FI</button>
      </div>`;
  }

  return tableHTML;
}

/* ====== Event Handlers ====== */
document.addEventListener('click', function (e) {
  // === Mass PGI ===
  if (e.target && e.target.id === 'btnMassPGI') {
    const selected = Array.from(
      document.querySelectorAll('.chk-dl:checked')
    ).map((chk) => chk.value);
    if (!selected.length)
      return alert('⚠️ Please select at least one Delivery to post PGI.');

    selected.forEach((dlNo) => {
      const dl = DB.deliveries.find((d) => d.deliveryNo === dlNo);
      if (dl) {
        dl.status = 'PGI_POSTED';
        const so = DB.items.find((s) => s.so === dl.soNo);
        if (so) so.status = 'PGI_POSTED';
        console.log(`✅ PGI posted for Delivery ${dlNo}`);
      }
    });
    alert(`✅ PGI posted for ${selected.length} deliveries.`);
    document.getElementById('trackingTable').innerHTML =
      renderTrackingTable('PGI_POSTED');
  }

  // === Mass Billing (Post to FI) ===
  if (e.target && e.target.id === 'btnMassBilling') {
    const selected = Array.from(
      document.querySelectorAll('.chk-pgi:checked')
    ).map((chk) => chk.value);
    if (!selected.length)
      return alert('⚠️ Please select at least one PGI to post Billing.');

    selected.forEach((dlNo) => {
      const dl = DB.deliveries.find((d) => d.deliveryNo === dlNo);
      if (!dl) return;

      const biNo = nextBI();
      const so = DB.items.find((s) => s.so === dl.soNo);

      const newBilling = {
        billingNo: biNo,
        soNo: dl.soNo,
        deliveryNo: dl.deliveryNo,
        salesOrg: dl.salesOrg,
        distChnl: dl.distChnl,
        division: dl.division,
        soldTo: dl.soldTo,
        shipTo: dl.shipTo,
        custRef: dl.custRef,
        date: new Date().toISOString().slice(0, 10),
        totalQty: dl.totalQty,
        netValue: so?.netValue || '100,000',
        tax: '8,000',
        status: 'BILLED',
      };
      DB.billings.unshift(newBilling);
      dl.status = 'BILLED';
      if (so) so.status = 'BILLED';

      console.log(`✅ Billing ${biNo} created for Delivery ${dlNo}`);
    });

    alert(`✅ Posted Billing for ${selected.length} PGI document(s).`);
    document.getElementById('trackingTable').innerHTML =
      renderTrackingTable('BILLED');
  }

  // === Select All checkboxes ===
  if (e.target && (e.target.id === 'chkAllDL' || e.target.id === 'chkAllPGI')) {
    const checked = e.target.checked;
    const selector = e.target.id === 'chkAllDL' ? '.chk-dl' : '.chk-pgi';
    document
      .querySelectorAll(selector)
      .forEach((chk) => (chk.checked = checked));
  }
});

/* ===== Event Handler: Mass PGI ===== */
document.addEventListener('click', function (e) {
  // Mass PGI
  if (e.target && e.target.id === 'btnMassPGI') {
    const selected = Array.from(
      document.querySelectorAll('.chk-dl:checked')
    ).map((chk) => chk.value);
    if (!selected.length) {
      alert('⚠️ Please select at least one Delivery to post PGI.');
      return;
    }

    selected.forEach((dlNo) => {
      const dl = DB.deliveries.find((d) => d.deliveryNo === dlNo);
      if (dl) {
        dl.status = 'PGI_POSTED';
        const so = DB.items.find((s) => s.so === dl.soNo);
        if (so) so.status = 'PGI_POSTED';
        console.log(`✅ PGI posted for Delivery ${dlNo}`);
      }
    });

    alert(`✅ PGI posted for ${selected.length} delivery document(s).`);
    document.getElementById('trackingTable').innerHTML =
      renderTrackingTable('PGI_POSTED');
  }

  // Select All checkbox
  if (e.target && e.target.id === 'chkAllDL') {
    const checked = e.target.checked;
    document
      .querySelectorAll('.chk-dl')
      .forEach((chk) => (chk.checked = checked));
  }
});

/* ===== Filter Status ===== */
function filterStatus(type) {
  // Active tab button
  document
    .querySelectorAll('.tab-btn')
    .forEach((b) => b.classList.remove('active'));
  document
    .querySelector(`.tab-btn[onclick*="${type}"]`)
    ?.classList.add('active');

  const container = document.getElementById('trackingTable');

  // --- DELIVERY TAB ---
  if (type === 'DELIVERED') {
    // Nếu là tab Delivery Created → generate deliveries (nếu chưa có)
    const newDeliveries = DB.items
      .filter((x) => x.status === 'DELIVERED')
      .map((x, idx) => {
        const no = 'DL' + (DB.dlSeq + idx + 1);
        if (!DB.deliveries.some((d) => d.deliveryNo === no)) {
          DB.deliveries.push({
            deliveryNo: no,
            salesOrg: x.salesOrg,
            distChnl: x.distChnl,
            division: x.division,
            soldTo: x.soldTo,
            shipTo: x.shipTo,
            custRef: x.custRef,
            date: x.reqDelivDate || '2025-10-07',
            totalQty: x.totalQty,
            status: 'DELIVERED',
          });
        }
        return DB.deliveries.find((d) => d.deliveryNo === no);
      });

    container.innerHTML = renderTrackingTable('DELIVERED');
  }

  // --- PGI TAB ---
  else if (type === 'PGI_POSTED') {
    // Hiển thị PGI Documents (đã post)
    container.innerHTML = renderTrackingTable('PGI_POSTED');

    // --- BILLED TAB ---
  } else if (type === 'BILLED') {
    container.innerHTML = renderTrackingTable('BILLED');
  }

  // --- CÁC TAB KHÁC ---
  else {
    container.innerHTML = renderTrackingTable('ALL');
    const rows = container.querySelectorAll('#statusTable tbody tr');
    rows.forEach((r) => {
      const s = r.dataset.status || '';
      if (type === 'ALL' || s === type) r.style.display = '';
      else r.style.display = 'none';
    });
  }
}

/* ===== Status Pill (SAP Style) ===== */
function renderStatus(status) {
  let label = status || 'CREATED';
  let bg = '#e0e0e0',
    color = '#000';
  switch (status) {
    case 'DELIVERED':
      bg = '#d9edf7';
      color = '#31708f';
      break;
    case 'PGI_POSTED':
      bg = '#dff0d8';
      color = '#3c763d';
      break;
    case 'BILLED':
      bg = '#c8e6c9';
      color = '#256029';
      break;
    case 'CANCELLED':
      bg = '#f2dede';
      color = '#a94442';
      break;
    case 'INCOMPLETE':
      bg = '#fff3cd';
      color = '#856404';
      break;
    default:
      bg = '#fcf8e3';
      color = '#8a6d3b';
      label = 'CREATED';
      break;
  }
  return `<div class="status-pill" style="background:${bg};color:${color};font-weight:bold;padding:4px 8px;border-radius:3px;text-align:center;min-width:110px;display:inline-block;">${label}</div>`;
}
