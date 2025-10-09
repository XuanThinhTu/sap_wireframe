/* ===== billing.js — SAP Wireframe Style (Item Details / Partner / Condition + Overview Blocks) ===== */

function Billing(billingNo) {
  // --- Tìm dữ liệu Billing ---
  let b = DB.billings?.find((x) => x.billingNo === billingNo);
  if (!b) {
    const dl = DB.deliveries.find(
      (x) => 'BI' + x.deliveryNo.slice(2) === billingNo
    );
    const so = DB.items.find((x) => 'BI' + x.so.slice(2) === billingNo);
    if (dl || so) {
      b = {
        billingNo,
        deliveryNo: dl?.deliveryNo || so?.delivery,
        soNo: dl?.soNo || so?.so,
        salesOrg: dl?.salesOrg || so?.salesOrg || '1000',
        distChnl: dl?.distChnl || so?.distChnl || '10',
        division: dl?.division || so?.division || '00',
        soldTo: dl?.soldTo || so?.soldTo,
        shipTo: dl?.shipTo || so?.shipTo,
        custRef: dl?.custRef || so?.custRef,
        date: new Date().toISOString().slice(0, 10),
        totalQty: dl?.totalQty || so?.totalQty || 10,
        netValue: '100,000',
        tax: '8,000',
        status: 'BILLED',
      };
      DB.billings.push(b);
    }
  }

  if (!b) {
    return `
      <h2>Billing Document</h2>
      <div class="muted">Billing ${billingNo} not found.</div>
      <button onclick="location.hash='#/tracking'">Back</button>
    `;
  }

  const fmtDate = (v) => {
    const d = new Date(v);
    return isNaN(d) ? v : d.toLocaleDateString('en-GB');
  };

  const date = fmtDate(b.date);
  const netValue = b.netValue || '100,000';
  const tax = b.tax || '8,000';

  /* --- HEADER BLOCK --- */
  const headerBlock = `
    <div class="billing-header" style="border:1px solid #ccc; padding:12px; margin-top:10px; font-size:13px;">
      <h3 style="background:#f5f5f5; padding:5px 8px; border-bottom:1px solid #ccc;">Header Level</h3>
      <table class="table-detail" style="width:100%; border-collapse:collapse; margin-top:6px;">
        <tbody>
          <tr>
            <td><strong>Billing type:</strong> Invoice</td>
            <td><strong>Net Value:</strong> ${netValue} VND</td>
            <td><strong>Tax:</strong> ${tax} VND</td>
          </tr>
          <tr>
            <td><strong>Billing document:</strong> ${b.billingNo}</td>
            <td><strong>Currency:</strong> VND</td>
            <td><strong>Dest. Country/Region:</strong> VN</td>
          </tr>
          <tr>
            <td><strong>Payer:</strong> 1003281</td>
            <td><strong>Company Code:</strong> FU24</td>
            <td><strong>Sales Area:</strong> FU24/FU/ED</td>
          </tr>
          <tr>
            <td><strong>Billing date:</strong> ${date}</td>
            <td><strong>Pricing Procedure:</strong> ZPR1</td>
            <td><strong>Tax Depart.:</strong> C/R</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  /* --- LINE ITEM BLOCK (shared by Item & Partner tab) --- */
  const lineItemBlock = `
    <div class="line-item" style="margin-top:20px; border:1px solid #ccc; padding:8px;">
      <h4 style="background:#f5f5f5; padding:4px 8px; margin:0 0 6px 0;">Line Item Overview</h4>
      <table class="table" style="width:100%; font-size:12px; border-collapse:collapse;">
        <thead style="background:#fafafa;">
          <tr>
            <th>Item</th><th>Material</th><th>Material Description</th><th>Billed Qty</th>
            <th>SU</th><th>Net value</th><th>Tax amount</th><th>Plant</th>
            <th>S.Loc</th><th>Sales Doc</th><th>Ref Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10</td><td>CPV0004</td><td>iPhone 16 Pro</td><td>${
              b.totalQty
            }</td>
            <td>EA</td><td>${netValue}</td><td>${tax}</td><td>FU24</td>
            <td>TG01</td><td>${b.soNo || '-'}</td><td>${
    b.deliveryNo || '-'
  }</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  /* --- CONDITION BLOCK (for tab Condition) --- */
  const conditionBlock = `
    <div class="condition-overview" style="margin-top:20px; border:1px solid #ccc; padding:8px;">
      <h4 style="background:#f5f5f5; padding:4px 8px; margin:0 0 6px 0;">Condition Overview</h4>
      <table class="table" style="width:100%; font-size:12px; border-collapse:collapse;">
        <thead style="background:#fafafa;">
          <tr>
            <th>Inactive</th><th>CnTy</th><th>Des.cr</th><th>Amount</th>
            <th>Crcy</th><th>per</th><th>Unit of Measure</th><th>Condition Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>-</td><td>PR00</td><td>Base Price</td><td>${netValue}</td>
            <td>VND</td><td>1</td><td>EA</td><td>${netValue}</td>
          </tr>
          <tr>
            <td>-</td><td>MWST</td><td>Tax</td><td>${tax}</td>
            <td>VND</td><td>1</td><td>EA</td><td>${tax}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  /* --- TABS --- */
  const tabs = `
    <div class="tab-bar" style="margin-top:20px; margin-bottom:10px;">
      <button class="tab-btn active" onclick="showBillingTab('details')">Item Details</button>
      <button class="tab-btn" onclick="showBillingTab('partner')">Partner</button>
      <button class="tab-btn" onclick="showBillingTab('condition')">Condition</button>
    </div>
  `;

  /* --- TAB 1: ITEM DETAILS --- */
  const tabDetails = `
    <div id="tab-details" class="tab-content active" style="display:block;">
      <table class="table-detail" style="width:100%; font-size:13px;">
        <tbody>
          <tr><td><strong>Sales Document Item:</strong> 10</td><td></td><td></td></tr>
          <tr><td><strong>Material:</strong> CPV0004</td><td>iPhone 16 Pro</td><td><strong>Division:</strong> ${
            b.division
          }</td></tr>
          <tr><td><strong>Material Group:</strong> SFTY</td><td><strong>Unit:</strong> EA</td><td><strong>Item Category:</strong> TAN</td></tr>
          <tr><td><strong>Billed Quantity:</strong> ${
            b.totalQty
          }</td><td></td><td><strong>Sales Document:</strong> ${
    b.soNo || '-'
  }</td></tr>
          <tr><td><strong>Plant:</strong> FU24</td><td></td><td><strong>Reference Doc.:</strong> ${
            b.deliveryNo || '-'
          }</td></tr>
        </tbody>
      </table>
      ${lineItemBlock}
    </div>
  `;

  /* --- TAB 2: PARTNER --- */
  const tabPartner = `
    <div id="tab-partner" class="tab-content" style="display:none;">
      <div style="border:1px solid #ccc; padding:12px; width:45%; font-size:13px;">
        <h3 style="background:#f5f5f5; padding:5px 8px; border-bottom:1px solid #ccc;">Partner Details</h3>
        <table class="table-detail" style="width:100%; margin-top:8px;">
          <tbody>
            <tr><td><strong>Sold-to Party:</strong> ${b.soldTo}</td></tr>
            <tr><td><strong>Ship-to Party:</strong> ${b.shipTo}</td></tr>
            <tr><td><strong>Bill-to Party:</strong> ${b.soldTo}</td></tr>
            <tr><td><strong>Payer:</strong> 1003281</td></tr>
            <tr><td><strong>Company Code:</strong> FU24</td></tr>
          </tbody>
        </table>
      </div>
      ${lineItemBlock}
    </div>
  `;

  /* --- TAB 3: CONDITION --- */
  const tabCondition = `
    <div id="tab-condition" class="tab-content" style="display:none;">
      <div style="border:1px solid #ccc; padding:12px; width:45%; font-size:13px;">
        <h3 style="background:#f5f5f5; padding:5px 8px; border-bottom:1px solid #ccc;">Pricing Condition</h3>
        <table class="table-detail" style="width:100%; margin-top:8px;">
          <tbody>
            <tr><td><strong>Pricing Date:</strong> ${date}</td></tr>
            <tr><td><strong>Net value:</strong> ${netValue} VND</td></tr>
            <tr><td><strong>Tax amount:</strong> ${tax} VND</td></tr>
          </tbody>
        </table>
      </div>
      ${conditionBlock}
    </div>
  `;

  /* --- RETURN PAGE --- */
  return `
    <div style="display:flex; align-items:center; justify-content:space-between;">
  <h2>Billing Document — ${b.billingNo}</h2>

  <div style="display:flex; gap:8px;">
    <!-- 🔹 Button Cancel -->
    <button class="sap-btn" style="min-width:90px; background:#fff3cd; border:1px solid #ffb300; color:#8a6d3b;"
      onclick="openCancelScreen('${b.billingNo}')">
      Cancel
    </button>

    <!-- 🔹 Button Display/Change -->
    <button class="sap-btn" style="min-width:100px;">Display / Change</button>

    <!-- 🔹 Button Document Flow -->
    <button class="sap-btn" style="min-width:120px;" onclick="openDocumentFlow('${b.soNo}')">
      Document Flow
    </button>
  </div>
</div>


    ${headerBlock}
    ${tabs}
    ${tabDetails}
    ${tabPartner}
    ${tabCondition}

    <div class="btnbar" style="margin-top:20px; display:flex; justify-content:flex-end; gap:8px;">
      <button class="primary-btn" onclick="postBilling('${billingNo}')">Post to FI</button>
      <button onclick="location.hash='#/tracking'">Back</button>
    </div>
  `;
}

/* ===== Tab switching ===== */
function showBillingTab(name) {
  document
    .querySelectorAll('.tab-btn')
    .forEach((b) => b.classList.remove('active'));
  document
    .querySelector(`.tab-btn[onclick*="${name}"]`)
    .classList.add('active');
  document
    .querySelectorAll('.tab-content')
    .forEach((t) => (t.style.display = 'none'));
  document.getElementById(`tab-${name}`).style.display = 'block';
}

/* ===== Post Billing ===== */
function postBilling(billingNo) {
  const b = DB.billings?.find((x) => x.billingNo === billingNo);
  if (!b) return alert('Billing not found.');

  b.status = 'BILLED';
  const so = DB.items.find((x) => x.so === b.soNo || x.custRef === b.custRef);
  const dl = DB.deliveries.find(
    (x) => x.deliveryNo === b.deliveryNo || x.custRef === b.custRef
  );
  if (so) so.status = 'BILLED';
  if (dl) dl.status = 'BILLED';

  console.log('✅ Posted Billing:', b);
  alert(`✅ Billing document ${b.billingNo} successfully posted to FI!`);

  location.hash = '#/tracking';
  setTimeout(() => filterStatus('BILLED'), 50);
}
