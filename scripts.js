const restaurantApp = {}

const $selectedCity = $('#citySelection');
const $cuisine = $('#cuisine');
const $submit = $('#submit');
const $form = $('#form');





$form.on('submit', function(e) {
    e.preventDefault();
    console.log('form submitted')

    restaurantApp.getInput();
  

});



restaurantApp.getInput = function() {
    const entityId = parseInt($selectedCity.val());

    const cuisineType = $cuisine.val();

    console.log(entityId, cuisineType);

    if(entityId !== entityId || cuisineType === undefined) {
        console.log('error message');
    } else {
         restaurantApp.ajaxRequest(entityId, cuisineType);
    }
}



// ajax call to zomato
restaurantApp.ajaxRequest = function(entityId, cuisinesType) {
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?",
        type: "GET",
        dataType: "JSON",
        data: {
            count: 12,
            sort: 'rating',
            order: desc,
            entity_id: entityId,
            cuisines: cuisinesType

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", "b7d63a85e5a9127cf51fb71ccf4c92e6");
        },
        success: function (result) {
            const restaurantArray = result.restaurants;
            // console.log(restaurantArray);

            for (restaurantObj of restaurantArray) {

                const restaurant = restaurantObj.restaurant;

                const { name, location, cuisines, price_range, user_rating, featured_image } = restaurant;

                const address = location.address;
                const rating = user_rating.aggregate_rating;

                console.log(
                    `Restaurant Name: ${name},
                    Cuisine Type: ${cuisines},
                    Price range: ${price_range},
                    Rating: ${rating}/5,
                    Location: ${address},
                    Thumbnail url: ${featured_image}`
                );

            }
        },
    });
}


//doc ready
$('document').ready(function() {




})