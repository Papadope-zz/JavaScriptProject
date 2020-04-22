function initApp(fetchedJson) {
    const hotels = fetchedJson[1].entries;
    const search = document.getElementById("search_area");
    const matchList = document.getElementById("match-list");
    const searchButton = document.getElementById("search_button");
    const priceSlider = document.getElementById("price");
    const price = document.getElementById("selected_price");

    const propertySelect = document.getElementById("property_select");
    const ratingSelect = document.getElementById("rating_select");
    const locationSelect = document.getElementById("location_select");
    const filterSelect = document.getElementById("sort_by_select");
    const resultsDiv = document.getElementById("results");

    const locationFill = () => {
        let outputSet = new Set();
        hotels.map(function(hotel) {
            outputSet.add(hotel.city);
        });
        let outputArray = Array.from(outputSet);
        outputArray.map(function(hotelCity) {
            locationSelect.innerHTML += "<option>" + hotelCity + "</option>";
        });
    };

    const fillSlider = () => {
        let max = 0;
        hotels.map(function(hotel) {
            if (hotel.price > max) max = hotel.price;
        });

        priceSlider.max = max;
        priceSlider.value = max;
        price.innerText = max;
    };
    const filterFill = () => {
        let outputSet = new Set();
        hotels.map(function(hotel) {
            hotel.filters.map(function(filter) {
                outputSet.add(filter.name);
            });
        });
        let outputArray = Array.from(outputSet);
        outputArray.map(function(filterName) {
            filterSelect.innerHTML += "<option>" + filterName + "</option>";
        });
    };

    fillSlider();
    filterFill();
    locationFill();

    const autoFill = () => {
        let matches = hotels.filter((hotel) => {
            const regex = new RegExp("^" + search.value, "gi");
            return hotel.city.match(regex);
        });

        if (search.value.length === 0) matches = [];

        if (matches.length > 0) {
            const html = matches
                .map((match) => '<option value="' + match.city + '">')
                .join("");
            matchList.innerHTML = html;
        }
    };

    const starsFill = (stars) => {
        let output = "";
        for (let i = 0; i < stars; i++) {
            output += "&bigstar;";
        }
        return output;
    };
    const resultsFill = () => {
        resultsDiv.innerHTML = "";
        let matches = searchHotels();
        matches.map(function(hotelObj) {
            resultsDiv.innerHTML += `
        </br>
  
  
  <div
          class="container-fluid shadow p-3"
          style="background-color: white; border-color: black; padding: 20%;"
        >
          <div class="row">
            <div
  
              class="col-3"
              style=" 
                background-image: url(${hotelObj.thumbnail});
              "
            ></div>
            <div class="col-4">
              <h1>${hotelObj.hotelName}</h1>
              <span style="color: #f6ab3f;"
                >${starsFill(hotelObj.rating)}</span
              >
              <p class="text-muted">${hotelObj.city}</p>
              <div class="row">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <p id="rating">${hotelObj.ratings.no}</p>
                <p style="font-weight: bold;">&nbsp;${hotelObj.ratings.text}</p>
                <p class="text-muted">&nbsp;(1736 reviews)</p>
              </div>
              <div class="row">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <p class="text-muted">Excellent location (9.2/10)</p>
              </div>
            </div>
            <div class="col-2">
              <div style="text-align: center; padding: 5%;">
                Hotel website
                <p class="text-">$${hotelObj.price}</p>
              </div>
              <div style="text-align: center;">
                Agoda
                <p class="text">$${
                  hotelObj.price + (9 / 100) * hotelObj.price
                }</p>
              </div>
              <div style="text-align: center;">
                Travelocity
                <p class="text">$${
                  hotelObj.price + (5 / 100) * hotelObj.price
                } </p>
              </div>
              <div style="text-align: center; font-weight: bold;">
                Travelocity
                <p class="text">$${
                  hotelObj.price + (5 / 100) * hotelObj.price
                }</p>
              </div>
            </div>
            <div class="col-3 text-center" style="text-align: center;">
              <div style="color: #428500; padding: 20%; font-size: 25px">
                Hotel Website
                <p style="font-weight: bold; font-size: 110%;">$${
                  hotelObj.price
                }</p>
                <p>3 nights for <span style="color: #428500;">$${
                  2 * hotelObj.price
                }</span></p>
              </div>
              <div class="btn btn-success" id="button_hotel">View Deal</div>
            </div>
          </div>
        </div>
        `;
        });
        console.log(matches[0].mapurl);
        document.getElementById("map").src = matches[0].mapurl;
    };

    const searchHotels = () => {
        let matches = hotels.filter((hotel) => {
            let hasFilter = false;
            hotel.filters.map((filter) => {
                if (filter.name === (filterSelect.value || filter.name)) {
                    hasFilter = true;
                }
            });

            return (
                hotel.city === search.value &&
                hotel.price <= (priceSlider.value || hotel.price) &&
                hotel.rating >= (propertySelect.value || hotel.rating) &&
                hotel.ratings.no >=
                (JSON.parse(ratingSelect.value).range[0] || hotel.ratings.no) &&
                hotel.ratings.no <=
                (JSON.parse(ratingSelect.value).range[1] || hotel.ratings.no) &&
                hotel.city === (locationSelect.value || hotel.city) &&
                hasFilter
            );
        });

        return matches;
    };

    search.addEventListener("input", () => autoFill());
    searchButton.addEventListener("click", () => resultsFill());
    propertySelect.addEventListener("change", () => resultsFill());
    ratingSelect.addEventListener("change", () => resultsFill());
    locationSelect.addEventListener("change", () => resultsFill());
    filterSelect.addEventListener("change", () => resultsFill());

    priceSlider.addEventListener("input", function() {
        price.innerText = priceSlider.value;
        resultsFill();
    });
}

fetch("JSON/data.json")
    .then(function(response) {
        return response.json();
    })
    .then(initApp)
    .catch(function(error) {
        console.log("Error:", error.message);
    });