const express = require('express');
const app = express();
const User = require('./models/user.js');
const Admin = require('./models/admin.js');
const Event = require('./models/event.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
var myBool=true;
app.use('/Public', express.static('Public'));
mongoose.connect('mongodb://localhost:27017/stepProject', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    app.set('view engine', 'ejs');
    app.set('views', 'views');
    
    app.use(express.urlencoded({ extended: true }));
    app.use(session({ secret: 'notagoodsecret', resave: true, saveUninitialized: true }))

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/')
    }
    next();
}

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/register', (req, res) => {
    res.render('index.ejs')
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({ username, password })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('index.ejs')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
    const foundUser = await User.findAndValidate(username, password);

        if(foundUser.username=="admin"){
            const foundAdmin = await Admin.findAdmin(username, password);
            req.session.user_id = foundAdmin._id;
            res.redirect('/all_events');     
        }
        else{
            req.session.user_id = foundUser._id;
            req.session.username= foundUser.username;
            res.redirect('/user_home');
        }

    }
    catch(err){
        res.redirect('/');
    }
})

app.get('/admin_home', requireLogin, (req, res) => {
    res.render('admin_home.ejs')
})

app.get('/add_event', (req, res) => {
    res.render('add_event.ejs')
})

app.get('/edit_event', (req, res) => {
    res.render('edit_event.ejs')
})

app.post('/add_event', (req, res) => {
    const { name,description,url,eventdate,starttime,endtime } = req.body;
    const event = new Event({ name,description,url,eventdate,starttime,endtime })
    event.save();
    res.redirect('/all_events')
})

app.get('/user_home', requireLogin, (req, res) => {
    Event.find({}, function(err, events) {
        if(events.length>0){
        res.render('user_all_events.ejs', {events , username: req.session.username });
        }
        else{
            res.render('users_home.ejs',{ username: req.session.username });
        }
     });
})

app.get('/user_home_cal', requireLogin, (req, res) => {
    res.render('users_home_cal.ejs', { username: req.session.username } )
})

app.get('/user_calendar', requireLogin, (req, res) => {
    if(myBool==false){
    res.render('user_calendar.ejs', { username: req.session.username } )}
    else{
        myBool=false;
        res.render('users_home_cal.ejs',{ username: req.session.username })
    }
})

app.get('/all_events', (req, res) => {
    Event.find({}, function(err, events) {
        if(events.length>0){
        res.render('all_events.ejs', {events});
        }
        else{
            res.render('admin_home.ejs');
        }
     });
})

app.post('/edit_event', (req, res) => {
    const { name,description,url,eventdate,starttime,endtime } = req.body;
    var query={name:name};
    var newvalues = { $set: {description:description,url:url,eventdate:eventdate,starttime:starttime,endtime:endtime } };
    Event.updateOne(query, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    })
    res.redirect('/all_events')
})

app.post('/delete', (req, res) => {
    Event.findOne({name: req.body.name}).remove().exec();
    res.redirect('/all_events')
})

app.listen(8000, () => {
    console.log("SERVING YOUR APP!")
})