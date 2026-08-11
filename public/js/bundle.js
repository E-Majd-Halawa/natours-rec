var $jANz3$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/* eslint-disable */ /* eslint-disable */ const $567099f3ebcb8bdf$export$4c5dd147b21b9176 = (mapEl)=>{
    if (!mapEl) return;
    const locations = JSON.parse(mapEl.dataset.locations);
    // 1️⃣ إنشاء الخريطة مع إيقاف التكبير بالسكرول لمنع التعليق أثناء تصفح الصفحة
    const map = L.map('map', {
        scrollWheelZoom: false,
        zoomControl: true
    });
    // 2️⃣ استخدام سيرفر CartoDB السريع جداً لتفادي بطء OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
    }).addTo(map);
    const points = [];
    // 3️⃣ إضافة العلامات (Markers) والنوافذ المنبثقة (Popups)
    locations.forEach((loc)=>{
        // Leaflet تستقبل [lat, lng] بينما MongoDB يخزنها [lng, lat]
        const latLng = [
            loc.coordinates[1],
            loc.coordinates[0]
        ];
        points.push(latLng);
        L.marker(latLng).addTo(map).bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
            autoClose: false,
            closeOnClick: false,
            className: 'map-popup'
        });
    });
    // 4️⃣ ضبط أبعاد الخريطة لتتسع لجميع النقاط مع هامش مريح
    if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, {
            padding: [
                100,
                100
            ]
        });
    }
    // 5️⃣ إعادة إجبار الخريطة على حساب الحجم لتفادي أي مربعات رمادية
    setTimeout(()=>{
        map.invalidateSize();
    }, 200);
};


/* eslint-disable */ const $9872a30d54cb2189$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
const $9872a30d54cb2189$export$de026b00723010c1 = (type, msg, time = 5)=>{
    $9872a30d54cb2189$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout($9872a30d54cb2189$export$516836c6a9dfc573, time * 1000);
};


const $8f9e48ecb391b951$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await fetch('/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data1 = await res.json();
        if (data1.status === 'success') {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        } else (0, $9872a30d54cb2189$export$de026b00723010c1)('error', data1.message); // ← هاد بيطلع 'Incorrect email or password'
    } catch (err) {
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', data.message);
    }
};
const $8f9e48ecb391b951$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await fetch('/logout', {
            // سطر 25
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) location.assign('/');
    } catch (err) {
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', 'Error logging out ! Try again');
    }
};


