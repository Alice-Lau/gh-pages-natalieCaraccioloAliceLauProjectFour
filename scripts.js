



// ajax call to zomato
$(function () {
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?",
        type: "GET",
        dataType: "JSON",
        data: {
            count: 10,
            sort: 'rating',
            order: 'desc'
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", "b7d63a85e5a9127cf51fb71ccf4c92e6");
        },
        success: function (result) {
            const restaurantArray = result.restaurants;
            // console.log(restaurantArray);

            for (restauranObj of restaurantArray) {
                
                const restaurant = restauranObj.restaurant;
                
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
});