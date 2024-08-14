require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'japura'
});


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Registration route
app.post('/register', (req, res) => {
  const { studentID, firstName, lastName, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    const sql = 'INSERT INTO users (studentID, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [studentID, firstName, lastName, email, hash], (err, result) => {
      if (err) {
        res.json({ success: false, message: 'Registration failed' });
      } else {
        res.json({ success: true });
      }
    });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      });
    } else {
      res.json({ success: false });
    }
  });
});

// Form submission route
app.post('/api/submit', (req, res) => {
  const { firstName, lastName, faculty, studentID, email, eventDate, event, bookingPlace, bookingTime } = req.body;
  const sql = 'INSERT INTO requestingform (firstName, lastName, faculty, studentID, email, eventDate, event, bookingPlace, bookingTime, deanApproved, adminApproved, sportleaderApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)';

  db.query(sql, [firstName, lastName, faculty, studentID, email, eventDate, event, bookingPlace, bookingTime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error: ' + err.message);
    }

    const insertedId = result.insertId;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'swiftvlog12@gmail.com', // Replace with dean's actual email
      subject: 'Approval Needed for Sport Event',
      html: `<p>Please review the following request:</p>
            <p>Request ID: ${insertedId}</p>
            <p>Student ID: ${studentID}</p>
            <p>First Name: ${firstName}</p>
            <p>Last Name: ${lastName}</p>
            <p>Faculty: ${faculty}</p>
            <p>Event: ${event}</p>
            <p>Date: ${eventDate}</p>
            <p>Place: ${bookingPlace}</p>
            <p>Time: ${bookingTime}</p>
            <a href="http://localhost:${PORT}/approve/${insertedId}">Approve</a>
            <a href="http://localhost:${PORT}/dismiss/${insertedId}">Dismiss</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Email not sent');
      }
      res.send('Request submitted successfully, email sent for approval.');
    });
  });
});

// Approval routes
app.get('/approve/:reqID', (req, res) => {
  const reqID = req.params.reqID;
  db.query('UPDATE requestingform SET deanApproved = 1 WHERE reqID = ?', [reqID], (err, result) => {
    if (err) {
      console.error("Error in database operation:", err);
      res.status(500).send('Failed to approve the request');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Request not found');
      return;
    }
    db.query('SELECT * FROM requestingform WHERE reqID = ?', [reqID], (err, results) => {
      if (err || results.length === 0) {
        console.error("Error fetching request details or no result:", err);
        res.status(500).send('Failed to fetch request details.');
        return;
      }
      const { email, firstName, lastName, faculty, studentID, event, eventDate } = results[0];
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'sudeepaweerasena@gmail.com', // Replace with actual admin email
        subject: 'Approval Needed for Sport Event by Admin',
        html: `<p>Please review the following request:</p>
              <p>Request ID: ${reqID}</p>
              <p>Student ID: ${studentID}</p>
              <p>First Name: ${firstName}</p>
              <p>Last Name: ${lastName}</p>
              <p>Faculty: ${faculty}</p>
              <p>Event: ${event}</p>
              <p>Date: ${eventDate}</p>
              <a href="http://localhost:${PORT}/adminApprove/${reqID}">Approve</a>
              <a href="http://localhost:${PORT}/adminDismiss/${reqID}">Dismiss</a>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send('Email not sent to admin');
        } else {
          res.send('Dean approved and email sent to admin: ' + info.response);
        }
      });
    });
  });
});

// Admin approval route
app.get('/adminApprove/:reqID', (req, res) => {
  const reqID = req.params.reqID;
  db.query('UPDATE requestingform SET adminApproved = 1 WHERE reqID = ?', [reqID], (err, result) => {
    if (err) {
      console.error("Error in database operation:", err);
      res.status(500).send('Failed to approve the request');
      return;
    }
    db.query('SELECT * FROM requestingform WHERE reqID = ?', [reqID], (err, results) => {
      if (err || results.length === 0) {
        console.error("Error fetching request details or no result:", err);
        res.status(500).send('Failed to fetch request details.');
        return;
      }
      const { firstName, lastName, faculty, studentID, event, eventDate } = results[0];
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'swiftvlog12@gmail.com', // Replace with actual sports club email
        subject: 'Approval Needed for Sport Event by Sports Club',
        html: `<p>Please review the following request:</p>
              <p>Request ID: ${reqID}</p>
              <p>Student ID: ${studentID}</p>
              <p>First Name: ${firstName}</p>
              <p>Last Name: ${lastName}</p>
              <p>Faculty: ${faculty}</p>
              <p>Event: ${event}</p>
              <p>Date: ${eventDate}</p>
              <a href="http://localhost:${PORT}/sportsClubApprove/${reqID}">Approve</a>
              <a href="http://localhost:${PORT}/sportsClubDismiss/${reqID}">Dismiss</a>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send('Email not sent to sports club');
        } else {
          res.send('Admin approved and email sent to sports club: ' + info.response);
        }
      });
    });
  });
});

// Sport leader approval route
app.get('/sportsClubApprove/:reqID', (req, res) => {
  const reqID = req.params.reqID;
  db.query('UPDATE requestingform SET sportleaderApproved = 1 WHERE reqID = ?', [reqID], (err, result) => {
    if (err) {
      console.error("Error in database operation:", err);
      res.status(500).send('Failed to approve the request');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Request not found');
      return;
    }
    db.query('SELECT email FROM requestingform WHERE reqID = ?', [reqID], (err, results) => {
      if (err || results.length === 0) {
        console.error("Error fetching request details or no result:", err);
        res.status(500).send('Failed to fetch request details.');
        return;
      }
      const { email } = results[0];
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Event Request has been Approved',
        html: `<p>Your request has been approved!</p>
              <p>Request ID: ${reqID}</p>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send('Email not sent to user');
        } else {
          res.send('Sport leader approved and email sent to user: ' + info.response);
        }
      });
    });
  });
});

// Admin dismissal route
app.get('/adminDismiss/:reqID', (req, res) => {
  const reqID = req.params.reqID;
  db.query('DELETE FROM requestingform WHERE reqID = ?', [reqID], (err, result) => {
    if (err) {
      console.error("Error in database operation:", err);
      res.status(500).send('Failed to dismiss the request');
      return;
    }
    res.send('Request dismissed successfully');
  });
});

// Sport leader dismissal route
app.get('/sportsClubDismiss/:reqID', (req, res) => {
  const reqID = req.params.reqID;
  db.query('DELETE FROM requestingform WHERE reqID = ?', [reqID], (err, result) => {
    if (err) {
      console.error("Error in database operation:", err);
      res.status(500).send('Failed to dismiss the request');
      return;
    }
    res.send('Request dismissed successfully');
  });
});


// Fetch approved events
app.get('/api/approved-events', (req, res) => {
  const sql = `SELECT * FROM requestingform 
               WHERE deanApproved = 1 AND adminApproved = 1 AND sportleaderApproved = 1`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Database error');
    } else {
      res.json(results);
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
