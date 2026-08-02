//Controllers في asyncيمسك أخطاء الـ
module.exports = (fn) => {
  return (req, res, next) => {
    // لازم ترجع في النهاية دالة عشان نصدرها ونستخدمها مش بس قيم
    fn(req, res, next).catch(next);
  };
};
