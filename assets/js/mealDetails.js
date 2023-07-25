let id = localStorage.getItem("currentId");
let mainCont = document.querySelector("#main-cont");

// fetching meal details by api call using id
async function getMealDetails(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (response.ok) {
        let data = await response.json();
        return data["meals"];
    }
}

// document.addEventListener("scroll", (e) => {
//     document.body.style.userSelect = "none";
// })

// update meal tags
function updateTags(tags) {
    if(tags) {
        let detailList = mainCont.querySelector("ul");
        let tagRow = document.createElement("li");
        tagRow.setAttribute("class", "list-group-item transparentbg");
        tagRow.innerHTML = `
        <div class="container">
            <div class="row text-start">
                <div class="col-3 fw-medium">
                    Tags
                </div>
                <div class="col-9">
                    ${tags}
                </div>
            </div>
        </div>
        `;
        detailList.appendChild(tagRow);
    }
}

// update instructions
function updateInstructions(instructions) {
    let array = instructions.split("\r\n\r\n");
    let list = mainCont.querySelector("#instructions");
    array.forEach(element => {
        let newRow = document.createElement("li");
        newRow.innerText = element;
        list.appendChild(newRow);
    });
}

// get details about each meal and display
getMealDetails(id).then(meals => {
    if (meals) {
        let meal = meals[0];
        let title = meal["strMeal"];
        let category = meal["strCategory"];
        let imgLink = meal["strMealThumb"];
        let ytLink = meal["strYoutube"];
        let tags = meal["strTags"];
        let instructions = meal["strInstructions"];
        mainCont.innerHTML = `
        <div class="row">
            <div class="col-4">
                <div class="card" style="width: 100%;">
                    <img src=${imgLink} class="card-img-top"
                        alt="...">
                </div>
            </div>

            <div class="col-8">
                <div class="card transparentbg" style="width: 100%;">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item transparentbg">
                            <div class="container">
                                <div class="row text-start">
                                    <div class="col-3 fw-medium">
                                        Category
                                    </div>
                                    <div class="col-9">
                                        ${category}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item transparentbg">
                            <div class="container">
                                <div class="row text-start">
                                    <div class="col-3 fw-medium">
                                        Instructions
                                    </div>
                                    <ul class="col-9" id="instructions"></ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="card-body">
                        <a href=${ytLink} target="_blank" 
                            class="card-link link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                            <i class="fa-brands fa-youtube me-2"></i>View recipe on
                            YouTube</a>
                    </div>
                </div>
            </div>
        </div>
        `;
        updateTags(tags);
        updateInstructions(instructions);
    } else {
        console.log("Invalid mealId", mealId);
    }
});