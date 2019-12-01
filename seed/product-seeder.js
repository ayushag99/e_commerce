var Product = require("../models/product");

var mongoose = require("mongoose");
mongoose.connect("mongodb://ayush:123456789as@ds041758.mlab.com:41758/carty",{useNewUrlParser:true,useUnifiedTopology: true});


var product = [
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/51-QMzEE0HL._SL1166_.jpg",
    title: "One Plus 7 Pro",
    description: "Awesome Phone!!",
    price: 400
  }),
  new Product({
    imagePath:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-select-2019-family?wid=882&hei=1058&fmt=jpeg&qlt=80&op_usm=0.5,0.5&.v=1567812930312",
    title: "iphone 11 Pro",
    description: "Awesome Phone!!",
    price: 1100
  }),
  new Product({
    imagePath:
      "https://i-cdn.phonearena.com/images/article/120125-two_lead/Pixel-4-XL-bashing-misses-the-big-picture-here-is-why-I-think-this-is-the-best-Android-phone-of-2019.jpg",
    title: "Google Pixel 4 Xl",
    description: "Awesome Phone!!",
    price: 800
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/I/71G1FCIP1EL._SX569_.jpg",
    title: "Samsung Note 10 Plus",
    description: "Awesome Phone!!",
    price: 850
  }),
];

var done=0;
for (var i=0; i < product.length ; i++){
    product[i].save((err,result)=>{
        done++;
        if(done == product.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}
