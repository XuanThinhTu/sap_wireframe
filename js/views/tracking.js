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

  <table class="table" id="statusTable">
    <thead>
      <tr>
        <th>Sales Doc.</th>
        <th>Sales Org.</th>
        <th>Dist. Chnl</th>
        <th>Division</th>
        <th>Sold-to Party</th>
        <th>Ship-to Party</th>
        <th>Cust. Ref.</th>
        <th>Doc. Date</th>
        <th>Items</th>
        <th>Total Qty</th>
        <th>Payt. Term</th>
        <th>Incoterm</th>
        <th>Net Value</th>
        <th>Curr.</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${
        DB.items.length === 0
          ? `<tr><td colspan="15" class="muted">No Sales Orders available.</td></tr>`
          : DB.items
              .map(
                (x) => `
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
      }
    </tbody>
  </table>
`;

/* ===== Render Status với màu SAP-style ===== */
function renderStatus(status) {
  let label = status || 'CREATED';
  let bg = '#e0e0e0',
    color = '#000';

  switch (status) {
    case 'DELIVERED':
      bg = '#d9edf7';
      color = '#31708f';
      label = 'DELIVERED';
      break;
    case 'PGI_POSTED':
      bg = '#dff0d8';
      color = '#3c763d';
      label = 'PGI POSTED';
      break;
    case 'BILLED':
      bg = '#c8e6c9';
      color = '#256029';
      label = 'BILLED';
      break;
    case 'CANCELLED':
      bg = '#f2dede';
      color = '#a94442';
      label = 'CANCELLED';
      break;
    case 'INCOMPLETE':
      bg = '#fff3cd';
      color = '#856404';
      label = 'INCOMPLETE';
      break;
    case 'CREATED':
    default:
      bg = '#fcf8e3';
      color = '#8a6d3b';
      label = 'CREATED';
      break;
  }

  return `
    <div class="status-pill" style="
      background:${bg};
      color:${color};
      font-weight:bold;
      padding:4px 8px;
      border-radius:3px;
      text-align:center;
      min-width:110px;
      display:inline-block;
    ">${label}</div>
  `;
}

/* ===== Filter theo Status ===== */
function filterStatus(type) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach((b) => b.classList.remove('active'));
  document
    .querySelector(`.tab-btn[onclick*="${type}"]`)
    ?.classList.add('active');

  const rows = document.querySelectorAll('#statusTable tbody tr');
  rows.forEach((r) => {
    const s = r.dataset.status || '';
    if (type === 'ALL' || s === type) r.style.display = '';
    else r.style.display = 'none';
  });
}
