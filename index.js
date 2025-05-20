const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');

const redisStore = require('connect-redis').default;
const {createClient} = require('redis');
const redisClient = createClient({
    // url: 'rediss://red-d0m3snqdbo4c73cfcpi0:8T6X0GFUEhxeUkKYwO7pVytVFSWKFo0v@singapore-keyvalue.render.com:6379'
    url: 'redis://red-d0m3snqdbo4c73cfcpi0:6379'
});
redisClient.connect().catch(console.error);

// Cau hinh public static folder
app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//     res.send('Hello to EShop');
// });

// Cau hinh su dung express-handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
}));
app.set('view engine', 'hbs');

// Cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cau hinh su dung session
app.use(session({
    secret: 'S3cret',
    store: new redisStore({client: redisClient}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 // 20m
    }
}));

// Middleware khoi tao gio hang
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;

    next();
});

// Routes
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));
app.use('/users', require('./routes/usersRouter'));

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'File not Found!' });
})

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error' });
})

// router.get('/', (req, res) => {
//     res.render('index');
// })

// router.get('/:page', (req, res) => {
//     // res.render(__dirname + `/views/partials/${req.params.page}.hbs`);
//     res.render(req.params.page);
// })

// Khoi dong web server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})