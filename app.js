//GETTING STARTED, DEFAULT SHIT NEEDED
//ENV SETUP
require('dotenv').config();
//including our frameworks/libraries
var express     = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
app             = express();


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("database connected");
}).catch(err => {
    console.log('ERROR', err.message);
});//connecting mongo -> THE NAME OF WHAT WE WILL LOOK FOR IN MONGO

// APP CONFIG
app.set("view engine", "ejs"); //connecting ejs
app.use(express.static("public")); //using express
app.use(bodyParser.urlencoded({extended: true})); //using body-parser
app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*


//defining Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,//i.e it detact image url and show image.
    body: String,
    created: 
        {type: Date, default: Date.now} //i.e it should be a date and to check for default date value as of now
});

//MONGOOSE/MODEL CONFIG
var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES
app.get("/", function (req, res){
    res.redirect("/blogs");
        
});

//INDEX ROUTE
app.get("/blogs", function (req, res){
    Blog.find({}, function (err, blogs){ // adding index functionality to retrieve all blogs from database
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs}); //blogs:blogs -> render index with data (blogs is the data)
        }
    });
});


//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");// all we have to do is render b/c its new
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
   //create blog
   Blog.create(req.body.blog, function (err, newBlog){
       if(err) {
           res.render("new");
       } else {
           //if successful, redirect to index
           res.redirect("/blogs");
       }
   });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err){
           res.redirect("/blogs");
       } else {
              res.render("edit", {blog: foundBlog}); 
       }
   })
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err) {
           res.redirect("/blogs");
           } else {
               res.redirect("/blogs/" + req.params.id);
           }
   });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
   //redirect somewhere
});

app.listen(process.env.PORT || 8888, () => {
    console.log("Server connected: http://localhost:8888");
});