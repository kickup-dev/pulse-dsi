const dotenv = require('dotenv');
dotenv.config();

const async = require('async');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_SRV, { useNewUrlParser: true });
const models = require('./models.js');


const data = require('./db.json');
const {images, categories} = data;

console.log(images.length, categories.length);

function createAllCategory(callback){
  models.Category.create({name: 'All'}, (err, result) => {
    if (err) {
      console.log(err);
      return callback();
    }
    console.log(result);
    return callback();
  })
}

function createTopLevelCategories(callback){
  let topLevelCategories = categories.filter(cat => cat.parent === 'All');
  let findAll = models.Category.findOne({name: 'All'});

  findAll.then(all => {
    console.log(topLevelCategories.length);
    return async.each(topLevelCategories, cat => {
      models.Category.update({name: cat.name, parent: all}, {upsert: true}, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      })
    }, callback);
  })
}

function createSubCategories(callback){
  let subCategories = categories.filter(cat => cat.parent !== 'All');
  console.log(subCategories.length);
  return async.each(subCategories, (cat, cb) => {
    const getParent = models.Category.findOne({name: cat.parent});
    getParent.then(parent => {
      if(!parent) {
        console.log("No parent yet", cat.name);
        return cb();
      }
      console.log("Parent:", parent.name)

      return models.Category.create({name: cat.name, parent: parent}, (err, result) => {
        if (err) {
          console.log(err);
          return cb();
        }
        console.log(result);
        return cb()
      })
    })

  }, callback);
}

function createImages(index, callback){
  return async.each(images, (image, cb) => {
    const getCategory = models.Category.findOne({name: image.category});
    getCategory.then(category => {
      if(!category) {
        console.log("No category yet", image.category);
        return cb();
      }
      console.log("Category:", image.category)
      image.category = category;

      return models.Item.create({...image}, (err, result) => {
        if (err) {
          console.log(err);
          return cb();
        }
        console.log(result);
        return cb()
      })
    })
  }, callback);


}

function createTopLevelCategories(callback){
  let topLevelCategories = categories.filter(cat => cat.parent === 'All');
  let findAll = models.Category.findOne({name: 'All'});

  findAll.then(all => {
    console.log(topLevelCategories.length);

  })
}

function createCategory(name, parent, callback){
  models.Item.create(image, (err, item) => {
    if (err) {
      console.error(err)
      return callback();
    };
    console.log("Added", item.name)
    return callback()
  });
}

function createImage(image, callback){
  models.Item.create(image, (err, item) => {
    if (err) {
      console.error(err)
      return callback();
    };
    console.log("Added", item.name)
    return callback()
  });
}

createImages(()=> process.exit(1));
