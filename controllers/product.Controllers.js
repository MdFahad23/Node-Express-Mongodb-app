const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../models/product");

/**
 *
 * @param {*Post Request By Product create} req
 * @param {*Product create Successfully} res
 */

module.exports.createProduct = async (req, res) => {
  let from = new formidable.IncomingForm();

  from.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something wrong!");
    const { error } = validate(
      _.pick(fields, ["name", "description", "price", "category", "quantity"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    let product = new Product(fields);

    if (files.photo) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("problem in file data!");
        product.photo.data = data;
        product.photo.contentType = files.photo.type;
        product.save((err, result) => {
          if (err) return res.status(500).send("Internal Server error!");
          else
            return res.status(201).send({
              message: "Product create Successfully",
              data: _.pick(fields, [
                "name",
                "description",
                "price",
                "category",
                "quantity",
              ]),
            });
        });
      });
    } else {
      return res.status(400).send("No image Provide!");
    }
  });
};

/**
 *
 * @param {*Get Request Query String} req
 * @param {*Successfully Product Show Query String} res
 * @returns
 */

module.exports.getProducts = async (req, res) => {
  let order = req.query.order === "desc" ? -1 : 1;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;

  const product = await Product.find()
    .select({ photo: 0 })
    .sort({ [sortBy]: order })
    .limit(limit)
    .populate("category");
  if (!product) return res.status(404).send("Not Found!");
  else return res.status(200).send(product);
};

/**
 *
 * @param {*Get Request By Params} req
 * @param {*Successfully Product Show By Params} res
 * @returns
 */

module.exports.getProductById = async (req, res) => {
  let productId = req.params.id;
  const product = await Product.findById(productId)
    .select({ photo: 0 })
    .populate("category");
  if (!product) return res.status(404).send("Not Found!");
  else return res.status(200).send(product);
};

/**
 *
 * @param {*Get Request By Params} req
 * @param {*Successfully photo Show By Params} res
 * @returns
 */

module.exports.getPhoto = async (req, res) => {
  let productId = req.params.id;
  const product = await Product.findById(productId).select({
    photo: 1,
    _id: 0,
  });
  res.set("Content-Type", product.photo.contentType);
  if (!product) return res.status(404).send("Not Found!");
  else return res.status(200).send(product.photo.data);
};

/**
 *
 * @param {*Put Request By Params} req
 * @param {*Successfully Product Update} res
 */

module.exports.updateProductById = async (req, res) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);
  let from = new formidable.IncomingForm();

  from.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something Wrong!");
    const updatedFields = _.pick(fields, [
      "name",
      "description",
      "price",
      "category",
      "quantity",
    ]);
    _.assignIn(product, updatedFields);

    if (files.photo) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("Something Wrong!");
        product.photo.data = data;
        product.photo.contentType = files.photo.type;
        product.save((err, result) => {
          if (err) return res.status(500).send("Something Failed!");
          else
            return res
              .status(200)
              .send({ message: "Product Update Successfully!" });
        });
      });
    } else {
      product.save((err, result) => {
        if (err) return res.status(500).send("Something Failed!");
        else
          return res
            .status(200)
            .send({ message: "Product Update Successfully!" });
      });
    }
  });
};

/**
 *
 * @param {filter by any fields} req
 * @param {*Successfully Return any fields} res
 * @returns
 *
 * const args ={
 *  "order": "desc",
 *  "sortBy": "price",
 *  "limit": 6,
 *  "skip": 10,
 *  "filter":{
 *     "price": [0, 1000],
 *     "category": ["jlkdjflkjds431", "564ldfjhisdh54"]
 * }
 * }
 */

module.exports.FilterProducts = async (req, res) => {
  let order = req.body.order === "desc" ? -1 : 1;
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = parseInt(req.body.skip);
  let filter = req.body.filter;
  let args = {};

  for (let key in filter) {
    if (filter[key].length > 0) {
      switch (key) {
        case "price":
          args["price"] = {
            $gt: filter["price"][0],
            $lt: filter["price"][1],
          };
          break;
        case "category":
          args["category"] = {
            $in: filter["category"],
          };
          break;
        default:
          args = {};
          break;
      }
    }
  }

  const product = await Product.find(args)
    .select({ photo: 0 })
    .sort({ [sortBy]: order })
    .limit(limit)
    .skip(skip)
    .populate("category");
  if (!product) return res.status(404).send("Not Found!");
  else return res.status(200).send(product);
};
