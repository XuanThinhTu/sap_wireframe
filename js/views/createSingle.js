const CreateSingle = () => `
  <h2>Create Sales Order — Single Upload</h2>
  <div class="group">
    <div class="row"><label>Sold-to</label><input id="iSoldTo" type="text"></div>
    <div class="row"><label>Material</label><input id="iMatnr" type="text"></div>
    <div class="row"><label>Quantity</label><input id="iQty" type="number" value="1"></div>
    <div class="row"><label>Plant</label><select id="iPlant"><option>1000</option><option>1100</option></select></div>
    <div class="row"><label>Pricing Date</label><input id="iPDate" type="date"></div>
    <div class="btnbar"><button onclick="simulateCreateSO()">Create</button><button onclick="location.hash='#/home'">Back</button></div>
  </div>
`;
function simulateCreateSO() {
  const soldTo = iSoldTo.value.trim(),
    matnr = iMatnr.value.trim(),
    qty = +iQty.value,
    plant = iPlant.value,
    pdate = iPDate.value;
  if (!soldTo || !matnr || !qty) return alert('Fill all fields');
  const so = nextSO();
  const rec = {
    so,
    soldTo,
    plant,
    pricingDate: pdate,
    totalQty: qty,
    status: 'CREATED',
  };
  DB.items.unshift(rec);
  autoCreateDelivery(rec);
  alert(`SO ${so} created with Delivery ${rec.delivery}`);
  location.hash = '#/tracking';
}
