'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var cssresources = require("css-resources");
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

var cssResourcesMove = function(options) {
  options = options || {};

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new error('gulp-cssresourcesmove: Streaming not supported'), file);

    var content = file.contents.toString(enc);

    if (!content) return cb(null, file); // pass along
      var images = cssresources(content);
      var times = 0;
      var complete = function(){
        times--;
        if(times === 0){
          cb(null, file);
        }
      }
      for(var idx in images){
        var imagePath = getFilePath(images[idx].path);
        imagePath = imagePath.trim();
        if(/^data:image/.test(imagePath)){
          continue;
        }else if(/^(?:(?:https?:)?\/\/)/.test(imagePath)){
          continue;
        }else if(imagePath.indexOf("/") !== 0){
          imagePath = path.normalize(path.join(path.dirname(file.path),imagePath)).replace(options.WebRoot,"");
        }
        var destPath = options.dest + imagePath;
        var resourcePath = options.WebRoot + imagePath;
        fs.stat(resourcePath,function(err,stat){
          var targetPath = this.targetPath;
          var resourcePath = this.resourcePath;
          if(err){
            if(err.errno === -2){
              gutil.log("Can not find file ",err.path);
              complete();
            }else{
              throw err;
            }
          }else if(stat.isFile()){
            fs.readFile(resourcePath,function(err,data){
              if(err){
                complete();
              }else{
                mkdirp(path.dirname(targetPath), function (err) {
                    if(err){
                      throw err
                    }else{
                      fs.writeFile(targetPath,data,function(err){
                        if(err) throw err;
                        complete();
                      });
                    }
                });
              }
            });
          }else{
            complete();
            gutil.log(resourcePath+" is not a file path!");
          }
        }.bind({targetPath:destPath,resourcePath:resourcePath}));
        times++;
      }
      if(times === 0){
        cb(null, file);
      }
  });
};

var getFilePath = function(alterName){
  var symbols = ["?","#"];
  var resultStr = alterName;
  for(var idx in symbols){
    if(resultStr.lastIndexOf(symbols[idx])>-1){
      resultStr = resultStr.substring(0,alterName.lastIndexOf(symbols[idx]));
    } 
  }
  return resultStr;
}
module.exports = cssResourcesMove;
