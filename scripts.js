// namespacing object
const restaurantApp = {}

const $selectedCity = $('#citySelection');
const $selectedCuisine = $('#cuisineSelection');
const $submit = $('#submit');
const $form = $('#userSelectionForm');
const $userSelectionPage = $('.userSelectionPage');
const $restaurantDisplay = $('#restaurantDisplay');


const resultArray = [];

// form submission listener
$form.on('submit', function(e) {
    e.preventDefault();
    
    $restaurantDisplay.empty();
    
    restaurantApp.getInput();
});

// storing the user inputs into variable, checking the inputs are valid, then pass to ajax request function
restaurantApp.getInput = function() {
    const entityId = parseInt($selectedCity.val());

    const cuisineId = parseInt($selectedCuisine.val());

    if(entityId !== entityId || cuisineId !== cuisineId) {
        alert('Please complete your choice inputs');
    } else {
        restaurantApp.ajaxRequest(entityId, cuisineId);
    }
}

// ajax call to zomato
// !!! although the api stated to accept multiple parameter, we found that it only return data based on the last parameter provided !!!
restaurantApp.ajaxRequest = function (entityId, cuisinesId) {
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?",
        type: "GET",
        dataType: "JSON",
        data: {
            cuisines: cuisinesId,
            entity_id: entityId
        },
        // the api key has to be passed as a header, this solution was provided by Colin, whom we are really thankful to :)
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", "b7d63a85e5a9127cf51fb71ccf4c92e6");
        },
        // when ajax call is successful, we pass the result to the filterResult function
        success: function (ajaxResult) {
            $restaurantDisplay.empty();
            restaurantApp.filterResult(ajaxResult);
        },
        error: function () {
            $restaurantDisplay.html(`
                < h2 >There seems to be an error in your input.Please re-enter your input.</h2>
            `)
        }
    });
}

// the main purpose of this function is to filter out result without feature image of the restaurant. Also to restrict the total return to 12 items.
// although the api provide a choice to restrict the number of results return, there is not parameter to assure every return will have image
// so to ensure that all our returned data has image and that there're always 12 results to be displayed. This function was created.
restaurantApp.filterResult = function (ajaxResult) {

    const restaurantArray = ajaxResult.restaurants;

    for (restaurantObj of restaurantArray) {
        const restaurant = restaurantObj.restaurant;
        const image = restaurant.featured_image;

        if (image && resultArray.length <= 12) {
            resultArray.push(restaurant);
        }
    }

    restaurantApp.displayAjaxResult(resultArray);
}

// after a list of filtered results with 12 items is completed, the following function display the data onto the DOM
restaurantApp.displayAjaxResult = function(result) {
    // we only call the smooth scroll to happen after the ajax call collected all 12 items of data
    $('html, body').animate({
        scrollTop: $("#restaurantDisplay").offset().top
    }, 1000);

    for (item of result) {

        const { cuisines, featured_image, location, name, price_range, url, user_rating} = item;

        const rating = user_rating.aggregate_rating;
        const address = location.address

        $restaurantDisplay.append(`
            <div class='singleRestaurant'>
                <h2>${name}</h2>
                <img src='${featured_image}' alt='A featured image of ${name}'/>

                <h3>Cuisine Type</h3>
                <p>${cuisines}</p>

                <div class='ratingStat'>
                    <div class='userRating'>
                        <h3>Rating</h3>
                        <p>${rating}/5</p>
                    </div>
                    <div class='priceRange'>
                        <h3>Price</h3>
                        <p>${price_range}/5</p>
                    </div>
                </div>

                <div class="moreInfoLink">
                    <a href="${url}">more info</a>
                </div>
            </div>
        `)
    }

    $('.resetButton').css('display', 'block')

}

$('#reset').on('click', function() {

        $restaurantDisplay.empty();

        $('#form').trigger('reset');

        $('.resetButton').css('display', 'none');

})

restaurantApp.init = function() {
    
}

//doc ready
$('document').ready(function() {




});