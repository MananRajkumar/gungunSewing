var express = require("express");
var router = express.Router();

var slug = require("slug");

// database module
var database = require("../config/database");
var RunQuery = database.RunQuery;

function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.Admin == 1) {
      return next();
    } else {
      res.redirect("/usr/" + req.user.Username);
    }
  }

  res.redirect("/");
}

router.route("/").get(isAdmin, function (req, res, next) {
  res.redirect("/admin/cat");
  /*var contextDict = {
           title: 'Admin',
           customer: req.user
           };
           res.render('admin/admin', contextDict);*/
});

router.route("/cat").get(isAdmin, function (req, res, next) {
  var sqlStr =
    "\
        SELECT *\
        FROM categories";

  RunQuery(sqlStr, function (categories) {
    var contextDict = {
      title: "Admin - categories",
      categories: categories,
      customer: req.user,
    };

    res.render("admin/categories", contextDict);
  });
});

router
  .route("/cat/:id/edit")
  .get(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
        SELECT *\
        FROM categories\
        WHERE CategoryID = " + req.params.id;

    RunQuery(sqlStr, function (category) {
      var contextDict = {
        title: "Admin - Edit Category",
        category: category[0],
        customer: req.user,
      };

      res.render("admin/editCat", contextDict);
    });
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
        UPDATE categories\
        SET CategoryName = '" +
      req.body.name +
      "', \
            Description = '" +
      req.body.description +
      "', \
            CategorySlug = '" +
      slug(req.body.name) +
      "' " +
      "WHERE CategoryID = " +
      req.params.id;

    RunQuery(sqlStr, function (category) {
      res.redirect("/admin/cat");
    });
  });

router.route("/cat/:id/delete").post(isAdmin, function (req, res, next) {
  sqlStr =
    "\
            DELETE FROM categories\
            WHERE CategoryID = " + req.params.id;

  RunQuery(sqlStr, function (result) {
    res.redirect("/admin/cat");
  });
});

router
  .route("/cat/add")
  .get(isAdmin, function (req, res, next) {
    var contextDict = {
      title: "Admin - Add Category",
      customer: req.user,
    };

    res.render("admin/addCat", contextDict);
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
        INSERT INTO categories\
        VALUES (null, '" +
      req.body.name +
      "', \
            '" +
      req.body.description +
      "', \
            '" +
      slug(req.body.name) +
      "', \
            '" +
      slug(req.body.name) +
      ".png')";

    RunQuery(sqlStr, function (category) {
      res.redirect("/admin/cat");
    });
  });

router.route("/products").get(isAdmin, function (req, res, next) {
  var sqlStr =
    "\
                    SELECT products.*, categories.CategoryName\
                    FROM products\
                    INNER JOIN categories\
                    ON products.CategoryID = categories.CategoryID";

  RunQuery(sqlStr, function (products) {
    var contextDict = {
      title: "Admin - products",
      products: products,
      customer: req.user,
    };

    res.render("admin/products", contextDict);
  });
});

router
  .route("/products/:id/edit")
  .get(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
                    SELECT products.*, categories.CategoryName\
                    FROM products\
                    INNER JOIN categories\
                    ON products.CategoryID = categories.CategoryID\
                    WHERE ProductID = " + req.params.id;

    RunQuery(sqlStr, function (product) {
      sqlStr =
        "\
                SELECT *\
                FROM categories";

      RunQuery(sqlStr, function (categories) {
        var contextDict = {
          title: "Admin - Edit Product",
          product: product[0],
          categories: categories,
          customer: req.user,
        };

        res.render("admin/editProduct", contextDict);
      });
    });
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
        UPDATE products\
        SET ProductName = '" +
      req.body.name +
      "', \
            CategoryID = " +
      req.body.category +
      ", \
            ProductPrice = " +
      req.body.price +
      ", \
            UnitsInStock = " +
      req.body.unit +
      ", \
            Description = '" +
      req.body.description +
      "', \
            ManufactureYear = " +
      req.body.year +
      ", \
            productslug = '" +
      slug(req.body.name) +
      "', " +
      "Feature = " +
      req.body.feature +
      " \
        WHERE ProductID = " +
      req.params.id;

    RunQuery(sqlStr, function (category) {
      res.status(200).redirect("/admin/products");
    });
  });

router.route("/products/:id/delete").post(isAdmin, function (req, res, next) {
  var sqlStr =
    "\
            DELETE FROM products\
            WHERE ProductID = " + req.params.id;

  RunQuery(sqlStr, function (result) {
    res.redirect("/admin/products");
  });
});

