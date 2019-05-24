const restaurantApp = {}

const $selectedCity = $('#citySelection');
const $cuisine = $('#cuisine');
const $submit = $('#submit');
const $form = $('#form');
const $userSelectionPage = $('.userSelectionPage');
const $restaurantDisplay = $('#restaurantDisplay');



let cycle = 0

const background = [
    
]

restaurantApp.backgroundLoop = function() {
    
}

setInterval(function() {
    if (cycle < 5) {
        $userSelectionPage.css('background-image', 'background[]')
        cycle += 1;
    } else {
        cycle = 0
    }
}, 5000)


$form.on('submit', function(e) {
    e.preventDefault();
    console.log('form submitted')

    restaurantApp.getInput();
});



restaurantApp.getInput = function() {
    const entityId = parseInt($selectedCity.val());

    const cuisineType = parseInt($cuisine.val());

    console.log(entityId, cuisineType);

    if(entityId !== entityId || cuisineType === undefined) {
        console.log('error message');
    } else {
        restaurantApp.ajaxRequest(entityId, cuisineType);
    }
}

restaurantApp.displayAjaxResult = function(result) {
    const restaurantArray = result.restaurants;
    // console.log(restaurantArray);

    for (restaurantObj of restaurantArray) {

        const restaurant = restaurantObj.restaurant;

        const { name, location, cuisines, price_range, user_rating, featured_image } = restaurant;

        const address = location.address;
        const rating = user_rating.aggregate_rating;
            
        $restaurantDisplay.append(`
            <div className="singleRestaurant">
                <h2>${name}</h2>
                <img src="${featured_image}" alt="A featured image of $ {name}"/>
                <h3>Cuisine Type</h3>
                <p>${cuisines}</p>
                <div className="ratingStat">
                    <div className="userRating">
                        <h3>Rating</h3>
                        <p>${rating}/5</p>
                    </div>
                    <div className="priceRange">
                        <h3>Price</h3>
                        <p>${price_range}/5</p>
                    </div>
                </div>
            </div>
        `)
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
            order: 'desc',
            entity_id: entityId,
            cuisines: cuisinesType

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", "b7d63a85e5a9127cf51fb71ccf4c92e6");
        },
        success: function (ajaxResult) {
            $restaurantDisplay.empty();
            restaurantApp.displayAjaxResult(ajaxResult);
        },
        error: function() {
            alert('There seems to be an error in your input. Please double check.')
        }
    });
}


//doc ready
$('document').ready(function() {




})