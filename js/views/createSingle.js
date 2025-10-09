/* ===== createSingle.js — Create Sales Order (Single Upload, SAP-style) ===== */

const CreateSingle = () => `
  <h2>Create Sales Order — Single Upload</h2>

  <div class="group" style="max-width:480px; margin-top:20px; font-size:14px;">
    
    <div class="row">
      <label>Order Type</label>
      <select id="iOrderType">
        <option value="OR">OR — Standard Order</option>
        <option value="RE">RE — Returns</option>
        <option value="FD">FD — Free-of-Charge Delivery</option>
      </select>
    </div>

    <div class="row">
      <label>Sales Org</label>
      <select id="iSalesOrg">
        <option value="1000">1000 — Head Office</option>
        <option value="1100">1100 — HCM Branch</option>
        <option value="1200">1200 — Hanoi Branch</option>
      </select>
    </div>

    <div class="row">
      <label>Distribution Channel</label>
      <select id="iDistChnl">
        <option value="10">10 — Retail</option>
        <option value="20">20 — Wholesale</option>
        <option value="30">30 — Online</option>
      </select>
    </div>

    <div class="row">
      <label>Division</label>
      <select id="iDivision">
        <option value="00">00 — General</option>
        <option value="01">01 — Electronics</option>
        <option value="02">02 — Furniture</option>
      </select>
    </div>

    <div class="row">
      <label>Sales Office</label>
      <select id="iSalesOffice">
        <option value="SO01">SO01 — HCM Office</option>
        <option value="SO02">SO02 — Hanoi Office</option>
        <option value="SO03">SO03 — Danang Office</option>
      </select>
    </div>

    <div class="row">
      <label>Sales Group</label>
      <select id="iSalesGroup">
        <option value="SG01">SG01 — Mobile Devices</option>
        <option value="SG02">SG02 — Home Appliances</option>
        <option value="SG03">SG03 — Accessories</option>
      </select>
    </div>


    <div class="btnbar" style="margin-top:20px;">
      <button class="primary-btn" onclick="simulateCreateSO()">Create</button>
      <button onclick="location.hash='#/home'">Back</button>
    </div>
  </div>
`;

/* ===== Logic xử lý tạo Sales Order ===== */
/* ===== Logic xử lý tạo Sales Order ===== */
function simulateCreateSO() {
  const orderType = iOrderType.value,
    salesOrg = iSalesOrg.value,
    distChnl = iDistChnl.value,
    division = iDivision.value,
    salesOffice = iSalesOffice.value,
    salesGroup = iSalesGroup.value;

  // Các field chính
  const qty = 1;
  const plant = '1000';
  const pdate = new Date().toISOString().slice(0, 10);

  const so = nextSO();

  const rec = {
    so,
    orderType,
    salesOrg,
    distChnl,
    division,
    salesOffice,
    salesGroup,
    status: 'CREATED',
  };

  DB.items.unshift(rec);
  autoCreateDelivery(rec);

  // 🔹 Điều hướng trực tiếp sang trang chi tiết SO (SODetail)
  location.hash = `#/soDetail/${so}`;
  setTimeout(() => {
    document.getElementById('app').innerHTML = SODetail(so);
  }, 100);
}
