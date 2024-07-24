'use strict';
const express = require('express'); // เรียกใช้ไลบรารี express
const crypto = require('crypto'); // เรียกใช้ไลบรารี crypto
const wrRoute = express.Router();
const connection = require('../db');

// POST: เพิ่มหนังสือใหม่
wrRoute.post('/api/books', function (req, res, next) {
    const { id, title, author, published_year = null, genre = null, available = null } = req.body;

    if (!id || !title || !author) {
        return res.status(400).send("Missing required fields: id, title, author");
    }

    const values = [id, title, author, published_year, genre, available];

    connection.execute(`INSERT INTO books (id, title, author, published_year, genre, available) 
        VALUES (?, ?, ?, ?, ?, ?);`, values)
        .then(() => {
            console.log('Insert Successfully');
            res.status(201).send("Insert Successfully");
        })
        .catch((err) => {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data");
        });
});

// GET: ดึงข้อมูลทั้งหมดจาก books
wrRoute.get('/api/books', function (req, res, next) {
    connection.execute('SELECT * FROM books;')
        .then((result) => {
            const rawData = result[0];
            res.send(JSON.stringify(rawData));
        })
        .catch((err) => {
            console.error('Error fetching books:', err);
            res.status(500).send("Error fetching books.");
        });
});

// GET: ดึงข้อมูลหนังสือที่ระบุด้วย ID
wrRoute.get('/api/books/:id', function (req, res, next) {
    const bookId = req.params.id;

    connection.execute('SELECT * FROM books WHERE id = ?;', [bookId])
        .then((result) => {
            const rawData = result[0];
            if (rawData.length === 0) {
                return res.status(404).send("Book not found");
            }
            res.send(JSON.stringify(rawData[0]));
        })
        .catch((err) => {
            console.error('Error fetching book:', err);
            res.status(500).send("Error fetching book.");
        });
});

// PUT: อัปเดตข้อมูลหนังสือที่ระบุด้วย ID
wrRoute.put('/api/books/:id', function (req, res, next) {
    const bookId = req.params.id;
    const { title, author, published_year = null, genre = null, available = null } = req.body;

    // ตรวจสอบว่ามีการระบุฟิลด์ที่จำเป็น
    if (!title || !author) {
        return res.status(400).send("Missing required fields: title, author");
    }

    connection.execute(`UPDATE books SET title = ?, author = ?, published_year = ?, genre = ?, available = ? WHERE id = ?;`,
        [title, author, published_year, genre, available, bookId])
        .then((result) => {
            if (result[0].affectedRows === 0) {
                return res.status(404).send("Book not found");
            }
            res.status(200).send("Update Successfully");
        })
        .catch((err) => {
            console.error('Error updating book:', err);
            res.status(500).send("Error updating book.");
        });
});

// DELETE: ลบข้อมูลหนังสือที่ระบุด้วย ID
wrRoute.delete('/api/books/:id', function (req, res, next) {
    const bookId = req.params.id;

    connection.execute('DELETE FROM books WHERE id = ?;', [bookId])
        .then((result) => {
            if (result[0].affectedRows === 0) {
                return res.status(404).send("Book not found");
            }
            res.status(200).send("Delete Successfully");
        })
        .catch((err) => {
            console.error('Error deleting book:', err);
            res.status(500).send("Error deleting book.");
        });
});

// เส้นทางสำหรับจัดการเส้นทางที่ไม่พบ
wrRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = wrRoute;
