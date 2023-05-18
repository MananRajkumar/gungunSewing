// database module
var mysql = require('mysql');
const cloudinary = require('cloudinary').v2;


var config = {
    host: 'sql.freedb.tech',
    user: 'freedb_id20655587_gungun',
    password: '$VJ93xCtM@JWtB*',
    database: 'freedb_id20655587_gungunstore'

    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'gungun'
};



cloudinary.config({
  cloud_name: 'dbljf31af',
  api_key: '254894558298539',
  api_secret: 'jk-FVQ7wBEzkB59FwcDfqHble0s'
});


// init database
var pool = mysql.createPool(config);

//Fetch data
function RunQuery(sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            ShowErrors(err);
        }
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                ShowErrors(err);
            }
            conn.release();
            callback(rows);
            // console.log(`Server connected to database ${config.database}`);
        });
    });
}

function updateCoupon(couponCode, discountAmount, callback) {
    const query = `UPDATE coupons SET discount_amount = ${discountAmount} WHERE code = '${couponCode}'`;
    pool.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  }
  

//Throw errors
function ShowErrors(err) {
    throw err;
}

module.exports = {
    RunQuery: RunQuery,
    updateCoupon: updateCoupon
};