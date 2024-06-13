
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const mysql=require('mysql')

const { generateToken } = require('./helper/jwtUtils');
 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Primevideo@9369",
    database: 'taskmanager'
});
conn.connect(function (err) {
    if (err) throw err;
    console.log('MySQL Database connected successfully!');
});
module.exports = conn



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const insertUserQuery = 'INSERT INTO register (name, email, password) VALUES (?, ?, ?)';
        conn.query(insertUserQuery, [name, email, password], function (err, result) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already exists' });
                } else {
                    throw err;
                }
            }
            console.log('User registered successfully in MySQL register table');
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      
        const selectUserQuery = 'SELECT * FROM register WHERE email = ? AND password=?';
        conn.query(selectUserQuery, [email,password], async function (err, results) {
            if (err) {
                console.error('Error querying user:', err);
                return res.status(500).json({ message: 'Error querying user' });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
                        console.log(results)
            const user = results[0];

         
            const isPasswordValid = await (password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid or password' });
            }

         
            const token = generateToken(user);

           
            res.status(200).json({  token,user });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});






