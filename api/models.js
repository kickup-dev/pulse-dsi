const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  url: String,
  description: String,
  dimensions: {
    width: Number,
    height: Number,
  },
  filetype: {
    type: String,
    enum: ['.png', '.gif', '.jpg', 'png', 'gif', 'jpg'],
  },
  styleSource: [{
    type: String
  }],
  clientFacing: Boolean,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

const CategorySchema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

module.exports.Item = mongoose.model('Item', ItemSchema);
module.exports.Category = mongoose.model('Category', CategorySchema);