var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var csrf = require("csurf");
var passport = require("passport");
var flash = require("connect-flash");
var Order = require("../models/order");
var Cart = require("../models/Cart");
var csrfProtection = csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedin, function(req, res, next) {
  Order.find({ user: req.user })
    .then(orders=>{
      // TODO: Need HElP
      var new_orders=[];
      orders.forEach(function(order, index){
        new_orders.push({})
        new_orders[index].cart={}
        new_orders[index].cart.totalPrice = order.cart.totalPrice
        new_orders[index].cart.totalQty = order.cart.totalQty
        var cart = new Cart(order.cart);
        new_orders[index].items = cart.generateArray();
        
      });
      console.log(new_orders )
      res.render("user/profile",{orders:new_orders});
    })
    .catch(err => console.log(err));
  
});

router.get("/logout", isLoggedin, (req, res) => {
  req.logout();
  res.redirect();
});

router.use("/", notLoggedIn, function(req, res, next) {
  next();
});

router.get("/signup", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signup", { csrfToken: req.csrfToken(), messages: messages });
});
router.post(
  "/signup",
  passport.authenticate("local.signup", {
    // successRedirect: 'profile',
    failureRedirect: "signup",
    failureFlash: true
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      var oldURL = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldURL);
    } else {
      res.redirect("/user/profile");
    }
  }
);

router.get("/signin", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signin", { csrfToken: req.csrfToken(), messages: messages });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    // successRedirect: 'profile',
    failureRedirect: "signin",
    failureFlash: true
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      var oldURL = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldURL);
    } else {
      res.redirect("/user/profile");
    }
  }
);
module.exports = router;

function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
