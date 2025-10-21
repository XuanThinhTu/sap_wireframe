const Home = () => `
  <h2>Create Sales Order</h2>
  <div class="group">
    <div class="radio-col">
      <label><input type="radio" name="createSO" value="single"> Single Upload</label>
      <label><input type="radio" name="createSO" value="mass"> Mass Upload</label>
    </div>
    <div class="btnbar">
      <button onclick="goCreate()">Execute</button>
    </div>
  </div>

  <h2>Management</h2>
  <div class="group">
    <div class="radio-col">
      <label><input type="radio" name="mgmt" value="tracking"> Processing Status</label>
    </div>
    <div class="btnbar">
      <button onclick="goMgmt()">Execute</button>
    </div>
  </div>
`;
function goCreate() {
  const pick = document.querySelector('input[name="createSO"]:checked');
  if (!pick) return alert('Choose Single or Mass');
  location.hash = pick.value === 'single' ? '#/create/single' : '#/create/mass';
}
function goMgmt() {
  const pick = document.querySelector('input[name="mgmt"]:checked');
  if (!pick) return alert('Choose Management option');
  location.hash = pick.value === 'cancel' ? '#/cancel' : '#/tracking';
}
