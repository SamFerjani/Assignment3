/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Oussama Issam Ferjani______ Student ID: 171852213______ Date: 2/19/2023______
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const cd = require('./modules/collegeData.js');
const path = require('path');

// home path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

// about path
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// HTML DEMO path
app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/htmlDemo.html'));
});

// students path
app.get("/students", async (req, res) => {
    try {

        if (req.query.course) {
            const course = parseInt(req.query.course);
            if (isNaN(course) || course < 1 || course > 7) {
                throw new Error('Invalid course number');
            }
            const students = await cd.getStudentsByCourse(course);
            res.json(students);
        } else {
            const students = await cd.getAllStudents();
            res.json(students);
        }
    } catch (err) {
        res.status(500).json({ message: 'no results' });
    }
});

// TAs path
app.get("/tas", async (req, res) => {
    try {
        const managers = await cd.getTAs();
        res.json(managers);
    } catch (err) {
        res.status(500).json({ message: 'no results' });
    }
});

// courses path
app.get("/courses", async (req, res) => {
    try {
        const courses = await cd.getCourses();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'no results' });
    }
});

// specific student path
app.get("/student/:num", async (req, res) => {
    try {
        const num = parseInt(req.params.num);
        if (isNaN(num) || num < 1) {
            throw new Error('Invalid student number');
        }
        const student = await cd.getStudentByNum(num);
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'no results ' });
    }
});

// WRONG PATH
app.use(function (req, res, next) {
    res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
cd.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
}).catch((err) => {
    console.error(`Error initializing data: ${err}`);
});
