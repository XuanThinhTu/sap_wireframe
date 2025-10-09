// === Database Core ===
const DB = {
  soSeq: 100000,
  dlSeq: 800000,
  billSeq: 500000,
  items: [], // SO
  deliveries: [], // Delivery
  billings: [], // Billing Documents
};

// === ID Generators ===
function nextSO() {
  return 'SO' + ++DB.soSeq;
}
function nextDL() {
  return 'DL' + ++DB.dlSeq;
}
function nextBI() {
  return 'BI' + ++DB.billSeq;
}

// === Auto-create Delivery when SO is created ===
function autoCreateDelivery(so) {
  if (!so) return;

  // Update SO status
  so.status = 'DELIVERED';

  // Create corresponding Delivery
  const newDelivery = {
    deliveryNo: nextDL(),
    soNo: so.so, // ✅ thêm dòng này để liên kết SO → DL → BI
    salesOrg: so.salesOrg,
    distChnl: so.distChnl,
    division: so.division,
    soldTo: so.soldTo,
    shipTo: so.shipTo,
    custRef: so.custRef,
    date: so.reqDelivDate || new Date().toISOString().slice(0, 10),
    totalQty: so.totalQty,
    status: 'DELIVERED',
  };

  DB.deliveries.unshift(newDelivery);
  console.log(
    `✅ Auto-created Delivery: ${newDelivery.deliveryNo} for ${so.so}`
  );
}
