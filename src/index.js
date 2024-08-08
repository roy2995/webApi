const app = require('./app');

app.listen(app.get('port'), () =>{
    console.log("server hearing in port", app.get("port"))
});