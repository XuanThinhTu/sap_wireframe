/* ===== Router.js (phiên bản tối ưu & giữ nguyên cấu trúc gốc của bạn) ===== */

const routes = {
  '#/home': Home,
  '#/create/single': CreateSingle,
  '#/create/mass': CreateMass,
  '#/tracking': Tracking,
  '#/cancel': Cancel,
};

/* ===== Router xử lý các route tĩnh & động ===== */
function router() {
  const hash = location.hash || '#/home';
  const app = document.getElementById('app');

  // 📦 Dynamic route: Sales Order Detail (#/so/:so)
  if (hash.startsWith('#/so/')) {
    const so = hash.split('/')[2];
    app.innerHTML = SODetail(so);
    return;
  }

  // 🚚 Dynamic route: PGI (Delivery Detail) (#/pgi/:deliveryNo)
  if (hash.startsWith('#/pgi/')) {
    const deliveryNo = hash.split('/')[2];
    app.innerHTML = PGI(deliveryNo);
    return;
  }

  // 🚚 Dynamic route: Billing (PGI Detail) (#/billing/:pgiNo)
  if (hash.startsWith('#/billing/')) {
    const pgiNo = hash.split('/')[2];
    app.innerHTML = Billing(pgiNo);
    return;
  }

  // 🧾 Các route tĩnh khác
  app.innerHTML = (routes[hash] || Home)();
}

/* ===== Cho phép rerender lại thủ công ===== */
function rerender() {
  router();
}

/* ===== Khởi tạo router ===== */
window.addEventListener('hashchange', router);
router();
