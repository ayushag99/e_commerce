var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var csrf = require("csurf");
var passport = require("passport");
var flash = require("connect-flash");
var Cart = require("../models/Cart");
var Order = require("../models/order");

var csrfProtection = csrf();
// router.use(csrfProtection);
/* GET home page. */
router.get("/", function(req, res, next) {
  Product.find()
    .then(products => {
      var successMsg = req.flash('success')[0];
      res.render("shop/index", { products: products , successMsg:successMsg});
    })
    .catch();
});

router.get("/add-to-cart/:id", (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId)
    .then(product => {
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(cart);
      res.redirect("/");
    })
    .catch(err => res.redirect("/"));
});

router.get("/reduce/:id", (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});
router.get("/remove/:id", (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session ? req.session.cart : {});

  cart.removeAll(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", (req, res) => {
  if (!req.session.cart) {
    return res.render("shop/shoppingcart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/shoppingcart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});
router.get("/checkout", isLoggedin, (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  var err = req.flash('error')[0];
  res.render("shop/checkout", { total: cart.totalPrice ,errMsg:err , noError:!err});
});

router.post("/checkout", isLoggedin, (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var order = new Order({
    user: req.user,
    email: req.user.email,
    cart: req.session.cart,
    address: req.body.address,
    name: req.body.name,
    amount: req.session.cart.totalPrice,
    items: req.session.cart.totalQty
  });
  order
    .save()
    .then(order => {
      console.log(order);
    })
    .catch(err => {
      console.log(err);
      req.flash(
        "error",
        "Some error occured, Please retry"
      );
      res.redirect("/checkout")
    });
  req.flash(
    "success",
    "Order Placed, check from User Management > User Account"
  );
  req.session.cart = null;
  res.redirect("/");
});

module.exports = router;
function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}
