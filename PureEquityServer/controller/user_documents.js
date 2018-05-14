var User_Document = function () { }
var mongoose = require("mongoose")
var fs=require("fs");
var User_Documents = require('../models/user_documents');

User_Document.prototype.get = function (req, res, next) {

    User_Documents.find()
        .populate("user")
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if (!doc.length || doc == null || doc == [] || doc == undefined) {
                res.status(404).send({ message: "No User Documents Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting User Documents!!" }).end();
            }
        });

}

User_Document.prototype.getById = function (req, res, next) {

    User_Documents.findById(req.params.id)
        .populate("user")
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No User Documents Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this User Documents!!" }).end();
            }
        });

}

User_Document.prototype.getByUid = function (req, res, next) {

    User_Documents.find({ user: req.params.id })
        .populate("user")
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc[0]) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No User Documents Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this User Documents!!" }).end();
            }
        });

}

User_Document.prototype.post = function (req, res, next) {
    var x = new User_Documents(req.body);
    x.save(function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No User Documents found to save!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in updating this User Documents!!" }).end();
        }
    });

}

User_Document.prototype.put = function (req, res, next) {

    User_Documents.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate("user")
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No User Documents found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this User Documents!!" }).end();
            }
        });

}

User_Document.prototype.patcher = function (req, res) {
    var updateObject = req.body;
    User_Documents.update({ _id: req.params.id }, { $set: updateObject }, function (er, dtt) {
        if (er) {
            console.log('error occured..' + er);
        }
        else {
            return res.json(dtt);
        }
    });
}


User_Document.prototype.delete = function (req, res, next) {

    User_Documents.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No User Documents Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this User Documents!!" }).end();
        }
    });

}

User_Document.prototype.image = function (req, res) {
    if (!req.files)
        return res.status(400).send('No Image was uploaded.');

    let image = req.files.image;
    var ext = image.name.split('.');
    var tim = Date.now();
    var imageName = tim + "." + ext[ext.length - 1];
    image.mv('./uploads/users/documents/' + imageName, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send(err);
        }
        else {
            res.status(200).send({ image: imageName });
        }
    });
}

User_Document.prototype.rmimg = function (req,res) {
    let img=req.body.img;
    let uid=req.body.user;
    fs.stat('./uploads/users/documents/'+img, function (err, stats) {
        if (err) {
            console.error(err);
            return res.json('No Such files or Directory found.'+err);
        }     
        fs.unlink('./uploads/users/documents/'+img,function(err){
             if(err){
                 console.log(err);
                 return res.json(err);
             }
             else{
                User_Documents.find({ user: uid },function(er,docker){
                    if(er){
                        return res.json(er);
                    }
                    else{
                        for(var j=0;j<=docker[0].scandoc.length;j++)
                        {
                            if(img==docker[0].scandoc[j]){
                                //console.log('pelanu : '+j+':::looper::'+docker[0].scandoc);
                                docker[0].scandoc.splice(j,1);
                                var updateObject={scandoc:docker[0].scandoc};
                                //console.log('pachinu : '+docker[0].scandoc);
                                User_Documents.update({ _id: docker[0]._id }, { $set: updateObject }, function (er, dtt) {
                                    if (er) {
                                        console.log('error occured..' + er);
                                    }
                                    else {
                                        console.log('file deleted successfully');
                                        return res.json('File Removed Successfully.');
                                        //return res.json(dtt);
                                    }
                                });
                            }
                        }
                    }
                });
             }
        });  
     });
}

module.exports = new User_Document();
