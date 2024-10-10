const { product } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
};

/**
 * @desc new RegExp(keySearch) - Tạo đối tượng biểu thức chính quy từ từ khóa tìm kiếm -> cho phép tìm kiếm linh hoạt hơn
 * @desc $text: { $search: regexSearch } - Mongoose sẽ tìm các tài liệu mà có chứa từ khóa (đã được lập chỉ mục bằng cách sử dụng text index).
 * @desc score: { $meta: 'textScore'} - Đánh giá mức độ phù hợp của tài liệu với từ khóa tìm kiếm 
 */
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({
        isPublished: true,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore'} })
    .sort({ score: { $meta: 'textScore' } })
    .lean()

    return result
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  // if update return 1 else return 0
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  // if update return 1 else return 0
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    // Tìm nạp thông tin của cửa hàng (shop) liên kết với sản phẩm, chỉ lấy trường 'name' và 'email', loại trừ trường '_id'
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(); // thực thi
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser
};
