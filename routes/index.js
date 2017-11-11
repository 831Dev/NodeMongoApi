/*jslint browser: true*/
/*jshint unused: true, node: true */
/*jslint unparam: true, node: true */
/*global require, module */

var express = require('express');
var asyncjs = require('async');
var mongoose = require('mongoose');
var Item = require('./../models/item');
var config = require('./../config.json');

var router = express.Router();

var notFound = {
    message: 'resource not found'
};
var dbError = {
    message: 'internal error'
};

router.get('/', function (req, res) {  
    res.json({
        app: 'newman 3'
    });
});

router.get('/item', function (req, res) {
    'use strict';
    Item.find(null, function (err, docs) {
        if (err) {
            res.status(500).json(dbError);
        } else {
            if (docs) {
                docs.forEach(x =>{
                    x.uri = "/item/"+x._id;
                })
                res.json(docs);
            } else {
                res.status(404).json(notFound);
            }
        }
    });

});

router.post('/item', function (req, res) {
    'use strict';
    console.log(req.body);
    if(!req.body.name || !req.body.price || !req.body.url){
        res.status(400)
            .json({"message":"item has bad data, please check the name, price and url properties."})
    } else {
        var newItem = new Item(req.body);
        newItem.save(function (err, item) {
            if (err) return res.status(500).json(err);
            res.json(item);
        });
    }   
});

router.get('/item/:id', function (req, res) {
    'use strict';
    var pId = req.params.id;
    var isValidID = mongoose.Types.ObjectId.isValid(pId);    
    if(!isValidID){
        res.status(400).json({"message":"invalid id"});
    } else{
        Item.findById(pId, function (err, doc) {
            if (err) {
                res.status(500).json({"message":err.message});
            } else {
                if (doc) {
                    res.json(doc);
                } else {
                    res.status(404).json(notFound);
                }
            }
        });
    }
});

router.delete('/item/:id', function (req, res) {
    'use strict';
    var pId = req.params.id;
    Item.remove({
        _id: pId
    }, function (err) {
        if (err) {
            res.status(500).json(dbError);
        } else {
            res.status(200).json({});
        }
    });

});

module.exports = router;
