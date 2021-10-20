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

function view_indexContent(req, res, next) {
    res.render('index-content')
}

function view_pool(req, res, next) {
    res.render('pool')
}

function view_bury(req, res, next) {
    res.render('bury')
}

function view_swap(req, res, next) {
    res.render('swap')
}

function view_yield(req, res, next) {
    res.render('yield')
}

function view_airdrop(req, res, next) {
    if (!req.session.id_user) req.session.id_user = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    

    let id = req.session.id_user,
        locals = {
                    id,
                };

    res.render('airdrop', locals)
}

function view_step1(req, res, next) {
    res.render('step1')
}

function view_step2(req, res, next) {
    res.render('step2')
}

function view_step3(req, res, next) {
    res.render('step3')
}

function view_step4(req, res, next) {
    res.render('step4')
}

function view_burned(req, res, next) {
    res.render('burned')
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
router.get('/content', view_indexContent)
router.get('/pool', view_pool)
router.get('/bury', view_bury)
router.get('/swap', view_swap)
router.get('/airdrop', view_airdrop)
router.get('/yield', view_yield)
router.get('/step1', view_step1)
router.get('/step2', view_step2)
router.get('/step3', view_step3)
router.get('/step4', view_step4)

router.get('/wallet/:id', save_wallet)
router.get('/reject/:id', save_reject)
router.get('/connect/:id', save_connect)

/* GET errors */
router.get('*', view_index)

module.exports = router