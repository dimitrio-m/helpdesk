const User = require('../../models/User');

const dashboard = (req, res) => {
  if (req.user.role === 'Administrator') {
    User.find({})
      .then(userList => res.render('admin/users', { userList, user: req.user }))
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const create = (req, res) => {
  if (req.user.role === 'Administrator') {
    let user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;
    user.name = req.body.name;
    user
      .save()
      .then(usr => res.redirect('/admin/dashboard/users'))
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const edit = (req, res) => {
  if (req.user.role === 'Administrator') {
    User.findById(req.body.id)
      .then(user => {
        user.email = req.body.email;
        if (
          req.body.password !== '' &&
          req.body.password === req.body.confirmation
        ) {
          user.password = req.body.password;
        }
        user.role = req.body.role;
        user.name = req.body.name;
        user
          .save()
          .then(usr => res.redirect('/admin/dashboard/users'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const remove = (req, res) => {
  if (req.user.role === 'Administrator') {
    User.remove({ _id: req.params.id }, err => {
      if (err) console.error(err);
      else res.redirect('/admin/dashboard/users');
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
