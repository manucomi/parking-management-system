const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Parking Management Backend'));

app.listen(3000, () => console.log('Backend running on port 3000'));
