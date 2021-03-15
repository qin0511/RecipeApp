const createForm = document.querySelector("#formCreate");
const errorText = document.querySelector("#error")

//this is for listing view
if (createForm) {
    createForm.addEventListener("submit", handleCreateSubmit);
}


function getRecipeInfo(form) {
    const formData = new FormData(form);
  
    console.log("form data", formData);
  
    return {
      title: formData.get("title"),
      materials: formData.get("materials"),
      content: formData.get("content"),
      img: formData.get("img"),
    };
  };



async function handleCreateSubmit(evt) {
    evt.preventDefault();
    const recipeInfo = getRecipeInfo(createForm);
 
    if (!recipeInfo.title || !recipeInfo.content) {
      errorText.innerHTML = "title and content are required!";
      return;
    }
    errorText.innerHTML = "";
    const response = await fetch("/createRecipe", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeInfo), // body data type must match "Content-Type" header
    });
    console.log(response);
    const res = await response.json();
 
    if (res && res.success) {
      alert("success!");
    } 
  }