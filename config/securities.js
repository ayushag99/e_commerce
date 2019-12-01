var sec = require("../setup/securities");
module.exports={
    dbURL : sec.dbURL || process.env.DBURL,
    secret:sec.secret || process.env.SECRET,
}