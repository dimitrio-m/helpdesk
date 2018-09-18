const User = require('../models/User');
const Store = require('../models/Store');
const Department = require('../models/Department');
const Category = require('../models/Category');
const Ticket = require('../models/Ticket');

const view = async (req, res) => {
  try {
    const categoriesList = await Category.find().exec();
    const usersList = await User.find().exec();
    const departmentsList = await Department.find().exec();
    const ticket = await Ticket.findById(req.params.id).exec();
    const store = await Store.findOne({ name: ticket.from.store }).exec();
    res.render('ticket', {
      user: req.user,
      ticket,
      store,
      categoriesList,
      usersList,
      departmentsList,
      backUrl: req.headers.referer && req.headers.referer.includes('ticket')?undefined:req.headers.referer,
    });
  } catch(err) {
    console.error(err);
  }
};

const create = (req, res) => {
  let ticket = new Ticket();
  ticket.from.name = req.body.from;
  ticket.from.store = req.body.store;
  ticket.role = 'Simple User';
  ticket.department = req.body.department;
  ticket.assigned_to = req.body.assignedto;
  ticket.cc = req.body.cc;
  ticket.category = req.body.category;
  ticket.subcategory = req.body.subcategory;
  ticket.problem = req.body.problem;
  ticket.description = req.body.description;
  ticket.status = req.body.isclosed ? 'Closed' : 'Open';
  ticket.phone = req.body.phone;
  ticket.cellphone = req.body.cellphone;
  ticket
    .save()
    .then(itm => res.redirect('/dashboard/order/date/down/1'))
    .catch(err => console.error(err));
};

const edit = (req, res) => {
  if (
    req.body.category ||
    req.body.subcategory ||
    req.body.cc ||
    req.body.assignedto || 
    req.body.department || 
    req.body.phone ||
    req.body.from ||
    req.body.problem
  ) {
    Ticket.findById(req.body.id)
      .then(ticket => {
        if (req.body.category && ticket.category !== req.body.category) {
          ticket.comments.push({
            author: req.user.email,
            content: `The category has changed to ${
              req.body.category
            } and the subcategory to ${req.body.subcategory}.`,
            category: 'Log',
          });
          ticket.category = req.body.category;
          ticket.subcategory = req.body.subcategory;
        }
        else if (req.body.subcategory && ticket.subcategory !== req.body.subcategory) {
          ticket.comments.push({
            author: req.user.email,
            content: `The subcategory has changed to ${
              req.body.subcategory
            }.`,
            category: 'Log',
          });
          ticket.subcategory = req.body.subcategory;
        }

        if (req.body.department && ticket.department !== req.body.department) {
          ticket.comments.push({
            author: req.user.email,
            content: `The department has changed to ${req.body.department}.`,
            category: 'Log',
          });
          ticket.department = req.body.department;
        }
        if (req.body.cc && ticket.cc !== req.body.cc) {
          ticket.comments.push({
            author: req.user.email,
            content: `The CC has changed to ${req.body.cc}.`,
            category: 'Log',
          });
          ticket.cc = req.body.cc;
        }
        if (req.body.assignedto && ticket.assigned_to !== req.body.assignedto) {
          ticket.comments.push({
            author: req.user.email,
            content: `The ticket was reassigned to ${req.body.assignedto}.`,
            category: 'Log',
          });
          ticket.assigned_to = req.body.assignedto;
        }
        if (req.body.phone && ticket.phone !== req.body.phone) {
          ticket.comments.push({
            author: req.user.email,
            content: `The phone has changed to ${req.body.phone}.`,
            category: 'Log',
          });
          ticket.phone = req.body.phone;
        }
        if (req.body.from && ticket.from.name !== req.body.from) {
          ticket.comments.push({
            author: req.user.email,
            content: `The user has changed to ${req.body.from}.`,
            category: 'Log',
          });
          ticket.from.name = req.body.from;
        }
        if (req.body.problem && ticket.problem !== req.body.problem) {
          ticket.comments.push({
            author: req.user.email,
            content: `The problem has changed to ${req.body.problem}.`,
            category: 'Log',
          });
          ticket.problem = req.body.problem;
        }
        ticket.save().then(itm => res.redirect('/ticket/' + ticket.id));
      })
      .catch(err => console.error(err));
  } else {
    res.redirect('/ticket/' + req.body.id);
  }
};

const createComment = (req, res) => {
  Ticket.findById(req.params.ticketId)
    .then(ticket => {
      ticket.comments.push({
        author: req.body.author,
        content: req.body.comment,
        category: 'Comment',
      });
      ticket
        .save()
        .then(usr => res.redirect('/ticket/' + ticket._id))
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

const close = (req, res) => {
  Ticket.findById(req.params.ticketId)
    .then(ticket => {
      ticket.status = 'Closed';
      ticket.comments.push({
        author: req.user.email,
        content: `The ticket status was marked as Closed.`,
        category: 'Log',
      });
      ticket
        .save()
        .then(usr => res.redirect('/ticket/' + ticket._id))
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

const progress = (req, res) => {
  Ticket.findById(req.params.ticketId)
    .then(ticket => {
      ticket.status = 'In Progress';
      ticket.comments.push({
        author: req.user.email,
        content: `The ticket status was marked as In Progress.`,
        category: 'Log',
      });
      ticket
        .save()
        .then(usr => res.redirect('/ticket/' + ticket._id))
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

module.exports = {
  view,
  create,
  edit,
  createComment,
  close,
  progress,
};
