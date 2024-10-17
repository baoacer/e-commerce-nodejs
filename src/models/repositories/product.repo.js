const { getSelectData, unGetSelectData } = require("../../utils");
const { product } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

/**
 * @desc new RegExp(keySearch) - Tạo đối tượng biểu thức chính quy từ từ khóa tìm kiếm -> cho phép tìm kiếm linh hoạt hơn
 * @desc $text: { $search: regexSearch } - Mongoose sẽ tìm các tài liệu mà có chứa từ khóa (đã được lập chỉ mục bằng cách sử dụng text index).
 * @desc score: { $meta: 'textScore'} - Đánh giá mức độ phù hợp của tài liệu với từ khóa tìm kiếm
 */
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result;
};

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

/**
 *
 * @param { Number } skip - Ví dụ page 2 bỏ qua sản phẩm ở page 1
 * @param { Number } sort - -1: Desc | 1: Asc
 * @param { Number } select - Chọn trường cụ thể
 */
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

/**
 * @desc update product
 * @returns new: true - Return Product after update
 * else return product before update
 */
const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

/**
 *
 * @param populate - Chọn trường cụ thể
 * @returns
 */
const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
