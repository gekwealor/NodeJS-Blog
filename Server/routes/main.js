const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

router.get('', async (req, res) => {
  const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
  }

  try {
    const data = await Post.find();
    res.render('index', { locals, data });
  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


function insertPostData () {
  Post.insertMany([
    {
      title: "Introduction to SQL",
      body: "WE will be introducing two types of SQL. The MySQL and Postgres"
    },
    {
      title: "How to pull datasets from different databases",
      body: "Steps to querying pull and merge two or more data"
    },
    {
      title: "Introduction to Python",
      body: "How to download Anaconda and Jupiter Notebook."
    },
    {
      title: "How to effectively use Python to transform data",
      body: "Easy step by step ways to do so."
    },
    {
      title: "Best Visualization tools",
      body: "Introduction to Tableau and PowerBI as tools for visualization."
    },
    {
      title: "Introduction to Tableau.",
      body: "Use Tableau effectively."
    },
    {
      title: "Introduction to PowerBI",
      body: "Beginner to pro PowerBI session."
    },
    {
      title: "How to answer technical questions for interview",
      body: "Best practices to guarantee success for SQL interview ."
    },
    {
      title: "Portfolio Website",
      body: "Learn how to build your portfolio website."
    },
    {
      title: "Work Life Balance",
      body: "Learn the importance early and know your."
    },
  ])
}

insertPostData();


module.exports = router;