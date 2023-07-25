let mainCont = document.querySelector(".main-cont");
let searchCont = document.querySelector("#search-group");
let searchText = document.querySelector('input[type="text"]');

// Fetching favorites from localstorage
let favorites = localStorage.getItem("favorites");
if(favorites) {
    favorites = JSON.parse(favorites);
} else {
    favorites = [];
}

// if user clicks outside the search bar, 
// the search items container should disappear
document.addEventListener("click", (e) => {
    let target = e.target;
    if(!mainCont.contains(target)) {
        while (searchCont.hasChildNodes())
            searchCont.removeChild(searchCont.firstChild)
    }
})

// Fetch and display meals according to search string
async function fetchMealItems(text) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`);
    let meals = [];
    if (response.ok) {
        let data = await response.json();
        // getting the list of meals from api response
        meals = data["meals"];
    }

    // for each typed word/phrase a fresh api call is made.
    // with each api call the search items container is emptied
    // before adding new meals to the container
    while (searchCont.hasChildNodes())
        searchCont.removeChild(searchCont.firstChild);

    // Adding meals to search container
    meals.forEach(meal => {
        let newItem = document.createElement("a");
        let id = meal["idMeal"];
        // assigning classes and id to each meal item
        newItem.setAttribute("class", "list-group-item list-group-item-action list-item");
        newItem.setAttribute("id", id);
        // if favorites list contains id, show coloured star
        // else regular star
        if (favorites.includes(id)) {
            newItem.innerHTML = `
        <span>${meal["strMeal"]}</span><i class="fa-solid fa-star p-1"></i>
        `;
        } else {
            newItem.innerHTML = `
        <span>${meal["strMeal"]}</span><i class="fa-regular fa-star p-1"></i>
        `;
        }
        searchCont.appendChild(newItem);
        // handle click for each meal
        handleItemClicks(newItem);
    })
}

// event listener for search bar
searchText.addEventListener("keyup", (e) => {
    if (searchText.value.length != 0) {
        fetchMealItems(searchText.value);
    }
})

function handleItemClicks(newItem) {
    let starIcon = newItem.querySelector("i");
    let id = newItem.getAttribute("id");
    newItem.addEventListener("click", (e) => {
        if(e.target == starIcon) {
            // toggling on the star icon for adding to/removing from favorites
            if(starIcon.classList.contains("fa-regular")) {
                favorites.push(id);
                starIcon.classList.remove("fa-regular");
                starIcon.classList.add("fa-solid");
            } else {
                starIcon.classList.remove("fa-solid");
                starIcon.classList.add("fa-regular");
                favorites = favorites.filter(mealId => {
                    return mealId != id;
                })
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        } else {
            // if target is not staricon, redirect to meal details page
            localStorage.setItem("currentId", newItem.getAttribute("id"));
            window.location.href = "./pages/mealDetails.html";
        }
    })
}