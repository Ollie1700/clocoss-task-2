// Express
var express = require('express');
var router = express.Router();

// Get DB variables
var fs = require('fs');
var dbVars = fs.readFileSync('../db_vars.json');

// Database
var mysql = require('mysql');
var db = mysql.createConnection(JSON.parse(dbVars));
/*
{
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clocoss',
}
*/

// Routes

// Gets the count based on an ID
router.get('/:id', (req, res) => {
    db.query(`SELECT count FROM register WHERE id='${req.params.id}'`, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send(result.length == 0 ? '0' : (result[0].count).toString());
    });
});

// Creates (or updates if already exists) a register by adding :count to the existing count
router.post('/:id', (req, res) => {
    var count = req.body.count ? req.body.count : 0;
    db.query(`INSERT INTO register (id, count) VALUES ('${req.params.id}', ${count}) ON DUPLICATE KEY UPDATE count=count+${count}`, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        db.query(`SELECT count FROM register WHERE id='${req.params.id}'`, (err, result) => {
            res.send((result[0].count).toString());
        });
    });
});

// Resets the register's value to :count or 0 if :count isn't specified
router.put('/:id', (req, res) => {
    var count = req.body.count ? req.body.count : 0;
    db.query(`INSERT INTO register (id, count) VALUES ('${req.params.id}', ${count}) ON DUPLICATE KEY UPDATE count=${count}`, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        res.send(count.toString());
    });
});

// Deletes entry with id of :id
router.delete('/:id', (req, res) => {
    db.query(`DELETE FROM register WHERE id='${req.params.id}'`, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        res.sendStatus(204);
    });
});

module.exports = router;
