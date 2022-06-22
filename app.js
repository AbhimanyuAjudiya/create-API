const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////////////requisting targetting articles////////////////////////////////////////////////////////
//rought method helps to use a particular route here it is "articles"
app
  .route("/articles")

  //get method
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //post method
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Succesfully added new article.");
      } else {
        res.send(err);
      }
    });
  })

  //delete method
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Succesfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////////////////////////////requisting targetting a specific article////////////////////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found.");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      req.body,
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("The article was updated Successfully");
        } else {
            res.send(err);
        }
      }
    );
  })
  .delete(function(req, res){
    Article.findOneAndDelete(
        { title: req.params.articleTitle },
        function(err){
            if (!err){
                res.send("Successfully article deleted.")
            } else {
                res.send(err);
            }
        }
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
