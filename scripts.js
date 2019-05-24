const restaurantApp = {}

const $selectedCity = $('#citySelection');
const $cuisine = $('#cuisine');
const $submit = $('#submit');
const $form = $('#form');
const $userSelectionPage = $('.userSelectionPage');
const $restaurantDisplay = $('#restaurantDisplay');

const resultArray = [];



$form.on('submit', function(e) {
    e.preventDefault();
    console.log('form submitted')

   

    restaurantApp.getInput();

    $('html, body').animate({
        scrollTop: $("#restaurantDisplay").offset().top
    }, 4000);

  
   
});




restaurantApp.getInput = function() {
    const entityId = parseInt($selectedCity.val());

    const cuisineId = parseInt($cuisine.val());

    console.log(entityId, cuisineId);

    if(entityId !== entityId || cuisineId === undefined) {
        console.log('error message');
    } else {
        restaurantApp.ajaxRequest(entityId, cuisineId);
    }
}

restaurantApp.displayAjaxResult = function(result) {
    
    for (item of result) {
        console.log (item);

        const { name, featured_image, cuisines, price_range, user_rating} = item;

        const rating = user_rating.aggregate_rating;

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
            </div>
        `)
    }
}


// ajax call to zomato
restaurantApp.ajaxRequest = function(entityId, cuisinesId) {
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?",
        type: "GET",
        dataType: "JSON",
        data: {
            // sort: 'rating',
            // order: 'desc',
            entity_id: entityId,
            cuisines: cuisinesId

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", "b7d63a85e5a9127cf51fb71ccf4c92e6");
        },
        success: function (ajaxResult) {
            $restaurantDisplay.empty();
            restaurantApp.filterResult(ajaxResult);
            // restaurantApp.displayAjaxResult(ajaxResult);
        },
        error: function() {
            alert('There seems to be an error in your input. Please double check.')
        }
    });
}


restaurantApp.filterResult = function(ajaxResult) {

    const restaurantArray = ajaxResult.restaurants;

    for (restaurantObj of restaurantArray) {
        const restaurant = restaurantObj.restaurant;
        const image = restaurant.featured_image;

        if (image) {
            resultArray.push(restaurant);
        }
    }
    
    restaurantApp.displayAjaxResult(resultArray);
}


// $("#submit").click(function() {
//     console.log('hey')
    
//     $('html, body').animate({
//            scrollTop: $("#restaurantDisplay").offset().top
//        }, 2000);
 
// });



//doc ready
$('document').ready(function() {




});