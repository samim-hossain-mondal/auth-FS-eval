const express = require('express');
var cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = 4000;

dotenv.config({ path: '.env' });

const validateToken = require('./src/routes/validateToken');
const register = require('./src/routes/register');
const login = require('./src/routes/login');

app.use(express.json());
app.use(cors());
app.use(validateToken);
app.use(register);
app.use(login);

app.listen(PORT, process.env.HOST, () => console.log(`Server is listening on port ${PORT}`));