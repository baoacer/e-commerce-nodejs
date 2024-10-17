'use strict'

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {

  /**
   * @desc Create new product
   * @param { String } type - product type
   * @param { Object } payload - product payload  
   */
  createProduct = async (req, res, next) => {
   /*
    new SuccessResponse({
      message: 'Create Product Success!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body, 
        product_shop: req.user.userId
      })
    }).send(res)
    */
    new SuccessResponse({
      message: 'Create Product Success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body, 
        product_shop: req.user.userId
      })
    }).send(res)
  };

  // UPDATE //
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product Success!',
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body, 
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @desc Change status product to `Publish`
   * @param {ObjectId} product_shop
   * @param {ObjectId} product_id 
   * @returns {JSON} list product with status 'publish'
   */
  publishProductByShop = async (req, res, next) => {
     new SuccessResponse({
       message: 'Publish Product Success!',
       metadata: await ProductServiceV2.publishProductByShop({
         product_shop: req.user.userId,
         product_id: req.params.id
       })
     }).send(res)
   };

   unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublish Product Success!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  };

  // QUERY //
  /**
   * @desc Get list Draft
   * @param { ObjectId } product_shop 
   * @param { Number } limit - Number product limit 
   * @param { Number } skip - Number product skip
   * @returns { JSON } list Draft
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft Success!',
      metadata: await ProductServiceV2.findAllDraftsForShop({ 
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Publish Success!',
      metadata: await ProductServiceV2.findAllPublishForShop({ 
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Search Product Success!',
      metadata: await ProductServiceV2.searchProduct(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Product Success!',
      metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Product Success!',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
  // END QUERY //
}

module.exports = new ProductController();
