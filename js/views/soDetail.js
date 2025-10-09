function SODetail(so) {
  const x = DB.items.find((i) => i.so === so);
  if (!x) return `<h2>Sales Order not found</h2>`;

  return `
    <h2 style="display:flex;align-items:center;gap:10px;">
      <span>Sales Order Detail — ${x.so}${
    x.delivery ? ' - ' + x.delivery : ''
  }</span>

      <!-- 🟦 Display/Change Button -->
      <button class="sap-btn-mode" title="Display / Change Mode">
        <span class="sap-icon">🖋️</span> Display / Change
      </button>

      <!-- 🟧 Document Flow Button -->
      <button class="sap-btn-flow" title="View Document Flow" onclick="openDocumentFlow('${
        x.so
      }')">
        <span class="sap-icon">🔗</span> Document Flow
      </button>
    </h2>


    <!-- Header Info -->
    <div class="so-header">
      <div class="so-col">
        <div><strong>Order:</strong> ${x.so}</div>
        <div><strong>Sold-to party:</strong> ${x.soldTo || '—'}</div>
        <div><strong>Ship-to party:</strong> ${
          x.shipTo || x.soldTo || '—'
        }</div>
        <div><strong>Cust. Reference:</strong> ${x.custRef || '-'}</div>
        <div><strong>Sales Area:</strong> ${x.salesOrg || '1000'} / ${
    x.distChnl || '10'
  } / ${x.division || '00'}</div>
      </div>

      <div class="so-col">
        <div><strong>Net value:</strong> ${x.netValue || '0'} ${
    x.currency || 'VND'
  }</div>
        <div><strong>Doc. date:</strong> ${x.docDate || '-'}</div>
        <div><strong>Payment term:</strong> ${x.payTerm || 'Z001'}</div>
        <div><strong>Incoterm:</strong> ${x.incoterm || 'EXW'}</div>
        <div><strong>Req. Deliv. date:</strong> ${x.reqDelivDate || '—'}</div>
        <div><strong>Pricing date:</strong> ${x.docDate || '-'}</div>
      </div>

      <div class="so-col">
        <div><strong>Total Weight:</strong> ${(x.totalQty * 0.68).toFixed(
          1
        )} KG</div>
        <div><strong>Total Volume:</strong> ${(x.totalQty * 0.2).toFixed(
          2
        )} m³</div>
        <div><strong>Bill-to party:</strong> ${
          x.billTo || x.soldTo || '-'
        }</div>
        <div><strong>Payer:</strong> ${x.payer || x.soldTo || '-'}</div>
      </div>
    </div>

    <hr style="margin:20px 0;">

    <!-- Tabs Section -->
    <div class="subtab-bar">
      <button class="subtab-btn active" onclick="showSubTab('item')">Item Detail</button>
      <button class="subtab-btn" onclick="showSubTab('shipping')">Shipping</button>
      <button class="subtab-btn" onclick="showSubTab('procurement')">Procurement</button>
    </div>

    <!-- Tab Content -->
    <div id="tab-item" class="subtab-content active">${renderItemDetail(
      x
    )}</div>
    <div id="tab-shipping" class="subtab-content">${renderShippingDetail(
      x
    )}</div>
    <div id="tab-procurement" class="subtab-content">${renderProcurementDetail(
      x
    )}</div>


    <hr style="margin:20px 0;">
    <div class="so-status">
      <div><strong>Status:</strong> ${renderStatus(x.status)}</div>
    </div>

    <div class="btnbar" style="margin-top:15px; text-align:right; display:flex; justify-content:flex-end; gap:8px;">
      <button class="primary-btn" onclick="saveSO('${x.so}')">Save</button>
      <button onclick="location.hash='#/tracking'">Back</button>
    </div>

  `;
}

/* ====== Tab Switch (Item / Shipping / Procurement / Partner) ====== */
function showSubTab(name) {
  // Gỡ active tất cả nút tab
  document
    .querySelectorAll('.subtab-btn')
    .forEach((b) => b.classList.remove('active'));

  // Ẩn toàn bộ nội dung tab
  document
    .querySelectorAll('.subtab-content')
    .forEach((t) => t.classList.remove('active'));

  // Kích hoạt đúng tab được chọn
  document
    .querySelector(`.subtab-btn[onclick*='${name}']`)
    ?.classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
}

