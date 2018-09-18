const Department = require('../../models/Department');

const dashboard = (req, res) => {
  if (req.user.role === 'Administrator') {
    Department.find({})
      .then(departmentsList =>
        res.render('admin/departments', { departmentsList, user: req.user })
      )
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const create = (req, res) => {
  if (req.user.role === 'Administrator') {
    let department = new Department();
    department.name = req.body.name;
    department
      .save()
      .then(str => res.redirect('/admin/dashboard/departments'))
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const edit = (req, res) => {
  if (req.user.role === 'Administrator') {
    Department.findById(req.body.id)
      .then(department => {
        department.name = req.body.name;
        department
          .save()
          .then(str => res.redirect('/admin/dashboard/departments'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const remove = (req, res) => {
  if (req.user.role === 'Administrator') {
    Department.remove({ _id: req.params.id }, err => {
      if (err) console.error(err);
      else res.redirect('/admin/dashboard/departments');
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
