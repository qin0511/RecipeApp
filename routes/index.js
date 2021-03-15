var express = require("express");
var router = express.Router();

const myDB = require("../db/MyDB.js");

// login
router.post("/login", async (req, res) => {
  const userInfo = req.body;
  
  const userRes = await myDB.searchUser(userInfo);
  if (userRes && userRes.length > 0) {
    req.session.userInfo = userInfo;
    res.send({ success: true });
    return;
  }
  return res.send({success: false, message: "username or password error"});
});

// regist
router.post("/regist", async (req, res) => {
  const userInfo = req.body;
  const userRes = await myDB.searchUser({username: userInfo.username});
  if (userRes && userRes.length > 0) {
    return res.send({ success: false, message: "username already exist" });
  }
  const newUser = await myDB.creatUser(userInfo);
  if (newUser) {
    req.session.userinfo = userInfo;
    return res.send({ success: true });
  }
  
  return res.send({success: false, message: "regist faield"});
});

// log out
router.get("/logout", async(req, res) => {
  req.session.destroy((err) => {
    if (err) { console.log(err); }
    res.redirect("/index.html");
  });
});

router.get("/getUsers", async (req, res) => {
  const users = await myDB.searchUser({username: req.query.username});
  res.send({ users });
});


//creat recipe
router.post("/createRecipe", async (req, res) => {
  console.log(req);

  const recipe = req.body;
  const newRecipe = await myDB.createRecipe(recipe);

  if(newRecipe) {
    req.session.recipe = recipe;
    return res.send({success: true});
  }
});

// recipe created
router.get("/getRecipes", async (req, res) => {
  if(!req.session.userInfo) {
    return res.status(401).send({ success: false });
  } 

  res.send({ recipes: await myDB.getRecipes(), success: true});
});

// write comment
router.post("/writeComment", async(req, res) => {
  console.log(req.session);
  if(!req.session.userInfo) {
    return res.status(401).send({ success: false });
  } 
  console.log(req.body);
  await myDB.writeComment(req.body.recipeId, req.body.comment, req.session.userInfo.username);
  res.send({success: true});
});



// router.post("/writeComment", async(req, res) => {
//   // if(!req.session.userInfo) {
//   //   return res.redirect("/index.html");
//   // } 
//   const comment_body = req.body;
//   const recipe_find = await myDB.getRecipe({title: comment_body.} {
//     recipe_name: req.body.recipe_name,
//   });
//   const usr = req.session.username;
//   await writeComment(client, "Recipes", recipe_find[0], {
//     $push : {comments: { [usr]: comment_body}},
//   });
//   res.send({success: true});
// });

module.exports = router;
