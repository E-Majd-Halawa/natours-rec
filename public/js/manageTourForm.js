(function () {
  const form = document.getElementById('tourForm');
  const submitBtn = document.getElementById('createTourBtn');
  if (!form || !submitBtn) return; // not on the tour form page

  const statusEl = document.getElementById('formStatus');

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

  submitBtn.addEventListener('click', async () => {
    const tourId = form.dataset.tourId;
    const isEdit = Boolean(tourId);
    const fd = new FormData(form);

    const body = {
      name: fd.get('name'),
      summary: fd.get('summary'),
      duration: Number(fd.get('duration')),
      maxGroupSize: Number(fd.get('maxGroupSize')),
      difficulty: fd.get('difficulty'),
      price: Number(fd.get('price')),
      description: fd.get('description') || undefined,
    };

    const priceDiscount = fd.get('priceDiscount');
    if (priceDiscount) body.priceDiscount = Number(priceDiscount);

    let imageCoverFile = null;
    let galleryFiles = [];

    if (!isEdit) {
      // placeholder cover — the real file is uploaded right after creation
      body.imageCover = 'tour-pending-cover.jpg';

      const startDate = fd.get('startDate');
      body.startDates = startDate ? [startDate] : [];

      const description = fd.get('locationDescription');
      const lat = fd.get('lat');
      const lng = fd.get('lng');
      body.startLocation = {
        type: 'Point',
        // GeoJSON order is [longitude, latitude]
        coordinates: [lng ? Number(lng) : 0, lat ? Number(lat) : 0],
        description: description || 'To be set',
      };

      imageCoverFile = fd.get('imageCover');
      galleryFiles = document.getElementById('images').files; // FileList, up to 3
    }

    submitBtn.disabled = true;
    statusEl.textContent = isEdit ? 'Saving…' : 'Creating tour…';

    try {
      const res = await fetch(
        isEdit ? `/api/v1/tours/${tourId}` : '/api/v1/tours',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Something went wrong.');
      }

      const createdDoc = data.data?.doc || data.data?.data || data.data || data;
      const newTourId = isEdit ? tourId : createdDoc?.id || createdDoc?._id;

      if (!isEdit && !newTourId) {
        console.log('Create response:', data);
        throw new Error('Tour was created but no id was returned — check console.');
      }

      // Step 2 (create only): upload the real photos now that we have an id
      const hasCover = !isEdit && imageCoverFile && imageCoverFile.size > 0;
      const hasGallery = !isEdit && galleryFiles && galleryFiles.length > 0;

      if (hasCover || hasGallery) {
        statusEl.textContent = 'Uploading photos…';
        const photoForm = new FormData();
        if (hasCover) photoForm.append('imageCover', imageCoverFile);
        if (hasGallery) {
          [...galleryFiles].forEach((file) => photoForm.append('images', file));
        }

        const photoRes = await fetch(`/api/v1/tours/${newTourId}`, {
          method: 'PATCH',
          body: photoForm, // browser sets multipart/form-data boundary automatically
        });
        const photoData = await photoRes.json();
        if (!photoRes.ok || photoData.status !== 'success') {
          showAlert(
            'error',
            'Tour created, but photo upload failed. Edit the tour to try again.'
          );
          setTimeout(() => (window.location.href = '/manage-tours'), 1200);
          return;
        }
      }

      showAlert('success', isEdit ? 'Tour updated!' : 'Tour created!');
      setTimeout(() => (window.location.href = '/manage-tours'), 800);
    } catch (err) {
      statusEl.textContent = '';
      submitBtn.disabled = false;
      showAlert('error', err.message);
    }
  });
})();
