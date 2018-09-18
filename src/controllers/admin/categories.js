const Category = require('../../models/Category');

const dashboard = (req, res) => {
  if (req.user.role === 'Administrator') {
    Category.find({})
      .then(categoriesList =>
        res.render('admin/categories', { categoriesList, user: req.user })
      )
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const create = (req, res) => {
  if (req.user.role === 'Administrator') {
    let category = new Category();
    category.name = req.body.name;
    category.subcategories = req.body.subcategories.split(',');
    category
      .save()
      .then(str => res.redirect('/admin/dashboard/categories'))
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const edit = (req, res) => {
  if (req.user.role === 'Administrator') {
    Category.findById(req.body.id)
      .then(category => {
        category.name = req.body.name;
        category.subcategories = req.body.subcategories.split(',');
        category
          .save()
          .then(str => res.redirect('/admin/dashboard/categories'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const remove = (req, res) => {
  if (req.user.role === 'Administrator') {
    Category.remove({ _id: req.params.id }, err => {
      if (err) console.error(err);
      else res.redirect('/admin/dashboard/categories');
    });
  } else {
    res.status(401).redirect('/');
  }
};

module.exports = {
  dashboard,
  create,
  edit,
  remove,
};