/* eslint-disable */ 
const $677963a1596aa7ea$export$f558026a994b6051 = async (data, type)=>{
    try {
        const url = type === 'password' ? '/updatePassword' : '/updateMe';
        const isFormData = data instanceof FormData;
        const res = await fetch(`/api/v1/users${url}`, {
            method: 'PATCH',
            headers: isFormData ? {} : {
                'Content-Type': 'application/json'
            },
            body: isFormData ? data : JSON.stringify(data)
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || 'Something went wrong');
        (0, $9872a30d54cb2189$export$de026b00723010c1)('success', `${type.toUpperCase()} was successfully updated`);
        // إعطاء مهلة 1.5 ثانية ليقرأ المستخدم التنبيه ثم تحديث الصفحة لرؤية الصورة الجديدة
        window.setTimeout(()=>{
            location.reload(true);
        }, 1500);
    } catch (err) {
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.message);
    }
};
document.addEventListener('click', async (e)=>{
    if (e.target.classList.contains('btn--approve-guide')) {
        const userId = e.target.dataset.userId;
        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/v1/users/${userId}`,
                data: {
                    role: 'guide'
                }
            });
            if (res.data.status === 'success') {
                alert("\u062A\u0645 \u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0625\u0644\u0649 \u0645\u0631\u0634\u062F \u0628\u0646\u062C\u0627\u062D! \uD83C\uDF89");
                window.location.reload();
            }
        } catch (err) {
            alert(err.response ? err.response.data.message : "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0631\u0642\u064A\u0629!");
        }
    }
});


/* eslint-disable */ 

const $a8ddc032179a0e8e$var$stripe = Stripe('pk_test_51TvvZx4rlV4vwB5OzEHYBhHDm6T1RjnXJu6fLxZX7tCIVzpCCWPBpeI9b1jN2vpooIGODrKXnZMHS0a4ql0pzBtC00Y3XXV0Gb');
const $a8ddc032179a0e8e$export$8d5bdbf26681c0c2 = async (tourId)=>{
    try {
        //1)get  checkout session from Api
        const session = await (0, ($parcel$interopDefault($jANz3$axios)))(`/api/v1/bookings/checkout-session/${tourId}`);
        //2)create checkout form + charge cridet card}
        await $a8ddc032179a0e8e$var$stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err);
    }
};


// signup.js


const $57c58b919921038b$export$7200a869094fec36 = async (name, email, password, passwordConfirm)=>{
    try {
        const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name: name,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            }
        });
        console.log('Signup Response:', res.data);
        if (res.data.status === 'success') {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Account created successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.error('Signup Error:', err.response ? err.response.data : err);
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response.data.message);
    }
};





const $f25c14890e575cd8$export$7d0f10f273c0438a = async (userId, userRow)=>{
    try {
        const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
            method: 'DELETE',
            url: `/api/v1/users/${userId}`
        });
        // كود 204 يعني تم الحذف بنجاح (No Content)
        if (res.status === 204 || res.data.status === 'success') {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'User deleted successfully!');
            // إزالة السطر من جدول البيانات مباشرة
            if (userRow) userRow.remove();
        }
    } catch (err) {
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Failed to delete user');
    }
};




const $055f4e6a5a02f42f$export$dccf1e4d1cb5d95e = ()=>{
    const guideForm = document.querySelector('.form--become-guide');
    const cvInput = document.getElementById('cv');
    const label = document.querySelector('.form__upload-label');
    // 1. إظهار اسم الملف فور اختياره
    if (cvInput && label) cvInput.addEventListener('change', (e)=>{
        const file = e.target.files[0];
        if (file) {
            label.textContent = `Selected: ${file.name}`;
            label.style.color = '#55c57a';
        } else {
            label.textContent = 'Choose File (PDF/DOC)';
            label.style.color = 'inherit';
        }
    });
    // 2. إرسال النموذج لـ API
    if (guideForm) guideForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const submitBtn = guideForm.querySelector('button');
        submitBtn.textContent = 'Submitting...';
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('phone', document.getElementById('phone').value);
        form.append('experienceYears', document.getElementById('experienceYears').value);
        form.append('bio', document.getElementById('bio').value);
        form.append('portfolioLink', document.getElementById('portfolioLink').value);
        const cvFile = cvInput?.files[0];
        if (cvFile) form.append('cv', cvFile);
        try {
            const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
                method: 'POST',
                url: '/api/v1/users/become-guide',
                data: form
            });
            if (res.data.status === 'success') {
                (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Application submitted successfully! We will review it shortly.');
                window.setTimeout(()=>{
                    location.assign('/');
                }, 2000);
            }
        } catch (err) {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Error submitting application!');
        } finally{
            submitBtn.textContent = 'Submit Application';
        }
    });
};


// deleteReview.js


const $dbc9067b79f803d7$export$189a68d831f3e4ec = async (reviewId)=>{
    try {
        // 1. إرسال طلب الحذف للـ API
        const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`
        });
        // في طلبات DELETE الناجحة (204 No Content)، يرجع السيرفر استجابة فارغة
        if (res.status === 204 || res.data.status === 'success') {
            alert("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0628\u0646\u062C\u0627\u062D!");
            // 2. إزالة العنصر من الواجهة مباشرة دون إعادة تحميل الصفحة
            const card = document.querySelector(`.review-card[data-review-id="${reviewId}"]`);
            if (card) card.remove();
            else // أو إعادة تحميل الصفحة
            window.location.reload();
        }
    } catch (err) {
        alert(err.response?.data?.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062D\u0630\u0641 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629");
    }
};




