const User = require('../models/User');
const Store = require('../models/Store');
const Department = require('../models/Department');
const Category = require('../models/Category');
const Ticket = require('../models/Ticket');

const controllers = require('../controllers');
const utils = require('../utils');

module.exports = function(app, passport) {
  // AUTHENTICATION ROUTES

  app.get('/', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
  });

  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/dashboard/order/date/down/1',
      failureRedirect: '/',
      failureFlash: true,
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // VIEWS
  
  app.get('/dashboard/order/:orderBy/:rev/:page/', utils.isLoggedIn, controllers.dashboard.paginate);
  app.get('/dashboard/order/:orderBy/:rev/:page/:category', utils.isLoggedIn, controllers.dashboard.paginate);
  app.get('/dashboard/order/:orderBy/:rev/:page/:category/:subcategory', utils.isLoggedIn, controllers.dashboard.paginate);

  // ticket

  app.get('/ticket/:id', utils.isLoggedIn, controllers.tickets.view);
  app.post('/ticket/new', utils.isLoggedIn, controllers.tickets.create);
  app.post('/ticket/edit', utils.isLoggedIn, controllers.tickets.edit);
  app.post('/comment/new/:ticketId', utils.isLoggedIn, controllers.tickets.createComment);
  app.get('/close/:ticketId', utils.isLoggedIn, controllers.tickets.close);
  app.get('/inprogress/:ticketId', utils.isLoggedIn, controllers.tickets.progress);

  // ADMIN

  app.get('/admin/dashboard', utils.isLoggedIn, function(req, res) {
    if (req.user.role === 'Administrator') {
      res.render('admin/dashboard', {
        user: req.user,
      });
    } else {
      res.status(401).redirect('/');
    }
  });

  // admin users

  app.get('/admin/dashboard/users', utils.isLoggedIn, controllers.users.dashboard);
  app.post('/admin/user/new', utils.isLoggedIn, controllers.users.create);
  app.post('/admin/user/edit/', utils.isLoggedIn, controllers.users.edit);
  app.get('/admin/user/remove/:id', utils.isLoggedIn, controllers.users.remove);

  // admin stores

  app.get('/admin/dashboard/stores', utils.isLoggedIn, controllers.stores.dashboard);
  app.post('/admin/store/new', utils.isLoggedIn, controllers.stores.create);
  app.post('/admin/store/edit/', utils.isLoggedIn, controllers.stores.edit);
  app.get('/admin/store/remove/:id', utils.isLoggedIn, controllers.stores.remove);

  // admin categories

  app.get('/admin/dashboard/categories', utils.isLoggedIn, controllers.categories.dashboard);
  app.post('/admin/category/new', utils.isLoggedIn, controllers.categories.create);
  app.post('/admin/category/edit/', utils.isLoggedIn, controllers.categories.edit);
  app.get('/admin/category/remove/:id', utils.isLoggedIn, controllers.categories.remove);

  // admin departments

  app.get('/admin/dashboard/departments', utils.isLoggedIn, controllers.departments.dashboard);
  app.post('/admin/department/new', utils.isLoggedIn, controllers.departments.create);
  app.post('/admin/department/edit/', utils.isLoggedIn, controllers.departments.edit);
  app.get('/admin/department/remove/:id', utils.isLoggedIn, controllers.departments.remove);
};
