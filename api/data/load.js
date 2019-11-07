const dotenv = require('dotenv');
dotenv.config();

const async = require('async');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_SRV, { useNewUrlParser: true });
const models = require('../models');


const data = require('./db.json');
const {images, categories} = data;

const categoriesToAdd = require('./categoriesToAdd.json');


console.log(images.length, categories.length);

function deleteAllThings(callback){
  models.Category.deleteMany({ _id: { $exists: true } }, err => {
    if (err) { console.error(err)};
    console.log("All Categories Deleted");
    models.Item.deleteMany({ _id: { $exists: true}}, err=> {
      if (err) {console.error(err)};
      console.log("All Items Deleted.");
      return callback();
    })

  })
}

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
    return async.each(topLevelCategories, (cat, cb) => {
      models.Category.create({name: cat.name, parent: all}, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        return cb()
      })
    }, () => callback());
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
        console.log(result.name + " was created");
        return cb()
      })
    })

  }, callback);
}

function createImages(callback){
  return async.each(images, (image, cb) => {
    const getCategory = models.Category.findOne({name: image.category});
    getCategory.then(category => {
      if(!category) {
        console.log("No category yet", image.name, image.category);
        return cb();
      }
      // console.log("Category:", image.category)
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

function addStyleSource(callback){
  return async.each(images, (image, cb) => {
    const getCategory = models.Category.findOne({name: image.category});
    getCategory.then(category => {
      if(!category) {
        console.log("No category yet", image.category);
        return cb();
      }
      console.log("Category:", image.category)
      image.category = category;

      return models.Item.update({id: image.id}, {styleSource: image.styleSource}, (err, result) => {
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

function updateCategories(callback){
  return async.each(images, (image, cb) => {
    const getCategory = models.Category.findOne({name: image.category});
    getCategory.then(category => {
      if(!category) {
        console.log("No category yet", image.category);
        return cb();
      }
      console.log("Category:", image.category)
      image.category = category;

      return models.Item.update({id: image.id}, { category }, (err, result) => {
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

function addMissedCategories(callback) {
  let subCategories = categoriesToAdd;
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

function createAllCategory(callback){
  models.Category.create({name: 'All', _id: '5dae116630bdf32d46a1090b'}, (err, result) => {
    if (err) {
      console.log(err);
      return callback();
    }
    console.log(result);
    return callback();
  })
}



deleteAllThings(() => {
  return createAllCategory(() => {
    return createTopLevelCategories(()=> {
      return createSubCategories(() => {
        return addMissedCategories(()=> {
         return createImages(()=> process.exit(1));
        });
      });
    });
  });
});
