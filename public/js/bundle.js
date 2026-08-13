var $jANz3$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

const $9872a30d54cb2189$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
const $9872a30d54cb2189$export$de026b00723010c1 = (type, msg, time = 5)=>{
    $9872a30d54cb2189$export$516836c6a9dfc573();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout($9872a30d54cb2189$export$516836c6a9dfc573, time * 1000);
};


const $e18016dbdc1c1791$var$tableReviews = document.querySelector('.billing-list');
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
                // حذف الصف مباشرة من القائمة بدون إعادة تحميل الصفحة
                e.target.closest('.review-row').remove();
            }
        } catch (err) {
            (0, $9872a30d54cb2189$export$de026b00723010c1)('error', err.response?.data?.message || 'Error deleting review!');
        }
    }
});


