(function () {
  const container = document.querySelector('.billing-container');
  const modal = document.getElementById('receiptModal');
  if (!container || !modal) return;

  const userName = container.dataset.userName || '';
  const userEmail = container.dataset.userEmail || '';

  const invoiceIdEl = document.getElementById('receiptInvoiceId');
  const customerNameEl = document.getElementById('receiptCustomerName');
  const customerEmailEl = document.getElementById('receiptCustomerEmail');
  const dateEl = document.getElementById('receiptDate');
  const tourEl = document.getElementById('receiptTour');
  const statusEl = document.getElementById('receiptStatus');
  const amountEl = document.getElementById('receiptAmount');

  function openModal(data) {
    invoiceIdEl.textContent = data.invoice;
    customerNameEl.textContent = userName;
    customerEmailEl.textContent = userEmail;
    dateEl.textContent = new Date(data.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    tourEl.textContent = data.tour;
    statusEl.textContent = data.paid === 'true' ? 'Paid' : 'Pending';
    amountEl.textContent = `$${data.price}`;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-receipt').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({
        invoice: btn.dataset.invoice,
        tour: btn.dataset.tour,
        price: btn.dataset.price,
        date: btn.dataset.date,
        paid: btn.dataset.paid,
      });
    });
  });

  document.getElementById('receiptCloseBtn').addEventListener('click', closeModal);
  document.getElementById('receiptCloseX').addEventListener('click', closeModal);
  modal
    .querySelector('.receipt-modal__overlay')
    .addEventListener('click', closeModal);
  document
    .getElementById('receiptPrintBtn')
    .addEventListener('click', () => window.print());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
