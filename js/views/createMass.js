const CreateMass = () => `
  <h2>Create Sales Order — Mass Upload (Excel)</h2>
  
  <!-- Upload Section -->
  <div class="group" style="margin-bottom:25px;">
    <div class="row">
      <label>Template</label>
      <a href="assets/SO_MassUpload_Template.xlsx" download>
        <button>Download Template</button>
      </a>
    </div>

    <div class="row">
      <label>Upload File</label>
      <input id="iFile" type="file" accept=".xlsx,.xls,.csv">
    </div>

    <div class="btnbar" style="margin-top:15px;">
      <button onclick="simulateMass()">Preview</button>
      <button onclick="location.hash='#/home'">Back</button>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Preview Section -->
  <div id="massPreview" style="margin-bottom:25px;"></div>

  <!-- Final Action -->
  <div class="btnbar" id="createSection" style="margin-top:30px; display:none;">
    <button class="primary-btn" onclick="createAllSO()">Create Sales Orders</button>
  </div>
`;

/* ===== Khi bấm Preview ===== */
function simulateMass() {
  const complete = [
    {
      SalesOrganization: '1000',
      DistributionChannel: '10',
      Division: '00',
      SoldToParty: '100000',
      CustomerReference: 'CR-100001',
      RequestedDeliveryDate: '2025-10-10',
      NoOfItems: 3,
      NetValue: '45,000,000',
    },
    {
      SalesOrganization: '1000',
      DistributionChannel: '10',
      Division: '00',
      SoldToParty: '100200',
      CustomerReference: 'CR-100002',
      RequestedDeliveryDate: '2025-10-11',
      NoOfItems: 2,
      NetValue: '28,500,000',
    },
    {
      SalesOrganization: '1000',
      DistributionChannel: '10',
      Division: '00',
      SoldToParty: '100300',
      CustomerReference: 'CR-100003',
      RequestedDeliveryDate: '2025-10-12',
      NoOfItems: 4,
      NetValue: '60,200,000',
    },
  ];

  const incomplete = [
    {
      SalesOrganization: '2000',
      DistributionChannel: '20',
      Division: '01',
      SoldToParty: '200100',
      CustomerReference: 'CR-200001',
      RequestedDeliveryDate: '2025-10-15',
      NoOfItems: 3,
      NetValue: '36,700,000',
      MissingField: 'Payment Term missing',
    },
    {
      SalesOrganization: '2000',
      DistributionChannel: '20',
      Division: '01',
      SoldToParty: '200200',
      CustomerReference: 'CR-200002',
      RequestedDeliveryDate: '2025-10-16',
      NoOfItems: 2,
      NetValue: '25,000,000',
      MissingField: 'Incoterms missing',
    },
  ];

  const error = [
    {
      SalesOrganization: '9999',
      DistributionChannel: '99',
      Division: '09',
      SoldToParty: '999001',
      CustomerReference: 'CR-ERR001',
      RequestedDeliveryDate: '2025-10-20',
      NoOfItems: 2,
      NetValue: '18,000,000',
      ErrorMsg: 'Customer 999001 not assigned to Sales Org 9999',
    },
    {
      SalesOrganization: '9999',
      DistributionChannel: '99',
      Division: '09',
      SoldToParty: '999002',
      CustomerReference: 'CR-ERR002',
      RequestedDeliveryDate: '2025-10-21',
      NoOfItems: 3,
      NetValue: '22,500,000',
      ErrorMsg: 'Material master missing in Plant 9999',
    },
  ];

  // 🔁 Save preview data
  window.completeData = complete;
  window.incompleteData = incomplete;
  window.errorData = error;

  // Render 3 tab preview
  massPreview.innerHTML = `
    <div class="tab-bar" style="margin-bottom:15px;">
      <button class="tab-btn active" onclick="showTab('complete')">🟩 Complete (${
        complete.length
      })</button>
      <button class="tab-btn" onclick="showTab('incomplete')">🟨 Incomplete (${
        incomplete.length
      })</button>
      <button class="tab-btn" onclick="showTab('error')">🟥 Error (${
        error.length
      })</button>
    </div>

    <div id="tab-complete" class="tab-content active">${renderTable(
      complete,
      'complete'
    )}</div>
    <div id="tab-incomplete" class="tab-content">${renderTable(
      incomplete,
      'incomplete'
    )}</div>
    <div id="tab-error" class="tab-content">${renderTable(error, 'error')}</div>
  `;

  // ✅ Show Create button
  document.getElementById('createSection').style.display = 'flex';
}

