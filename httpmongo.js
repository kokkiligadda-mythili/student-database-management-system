const express = require('express');

const a = express();
const crudRouter = require('./crud'); 
a.use('/', crudRouter); 


a.listen(3000, () => {
  console.log("Server running on port 3002");

});