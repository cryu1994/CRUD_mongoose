var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
//mongodb
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// db connetoion
mongoose.connect('mongodb://localhost/dash');
mongoose.Promise = global.Promise;

var DashSchema = new mongoose.Schema({
    name:{ type:String, required: true},
    quote: {type: String, required: true, minlength: 10}
}, {timestamps: true});

mongoose.model('Dash', DashSchema); // We are setting this Schema in our Models as 'User'
var Dash = mongoose.model('Dash'); // We are retrieving this Schema from our Models, named 'User'
// Routes
// Root Request

app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
});
// Add User Request
app.post('/add_new', function(req, res) {
    console.log("POST DATA", req.body);

    var dash = new Dash({name: req.body.name, quote: req.body.quote});
    dash.save(function(err){
        if(err){
            console.log(dash.errors);
            res.render('index', {title: 'You have errors!', errors: dash.errors})
        }
        else{
          console.log("success");
          res.redirect('/add');
        }
    });
    // This is where we would add the user from req.body to the database.
});

app.get('/add', function(req, res){
    Dash.find({}).sort('-createdAt').exec(function(err, postdata){
        if(err){
            console.log("Sanp!! You have some err", err);
            res.render('add', {title: 'Ah Snap!', errors: dash.errors})
        }
        else{
            res.render('add', {postdata: postdata});
        }
    })
});

app.get('/add/edit/:id', function(req, res){
    Dash.findOne({_id: req.params.id}, function(err, quotes){
        if(err){
            console.log("snap", err);
            res.redirect('/add')
        }
        else{
            console.log('success');
            res.render('update', {data: quotes});
        }
    });
});
app.post('/update/:id', function(req,res){
    Dash.update({_id: req.params.id}, req.body, {runValidator: true}, function(err){
        console.log("POST DATA", req.body);
        if(err){
            console.log(err, "err in the update")
        }
        else{
            res.redirect('/add');
        }
    })

});

app.post('/destroy/:id', function(req, res){
    Dash.remove({_id: req.params.id}, function(err, success){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/add');
        }
    })
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
