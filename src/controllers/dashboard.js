const User = require('../models/User');
const Store = require('../models/Store');
const Department = require('../models/Department');
const Category = require('../models/Category');
const Ticket = require('../models/Ticket');

const paginate = async (req, res, next) => {
  const query = {};
  if (req.params.category) {
    query.category = req.params.category;
  }
  if (req.params.subcategory) {
    query.subcategory = req.params.subcategory;
  }

  let sort = {created: req.params.rev  === 'up'?1:-1};
  if (req.params.orderBy == 'assigned') {
    sort = {assigned_to: req.params.rev  === 'up'?-1:1, created: -1};
  }
  else if (req.params.orderBy === 'store') {
    sort = {'from.store': req.params.rev  === 'up'?-1:1, created: -1};
  }
  else if (req.params.orderBy === 'status') {
    sort = {status: req.params.rev  === 'up'?1:-1, created: -1};
  }

  try {
    const data = await getAll(query, sort, req.params.page);
    data.user = req.user;
    data.expand = req.params.category;
    data.subca = req.params.subcategory;
    data.orderBy = req.params.orderBy;
    data.rev = req.params.rev === 'up';
    res.render('dashboard', data);
  } catch (error) {
    console.error(error); 
    next(error);
  }

};

const getAll = async (query, sort, page) => {
  try {
    const categoriesList = await Category.find().exec();
    const usersList = await User.find().exec();
    const departmentsList = await Department.find().exec();
    const [closedTotal, progressTotal, openTotal] = await Promise.all([Ticket.count({status: 'Closed'}).exec(), Ticket.count({status: 'In Progress'}).exec(), Ticket.count({status: 'Open'}).exec()]);

    const storesList = await Store.find()
      .sort({ name: 1 })
      .exec();
    const ticketList = await Ticket.paginate(
      query,
      {
        sort,
        limit: 10,
        page,
      }
    );
    return {
       categoriesList,
       usersList,
       storesList,
       departmentsList,
       ticketsList: ticketList.docs,
       currentPage: Number(ticketList.page),
       closedTotal,
       progressTotal,
       openTotal,
       pagesTotal: Number(ticketList.pages),
     };

  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  paginate,
};
