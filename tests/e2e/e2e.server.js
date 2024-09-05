const express = require('express');
const app = express();
const port = 9000;

app.use(express.static('public'));

app.listen(port, (err) => {
  if (err) {
    console.error('Server error:', err);
    process.send('error');
  } else {
    console.log(`Server running at http://localhost:${port}/`);
    process.send('ok');
  }
});
