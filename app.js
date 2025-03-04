const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000; // Replace with your desired port

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.use('/public', express.static('public'));

var session = require('express-session');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: "yoursecret",
  resave: true,
  saveUninitialized: true,
}))

// MySQL connection configuration
const pool = mysql.createConnection({
  host: '192.168.68.2', // Hostname
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'project_fs' // Name of your database
});

pool.connect((err) => {
  if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
  }
  console.log('Connected to database');
});


// Route to render the product selection form
app.get('/', (req, res) => {
  res.render('index',{title: "Home"}); 
});

app.get('/myproduct', (req, res) => {
    sql1 = 'SELECT DISTINCT brand, logo FROM item';
    pool.query(sql1,(err, results) => {
      if (err) throw err;
      res.render('myproduct',{results: results, title: "partners"}); 
    });
  });

app.get('/solution', (req, res) => {
    res.render('solution',{title: "Solutions"}); 
});

app.get('/login', (req, res) => {
  const successMessage = req.query.success;
  res.render('login', {success: successMessage, title: "Login"}); 
});

app.get('/register', (req, res) => {
  res.render('register',{title: "Register"}); 
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/staffonly', (req, res) => {
  if (req.session.loggedin) {
    res.render('staffonly',{session: false, title: "Staff"}); 
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/additem', (req, res) => {
  if (req.session.loggedin) {
    const successMessage = req.query.success;
    res.render('additem',{success: successMessage, title: "Add"}); 
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/product', (req, res) => {
  if (req.session.loggedin) {
    const successMessage = req.query.success;
    sql1 = 'SELECT DISTINCT type FROM item';
    pool.query(sql1,(err, proType) => {
      if (err) throw err;
      sql2 = 'SELECT DISTINCT brand FROM item';
      pool.query(sql2, (err, proBrand) => {
        if (err) throw err;
        sql3 = 'SELECT DISTINCT model FROM item';
        pool.query(sql3, (err, proModel) => {
          if (err) throw err;
          res.render('product',{proType: proType, proBrand: proBrand, proModel: proModel, success: successMessage, title: "Product"}); 
        });
      });
    });
  }
  else {
    res.send("Staff Only - Please Login")
  };
});

app.get('/removeitem', (req, res) => {
  if (req.session.loggedin) {
    const successMessage = req.query.success;
    sql4 = 'SELECT DISTINCT type FROM item';
    pool.query(sql4,(err, proType) => {
      if (err) throw err;
      sql5 = 'SELECT DISTINCT brand FROM item';
      pool.query(sql5, (err, proBrand) => {
        if (err) throw err;
        sql6 = 'SELECT DISTINCT model FROM item';
        pool.query(sql6, (err, proModel) => {
          if (err) throw err;
          res.render('removeitem',{proType: proType, proBrand: proBrand, proModel: proModel, success: successMessage, title: "Remove"}); 
        });
      });
    });
  }
  else {
    res.send("Staff Only - Please Login")
  };
});

app.get('/getBrands/:type', (req, res) => {
  const type = req.params.type;
  const sql7 = 'SELECT DISTINCT brand FROM item WHERE type = ?';
  pool.query(sql7, [type], (err, results) => {
      if (err) throw err;
      res.json(results.map(row => row.brand));
  });
});

app.get('/getModels/:type/:brand', (req, res) => {
  const type = req.params.type;
  const brand = req.params.brand;
  const sql8 = 'SELECT DISTINCT model FROM item WHERE type = ? AND brand = ?';
  pool.query(sql8, [type, brand], (err, results) => {
      if (err) throw err;
      res.json(results.map(row => row.model));
  });
});

app.get('/getmyTypes', (req, res) => {
  let sql9 = 'SELECT DISTINCT type FROM item';
  pool.query(sql9, (err, result) => {
      if (err) throw err;
      const types = result.map(row => row.type);
      res.json(types);
  });
});

app.get('/getmyBrands', (req, res) => {
  let sql10 = 'SELECT DISTINCT brand FROM item';
  pool.query(sql10, (err, result) => {
      if (err) throw err;
      const brands = result.map(row => row.brand);
      res.json(brands);
  });
});

app.get('/customer', (req, res) => {
  if (req.session.loggedin) {
    const successMessage = req.query.success;
    res.render('customer', { success: successMessage, title: "Customer"}); 
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/prosearch', (req, res) => {
  if (req.session.loggedin) {
    res.render('prosearch', {results: null, title: "Search" });
  }
});

app.get('/faultrep', (req, res) => {
  if (req.session.loggedin) {
    res.render('faultrep', { results: null, title: "Fault" });
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/faultack', (req, res) => {
  if (req.session.loggedin) {
    const successMessage = req.query.success;
    res.render('faultack', { success: successMessage, title: "Acknowledge"}); 
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/updatefault', (req, res) => {
  if (req.session.loggedin) {
    res.render('updatefault', { results: null, title: "Update" });
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/closing', (req, res) => {
  if (req.session.loggedin) {
    const successMessage = req.query.success;
    res.render('closeack',{ success: successMessage, title: "Closed"});
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/pendreport', (req, res) => { 
  if (req.session.loggedin) {
    sql11 = 'SELECT DISTINCT type FROM item';
    pool.query(sql11,(err, proType) => {
      if (err) throw err;
      res.render('pendreport', {proType: proType,  results: null, title: "Report" });
    });
  }
  else {
    res.send("Staff Only - Please Login")
  }
});

app.get('/profile', (req, res) => {
  if (req.session.loggedin) { 
    pool.query('SELECT * FROM users WHERE username = ?', [req.session.username], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.render('profile', { results: results, title: "Profile" });
      } else {
        res.send("No user found!");
      }
    });
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
});

app.post('/auth', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
      let sql12 = 'SELECT * FROM users WHERE username = ? AND password = ?';
      pool.query(sql12, [username,password], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            let session = req.session.loggedin;
            res.render('staffonly', {session: session, results: results, title: "Staff"})
        } else { 
            res.send("Incorrect Username and/or Password! ");
        }
        res.end();
      });
  } 
});

app.post('/authnext',(req, res) => {
  let name = req.body.name;
  let team = req.body.team;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  if (password === password2) {
    if (email.includes('@abc.com')) {
        let sql13 = 'INSERT INTO users (name, team, email, username, password) VALUES (?, ?, ?, ?, ?)'; 
        pool.query(sql13, [name, team, email, username, password], (error, results) => {
          if (error) throw error;
          res.render('login', {name, name, success: 'Registered Successfully! Please Login', title: "Login"} );
          res.end();
        })
    } else {
      res.send("eMail invalid! Please enter company eMail address ");
    }
  }
  else {
    res.send("Password mismatch! Please Retry ");
  }
});

app.post('/addCustomer', (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const email = req.body.email;
  
  const sql14 = `
    INSERT INTO customer (
      name, 
      address, 
      phone, 
      email
    ) 
    VALUES (?, ?, ?, ?)`;

    pool.query(sql14, [name, address, phone, email], (err, results) => {
      if (err) throw err;
      const sql15 = `SELECT id FROM customer ORDER BY id DESC LIMIT 1;`;
        pool.query(sql15, async (err, Cid) => {
        if (err) throw err;
        const id = Cid[0].id;
        res.render('customer', {cID:id, success: 'Customer added successfully!', title: "Customer" });
      })
  });
});

app.post('/submitProduct', (req, res) => {
  const customerId = req.body.customerId;
  const dateOfPurchase = req.body.dateOfPurchase;
  const productType = req.body.productType;
  const brand = req.body.brand;
  const model = req.body.model;
  const warranty = req.body.warranty;
  const serialNumber = req.body.serialNumber;

  const sql16 = `
    INSERT INTO products (
      customerId,
      dateOfPurchase,
      productType,
      brand,
      model,
      warranty,
      serialNumber
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  pool.query(sql16,
    [customerId, dateOfPurchase, productType, brand, model, warranty, serialNumber], (err, results) => {
    if (err) throw err;
    const sql17 = `SELECT id FROM products ORDER BY id DESC LIMIT 1;`;
    pool.query(sql17, async (err, Pid) => {
      if (err) throw err;
      const id = Pid[0].id;
      res.render('product',{cID: customerId, pID:id, proType: null, proBrand: null, proModel: null, success: 'Sales Details submitted successfully!', title: "Product"});
    });
  });
});

app.post('/submitremove', (req, res) => {
  const model = req.body.model;
  const sql18 = `DELETE FROM item WHERE model = ?`;   
  pool.query(sql18, [model], (err, results) => {
    if (err) throw err;
    res.render('removeitem',{proType: null, proBrand: null, proModel: null,success: 'Model Removed successfully!', title: "Remove"});
    });
});

app.post('/search', (req, res) => { 
  const cusIDemail  = req.body.cusIDemail;
    const sql19 = 'SELECT p.*, c.name, c.address, c.phone, c.email FROM products p INNER JOIN customer c ON p.customerId = c.id WHERE p.customerId = ? OR c.email = ?;';
  pool.query(sql19, [cusIDemail, cusIDemail], (err, results) => { 
    if (err) throw err;
    res.render('prosearch', {results: results, title: "Search" });
  }); 
});

app.post('/fault', (req, res) => { 
  const { customerID, productID } = req.body;
  const sql20 = 'SELECT p.*, c.name, c.address, c.phone, c.email FROM products p INNER JOIN customer c ON p.customerId = c.id WHERE p.customerId = ? AND p.id = ?';
  pool.query(sql20, [customerID, productID], (err, results) => {
    if (err) throw err;
    res.render('faultrep', { results: results[0], title: "Fault" }); 
  }); 
});

app.post('/ticket', (req, res) => {
    const customerId = req.body.customerId;
    const productId = req.body.productId;
    const reportDate = req.body.reportDate;
    const status = req.body.status;
    const description = req.body.description;

    const sql21 = `
      INSERT INTO faults (
        customerId,
        productId,
        reportDate,
        status,
        description
      )
      VALUES (?, ?, ?, ?, ?)`;

      pool.query(sql21,
      [customerId, productId, reportDate, status, description],
      (err, result) => {
        if (err) throw err;
        const sql22 = `SELECT id FROM faults ORDER BY id DESC LIMIT 1;`;
        pool.query(sql22, async (err, Fid) => {
          if (err) throw err;
          const id = Fid[0].id;
          res.render('faultack', {fID: id, cID: customerId , pID: productId , success: 'Ticket submitted successfully!', title: "Acknowledge"});
        });
      });
});

app.post('/update', (req, res) => { 
  const { customerID, productID, faultID } = req.body;
  const sql23 = 'SELECT f.*, c.name, c.address, c.phone, c.email, p.dateOfPurchase, p.productType, p.brand, p.model, p.warranty, p.`serialNumber` FROM faults f INNER JOIN products p INNER JOIN customer c ON f.productId = p.id AND f.customerId = c.id WHERE f.productId= ? AND f.customerId = ? AND f.id = ?'
  pool.query(sql23, [productID, customerID,faultID ], (err, results) => { 
    if (err) throw err;
    res.render('updatefault', {results: results[0], title: "Update" }); 
  }); 
});

app.post('/closing', (req, res) => {
  const {faultId, closeRemark} = req.body;
  const sql24 =`UPDATE faults SET status = 'closed', closeRemark = ?, closeDate = DATE_FORMAT(CURRENT_DATE, '%Y:%m:%d') WHERE id = ?`;
    pool.query(sql24,
    [closeRemark, faultId],
    (err, result1) => {
      if (err) throw err;
          res.render('closeack', {success: 'Ticket closed successfully!', title: "Closed"});
    });
});

app.post('/pending', (req, res) => { 
  const {productType, status} = req.body;
  const sql25 = 'SELECT f.*, p.productType, p.brand, p.model FROM faults f JOIN products p ON f.productId = p.id  WHERE f.status = ? AND p.productType = ?';
  pool.query(sql25, [ status, productType], (err, results) => { 
    if (err) throw err;
    res.render('pendreport', {proType: null, results: results, title: "Report"});
  });
});

app.post('/addtoitems', (req, res) => {
  const { type, brand, model, selection } = req.body;

  if (selection === 'type') {
      sql26 = `INSERT INTO item (type, brand, model) VALUES ('${type}', '${brand}', '${model}')`;
  } else if (selection === 'brand') {
      sql26 = `INSERT INTO item (type, brand, model) VALUES ('${req.body.brandType}', '${req.body.brandText}', '${req.body.brandModelText}')`;
  } else if (selection === 'model') {
      sql26 = `INSERT INTO item (type, brand, model) VALUES ('${req.body.modelType}', '${req.body.modelBrand}', '${req.body.modelText}')`;
  }

  pool.query(sql26, (err, result) => {
      if (err) throw err;
      res.render('additem', {success: 'Product added successfully!', title: "Add" });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});