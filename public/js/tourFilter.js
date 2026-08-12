(function () {
  const grid = document.getElementById('cardGrid');
  if (!grid) return; // not on the overview page

  const cards = [...grid.querySelectorAll('.card')];
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const chipRow = document.getElementById('chipRow');
  const resultCount = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  let activeDiff = 'all';

  function apply() {
    const q = searchInput.value.trim().toLowerCase();

    let visible = cards.filter((card) => {
      const matchesQ = !q || card.dataset.name.includes(q);
      const matchesDiff =
        activeDiff === 'all' || card.dataset.diff === activeDiff;
      const show = matchesQ && matchesDiff;
      card.style.display = show ? '' : 'none';
      return show;
    });

    const sort = sortSelect.value;
    if (sort === 'price-asc')
      visible.sort((a, b) => a.dataset.price - b.dataset.price);
    else if (sort === 'price-desc')
      visible.sort((a, b) => b.dataset.price - a.dataset.price);
    else if (sort === 'rating')
      visible.sort((a, b) => b.dataset.rating - a.dataset.rating);

    // re-order visible cards in the DOM to reflect sorting
    visible.forEach((card) => grid.appendChild(card));

    resultCount.textContent = `${visible.length} trail${visible.length === 1 ? '' : 's'} found`;
    noResults.classList.toggle('show', visible.length === 0);
  }

  searchInput.addEventListener('input', apply);
  sortSelect.addEventListener('change', apply);
  chipRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    [...chipRow.children].forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeDiff = chip.dataset.diff;
    apply();
  });

  apply();

  // header scroll shadow
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    });
  }
})();
document.querySelectorAll('.btn--small').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});
