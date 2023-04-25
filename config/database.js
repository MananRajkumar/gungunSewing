// database module
var mysql = require('mysql');
var config = {
    // host: 'sql12.freesqldatabase.com',
    // user: 'sql12606982',
    // password: 'AW6jktcgEx',
    // database: 'sql12606982'

    host: 'localhost',
    user: 'id20655587_gungun',
    password: '1q!5&9SovB<TWmyV',
    database: 'id20655587_gungunstore'
};

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