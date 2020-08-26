const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose');
const dev = require('./dev');
const Service = require('./models/service');
const crypto = require('crypto');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const user = require('./models/user');
const { json } = require('body-parser');
const { combineLatest } = require('rxjs');
const { response } = require('express');
const dburl = dev.dbFoostelUrl;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var objOnRun = [];
const nodemailer = require('nodemailer')
const mailsender = nodemailer.createTransport(dev.mailuser);

mongoose.Promise = global.Promise;
mongoose.connect(dburl, function (err) {
    if (err) {
        console.log("Error: " + err)
    }
});


var verif = null;
var exp = null;
var key = null;
var algorithm = 'aes256';
var ouv = null;
const process = require('process')

function verifyUser(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send("unauthorized request !");
    }
    else {
        let token = req.headers.authorization.split(" ")[1];
        if (token == 'null') {
            console.log("TOKEN NULLLLLLLLLLLLLLLLLLL");
            return res.status(401).send("unauthorized request !");
        }
        console.log("TOKEN:: " + token);
        let payload = jwt.verify(token, 'privatetest');
        if (!payload) {
            return res.status(401).send("unauthorized request !");
        }
        req.userId = payload.subject;
        next()
    }
}

router.get('/getuser', verifyUser, function (req, res) {
    let id = req.userId;
    User.findById({ _id: id })
        .exec(function (err, user) {
            if (err) {
                console.log(err)
            }
            else {
                if (user) {
                    res.json({
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    })
                }
            }
        })
})

router.post('/checkmail', function (req, res) {
    console.log(req.body.email)
    User.findOne({ email: req.body.email })
        .exec(function (err, u) {
            if (err) {
                console.log(err)
            }
            else if (u) {
                res.send({ exist: 1 })
            }
            else {
                res.send({ exist: 0 })
            }
        })
})


router.post('/vp', function (req, res) {
    console.log("VP called");
    var cipher = crypto.createCipher(algorithm, dev.sk);
    var pass = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
    User.findOne({ email: req.body.email })
        .exec(function (err, u) {
            if (pass == u.password) {
                var payload = {
                    subject: u._id
                }
                //console.log(dev.sk);
                var token = jwt.sign(payload, 'privatetest');
                res.send({ pass: 1, token: token })
            }
            else {
                res.send({ pass: 0 });
            }
        })
}
)



router.get('/verifyuser/:uf', function (req, res) {
    var text = req.params.uf;
    var decipher = crypto.createDecipher(algorithm, dev.sk);
    var decrypted = null;
    try {
        decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
        decrypted = decrypted.split("<ttl>");
        var user_email = decrypted[0];
        for (let i of objOnRun) {
            if (i.email == user_email) {
                if (parseInt(decrypted[1]) >= Date.now()) {

                    User.findOne({ email: user_email })
                        .exec(function (e, u) {
                            if (e) {
                                console.error(e);
                            }
                            else {
                                if (!u) {
                                    var user = new User();
                                    var cipher = crypto.createCipher(algorithm, dev.sk);
                                    user.name = i.name;
                                    user.email = i.email;
                                    user.phone = i.dc + '' + i.phone;
                                    user.e_verified = true;

                                    user.password = cipher.update(i.password, 'utf8', 'hex') + cipher.final('hex');
                                    user.save(function (err, saved) {
                                        if (err) {
                                            //console.log(err);
                                            res.send("Server error try after some time.")
                                        }
                                        else {
                                            //console.log("NEW USER ADDED::");
                                            res.send("<div style='text-align:center;'><h2>Account verified.</h2> <a href='http://localhost:4200/signin'>Sign In</a> to continue.</div>");
                                            for (let j = 0; j < objOnRun.length; j++) {
                                                if (objOnRun[j].email == i.email) {
                                                    objOnRun.splice(j, 1);
                                                    //console.log("OBJECT DELETED");
                                                }
                                            }
                                        }
                                    });

                                }
                                else {
                                    res.send("Invalid URL");
                                }
                            }
                        })

                }
                else {
                    res.send("Link expired! ");
                    return;
                }
                return;
            }

        }
        res.send("Invalid URL");

    }
    catch{

        res.send("<h1 style='align-self:center;'>Link Broken</h1>");
    }
});


router.post('/verifyUser', function (req, res) {
    //console.log("verifyuser");
    exp = Date.now() + 1000 * 60 * 10;
    key = dev.sk;
    objOnRun.push(req.body.user);
    var text = req.body.user.email + '<ttl>' + exp;
    //console.log(text);
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    //console.log(encrypted);
    verif = encrypted;
    var mailBody = {
        from: 'foostelservices@gmail.com',
        to: req.body.user.email,
        subject: 'Sign up to Foostel',
        html: `
            <a href = "http://localhost:3000/api/verifyuser/${encrypted}" >Click here</a> to verify your Foostel registration.
        `
    }

    mailsender.sendMail(mailBody,(err,info)=>{
        if(err)
            console.log(err);
        else{
            console.log('email sent' +  info.response);
        }
    })
    
    console.log("http://localhost:3000/api/verifyuser/" + encrypted)
    console.log('/n')

    res.send({ sent: 1 });
})




const request = require('request');

function getCurrency(url, res, callback) {
    request(url, function (err, res, body) {
        return callback(body);
    });
}

router.get('/getCurrency/:cid', function (req, res) {
    let data = [];
    let url = "https://restcountries.eu/rest/v2/alpha/" + req.params.cid + "?fields=currencies";
    getCurrency(url, res, function (r) {
        data = r;
        console.log("RES: ");
        console.log(r)
        return res.send(r);
    })
})


