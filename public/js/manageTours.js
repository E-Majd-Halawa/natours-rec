(function () {
  const table = document.querySelector('.admin-table');
  if (!table) return; // not on the manage-tours page

  function showAlert(type, msg) {
    const existing = document.querySelector('.alert');
    if (existing) existing.parentElement.removeChild(existing);
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(() => {
      const el = document.querySelector('.alert');
      if (el) el.parentElement.removeChild(el);
    }, 4000);
  }

  table.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-delete-id]');
    if (!btn) return;

    const id = btn.dataset.deleteId;
    const name = btn.dataset.deleteName || 'this tour';
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;

    try {
      btn.disabled = true;
      const res = await fetch(`/api/v1/tours/${id}`, { method: 'DELETE' });

      if (res.status === 204) {
        const row = btn.closest('tr');
        row.style.transition = 'opacity .25s';
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 250);
        showAlert('success', 'Tour deleted.');
      } else {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed (${res.status})`);
      }
    } catch (err) {
      btn.disabled = false;
      showAlert('error', err.message || 'Could not delete this tour.');
    }
  });
})();
// في الدالة التي تعالج submit الخاص بالفورم
const form = document.querySelector('.form-tour-data'); // أو اسم الكلاس لديك

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 💡 الحل الجذري: جمع كل الـ IDs للمرشدين المختارين في مصفوفة واحدة
    const guides = Array.from(document.querySelectorAll('.tour-guides-select'))
      .map((el) => el.value)
      .filter((val) => val !== ''); // إزالة الخيارات الفارغة

    const formData = {
      name: document.getElementById('name').value,
      price: document.getElementById('price').value,
      // ... باقي الحقول
      guides: guides, // 👈 إرسالها كمصفوفة أكيدة Array
    };

    // إرسال formData إلى API (سواء createTour أو updateTour)
    saveTourData(formData);
  });
}
