const Store = require('../../models/Store');

const dashboard = (req, res) => {
  if (req.user.role === 'Administrator') {
    Store.find({})
      .sort({ name: 1 })
      .then(storeList =>
        res.render('admin/stores', { storeList, user: req.user })
      )
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const create = (req, res) => {
  if (req.user.role === 'Administrator') {
    let store = new Store();
    store.name = req.body.name;
    store.company = req.body.company;
    store.ip_pc = req.body.ip_pc;
    store.ipvpn = req.body.ipvpn;
    store.phone = req.body.phone;
    store
      .save()
      .then(stor => res.redirect('/admin/dashboard/stores'))
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const edit = (req, res) => {
  if (req.user.role === 'Administrator') {
    Store.findById(req.body.id)
      .then(store => {
        store.name = req.body.name;
        store.ip_pc = req.body.ip_pc;
        store.ipvpn = req.body.ipvpn;
        store.phone = req.body.phone;
        store
          .save()
          .then(str => res.redirect('/admin/dashboard/stores'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  } else {
    res.status(401).redirect('/');
  }
};

const remove = (req, res) => {
  if (req.user.role === 'Administrator') {
    Store.remove({ _id: req.params.id }, err => {
      if (err) console.error(err);
      else res.redirect('/admin/dashboard/stores');
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
