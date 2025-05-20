'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');

// Chi su dung 1 lan
router.get('/createTables', (req, res) => {
    let models = require('../models');
    models.sequelize.sync().then(() => {
        res.send('table created');
    })
});

router.get('/', controller.showHomepage);

router.get('/:page', controller.showPage);

// router.get('/:page', (req, res) => {
//     // res.render(__dirname + `/views/partials/${req.params.page}.hbs`);
//     res.render(req.params.page);
// })


module.exports = router;