function attachEvents() {

    let getWeatherBtn = $("#submit");
    getWeatherBtn.click(getRequest);

    function getRequest() {
        let hostServiceUrl = `https://judgetests.firebaseio.com`;

        let locationServiceUrl = `${hostServiceUrl}/locations.json`;

        $.get(locationServiceUrl)
            .then(findLocation)
            .catch(displayError);

        function findLocation(allLocations) {

            let locationName = $("#location").val();

            let locationCode = allLocations
                .find(l => l.name === locationName)
                .code;

            let currentWeather = getWeather(hostServiceUrl, locationCode, "today");
            let upcomingWeather = getWeather(hostServiceUrl, locationCode, "upcoming");

            Promise.all([currentWeather, upcomingWeather])
                .then(displayInfo)
                .catch(displayError);

            function displayInfo([today, upcoming]) {
                let symbols = {
                    "Sunny": "&#x2600;", // ☀
                    "Partly sunny": "&#x26C5;", // ⛅
                    "Overcast": "&#x2601;", // ☁
                    "Rain": "&#x2614;", // ☂
                    "Degrees": "&#176;"   // °
                };

                let current = $("#current");
                current.not(":first").remove();

                current.append($(`<span class='condition symbol'>${symbols[today.forecast.condition]}</span>`));

                let currentHtml = $(`<span class='condition'></span>`)
                    .append($(`<span class='forecast-data'>${today.name}</span>`))
                    .append($(`<span class='forecast-data'>${today.forecast.low}${symbols.Degrees}/${today.forecast.high}${symbols.Degrees}</span>`))
                    .append($(`<span class='forecast-data'>${today.forecast.condition}</span>`));

                current.append(currentHtml);

                let future = $("#upcoming");
                future.not(":first").remove();

                for (let day of upcoming.forecast) {
                    let spanUpcoming = $("<span class='upcoming'>");

                    let upcomingHtml = $(`<span class='symbol'>${symbols[day.condition]}</span>
                    <span class="forecast-data">${day.low}${symbols.Degrees}/${day.high}${symbols.Degrees}</span>
                    <span class="forecast-data">${day.condition}</span>`);

                    spanUpcoming.append(upcomingHtml);

                    future.append(spanUpcoming);
                }

                $("#forecast").show();
            }

            function getWeather(hostServiceUrl, locationCode, todayOrUpcoming) {

                let weatherServiceUrl = `${hostServiceUrl}/forecast/${todayOrUpcoming}/${locationCode}.json`;

                return $.get(weatherServiceUrl);
            }

        }

        function displayError() {
            $("#forecast").show()
                .empty()
                .text("Error");
        }
    }
}