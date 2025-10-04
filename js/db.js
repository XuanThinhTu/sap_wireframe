const DB = {
  soSeq: 100000,
  dlSeq: 800000,
  billSeq: 500000,
  items: [],
};
function nextSO() {
  return 'SO' + ++DB.soSeq;
}
function nextDL() {
  return 'DL' + ++DB.dlSeq;
}
function nextBI() {
  return 'BI' + ++DB.billSeq;
}
