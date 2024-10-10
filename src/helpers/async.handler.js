/**
 * Xử lý Route Handler.
 * 
 * @param {*} fn - nhận 1 fn, cụ thể ex: 'accessController.signUp' -> trả vể (req, res, next)
 * @returns  Nếu fn trả về một Error, catch(next) sẽ tự động bắt lỗi và chuyển nó đến middleware xử lý lỗi của Express.
 */
const asyncHandler = (fn) => (req, res, next) => {
    // middleware thực thi signup | login nếu có lỗi -> catch(next)
    fn(req, res, next).catch(next); 
}

module.exports = asyncHandler