const $8f1c4bddb11a4df1$export$465cb47180de50f0 = async (name, email, subject, message)=>{
    const sendBtn = document.querySelector('.btn--send-message');
    const originalText = sendBtn ? sendBtn.textContent : "Send Message \uD83D\uDE80";
    try {
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.textContent = "Sending... \u23F3";
        }
        const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
            method: 'POST',
            url: '/contact',
            data: {
                name: name,
                email: email,
                subject: subject,
                message: message
            }
        });
        if (res.data.status === 'success') {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Thank you! Your message has been sent successfully.');
            document.getElementById('contact-form').reset();
        }
    } catch (err) {
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Something went wrong! Please try again.');
    } finally{
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = originalText;
        }
    }
};





const $1684bd6b16af04e4$export$768b73f800a944a3 = async (contactId, rowElement)=>{
    try {
        const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
            method: 'DELETE',
            url: `/manage-contacts/${contactId}`
        });
        if (res.status === 204 || res.data?.status === 'success') {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Contact message deleted successfully!');
            if (rowElement) rowElement.remove();
            else window.location.reload();
        }
    } catch (err) {
        // إظهار سبب الخطأ القادم من الباك إند
        const errorMsg = err.response?.data?.message || err.message || 'Error deleting contact message!';
        (0, $9872a30d54cb2189$export$de026b00723010c1)('error', errorMsg);
        console.error('Delete Contact Error:', err.response?.data);
    }
};


