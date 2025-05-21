'use strict'

const controller = {}
const passport = require('./passport')

controller.show = (req, res) => {
    res.render('login', { loginMessage: req.flash('loginMessage') });
}

controller.login = (req, res, next) => {
    let keepSignedIn = req.body.keepSignedIn;
    let cart = req.session.cart;
    passport.authenticate('local-login', (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.redirect('/users/login');
        }
        req.logIn(user, (error) => {
            if (error) { return next(error); }
            req.session.cookie.maxAge = keepSignedIn ? (24 * 60 * 60 * 1000) : null;
            req.session.cart = cart;
            return res.redirect('/users/my-account');
        });
    })(req, res, next);
}

controller.logout = (req, res, next) => {
    let cart = req.session.cart;
    req.logout((error) => {
        if (error) { return next(error); }
        req.session.cart = cart;
        res.redirect('/');
    })
}

module.exports = controller;