/* ====== Render từng tab ====== */
function renderItemDetail(x) {
  return `
  <table class="table-detail" style="width:100%; border-collapse:collapse;">
    <tr>
      <td colspan="6" style="background:#f7f7f7; font-weight:bold;">Item Detail</td>
    </tr>

    <tr>
      <td colspan="6" style="padding:4px 8px;">
        <button class="nav-btn">«</button>
        <button class="nav-btn">‹</button>
        <button class="nav-btn">›</button>
        <button class="nav-btn">»</button>
        <span style="margin-left:10px;">Sales Document Item: <strong>10</strong></span>
      </td>
    </tr>

    <tr>
      <td><strong>Material:</strong> CPV0004</td>
      <td>Iphone 16 Pro</td>
      <td><strong>Material Group:</strong> SFTY</td>
    </tr>
    <tr>
      <td><strong>Order Quantity:</strong> ${x.totalQty || 10}</td>
      <td>EA</td>
      <td><strong>Division:</strong> ${x.division || '00'}</td>
    </tr>
    <tr>
      <td><strong>Plant:</strong> FU24</td>
      <td></td>
      <td><strong>Item Category:</strong> TAN</td>
    </tr>
    <tr>
      <td><strong>Net Weight:</strong></td>
      <td></td>
      <td><strong>Amount:</strong> 1,000 VND</td>
    </tr>
    <tr>
      <td><strong>Gross Weight:</strong></td>
      <td></td>
      <td><strong>Net Price:</strong> 10,000 VND</td>
    </tr>
    <tr>
      <td><strong>Volume:</strong></td>
      <td colspan="2"></td>
    </tr>
  </table>

  <!-- 🧱 Block: All Items + Delivery/Pricing -->
<h3 style="margin-top:25px; font-size:13px;">ALL ITEMS</h3>
<table class="table-item" style="width:100%; font-size:13px; border-collapse:collapse;">
  <thead>
    <tr>
      <th>Chọn</th>
      <th>Item</th>
      <th>Material</th>
      <th>Order Quantity</th>
      <th>Sales Unit</th>
      <th>Item Description</th>
      <th>ItCa</th>
      <th>Higher-level Item</th>
      <th>Delivery Date</th>
      <th>Plant</th>
      <th>CnTy</th>
      <th>Amount</th>
      <th>Per</th>
      <th>Crcy</th>
      <th>Net Price</th>
      <th>Shipping Point</th>
      <th>Overall Status</th>
      <th>Rejection Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input type="checkbox" checked></td>
      <td>10</td>
      <td>CPV0004</td>
      <td>${x.totalQty || 10}</td>
      <td>EA</td>
      <td>iPhone 16 Pro</td>
      <td>TAN</td>
      <td>-</td>
      <td>${x.reqDelivDate || '07/08/2025'}</td>
      <td>${x.plant || 'FU24'}</td>
      <td>ZPRB</td>
      <td>1,000</td>
      <td>1</td>
      <td>VND</td>
      <td>10,000</td>
      <td>${x.plant || 'HCM1'}</td>
      <td>Fully delivery</td>
      <td>-</td>
    </tr>
    ${Array(5)
      .fill('<tr><td colspan="18" style="height:20px;"></td></tr>')
      .join('')}
  </tbody>
</table>

  `;
}

function renderShippingDetail(x) {
  return `
  <table class="table-detail" style="width:100%; border-collapse:collapse;">
    <tr>
      <td colspan="6" style="background:#f7f7f7; font-weight:bold;">Shipping</td>
    </tr>

    <!-- Navigation row -->
    <tr>
      <td colspan="6" style="padding:4px 8px;">
        <button class="nav-btn">«</button>
        <button class="nav-btn">‹</button>
        <button class="nav-btn">›</button>
        <button class="nav-btn">»</button>
        <span style="margin-left:10px;">Sales Document Item: <strong>10</strong></span>
      </td>
    </tr>

    <!-- Shipping fields -->
    <tr>
      <td><strong>Material:</strong> CPV0004</td>
      <td colspan="2"></td>
      <td><strong>Transportation plan:</strong> 07/08/2025</td>
    </tr>
    <tr>
      <td><strong>Ship-to party:</strong> ${x.shipTo || x.soldTo || ''}</td>
      <td colspan="2"></td>
      <td><strong>Delivery date:</strong> ${x.reqDelivDate || '07/08/2025'}</td>
    </tr>
    <tr>
      <td><strong>Confirmed Qty:</strong> ${x.totalQty || 10}</td>
      <td colspan="2"></td>
      <td><strong>Mat.av.dt:</strong> 07/08/2025</td>
    </tr>
    <tr>
      <td><strong>Delivery Priority:</strong> 0</td>
      <td colspan="2"></td>
      <td><strong>Loading dt:</strong> 07/08/2025</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td><strong>Shipping point:</strong> ${x.plant || 'HCM1'}</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td><strong>S.Log:</strong></td>
    </tr>
    <tr>
      <td colspan="3"></td>
      <td><strong>Overall Status:</strong> fully delivery</td>
    </tr>
    <tr>
      <td colspan="3"></td>
      <td><strong>Delivered qty:</strong> ${x.totalQty || 10}</td>
    </tr>
  </table>

  <!-- 🧱 Block: All Items + Delivery/Pricing -->
<h3 style="margin-top:25px; font-size:13px;">ALL ITEMS</h3>
<table class="table" style="width:100%; font-size:13px; border-collapse:collapse;">
  <thead>
    <tr>
      <th>Chọn</th>
      <th>Item</th>
      <th>Material</th>
      <th>Order Quantity</th>
      <th>Sales Unit</th>
      <th>Item Description</th>
      <th>ItCa</th>
      <th>Higher-level Item</th>
      <th>Delivery Date</th>
      <th>Plant</th>
      <th>CnTy</th>
      <th>Amount</th>
      <th>Per</th>
      <th>Crcy</th>
      <th>Net Price</th>
      <th>Shipping Point</th>
      <th>Overall Status</th>
      <th>Rejection Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input type="checkbox" checked></td>
      <td>10</td>
      <td>CPV0004</td>
      <td>${x.totalQty || 10}</td>
      <td>EA</td>
      <td>iPhone 16 Pro</td>
      <td>TAN</td>
      <td>-</td>
      <td>${x.reqDelivDate || '07/08/2025'}</td>
      <td>${x.plant || 'FU24'}</td>
      <td>ZPRB</td>
      <td>1,000</td>
      <td>1</td>
      <td>VND</td>
      <td>10,000</td>
      <td>${x.plant || 'HCM1'}</td>
      <td>Fully delivery</td>
      <td>-</td>
    </tr>
    ${Array(5)
      .fill('<tr><td colspan="18" style="height:20px;"></td></tr>')
      .join('')}
  </tbody>
</table>

  `;
}

