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
    <button onclick="filterStatus('CANCELLED')" class="tab-btn">Cancelled</button>
  </div>

  <div id="trackingTable">${renderTrackingTable('ALL')}</div>
`;

/* ===== Render Table ===== */
function renderTrackingTable(view) {
  const isDeliveryView = view === 'DELIVERED';

  // ✅ Nếu là tab Delivery Created → tự sinh danh sách delivery từ các SO delivered
  const data = isDeliveryView
    ? DB.items
        .filter((x) => x.status === 'DELIVERED')
        .map((x, idx) => ({
          deliveryNo: 'DL' + (DB.dlSeq + idx + 1),
          salesOrg: x.salesOrg,
          distChnl: x.distChnl,
          division: x.division,
          soldTo: x.soldTo,
          shipTo: x.shipTo,
          custRef: x.custRef,
          date: x.reqDelivDate || '2025-10-07',
          totalQty: x.totalQty,
          status: 'DELIVERED',
        }))
    : DB.items || [];

  const headerLabel = isDeliveryView
    ? 'Outbound Delivery Document'
    : 'Sales Doc.';

  const rowsHTML = data.length
    ? data
        .map((x) =>
          isDeliveryView
            ? `
              <tr data-status="${x.status}">
                <td><a href="#/pgi/${x.deliveryNo}" class="so-link">${
                x.deliveryNo
              }</a></td>
                <td>${x.salesOrg || '1000'}</td>
                <td>${x.distChnl || '10'}</td>
                <td>${x.division || '00'}</td>
                <td>${x.soldTo || '-'}</td>
                <td>${x.shipTo || '-'}</td>
                <td>${x.custRef || '-'}</td>
                <td>${x.date}</td>
                <td>${x.totalQty || 0}</td>
                <td>${(x.totalQty * 0.68).toFixed(1)} KG</td>
                <td>${(x.totalQty * 0.2).toFixed(2)} m³</td>
                <td>${renderStatus(x.status)}</td>
              </tr>`
            : `
              <tr data-status="${x.status}">
                <td><a href="#/so/${x.so}" class="so-link">${x.so}</a></td>
                <td>${x.salesOrg || '1000'}</td>
                <td>${x.distChnl || '10'}</td>
                <td>${x.division || '00'}</td>
                <td>${x.soldTo || '100000'}</td>
                <td>${x.shipTo || x.soldTo}</td>
                <td>${x.custRef || 'CR-' + x.so}</td>
                <td>${x.docDate || '2025-10-04'}</td>
                <td>${x.noItems || 3}</td>
                <td>${x.totalQty || 10}</td>
                <td>${x.payTerm || 'Z001'}</td>
                <td>${x.incoterm || 'EXW'}</td>
                <td>${x.netValue || '45,000,000'}</td>
                <td>${x.currency || 'VND'}</td>
                <td>${renderStatus(x.status)}</td>
              </tr>`
        )
        .join('')
    : `<tr><td colspan="15" class="muted">No ${
        isDeliveryView ? 'Deliveries' : 'Sales Orders'
      } available.</td></tr>`;

  return `
    <table class="table" id="statusTable">
      <thead>
        <tr>
          <th>${headerLabel}</th>
          <th>Sales Org.</th>
          <th>Dist. Chnl</th>
          <th>Division</th>
          <th>Sold-to Party</th>
          <th>Ship-to Party</th>
          <th>Cust. Ref.</th>
          <th>${isDeliveryView ? 'Deliv. Date' : 'Doc. Date'}</th>
          <th>${isDeliveryView ? 'Total Qty' : 'Items'}</th>
          ${
            isDeliveryView
              ? '<th>Weight</th><th>Volume</th>'
              : '<th>Payt. Term</th><th>Incoterm</th><th>Net Value</th><th>Curr.</th>'
          }
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ===== Filter Status ===== */
function filterStatus(type) {
  document
    .querySelectorAll('.tab-btn')
    .forEach((b) => b.classList.remove('active'));
  document
    .querySelector(`.tab-btn[onclick*="${type}"]`)
    ?.classList.add('active');

  const container = document.getElementById('trackingTable');

  if (type === 'DELIVERED') {
    // ✅ Nếu là tab Delivery Created, generate deliveries (nếu chưa có)
    const newDeliveries = DB.items
      .filter((x) => x.status === 'DELIVERED')
      .map((x, idx) => {
        const no = 'DL' + (DB.dlSeq + idx + 1);
        // tránh trùng
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
  } else {
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
