const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-items');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const userRoutes = require('../routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.User = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/user', userRoutes);

app.post('/user/add-user', async(req,res) => {
    try {
        if(!req.body.number){
            throw new Error('Phone Number is mandatory');
        }
        const name = req.body.name;
        const email = req.body.email;
        const phoneNumber = req.body.number;
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
})

app.use(errorController.get404);

// User Created the product
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if(!user) {
        User.create({name: 'Krishna', email: 'test@gmail.com'});
    }
    return user;
  })
  .then(user => {
    console.log(user);
  })
  .catch(err => {
    console.log(err);
  });

  app.listen(4000);