router.post('/insertService', verifyUser, function (req, res) {
    var service = new Service();
    service.providersId
    console.log(req.userId);
    service.s_ownerId = req.userId;
    service.s_name = req.body.service.s_name
    service.s_type = req.body.service.s_type
    service.s_coords = req.body.service.s_coords
    service.s_loc = req.body.service.s_loc
    service.s_add = req.body.service.s_add
    service.s_data = req.body.service.s_data
    service.s_currency = req.body.service.s_currency
    service.s_currency_symbol = req.body.service.s_currency_symbol
    service.dc = req.body.service.dc;
    service.owner_contact = req.body.service.owner_contact;
    service.save(function (err, saved) {
        if (err) {
            console.log(err)
        }
        else {
            res.json()
        }
    })

    

})

router.get('/getServicesByUser', verifyUser, function (req, res) {
    let q = Service.find({ s_ownerId: req.userId }).select('_id s_name s_type');
    q.exec(function (err, services) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(services);
            res.json(services)
        }
    })
})


router.get('/getUserService/:sid', verifyUser, function (req, res) {
    Service.findById({ _id: req.params.sid })
        .exec(function (err, service) {
            if (err) {
                console.log(err)
            }
            else {
                res.json(service);
                console.log(service);
            }
        })
})

router.get('/getService/:sid', function (req, res) {
    Service.findById({ _id: req.params.sid })
        .exec(function (err, service) {
            if (err) {
                console.log(err)
            }
            else {
                res.json(service);
            }
        })
})


router.put('/updateService', function (req, res) {
    Service.findByIdAndUpdate(req.body.service._id, {
        $set: req.body.service
    }, {
        new: true
    }, function (err, updated) {
        if (err) {
            console.log(err)
        }
        else {
            res.send(updated);
        }
    })
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.post('/search', function (req, res) {
    let sobj = req.body.searchObj;
    console.log(sobj.type);
    if (sobj.type != null) {
        let searchRegex = new RegExp(sobj.loc.place_name);
        Service.find({ s_type: sobj.type, s_loc: { $elemMatch: { place_name: searchRegex } } }, {
            _id: 1, dc: 1, owner_contact: 1, s_name: 1, s_data: 1, s_type: 1, s_coords: 1,
            s_loc: { $slice: 1 }, s_add: 1
        })
            .exec(function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                    if (data.length == 0) {
                        let places = sobj.loc.place_name.split(",");
                        searchRegex = new RegExp(places[places.length - 3]);
                        console.log("trying for: " + searchRegex);
                        Service.find({ s_type: sobj.type, s_data: 1, s_loc: { $elemMatch: { place_name: searchRegex } } }, {
                            _id: 1, s_name: 1, s_type: 1, s_coords: 1,
                            s_loc: { $slice: 1 }, s_add: 1, dc: 1, owner_contact: 1
                        })
                            .exec(function (err, d) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log("TRIAL 2");
                                    res.send(d);
                                }
                            })
                    }
                    else {
                        res.send(data);
                    }
                }
            })
    }
    else {
        console.log("ELSE RUNNING ");
        let searchRegex = new RegExp(escapeRegex(sobj.ss), 'gi');
        console.log("SS: " + sobj.ss);
        console.log("REGEX: " + searchRegex);
        Service.find({ s_name: searchRegex })
            .exec(function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                    res.send(data);
                }
            })
    }

});



const conn = mongoose.createConnection(dev.dbFoostelUrl);
var gfs;
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

const storage = new GridFsStorage({
    url: dev.dbFoostelUrl,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
})

var upload = multer({ storage: storage });

const fs = require('fs');
var Binary = require('mongodb').Binary;
const Image = require('./models/image');
const { promise } = require('protractor');
const { resolve } = require('path');
const { rejects } = require('assert');
const { url } = require('inspector');

router.post('/upload', upload.single('file'), function (req, res) {
    console.log(req.file);
    console.log(req.body);
    //res.send(req.file);   
    Service.findByIdAndUpdate(req.body.sid, {
        $push: { photos: { imageId: req.file.md5, tn: req.body.tn } }
    }, {
        new: true
    }, function (err, updated) {
        if (err) {
            console.log(err)
        }
        else {
            res.send(updated);
        }
    })

})

router.get('/getImageById/:id', function (req, res) {
    console.log("LOOKINF FOR : " + '5f2d5de53f39ec75f06e7b56');
    gfs.files.findOne({ md5: req.params.id }, (err, files) => {
        if (!files) {
            return res.send(404);
        }

    })
})

router.get('/photos/:id',function(req,res){
    gfs.files.findOne({md5: req.params.id},(err,photo)=>{
        if(err){
            console.log(err);
            res.status(422).send();
        }
        else{
            var rs = gfs.createReadStream(photo.filename);
            rs.on('data',function(d){
                console.log(d)
                var tmp = new Buffer(d).toString('base64');
                res.send({fileData:'data:image/jpeg;base64,'+tmp});
            })
        }
    })
})

router.post('/deleteImage',function(req,res){
    let imageID = req.body.id;
    gfs.files.remove({md5: imageID},function(err){
        if(err)
        {
            return handleError(err);
        }
        else{
            Service.findByIdAndUpdate(req.body.sid,{
                $pull:{ photos:{imageId: imageID}}
            },{
                new: true,
                userFindAndModify:false
            },
            function(err,dltd){
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.send({dltd:1});
                }
            })
        }
    })
})

module.exports = router;