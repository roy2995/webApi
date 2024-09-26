const app = require('./app');

app.listen(app.get('port'), () =>{
   console.log("Server hearing in port", app.get("port"))
});

module.exports = require('./app');