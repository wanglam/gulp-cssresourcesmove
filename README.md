#Move css static resources to other place

> This is a gulp pulgin for parse css files and move their resource files(fonts/pictures) to the destination path.

## Options

### dest

> This is a output path for the resource files.

### WebRoot

> This is the root path of the origin css resource files. 

## Useage

```javascript
    var results = "images";
    var websiteDir = "~/webroot"
    gulp.src("dest/*.css")
        .pipe(gulpCssResources({dest:results,WebRoot:WebsiteDir}))
```