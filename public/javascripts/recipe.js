const divRecipes = document.querySelector("#recipes");
const createForm = document.querySelector("#formCreate");


function renderRecipe(recipe) {
  const divR = document.createElement("div");
  divR.className = "col-xs-12 col-md-4 col-sm-6 recipe";

  const divName = document.createElement("div");
  divName.setAttribute("style", 'font-family: "librebaskerville-bold", serif; font-size:25px; font-weight:bold;margin-top:20px');
  divName.textContent = recipe.title;
  divR.appendChild(divName);

  const divIngre = document.createElement("div");
  divIngre.textContent = "Ingredients";
  divIngre.setAttribute("style", "color:#848484");
  divR.appendChild(divIngre);

  const divMaterial = document.createElement("div");
  divMaterial.setAttribute("style", "color:#848484");
  divMaterial.textContent = recipe.materials;

  divR.appendChild(divMaterial);

  const divDir = document.createElement("div");
  divDir.textContent = "Direction";
  divDir.setAttribute("style", "font-weight:500;margin-top:2%");
  divR.appendChild(divDir);

  const divContent = document.createElement("div");
  divContent.textContent = recipe.content;
  divR.appendChild(divContent);

  if (typeof recipe.img === 'string' || recipe.img instanceof String) {
    const imgF = document.createElement("img");
    imgF.setAttribute("src", recipe.img);
    imgF.setAttribute( "style", "width:360px; margin-top:2%");
    imgF.className = "fileImg";
    divR.appendChild(imgF);
  }
  
  const comments = document.createElement("div");
  const commentBox = document.createElement("form");
  const commentText = document.createElement("input");
  const commentButton = document.createElement("button");
  
  if (recipe.comments !== undefined) {
    for (let comment of recipe.comments) {
      const new_comment = document.createElement("div");
      const name = document.createElement("div");
      const body = document.createElement("div");
      name.innerHTML = comment.username + ":";
      body.innerHTML = comment.commentValue;
      new_comment.appendChild(name);
      new_comment.appendChild(body);
      new_comment.classList.add(
        "d-flex",
        "m-2",
        "align-self-center",
        "position-relative"
      );
      body.classList.add("align-self-center");
      name.classList.add("me-2", "align-self-center");
      comments.appendChild(new_comment);
    }
  }

  commentBox.addEventListener("submit", async (event) => {
    event.preventDefault();
    const commentValue = commentText.value;
    if (commentValue === "") {
      alert("Comment cannot be empty");
      return;
    }
    commentBox.reset();
    console.log(commentValue);
    const resRaw = await fetch("/writeComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: commentValue,
        recipeId: recipe._id,
      }),
    });

    const res = await resRaw.text();
    console.log(res);
    console.log("?", resRaw, resRaw.ok);
    if (!resRaw.ok) {
      window.location.href = "/index.html";
    } else {
      location.reload(); 
    }
  });

  // set comment form properties
  commentText.setAttribute("placeholder", "Add a comment...");
  commentText.setAttribute("type", "text");
  commentText.setAttribute("name", "comment");

  commentButton.innerText = "comment";
  commentButton.setAttribute("type", "submit");
  
  commentBox.appendChild(commentText);
  commentBox.appendChild(commentButton);

  divR.append(comments);
  divR.append(commentBox);

  divRecipes.append(divR);
  return divRecipes;
}

async function reloadRecipes() {
  const resRaw = await fetch("./getRecipes");

  if (!resRaw.ok) {
    window.location.href = "/index.html";
    console.log(resRaw);
    return;
  }
  const res = await resRaw.json();

  if (res.error) {
    showError(res.error);
    return;
  }
  console.log("got recipes", res);

  res.recipes.forEach(renderRecipe);
}

reloadRecipes();