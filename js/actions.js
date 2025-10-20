/* ====== SALES / DELIVERY / BILLING ACTIONS (with unified status) ====== */

// 🚀 Auto create Delivery from SO
function autoCreateDelivery(soObj) {
  soObj.delivery = nextDL();
  soObj.status = 'IN_PROCESS';

  const newDelivery = {
    deliveryNo: soObj.delivery,
    soNo: soObj.so,
    salesOrg: soObj.salesOrg,
    distChnl: soObj.distChnl,
    division: soObj.division,
    soldTo: soObj.soldTo,
    shipTo: soObj.shipTo,
    custRef: soObj.custRef,
    date: new Date().toISOString().slice(0, 10),
    totalQty: soObj.totalQty,
    status: 'OPEN',
  };
  DB.deliveries.unshift(newDelivery);

  console.log(
    `✅ Delivery ${newDelivery.deliveryNo} created for SO ${soObj.so}`
  );
}

// 🚀 Post Goods Issue (PGI)
function postGI(soObj) {
  if (!soObj.delivery) {
    console.warn('⚠️ No delivery found for SO:', soObj.so);
    return false;
  }
  const dl = DB.deliveries.find((d) => d.deliveryNo === soObj.delivery);
  if (dl) dl.status = 'IN_PROCESS';

  soObj.gi = true;
  soObj.status = 'IN_PROCESS';
  console.log(`✅ PGI posted for SO ${soObj.so}`);
  return true;
}

// 🚀 Create Billing
function createBilling(soObj) {
  if (!soObj.gi) {
    console.warn('⚠️ Cannot create billing: PGI not done.');
    return false;
  }

  const biNo = nextBI();
  soObj.billing = biNo;
  soObj.status = 'COMPLETED';

  const newBilling = {
    billingNo: biNo,
    soNo: soObj.so,
    deliveryNo: soObj.delivery,
    salesOrg: soObj.salesOrg,
    distChnl: soObj.distChnl,
    division: soObj.division,
    soldTo: soObj.soldTo,
    shipTo: soObj.shipTo,
    custRef: soObj.custRef,
    date: new Date().toISOString().slice(0, 10),
    totalQty: soObj.totalQty,
    netValue: soObj.netValue || '100,000',
    tax: '8,000',
    status: 'COMPLETED',
  };
  DB.billings.unshift(newBilling);

  const dl = DB.deliveries.find((d) => d.deliveryNo === soObj.delivery);
  if (dl) dl.status = 'COMPLETED';

  console.log(`✅ Billing ${biNo} created for SO ${soObj.so}`);
  return true;
}

// 🚀 Cancel SO
function cancelSO(soObj, reason = 'User Request') {
  soObj.cancelled = reason;
  soObj.status = 'INCOMPLETE';
  const dl = DB.deliveries.find((d) => d.deliveryNo === soObj.delivery);
  const bi = DB.billings.find((b) => b.billingNo === soObj.billing);
  if (dl) dl.status = 'INCOMPLETE';
  if (bi) bi.status = 'INCOMPLETE';
  console.log(`❌ SO ${soObj.so} cancelled. Reason: ${reason}`);
}

/* ====== Document Flow View ====== */
function openDocumentFlow(docNo) {
  const so = DB.items.find((s) => s.so === docNo);
  const dl = DB.deliveries.find(
    (d) => d.soNo === docNo || d.custRef === so?.custRef
  );
  const bi = DB.billings.find(
    (b) => b.soNo === docNo || b.deliveryNo === dl?.deliveryNo
  );

  // ✅ Determine textual process phase
  const processStatus = (st) => {
    switch (st) {
      case 'OPEN':
        return 'Open';
      case 'IN_PROCESS':
        return 'In Process';
      case 'COMPLETED':
        return 'Completed';
      case 'INCOMPLETE':
        return 'Incomplete';
      default:
        return '—';
    }
  };

  const flowData = [
    {
      step: 'Sales Order',
      no: so?.so || '-',
      status: processStatus(so?.status),
    },
    {
      step: 'Delivery',
      no: dl?.deliveryNo || '-',
      status: processStatus(dl?.status),
    },
    {
      step: 'Post Goods Issue',
      no: dl?.deliveryNo || '-',
      status: processStatus(dl?.status),
    },
    {
      step: 'Billing',
      no: bi?.billingNo || '-',
      status: processStatus(bi?.status),
    },
  ];

  const rows = flowData
    .map(
      (r) => `
      <tr>
        <td><strong>${r.step}</strong></td>
        <td>${r.no}</td>
        <td>${renderStatus(r.status.toUpperCase())}</td>
      </tr>`
    )
    .join('');

  const html = `
    <h2>Document Flow — ${docNo}</h2>
    <table class="table" style="width:60%; margin-top:10px; border-collapse:collapse;">
      <thead style="background:#f5f5f5;">
        <tr><th>Step</th><th>Document No.</th><th>Status</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="btnbar" style="margin-top:20px;">
      <button onclick="location.hash='#/tracking'">Back</button>
    </div>
  `;

  document.getElementById('app').innerHTML = html;
}

/* ===== Global: Render Unified Status / Phase Pill ===== */
function renderStatus(status) {
  // ✅ Cho phép mapping cả Process Phase (ORDER / DELIVERY / INVOICE / ACCOUNT_*)
  // và legacy status (DELIVERED / PGI_POSTED / BILLED / etc.)

  let label = status || 'CREATED';
  let bg = '#e0e0e0',
    color = '#000';

  const phaseMap = {
    ORDER: { bg: '#fff3cd', color: '#856404', label: 'Order processing' },
    DELIVERY: { bg: '#d9edf7', color: '#31708f', label: 'Delivery processing' },
    INVOICE: { bg: '#dff0d8', color: '#3c763d', label: 'Invoice processing' },
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

  const legacyMap = {
    INCOMPLETE: { bg: '#fff3cd', color: '#856404', label: 'Incomplete' },
    DELIVERED: { bg: '#d9edf7', color: '#31708f', label: 'Delivered' },
    PGI_POSTED: { bg: '#dff0d8', color: '#3c763d', label: 'PGI Posted' },
    BILLED: { bg: '#c8e6c9', color: '#256029', label: 'Billed' },
    CANCELLED: { bg: '#f2dede', color: '#a94442', label: 'Cancelled' },
    COMPLETED: { bg: '#c8e6c9', color: '#256029', label: 'Completed' },
    CREATED: { bg: '#fcf8e3', color: '#8a6d3b', label: 'Created' },
  };

  const map = phaseMap[status] || legacyMap[status];
  if (map) ({ bg, color, label } = map);

  return `
    <div style="
      background:${bg};
      color:${color};
      font-weight:bold;
      padding:4px 8px;
      border-radius:3px;
      text-align:center;
      min-width:120px;
      display:inline-block;">
      ${label}
    </div>`;
}