// تشغيل الدالة
(0, $055f4e6a5a02f42f$export$dccf1e4d1cb5d95e)();
// 1. تحديد الجدول
const $e18016dbdc1c1791$var$usersTable = document.querySelector('.table-users');
if ($e18016dbdc1c1791$var$usersTable) $e18016dbdc1c1791$var$usersTable.addEventListener('click', (e)=>{
    // 2. التحقق مما إذا كان العنصر المخطوط هو زر الحذف
    const deleteBtn = e.target.closest('.btn--delete-user');
    if (deleteBtn) {
        // جلب ID المستخدم من data-user-id
        const userId = deleteBtn.dataset.userId;
        const userRow = deleteBtn.closest('tr');
        // رسالة تأكيد قبل الحذف
        if (confirm('Are you sure you want to delete this user?')) (0, $f25c14890e575cd8$export$7d0f10f273c0438a)(userId, userRow);
    }
});
// DOM
const $e18016dbdc1c1791$var$mapBox = document.getElementById('map');
const $e18016dbdc1c1791$var$loginForm = document.querySelector('.form--login');
const $e18016dbdc1c1791$var$logOutBtn = document.querySelector('.nav__el--logout');
const $e18016dbdc1c1791$var$userPasswordForm = document.querySelector('.form-user-password');
const $e18016dbdc1c1791$var$bookBtn = document.getElementById('book-tour');
// delegation
if ($e18016dbdc1c1791$var$mapBox) (0, $567099f3ebcb8bdf$export$4c5dd147b21b9176)($e18016dbdc1c1791$var$mapBox);
if ($e18016dbdc1c1791$var$loginForm) $e18016dbdc1c1791$var$loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    (0, $8f9e48ecb391b951$export$596d806903d1f59e)(email, password);
});
if ($e18016dbdc1c1791$var$logOutBtn) $e18016dbdc1c1791$var$logOutBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    (0, $8f9e48ecb391b951$export$a0973bcfe11b05c9)();
});
const $e18016dbdc1c1791$var$reviewsContainer = document.querySelector('.reviews');
const $e18016dbdc1c1791$var$btnLeft = document.querySelector('.reviews__btn--left');
const $e18016dbdc1c1791$var$userDataForm = document.querySelector('.form-user-data');
const $e18016dbdc1c1791$var$btnRight = document.querySelector('.reviews__btn--right');
if ($e18016dbdc1c1791$var$reviewsContainer && $e18016dbdc1c1791$var$btnLeft && $e18016dbdc1c1791$var$btnRight) {
    const cardWidth = 396;
    $e18016dbdc1c1791$var$btnRight.addEventListener('click', ()=>{
        $e18016dbdc1c1791$var$reviewsContainer.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });
    $e18016dbdc1c1791$var$btnLeft.addEventListener('click', ()=>{
        $e18016dbdc1c1791$var$reviewsContainer.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });
}
if ($e18016dbdc1c1791$var$userDataForm) $e18016dbdc1c1791$var$userDataForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    (0, $677963a1596aa7ea$export$f558026a994b6051)(form, 'data');
});
if ($e18016dbdc1c1791$var$userPasswordForm) $e18016dbdc1c1791$var$userPasswordForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await (0, $677963a1596aa7ea$export$f558026a994b6051)({
        currentPassword: currentPassword,
        password: password,
        passwordConfirm: passwordConfirm
    }, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
});
if ($e18016dbdc1c1791$var$bookBtn) $e18016dbdc1c1791$var$bookBtn.addEventListener('click', (el)=>{
    el.target.textContent = 'Processing...';
    const { tourId: tourId } = el.target.dataset;
    (0, $a8ddc032179a0e8e$export$8d5bdbf26681c0c2)(tourId);
});
const $e18016dbdc1c1791$var$signupForm = document.querySelector('.form--signup');
if ($e18016dbdc1c1791$var$signupForm) $e18016dbdc1c1791$var$signupForm.addEventListener('submit', (e)=>{
    e.preventDefault(); // هاد أهم سطر — بيمنع الإرسال الطبيعي
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    (0, $57c58b919921038b$export$7200a869094fec36)(name, email, password, passwordConfirm);
});
const $e18016dbdc1c1791$var$alertMessage = document.querySelector('body').dataset.alert;
if ($e18016dbdc1c1791$var$alertMessage) (0, $9872a30d54cb2189$export$de026b00723010c1)('success', $e18016dbdc1c1791$var$alertMessage, 20);
const $e18016dbdc1c1791$var$tableReviews = document.querySelector('.table-reviews');
if ($e18016dbdc1c1791$var$tableReviews) $e18016dbdc1c1791$var$tableReviews.addEventListener('click', async (e)=>{
    // التأكد من أن الضغط تم على زر الحذف
    if (e.target.classList.contains('btn--delete-review')) {
        const reviewId = e.target.dataset.reviewId;
        if (confirm('Are you sure you want to delete this review?')) try {
            // إرسال طلب الحذف للباك إند
            const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
                method: 'DELETE',
                url: `/api/v1/reviews/${reviewId}`
            });
            // HTTP status 204 تعني No Content (تم الحذف بنجاح)
            if (res.status === 204) {
                (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Review deleted successfully!');
                // حذف السطر مباشرة من الجدول بدون إعادة تحميل الصفحة
                e.target.closest('tr').remove();
            }
        } catch (err) {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Error deleting review!');
        }
    }
});
const $e18016dbdc1c1791$var$tableBookings = document.querySelector('.table-bookings');
if ($e18016dbdc1c1791$var$tableBookings) $e18016dbdc1c1791$var$tableBookings.addEventListener('click', async (e)=>{
    if (e.target.classList.contains('btn--delete-booking')) {
        const bookingId = e.target.dataset.bookingId;
        if (confirm('Are you sure you want to delete this booking?')) try {
            const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
                method: 'DELETE',
                url: `/api/v1/bookings/${bookingId}`
            });
            if (res.status === 204) {
                (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Booking deleted successfully!');
                e.target.closest('tr').remove();
            }
        } catch (err) {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Error deleting booking!');
        }
    }
});
const $e18016dbdc1c1791$var$userReviewsTable = document.querySelector('.table-reviews');
if ($e18016dbdc1c1791$var$userReviewsTable) $e18016dbdc1c1791$var$userReviewsTable.addEventListener('click', async (e)=>{
    if (e.target.classList.contains('btn--delete-user-review')) {
        const reviewId = e.target.dataset.reviewId;
        if (confirm('Are you sure you want to delete your review?')) try {
            const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
                method: 'DELETE',
                url: `/api/v1/reviews/${reviewId}`
            });
            if (res.status === 204) {
                (0, $9872a30d54cb2189$export$de026b00723010c1)('success', 'Your review was deleted successfully!');
                e.target.closest('tr').remove();
            }
        } catch (err) {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Error deleting review!');
        }
    }
});
// البحث عن كل أزرار الحذف في الصفحة
const $e18016dbdc1c1791$var$deleteBtns = document.querySelectorAll('.btn-delete-review');
if ($e18016dbdc1c1791$var$deleteBtns.length > 0) $e18016dbdc1c1791$var$deleteBtns.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        // الحصول على ID المراجعة من data-id الموجود في زر الـ Pug
        const reviewId = e.target.dataset.id;
        // تأكيد الحذف من المستخدم قبل التنفيذ
        if (confirm("\u0647\u0644 \u0623\u0646\u062A \u062A\u0623\u0643\u062F \u0645\u0646 \u0623\u0646\u0643 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0647\u0630\u0647 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629\u061F")) (0, $dbc9067b79f803d7$export$189a68d831f3e4ec)(reviewId);
    });
});
// البحث عن زر قبول المرشد وتفعيل الحدث
const $e18016dbdc1c1791$var$approveBtn = document.querySelectorAll('.btn--approve-guide');
if ($e18016dbdc1c1791$var$approveBtn.length > 0) $e18016dbdc1c1791$var$approveBtn.forEach((btn)=>{
    btn.addEventListener('click', async (e)=>{
        e.preventDefault();
        const userId = e.target.dataset.userId;
        if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u062A\u0623\u0643\u062F \u0645\u0646 \u0642\u0628\u0648\u0644 \u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u0642\u062F\u0645 \u0648\u062A\u062D\u0648\u064A\u0644\u0647 \u0625\u0644\u0649 \u0645\u0631\u0634\u062F\u061F")) return;
        try {
            // إرسال طلب PATCH لتحديث دور المستخدم إلى guide
            const res = await (0, ($parcel$interopDefault($jANz3$axios)))({
                method: 'PATCH',
                url: `/api/v1/users/${userId}`,
                data: {
                    role: 'guide'
                }
            });
            if (res.data.status === 'success') {
                alert("\u062A\u0645 \u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0631\u0634\u062F \u0628\u0646\u062C\u0627\u062D! \uD83C\uDF89");
                window.location.reload(); // إعادة تحميل الصفحة لرؤية التحديث
            }
        } catch (err) {
            alert(err.response && err.response.data.message ? err.response.data.message : "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0631\u0642\u064A\u0629!");
        }
    });
});
// 2. ربط الـ Event Listener الخاص بـ Contact Form
const $e18016dbdc1c1791$var$contactForm = document.getElementById('contact-form');
if ($e18016dbdc1c1791$var$contactForm) $e18016dbdc1c1791$var$contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    (0, $8f1c4bddb11a4df1$export$465cb47180de50f0)(name, email, subject, message);
});
// ... باقي الأكواد الموجودة لديك في index.js ...
// Event Delegation لحذف الرسائل من جدول إدارة الرسائل
const $e18016dbdc1c1791$var$tableContacts = document.querySelector('.table--contacts');
if ($e18016dbdc1c1791$var$tableContacts) $e18016dbdc1c1791$var$tableContacts.addEventListener('click', (e)=>{
    const deleteBtn = e.target.closest('.btn--delete-contact');
    if (deleteBtn) {
        e.preventDefault();
        const contactId = deleteBtn.dataset.contactId;
        const rowElement = deleteBtn.closest('tr');
        if (confirm('Are you sure you want to delete this message?')) (0, $1684bd6b16af04e4$export$768b73f800a944a3)(contactId, rowElement);
    }
});


