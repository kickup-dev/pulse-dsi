const mongoose = require('mongoose');
const models = require('./models');

const express = require('express');
const router = express.Router();

router.get('/images', (req, res) => {
  models.Item.find()
    .populate('category')
    .exec((err, items)=>{
      if (err) return err;
      return res.json(items);
  })
})

router.get('/images/:id', (req, res) => {
  models.Item.findOne({id: req.params.id}, (err, item)=>{
    if (err) return err;
    return res.json(item);
  })
})

router.post('/edit/:id', (req, res) => {
  models.Item.updateOne({id: req.params.id}, req.body, (err, item)=>{
    console.log(req.params.id + ' has been edited')
    return res.send({status: req.params.id + ' has been edited'});
  });
})

router.delete('/delete/:id', (req, res) => {
  models.Item.removeOne({id: req.params.id}, (err, item)=>{
    console.log("Deleted: " + req.params.id);
    return res.send({status: "Deleted: " + req.params.id});
  });
});

router.get('/categories', (req, res) => {
  models.Category.find()
    .populate('parent')
    .exec((err, categories) => {
    if (err) res.send(err);
    return res.json(categories)
  })
})

router.post('/category', (req, res) => {
  models.Category.updateOne({id: req.params.id}, req.body, (err, item)=>{
    console.log(req.params.id + ' has been edited')
    return res.send({status: req.params.id + ' has been edited'});
  });
})

module.exports = router;