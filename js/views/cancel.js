/* ===== cancel.js — Cancel Billing Document (SAP Wireframe style) ===== */

function Cancel(billingNo) {
  const b = DB.billings?.find((x) => x.billingNo === billingNo);
  if (!b) {
    return `
      <h2>Cancel Billing Document</h2>
      <div class="muted">Billing ${billingNo} not found.</div>
      <button onclick="location.hash='#/tracking'">Back</button>
    `;
  }

  return `
    <h2>Cancel Billing Document — ${billingNo}</h2>
    <div style="border:1px solid #ccc; padding:12px; margin-top:10px; font-size:13px;">
      <h3 style="background:#f5f5f5; padding:5px 8px; border-bottom:1px solid #ccc;">Header Information</h3>
      <table class="table-detail" style="width:100%; margin-top:6px;">
        <tbody>
          <tr><td><strong>Customer:</strong> ${b.soldTo || '-'}</td>
              <td><strong>Delivery Ref:</strong> ${
                b.deliveryNo || '-'
              }</td></tr>
          <tr><td><strong>Net Value:</strong> ${b.netValue} VND</td>
              <td><strong>Tax:</strong> ${b.tax} VND</td></tr>
          <tr><td><strong>Status:</strong> ${b.status}</td>
              <td><strong>Billing Date:</strong> ${b.date}</td></tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:20px;">
      <label><strong>Reason for Cancellation:</strong></label><br>
      <select id="cancelReason" style="margin-top:5px; width:40%; padding:4px;">
        <option value="">-- Select Reason --</option>
        <option value="Customer request">Customer request</option>
        <option value="Pricing error">Pricing error</option>
        <option value="Duplicate invoice">Duplicate invoice</option>
        <option value="Incorrect data entry">Incorrect data entry</option>
      </select>
    </div>

    <div style="margin-top:25px; display:flex; justify-content:flex-end; gap:8px;">
      <button class="primary-btn" onclick="confirmCancelBilling('${billingNo}')">Confirm Cancellation</button>
      <button onclick="location.hash='#/billing/${billingNo}'">Back</button>
    </div>
  `;
}

/* ===== Confirm and Process Cancellation ===== */
function confirmCancelBilling(billingNo) {
  const reason = document.getElementById('cancelReason').value;
  if (!reason) return alert('⚠️ Please select a reason for cancellation.');

  const b = DB.billings?.find((x) => x.billingNo === billingNo);
  if (!b) return alert('Billing document not found.');

  // Cập nhật trạng thái hủy
  b.status = 'CANCELLED';
  b.cancelReason = reason;

  // Cập nhật các liên kết
  const dl = DB.deliveries.find((x) => x.deliveryNo === b.deliveryNo);
  const so = DB.items.find((x) => x.so === b.soNo);
  if (dl) dl.status = 'CANCELLED';
  if (so) so.status = 'CANCELLED';

  console.log(`❌ Billing ${billingNo} cancelled. Reason: ${reason}`);
  alert(`✅ Billing ${billingNo} successfully cancelled.\nReason: ${reason}`);

  location.hash = '#/tracking';
  setTimeout(() => filterStatus('CANCELLED'), 50);
}

/* ===== Router Hook ===== */
function openCancelScreen(billingNo) {
  location.hash = `#/cancel/${billingNo}`;
  setTimeout(() => {
    document.getElementById('app').innerHTML = Cancel(billingNo);
  }, 50);
}
