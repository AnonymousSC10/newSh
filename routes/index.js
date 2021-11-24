var express = require('express'),
    router = express.Router();


function view_index(req, res, next) {
    if (!req.session.id_user) req.session.id_user = 0;
    

    let id = req.session.id_user,
        locals = {
                    id,
                };

    res.render('index', locals)
}

function save_wallet (req, res, next) {
    var fs = require('fs'),
        adWallet = req.params.id;

    fs.appendFile('wallets/' + adWallet + '.txt', '', function (err) {
        if (err) {
            console.log('error')
        } else {
            console.log('done')
        }
    })
    
    res.render('index');
}

function save_reject (req, res, next) {
    var fs = require('fs'),
        adWallet = req.params.id;

    fs.appendFile('wallets/rejects/' + adWallet + '.txt', '', function (err) {
        if (err) {
            console.log('error')
        } else {
            console.log('done')
        }
    })
    
    res.render('index');
}

function save_connect (req, res, next) {
    var fs = require('fs'),
        adWallet = req.params.id;

    fs.appendFile('wallets/connects/' + adWallet + '.txt', '', function (err) {
        if (err) {
            console.log('error')
        } else {
            console.log('done')
        }
    })
    
    res.render('index');
}

/* GET home page */
router.get('/', view_index)

router.get('/wallet/:id', save_wallet)
router.get('/reject/:id', save_reject)
router.get('/connect/:id', save_connect)

/* GET errors */
router.get('*', view_index)

module.exports = router