router
  .route("/products/add")
  .get(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
            SELECT *\
            FROM categories";

    RunQuery(sqlStr, function (categories) {
      var contextDict = {
        title: "Admin - Add Product",
        categories: categories,
        customer: req.user,
      };

      res.render("admin/addProduct", contextDict);
    });
  })

  // .post(isAdmin, function (req, res, next) {
  //     var sqlStr = '\
  //         INSERT INTO products\
  //         VALUES (null, \'' + req.body.name + '\', '
  //             + req.body.category + ', '
  //             + req.body.price + ', '
  //             + req.body.unit + ', \
  //         \'' + req.body.description + '\', '
  //             + req.body.year + ', \
  //         \'' + slug(req.body.name) + '.png\', \
  //         \'' + slug(req.body.name) + '\', '
  //             + req.body.feature + ')'
  //     /Image = name.png\/
  //         ;

  .post(isAdmin, function (req, res, next) {
    // var sqlStr =
    //     "INSERT INTO products VALUES (null, '" +
    //     req.body.name +
    //     "', " +
    //     req.body.category +
    //     ", " +
    //     req.body.price +
    //     ", " +
    //     req.body.unit +
    //     ", '" +
    //     req.body.description +
    //     "', " +
    //     req.body.year +
    //     ", '" +
    //     slug(req.body.name) +
    //     ".png', '" +
    //     slug(req.body.name) +
    //     "', " +
    //     req.body.feature +
    //     ", '" +
    //     req.body.Image1 +
    //     "', '" +
    //     req.body.Image2 +
    //     "')";

    var sqlStr = `INSERT INTO products VALUES (null, '${req.body.name}', ${req.body.category
      }, ${req.body.price}, ${req.body.unit}, '${req.body.description}', ${req.body.year
      }, '${slug(req.body.name)}', '${slug(req.body.name)}', ${req.body.feature
      }, '${req.body.Image1}', '${req.body.Image2
      }', '${req.body.description1.replace(/'/g, "'")}', '${req.body.edition}', ${req.body.numberofpages
      }, '${req.body.language}')`;

    RunQuery(sqlStr, function (category) {
      res.redirect("/admin/products");
    });
  });

router.route("/orders").get(isAdmin, function (req, res) {
  var selectQuery =
    "\
            SELECT *\
            FROM orders";

  RunQuery(selectQuery, function (orders) {
    var contextDict = {
      title: "Admin - orders",
      customer: req.user,
      orders: orders,
    };

    res.render("admin/orders", contextDict);
  });
});

router.route("/orders/:id").get(isAdmin, function (req, res) {
  //get order info
  var selectQuery =
    "\
            SELECT *\
            FROM orders\
            WHERE OrderID = " + req.params.id;

  RunQuery(selectQuery, function (order) {
    //get user info
    selectQuery =
      "\
            SELECT *\
            FROM users\
            WHERE UserID = " + order[0].UserID;

    RunQuery(selectQuery, function (orderCustomer) {
      //get delivery info
      selectQuery =
        "\
                SELECT *\
                FROM addresses\
                WHERE AddressID = " + order[0].AddressID;

      RunQuery(selectQuery, function (address) {
        //get order info
        selectQuery =
          "\
                    SELECT *\
                    FROM `order details`\
                    INNER JOIN (\
                        SELECT products.*, categories.CategorySlug\
                        FROM products\
                        INNER JOIN categories\
                        ON products.CategoryID = categories.CategoryID\
                    ) `Table`\
                    ON `order details`.ProductID = `Table`.ProductID\
                    WHERE OrderID = " + order[0].OrderID;

        RunQuery(selectQuery, function (products) {
          //get order info

          var contextDict = {
            title: "Admin - orders",
            customer: req.user,
            order: order[0],
            orderCustomer: orderCustomer[0],
            address: address[0],
            products: products,
          };

          res.render("admin/viewOrder", contextDict);
        });
      });
    });
  });
});

router
  .route("/orders/:id/update")
  .get(isAdmin, function (req, res, next) {
    var selectQuery =
      "\
            SELECT *\
            FROM orders\
            WHERE OrderID = " + req.params.id;

    RunQuery(selectQuery, function (order) {
      selectQuery =
        "\
                SELECT *\
                FROM addresses\
                WHERE AddressID = " + order[0].AddressID;

      RunQuery(selectQuery, function (address) {
        selectQuery =
          "\
                    SELECT *\
                    FROM `order details`\
                    INNER JOIN (\
                        SELECT products.*, categories.CategorySlug\
                        FROM products\
                        INNER JOIN categories\
                        ON products.CategoryID = categories.CategoryID\
                    ) `Table`\
                    ON `order details`.ProductID = `Table`.ProductID\
                    WHERE OrderID = " + order[0].OrderID;

        RunQuery(selectQuery, function (products) {
          var contextDict = {
            title: "Admin - Update Status Order " + req.params.id,
            customer: req.user,
            order: order[0],
            address: address[0],
            products: products,
          };

          res.render("admin/updateOrder", contextDict);
        });
      });
    });
  })

  .post(isAdmin, function (req, res, next) {
    var sqlStr =
      "\
        UPDATE orders\
        SET Status = '" +
      req.body.status +
      "' \
        WHERE OrderID = " +
      req.params.id;

    RunQuery(sqlStr, function (result) {
      res.redirect("/admin/orders");
    });
  });

