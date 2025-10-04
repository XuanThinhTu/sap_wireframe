const Cancel = () => `
  <h2>Cancellation</h2>
  <div class="row"><label>SO Number</label><input id="cSo"></div>
  <div class="row"><label>Reason</label><input id="cReason"></div>
  <div class="btnbar"><button onclick="cancelExec()">Execute</button></div>
`;
function cancelExec() {
  const so = cSo.value.trim(),
    reason = cReason.value.trim();
  const x = DB.items.find((i) => i.so === so);
  if (!x) return alert('SO not found');
  cancelSO(x, reason);
  alert('Cancelled');
  location.hash = '#/tracking';
}
