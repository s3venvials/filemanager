const express = require('express');
let app = express();
let flash = require("connect-flash");
let session = require("express-session");
let bodyParser = require("body-parser");
let filesRoute = require("./routes/document_manager");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(flash());
app.use((session)({
    secret: "There they go again!",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));

// Express message Middleware
app.use((req, res, next) => {
    res.locals.error   = req.flash("error");
    res.locals.info    = req.flash("info");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});
app.use("/", filesRoute);


//===============
// Network
//===============
let hostname = '0.0.0.0',
port = 5000;

app.listen(port, hostname, () => {
console.log(`Server running at http://${hostname}/${port}`);
});