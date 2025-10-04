function autoCreateDelivery(soObj) {
  soObj.delivery = nextDL();
  soObj.status = 'DELIVERY_CREATED';
}
function postGI(soObj) {
  if (!soObj.delivery) return false;
  soObj.gi = true;
  soObj.status = 'PGI_POSTED';
  return true;
}
function createBilling(soObj) {
  if (!soObj.gi) return false;
  soObj.billing = nextBI();
  soObj.status = 'BILLED';
  return true;
}
function cancelSO(soObj, reason = 'User Request') {
  soObj.cancelled = reason;
  soObj.status = 'CANCELLED';
}