/* ===== Render bảng preview ===== */
function renderTable(data, type) {
  if (!data || data.length === 0) return `<div class="muted">No data.</div>`;
  const headers =
    type === 'error'
      ? [
          'Sales Org',
          'Dist. Chnl',
          'Division',
          'Sold-to Party',
          'Customer Reference',
          'Req. Deliv. Date',
          'No. of Items',
          'Net Value',
          'Error Message',
        ]
      : type === 'incomplete'
      ? [
          'Sales Org',
          'Dist. Chnl',
          'Division',
          'Sold-to Party',
          'Customer Reference',
          'Req. Deliv. Date',
          'No. of Items',
          'Net Value',
          'Missing Fields',
        ]
      : [
          'Sales Org',
          'Dist. Chnl',
          'Division',
          'Sold-to Party',
          'Customer Reference',
          'Req. Deliv. Date',
          'No. of Items',
          'Net Value',
        ];

  const rows = data
    .map(
      (r) =>
        `<tr>${headers
          .map((h) => {
            const key = Object.keys(r).find(
              (k) =>
                k.toLowerCase().replace(/[^a-z]/g, '') ===
                h.toLowerCase().replace(/[^a-z]/g, '')
            );
            return `<td>${r[key] || '-'}</td>`;
          })
          .join('')}</tr>`
    )
    .join('');

  return `
    <h3 style="margin-top:15px; margin-bottom:10px;">
      ${
        type === 'complete'
          ? '🟩 Valid SOs – Ready to Create'
          : type === 'incomplete'
          ? '🟨 SOs with Incompletion Log'
          : '🟥 Invalid SOs – Error Details'
      }
    </h3>
    <table class="table" style="margin-bottom:20px;">
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/* ===== Tab switch ===== */
function showTab(name) {
  document
    .querySelectorAll('.tab-btn')
    .forEach((b) => b.classList.remove('active'));
  document
    .querySelectorAll('.tab-content')
    .forEach((t) => t.classList.remove('active'));
  document
    .querySelector(`.tab-btn[onclick*='${name}']`)
    .classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
}

/* ===== Create tất cả SO ===== */
function createAllSO() {
  const allData = [
    ...(window.completeData || []),
    ...(window.incompleteData || []),
  ];
  const errorData = window.errorData || [];
  const created = [],
    delivered = [],
    incomplete = [];

  allData.forEach((row) => {
    const so = nextSO();
    const rec = {
      so,
      salesOrg: row.SalesOrganization,
      distChnl: row.DistributionChannel,
      division: row.Division,
      soldTo: row.SoldToParty,
      shipTo: row.SoldToParty,
      custRef: row.CustomerReference,
      docDate: new Date().toISOString().slice(0, 10),
      noItems: row.NoOfItems,
      totalQty: row.NoOfItems * 5,
      payTerm: 'Z001',
      incoterm: 'EXW',
      netValue: row.NetValue,
      currency: 'VND',
      status: 'CREATED',
    };

    DB.items.unshift(rec);

    // ✅ Nếu SO hoàn chỉnh → auto Delivery + update status
    if (!row.MissingField) {
      autoCreateDelivery(rec);
      rec.status = 'DELIVERED';
      delivered.push(so);
    } else {
      rec.status = 'INCOMPLETE';
      incomplete.push(so);
    }

    created.push(so);
  });

  const msg = `Sales Order Creation Summary
-----------------------------------
✅ Delivered: ${delivered.length}
⚠️ Incomplete: ${incomplete.length}
❌ Failed: ${errorData.length}

Do you want to download Error Log (Excel)?`;

  if (confirm(msg) && errorData.length > 0) exportErrorLog(errorData);

  alert('SO creation completed. Redirecting to Tracking...');
  location.hash = '#/tracking';
}

/* ===== Export Error Log ===== */
function exportErrorLog(data) {
  if (!data.length) return;
  let csv = 'SalesOrg,DistChnl,Division,SoldToParty,CustomerRef,ErrorMessage\n';
  data.forEach((r) => {
    csv += `${r.SalesOrganization},${r.DistributionChannel},${r.Division},${r.SoldToParty},${r.CustomerReference},${r.ErrorMsg}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SO_ErrorLog_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}
