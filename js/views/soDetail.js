function SODetail(so) {
  const x = DB.items.find((i) => i.so === so);
  if (!x) return `<h2>Not found</h2>`;
  return `
    <h2>SO Detail — ${so}</h2>
    <div>Sold-to: ${x.soldTo}</div>
    <div>Plant: ${x.plant}</div>
    <div>Qty: ${x.totalQty}</div>
    <div>Status: ${x.status}</div>
    <div class="btnbar">
      <button onclick="doGI('${x.so}')">GI</button>
      <button onclick="doBill('${x.so}')">Billing</button>
      <button onclick="doCancel('${x.so}')">Cancel</button>
      <button onclick="location.hash='#/tracking'">Back</button>
    </div>
  `;
}
