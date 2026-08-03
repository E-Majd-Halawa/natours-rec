(function () {
  const wrapper = document.querySelector('.reviews-wrapper');
  if (!wrapper) return; // not on the tour page

  const track = wrapper.querySelector('.reviews');
  const prevBtn = wrapper.querySelector('.reviews__btn--left');
  const nextBtn = wrapper.querySelector('.reviews__btn--right');
  const card = track.querySelector('.reviews__card');
  const step = card ? card.getBoundingClientRect().width + 22 : 320; // card width + gap

  prevBtn.addEventListener('click', () => track.scrollBy({ left: -step, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: step, behavior: 'smooth' }));
})();
