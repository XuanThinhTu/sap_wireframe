/* ===== pgi.js — Post Goods Issue (with Tabs: Material / Processing / Shipment + All Items) ===== */

function PGI(deliveryNo) {
  // --- Tìm dữ liệu Delivery ---
  let d = DB.deliveries?.find((x) => x.deliveryNo === deliveryNo);
  if (!d) {
    const so = DB.items?.find((x) => 'DL' + x.so.slice(2) === deliveryNo);
    if (so) {
      d = {
        deliveryNo,
        salesOrg: so.salesOrg,
        distChnl: so.distChnl,
        division: so.division,
        soldTo: so.soldTo,
        shipTo: so.shipTo || so.soldTo,
        date: so.reqDelivDate || so.docDate,
        totalQty: so.totalQty,
        status: so.status || 'DELIVERED',
      };
      DB.deliveries.push(d); // thêm vào DB.deliveries nếu chưa có
    }
  }

  if (!d) {
    return `
      <h2>Post Goods Issue</h2>
      <div class="muted">Delivery ${deliveryNo} not found.</div>
      <button onclick="location.hash='#/tracking'">Back</button>
    `;
  }

  const fmt = (v) => {
    if (!v) return '-';
    const dt = new Date(v);
    if (isNaN(dt)) return v;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${dt.getFullYear()}`;
  };

  const planned = fmt(d.date || new Date());
  const weight = ((d.totalQty || 10) * 0.68).toFixed(0);
  const volume = ((d.totalQty || 10) * 0.2).toFixed(2);
  const time00 = '00:00';
  const td = (label, val) =>
    `<td style="width:40%;"><strong>${label}</strong> ${val || '-'}</td>`;
  const empty = '<td></td>';

  /* --- HEADER LEVEL --- */
  const headerHTML = `
    <h2>Post Goods Issue</h2>
    <table class="table-detail" style="width:100%; table-layout:fixed; font-size:13px; margin-top:10px;">
      <tbody>
        <tr><th colspan="4" style="text-align:left;background:#f5f5f5">Header level</th></tr>
        <tr>${td('Outbound delivery number:', d.deliveryNo)}${td(
    'Sales org:',
    d.salesOrg || '1000'
  )}</tr>
        <tr>${td('Ship-to party:', d.shipTo)}${td(
    'Distri.channel:',
    d.distChnl || '10'
  )}</tr>
        <tr>${td('Document date:', planned)}${td(
    'Division:',
    d.division || '00'
  )}</tr>
        <tr><td colspan="4" style="background:#f5f5f5;height:6px"></td></tr>
        <tr>${td('Planned GI date:', planned)}${td('Time:', time00)}${td(
    'Total weight:',
    weight
  )}${td('Unit of weight:', 'KG')}</tr>
        <tr>${td('Actual GI date:', planned)}${td('Time:', time00)}${td(
    'No. of packages:',
    Math.ceil((d.totalQty || 10) / 5)
  )}${td('Volume:', volume)}</tr>
        <tr>${td('Picked date:', planned)}${td('Time:', time00)}${td(
    'Picking status:',
    '-'
  )} ${td('Wm activity status:', '-')}</tr>
        <tr>${td('Warehouse no:', '-')} ${td('Loading date:', planned)}${td(
    'Time:',
    time00
  )}${td('Loading point:', '-')}</tr>
        <tr>${td('Door for Whs:', '-')} ${td('Staging area:', '-')} ${td(
    'Transptn plan:',
    planned
  )}${td('Route:', '-')}</tr>
        <tr>${td('Transptn status:', '-')} ${td('Route schedule:', '-')} ${td(
    'Pl. gds mvmt date:',
    planned
  )}${td('Time:', time00)}</tr>
        <tr>${td('Act. gds mvmt date:', planned)}${td('Time:', time00)}${td(
    'Gds mvmt status:',
    d.status
  )}${empty}</tr>
      </tbody>
    </table>
  `;

  /* --- TABS --- */
  const tabs = `
    <div class="tab-bar" style="margin-top:20px; margin-bottom:10px;">
      <button class="tab-btn active" onclick="showPGITab('material')">Material</button>
      <button class="tab-btn" onclick="showPGITab('processing')">Processing</button>
      <button class="tab-btn" onclick="showPGITab('shipment')">Shipment</button>
    </div>
  `;

  /* --- TAB: MATERIAL --- */
  const materialTab = `
    <div id="tab-material" class="tab-content active">
      <table class="table-detail" style="width:60%; font-size:13px;">
        <tbody>
          <tr><th colspan="2" style="text-align:left;background:#f5f5f5">Material</th></tr>
          <tr><td><strong>Item:</strong> 10</td><td></td></tr>
          <tr><td><strong>Material:</strong> CPV0004</td><td></td></tr>
          <tr><td><strong>Description:</strong> iPhone 16 promax</td><td></td></tr>
          <tr><td><strong>Item category:</strong> TAN</td><td></td></tr>
          <tr><td><strong>Quantity:</strong> ${
            d.totalQty || 10
          }</td><td></td></tr>
          <tr><td><strong>Unit:</strong> EA</td><td></td></tr>
          <tr><td><strong>Ref doc:</strong> 3273</td><td><strong>Unit:</strong> KG</td></tr>
          <tr><td><strong>Batch:</strong> -</td><td></td></tr>
          <tr><td><strong>Gross weight:</strong> ${weight}</td><td><strong>Unit:</strong> KG</td></tr>
          <tr><td><strong>Net weight:</strong> -</td><td></td></tr>
          <tr><td><strong>Volume:</strong> ${volume}</td><td></td></tr>
        </tbody>
      </table>
    </div>
  `;

  /* --- TAB: PROCESSING --- */
  const processingTab = `
    <div id="tab-processing" class="tab-content" style="display:none;">
      <table class="table-detail" style="width:60%; font-size:13px;">
        <tbody>
          <tr><th colspan="2" style="text-align:left;background:#f5f5f5">Processing</th></tr>
          <tr><td><strong>Item:</strong> 10</td><td></td></tr>
          <tr><td><strong>Material:</strong> CPV0004</td><td></td></tr>
          <tr><td><strong>Plant:</strong> FU24</td><td></td></tr>
          <tr><td><strong>S.Loc:</strong> TG01</td><td></td></tr>
          <tr><td><strong>S.Bin:</strong> -</td><td></td></tr>
          <tr><td><strong>Picking st:</strong> C</td><td></td></tr>
          <tr><td><strong>Packing st:</strong> -</td><td></td></tr>
          <tr><td><strong>Good issue st:</strong> C</td><td></td></tr>
          <tr><td><strong>Billing st:</strong> C</td><td></td></tr>
          <tr><td><strong>Requiment segment:</strong> -</td><td></td></tr>
          <tr><td><strong>Stock segment:</strong> -</td><td></td></tr>
        </tbody>
      </table>
    </div>
  `;

  /* --- TAB: SHIPMENT --- */
  const shipmentTab = `
    <div id="tab-shipment" class="tab-content" style="display:none;">
      <table class="table-detail" style="width:60%; font-size:13px;">
        <tbody>
          <tr><th colspan="2" style="text-align:left;background:#f5f5f5">Shipment</th></tr>
          <tr><td><strong>Item:</strong> 10</td><td></td></tr>
          <tr><td><strong>Material:</strong> CPV0004</td><td></td></tr>
          <tr><td><strong>Distri channel:</strong> FU</td><td></td></tr>
          <tr><td><strong>Division:</strong> ED</td><td></td></tr>
          <tr><td><strong>Ship-to party:</strong> 1003281</td><td></td></tr>
          <tr><td><strong>Loading group:</strong> 0001</td><td></td></tr>
          <tr><td><strong>Movement type:</strong> 601</td><td></td></tr>
          <tr><td><strong>Picked quantity:</strong> 10</td><td></td></tr>
          <tr><td><strong>Delivery quantity:</strong> 10</td><td></td></tr>
          <tr><td><strong>Del.lo Tzone:</strong> -</td><td></td></tr>
          <tr><td><strong>Text:</strong> -</td><td></td></tr>
        </tbody>
      </table>
    </div>
  `;

  /* --- BLOCK: ALL ITEMS --- */
  const allItemsHTML = `
    <div class="all-items" style="margin-top:25px; border:1px solid #ccc; padding:10px;">
      <h3 style="margin-bottom:10px;">All Items</h3>
      <table class="table" style="width:100%; font-size:12px;">
        <thead style="background:#f5f5f5;">
          <tr>
            <th>Item</th><th>Material</th><th>Deli.quantity</th><th>Sales unit</th>
            <th>Description</th><th>Picked quantity</th><th>Gross weight</th><th>Unit</th>
            <th>Volume</th><th>Unit</th><th>Item category</th><th>Part deli indi</th>
            <th>HL item</th><th>Batch split indi</th><th>Cus.mat number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10</td><td>CPV0004</td><td>10</td><td>EA</td><td>Iphone 16 promax</td>
            <td>10</td><td>680</td><td>KG</td><td>4.00</td><td>CBM</td><td>TAN</td>
            <td>Y</td><td>0001</td><td>N</td><td>IP16PROMAX</td>
          </tr>
          <tr>
            <td>20</td><td>CPV0005</td><td>5</td><td>EA</td><td>Iphone 16 Plus</td>
            <td>5</td><td>340</td><td>KG</td><td>2.00</td><td>CBM</td><td>TAN</td>
            <td>N</td><td>0002</td><td>N</td><td>IP16PLUS</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  return `
    ${headerHTML}
    ${tabs}
    ${materialTab}
    ${processingTab}
    ${shipmentTab}
    ${allItemsHTML}
    <div class="btnbar" style="margin-top:20px;">
      <button class="primary-btn" onclick="postPGI('${deliveryNo}')">Post Goods Issue</button>
      <button onclick="location.hash='#/tracking'">Back</button>
    </div>
  `;
}

/* ===== Chuyển tab ===== */
function showPGITab(name) {
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

/* ===== Action: Post PGI ===== */
function postPGI(deliveryNo) {
  const d = DB.deliveries?.find((x) => x.deliveryNo === deliveryNo);
  if (!d) return alert('Delivery not found.');

  // ✅ Cập nhật trạng thái delivery
  d.status = 'PGI_POSTED';

  // ✅ Cập nhật SO tương ứng (nếu có)
  const relatedSO = DB.items.find(
    (x) =>
      x.custRef === d.custRef ||
      'DL' + x.so.slice(2) === deliveryNo ||
      (x.soldTo === d.soldTo && x.totalQty === d.totalQty)
  );
  if (relatedSO) relatedSO.status = 'PGI_POSTED';

  console.log('✅ Updated Delivery:', d);
  console.log('✅ Updated SO:', relatedSO);

  alert(`✅ PGI successfully posted for ${deliveryNo}`);
  location.hash = '#/tracking';
  rerender();
}
