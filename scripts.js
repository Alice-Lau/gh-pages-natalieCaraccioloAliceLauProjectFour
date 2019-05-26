// namespacing object
const restaurantApp = {}

//cache of DOM elements
const $userSelectionPage = $('.userSelectionPage');
const $form = $('#userSelectionForm');
const $selectedCity = $('#citySelection');
const $selectedCuisine = $('#cuisineSelection');
const $submit = $('#submit');
const $main = $('main');
const $restaurantDisplay = $('#restaurantDisplay');
const $reset = $('.resetButton');
const $resetButton = $('#reset')

// init function
restaurantApp.init = function () {

    restaurantApp.userInput();

    restaurantApp.resetInput();
}

// form submission listener
restaurantApp.userInput =function() {
    $form.on('submit', function (e) {
        e.preventDefault();

        $restaurantDisplay.empty();

        restaurantApp.getInput();
    });
}

// storing the user inputs into variable, checking the inputs are valid, then pass to ajax request function
restaurantApp.getInput = function() {
    const citySelection = $selectedCity.val();

    const cuisineSelection = $selectedCuisine.val();

    if(!citySelection || !cuisineSelection) {
        alert('Please complete your choice inputs');
    } else {
        restaurantApp.ajaxRequest(citySelection, cuisineSelection);
    }
}

// ajax call to Yelp
// Originally this app uses Zomato as API database. However, we found that the API was not realiable in returning data that was requested !!! although the api stated to accept multiple parameter, we found that it only return data based on the last parameter provided !!! Same results seemed to return when different city_id were used either alone or with other parameters.
//credit to Colin for making the Zomato API usable by properly inserting the header
//credit Ilan P from stack overflow providing solution to overcome CORS issue for Yelp API
restaurantApp.ajaxRequest = function (city, cuisineType) {
    const ajaxQueryUrl = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search';

    const apiKey = '8hsNMQbj8H48W6rZ6bgIwQ4suDRZ2rygbNir5WOf6dQ_d5O0OR-rz49Zhckl_vuKvn4IzCd5ZRGz34M-vCEy2gQx4cOQTn9LRwjcvaEt9BDGF3PrvVl9ZHdtIsTlXHYx';

    $.ajax({
        url: ajaxQueryUrl,
        method: "GET",
        dataType: 'JSON',
        data: {
            location: city,
            categories: cuisineType,
            limit: 10
        },
        //this part is different from ajax method learnt in class
        //api key is stored in the header, instead of in a query parameter
        headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${apiKey}`
        }
    })
    .then(function(data) {
        restaurantApp.filterData(data);
    })
    .fail(function () {
        $form.trigger('reset');
        alert('please refine your input. Thank you');
    })
}

restaurantApp.filterData = function(rawDataObj) {
    // access the array within the object returned from initial ajax call
    const businessList = rawDataObj.businesses;

    // if there're fewer than 10 results, we advice the user to revise their choices
    if (businessList.length < 10) {
        $form.trigger('reset');

        alert(`Unfortunately, there're not enough data on your selections, please choose another city or cuisine type.`);
    // if there're more than 10 results, information is passed to the display function
    } else {
        businessList.forEach(function(restaurantInfo) {
            restaurantApp.displayAjaxResult(restaurantInfo);
        });
    }
}

restaurantApp.displayAjaxResult = function(restaurant) {
    $main.css('display', 'block');
    // we only call the smooth scroll to happen after the ajax call collected all data to avoid lurching movement on DOM
    $('html, body').animate({
        scrollTop: $("#restaurantDisplay").offset().top
    }, 2000); 

    const { categories, image_url, name, price, rating, url  } = restaurant;

    let aliasList = []

    const cuisineType = `${aliasList.toString()}`;

    for (obj of categories) {
        const alias = obj.alias
        aliasList.push(alias);
    }

    $restaurantDisplay.append(`
        <div class='singleRestaurant'>
            <h2>${name}</h2>
            <img src='${image_url}' alt='A featured image of the restaurant "${name}"'/>

            <h3>Cuisine Type</h3>
            <p>${aliasList.toString()}</p>

            <div class='ratingStat'>
                <div class='userRating'>
                    <h3>Rating</h3>
                    <p>${rating}/5</p>
                </div>
                <div class='priceRange'>
                    <h3>Price</h3>
                    <p>${price}</p>
                </div>
            </div>

            <div class="moreInfoLink">
                <a href="${url}">more info</a>
            </div>
        </div>
    `)

    $reset.css('display', 'block');
}

restaurantApp.resetInput = function() {
    $resetButton.on('click', function () {
        $restaurantDisplay.empty();

        $main.css('display', 'none');

        $form.trigger('reset');
    })
}

//doc ready
$('document').ready(function() {
    restaurantApp.init();
});