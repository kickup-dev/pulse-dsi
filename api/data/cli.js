const watch = require("node-watch");
const keygen = require("keygen");
const sizeOf = require("image-size");
const fs = require("fs");

const  mongoose = require('mongoose');
mongoose.connect(process.env.DB_SRV, { useNewUrlParser: true });



function watchFiles(callback) {
  watch('../', {
    recursive: false
  }, function(evt, name) {
    if (evt == 'update' && name !== '../.DS_Store') {
      sizeOf(name, function(err, dimensions) {
        var extension = name.match(/\..{2,3}$/g)[0];
        var obj = {
          id: keygen.url(keygen.medium),
          name: '',
          url: '',
          description: '',
          dimensions: {
            width: dimensions.width,
            height: dimensions.height
          },
          filetype: extension
        };
        fs.rename(name, `./images/${obj.id + extension}`, function(err) {
          if (err) console.log('ERROR: ' + err);
          db.get('images')
            .push(obj)
            .write()
          console.log(name + " uploaded.");
        });
      });
      return callback
    }
  })
};