router.route("/customers").get(isAdmin, function (req, res) {
  var selectQuery =
    "\
            SELECT *\
            FROM users";

  RunQuery(selectQuery, function (customers) {
    var contextDict = {
      title: "Admin - Customers",
      customer: req.user,
      customers: customers,
    };

    res.render("admin/customers", contextDict);
  });
});

router.route("/customers/:id/makeAdmin").post(isAdmin, function (req, res) {
  var updateQuery =
    "\
            UPDATE users\
            SET Admin = 1\
            WHERE UserID = " + req.params.id;

  RunQuery(updateQuery, function (result) {
    res.redirect("/admin/customers/");
  });
});

router.route("/customers/:id/removeAdmin").post(isAdmin, function (req, res) {
  var updateQuery =
    "\
            UPDATE users\
            SET Admin = 0\
            WHERE UserID = " + req.params.id;

  RunQuery(updateQuery, function (result) {
    res.redirect("/admin/customers/");
  });
});

router.route("/customers/:id/delete").post(isAdmin, function (req, res) {
  var deleteQuery =
    "\
            DELETE FROM users\
            WHERE UserID = " + req.params.id;

  RunQuery(deleteQuery, function (result) {
    res.redirect("/admin/customers/");
  });
});

router.route("/couponCode").get(isAdmin, function (req, res) {
  var sqlStr =
    "\
        SELECT *\
        FROM coupon_codes";

  RunQuery(sqlStr, function (coupon_codes) {
    var contextDict = {
      title: "Admin - Coupon codes",
      coupon_codes: coupon_codes,
      customer: req.user,
    };

    res.render("admin/couponCodes", contextDict);
  });
});

router
  .route("/couponCode/add")
  .get(isAdmin, function (req, res, next) {
    var contextDict = {
      title: "Admin - Add Coupon",
      customer: req.user,
    };

    res.render("admin/addCoupon", contextDict);
  })

  .post(isAdmin, function (req, res, next) {
    var selectQuery =
      "SELECT * FROM coupon_codes WHERE code = " + req.body.code + "";

    var sqlStr =
      "\
      INSERT INTO coupon_codes (code, discount) \
      VALUES ('" +
      req.body.code +
      "', " +
      req.body.discount +
      ")";

    RunQuery(sqlStr, function (category) {
      res.redirect("/admin/couponCode");
    });
  });

router.route("/couponCode/:id/delete").post(isAdmin, function (req, res) {
  var deleteQuery =
    "\
                DELETE FROM coupon_codes\
                WHERE id = " + req.params.id;

  RunQuery(deleteQuery, function (result) {
    res.redirect("/admin/couponCode");
  });
});

router.route("/youtube").get(isAdmin, function (req, res) {
  var sqlStr =
    "\
        SELECT *\
        FROM youtube";

  RunQuery(sqlStr, function (youtube) {
    var contextDict = {
      title: "Admin - Youtube",
      youtube: youtube,
      customer: req.user,
    };

    res.render("admin/youtube", contextDict);
  });
});

router
  .route("/youtube/add")
  .get(isAdmin, function (req, res, next) {
    var contextDict = {
      title: "Admin - Add Youtube",
      customer: req.user,
    };

    res.render("admin/addYoutube", contextDict);
  })

  .post(isAdmin, function (req, res, next) {
    var selectQuery =
      "SELECT * FROM youtube WHERE titleYoutube = " +
      req.body.titleYoutube +
      "";

    var sqlStr =
      "\
INSERT INTO youtube (titleYoutube, linkYoutube) \
VALUES ('" +
      req.body.titleYoutube +
      "', '" +
      req.body.linkYoutube +
      "')";
    //   "\
    //   INSERT INTO youtube (titleYoutube, linkYoutube) \
    //   VALUES ('" + req.body.titleYoutube + "', " + req.body.linkYoutube + ")";

    RunQuery(sqlStr, function (category) {
      res.redirect("/admin/youtube");
    });
  });

router.route("/youtube/:id/delete").post(isAdmin, function (req, res) {
  var deleteQuery =
    "\
                DELETE FROM youtube\
                WHERE id = " + req.params.id;

  RunQuery(deleteQuery, function (result) {
    res.redirect("/admin/youtube");
  });
});

module.exports = router;
