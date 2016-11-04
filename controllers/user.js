/**
 * Created by 35031 on 2016/10/19.
 */
var multiparty = require('multiparty');
var gm=require('gm').subClass({GraphicMagic:true});
var fs = require("fs");
var path = require('path');
var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: 'LTAI6K5lDlHrpgpv',
    accessKeySecret: '5zsmDm3KwZn0JtioShpyfEm543l0XV '
});
co(function* (){
    var result = yield client.listBuckets();
    console.log(result);
}).catch(function (err) {
    console.log(err);
});

exports.image=function(req,res){
    res.render('image');
};
exports.upImg=function(req,res) {
    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function (err, fields, files) {
        //Object.keys(fields).forEach(function(name) {
        //    console.log('got field named ' + name);
        //});
        ////Object.keys(files).forEach(function(name) {
        ////    console.log('got file named ' + name);
        ////});
        var filesTmp = JSON.stringify(files);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);

            var inputFile = files.inputFile[0];

            var uploadedPath = inputFile.path;
            var dstPath = './public/files/' + inputFile.originalFilename;
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
            function cutPhoto(){
                var p=new Promise(function(resolve,reject){
                    gm(dstPath)
                        .resize(fields.divWidth)
                        .crop(fields.w, fields.h, fields.x1, fields.y1)
                        .write(dstPath, function (err) {
                            if (!err) console.log('arrived');
                            if(err) console.log(err);
                        });
                    resolve('剪裁完成');
                });
                return p;
            }
            cutPhoto().then(function(){
                co(function* () {
                    client.useBucket('wangping');
                    var result = yield client.put(inputFile.originalFilename, dstPath);
                    console.log(result);
                    console.log(dstPath);
                }).catch(function (err) {
                    console.log(err);
                });
            });

        }
    });

    res.send("success");
};

