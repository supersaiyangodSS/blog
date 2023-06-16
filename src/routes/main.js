const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { log } = require("handlebars");

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "nodejs blog",
      desc: "A blog made using Node.js, Express.js and MongoDB",
    };
    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Post.aggregate([
      {
        $sort: { createdAt: -1 },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("index", {
      locals,
      data,
      currentPage: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (err) {
    console.log(err)
  }
});

router.get("/post/:id", async (req, res) => {
  try {
      
      const postId = req.params.id;
      
      const data = await Post.findById(postId)
      const locals = {
        title: data.title,
        desc: "A blog made using Node.js, Express.js and MongoDB",
      }
    res.render('post', {locals , data})
  } catch (err) {
    console.log(err);
  }
});


router.post('/search', async (req, res) => {
  try {
    const locals = {
        title: "Search",
        desc: "A blog made using Node.js, Express.js and MongoDB",
    };
    let searchTerm = req.body.searchTerm
    const filterChars = searchTerm.replace(/^[^a-zA-Z0-9]/g, "")
    const data = await Post.find({
      $or: [
          {title: { $regex: new RegExp(filterChars, 'i') }},
          {body: { $regex: new RegExp(filterChars, 'i') }}
      ]
    })
        res.render("search", {
          data,
          locals
        });
    } catch (err) {
        console.log(err);
    }
})


router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;



// router.get('/', async (req, res) => {
//     const local = {
//         title: "nodejs blog",
//         desc: "A blog made using Node.js, Express.js and MongoDB",
//     };
//     try {
//         const data = await Post.find();
//         console.log(data);
//         res.render("index", {
//             data
//         });
//     } catch (err) {
//         console.log(err);
//     }
// })
