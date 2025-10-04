const routes = {
  '#/home': Home,
  '#/create/single': CreateSingle,
  '#/create/mass': CreateMass,
  '#/tracking': Tracking,
  '#/cancel': Cancel,
};
function router() {
  const hash = location.hash || '#/home';
  const app = document.getElementById('app');
  if (hash.startsWith('#/so/')) {
    const so = hash.split('/')[2];
    app.innerHTML = SODetail(so);
    return;
  }
  app.innerHTML = (routes[hash] || Home)();
}
function rerender() {
  router();
}
window.addEventListener('hashchange', router);
router();
