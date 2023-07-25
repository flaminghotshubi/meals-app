let mainCont = document.querySelector(".main-cont");
let cardsCont = document.querySelector(".cards-cont");

// Fetching favorites from localstorage
let favorites = localStorage.getItem("favorites");
if (favorites) {
    favorites = JSON.parse(favorites);
} else {
    favorites = [];
}

// fetching meal details by api call using id
async function getMealDetails(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (response.ok) {
        let data = await response.json();
        return data["meals"];
    }
}

// redirect to meal details page when user clicks on meal card
function redirectToCardDetails(card) {
    let cardImg = card.querySelector("img");
    cardImg.addEventListener("click", (e) => {
        localStorage.setItem("currentId", card.getAttribute("id"));
    })
}

// on mouseover, highlight the meal card
function handleBtnEvents(card) {
    let btn = card.querySelector("button");
    let id = card.getAttribute("id");
    card.addEventListener("mouseover", (e) => {
        btn.classList.toggle("d-none");
        card.classList.toggle("text-bg-dark");
    });
    card.addEventListener("mouseout", (e) => {
        btn.classList.toggle("d-none");
        card.classList.toggle("text-bg-dark");
    });
    // when the card is highlighted a delete button is also shown
    // clicking on delete button removes the meal from favorites
    btn.addEventListener("click", (e) => {
        favorites = favorites.filter(mealId => {
            return mealId != id;
        })
        localStorage.setItem("favorites", JSON.stringify(favorites));
        cardsCont.removeChild(card);
    })
}

if (favorites.length == 0) {
    // message to display when there are no favorites
    let emptyCont = document.createElement("p");
    emptyCont.setAttribute("class", "text-center fs-3 fw-medium text-danger-emphasis");
    emptyCont.innerText = "There are no favorite meals to display."
    mainCont.append(emptyCont);
} else {
    // create card for each meal item from favorites
    favorites.forEach(mealId => {
        getMealDetails(mealId).then(meals => {
            if (meals) {
                let meal = meals[0];
                let card = document.createElement("div");
                let mealName = meal["strMeal"].toUpperCase();
                card.setAttribute("class", "card text-bg-danger m-3");
                card.style.width = "18rem";
                card.setAttribute("id", mealId);
                card.style.position = "relative";
                card.innerHTML = `
                    <a href="./mealDetails.html"><img src="${meal["strMealThumb"]}" class="card-img-top" alt="${meal["strMeal"]}"></a>
                    <button class="btn btn-dark d-none"><i class="fa-solid fa-trash"></i></button>
                    <div class="card-body d-flex justify-content-center align-items-center">
                        <span class="card-title text-center p-1">${mealName}</span>
                    </div>
                    `;
                cardsCont.appendChild(card);
                handleBtnEvents(card);
                redirectToCardDetails(card);
            } else {
                console.log("Invalid mealId", mealId);
            }
        });
    })
}