function renderProcurementDetail(x) {
  return `
  <table class="table-detail" style="width:100%; border-collapse:collapse;">
    <tr>
      <td colspan="6" style="background:#f7f7f7; font-weight:bold;">Procurement</td>
    </tr>
    <tr>
      <td colspan="6" style="padding:4px 8px;">
        <button class="nav-btn">«</button>
        <button class="nav-btn">‹</button>
        <button class="nav-btn">›</button>
        <button class="nav-btn">»</button>
        <span style="margin-left:10px;">Sales Document Item: <strong>10</strong></span>
      </td>
    </tr>

    <tr>
      <td><strong>Material:</strong> CPV0004</td>
      <td></td>
      <td><strong>Billing date:</strong> ${x.docDate || '07/08/2025'}</td>
    </tr>
    <tr>
      <td><strong>Bill-to party:</strong> ${x.billTo || x.soldTo || '-'}</td>
      <td></td>
      <td><strong>Tax classific.:</strong> V1</td>
    </tr>
    <tr>
      <td><strong>Payer:</strong> ${x.payer || x.soldTo || '-'}</td>
      <td></td>
      <td><strong>Tax:</strong> Included</td>
    </tr>
    <tr>
      <td><strong>Net:</strong> ${x.netValue || '10,000 VND'}</td>
      <td colspan="2"></td>
    </tr>
  </table>

  <!-- 🧾 Pricing Condition Table -->
  <h3 style="margin-top:25px; font-size:13px;">Pricing Conditions</h3>
  <table class="table-detail" style="width:100%; font-size:13px; border-collapse:collapse;">
    <thead>
      <tr>
        <th>Inactive</th>
        <th>CnTy</th>
        <th>Des.cr</th>
        <th>Amount</th>
        <th>Crcy</th>
        <th>Per</th>
        <th>Unit of Measure</th>
        <th>Condition Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>xanh</td>
        <td>ZPRB</td>
        <td>Base price</td>
        <td>1,000</td>
        <td>VND</td>
        <td>1</td>
        <td>EA</td>
        <td>10,000</td>
      </tr>
      <tr><td colspan="8" style="height:20px;"></td></tr>
      <tr>
        <td>đỏ (chưa có giá)</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      ${Array(3)
        .fill('<tr><td colspan="8" style="height:20px;"></td></tr>')
        .join('')}
    </tbody>
  </table>
  `;
}

/* ====== Action: Save Sales Order ====== */
function saveSO(soNo) {
  const so = DB.items.find((i) => i.so === soNo);
  if (!so) return alert('⚠️ Sales Order not found.');

  // Nếu chưa có Delivery thì tự tạo mới
  if (!so.delivery) {
    autoCreateDelivery(so);
    so.status = 'DELIVERED';
    alert(
      `✅ SO ${so.so} has been saved.\nDelivery ${so.delivery} automatically created.`
    );
  } else {
    so.status = 'DELIVERED';
    alert(`✅ SO ${so.so} has been saved and marked as DELIVERED.`);
  }

  console.log('✅ Updated Sales Order:', so);

  // Quay lại tracking sau khi lưu
  location.hash = '#/tracking';
  setTimeout(() => filterStatus('DELIVERED'), 100);
}
