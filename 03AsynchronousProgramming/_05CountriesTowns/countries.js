function attachEvents() {

    const countries = $("#countries");
    const towns = $("#towns");
    const submitBtn = $("#btnSubmit");
    const input = $("#new");
    const addEditContainer = $("#add-edit");


    $("#btnAddCountry").click(addCountry);
    $("#btnDeleteCountry").click(deleteCountry);
    $("#btnEditCountry").click(editCountry);

    $("#btnGetTowns").click(getTowns);
    $("#btnAddTown").click(addTown);
    $("#btnDeleteTown").click(deleteTown);
    $("#btnEditTown").click(editTown);


    getCountries();

    function editTown() {
        addEditContainer.show();

        submitBtn.one("click", () => {

            let town = towns.find(":selected");
            let townId = town.attr("town-id");

            let country = countries.find(":selected");
            let countryId = country.attr("country-id");

            let editedTown = {
                name: input.val(),
                country_id: countryId
            };

            callAJAX("PUT", `towns/${townId}`,
                getTowns, JSON.stringify(editedTown));

            input.val("");
            addEditContainer.hide();
        });
    }

    function deleteTown() {
        let town = towns.find(":selected");

        let townId = town.attr("town-id");

        callAJAX("DELETE", `towns/${townId}`, getTowns);
    }

    function addTown() {

        addEditContainer.show();

        submitBtn.one("click", () => {

            let country = countries.find(":selected");

            let countryId = country.attr("country-id");

            let town = {
                name: input.val(),
                country_id: countryId
            };

            callAJAX("POST", "towns",
                getTowns, JSON.stringify(town));

            input.val("");
            addEditContainer.hide();
        });
    }

    function getTowns() {

        let country = countries.find(":selected");

        let countryId = country.attr("country-id");

        callAJAX("GET", `towns/?query={"country_id":"${countryId}"}`, displayTowns);
    }

    function displayTowns(data) {

        towns.empty();

        for (let town of data) {
            let option = $(`<option town-id="${town._id}">${town.name}</option>`);

            towns.append(option);
        }
    }


    function editCountry() {

        addEditContainer.show();

        submitBtn.one("click", () => {

            let country = countries.find(":selected");

            let countryId = country.attr("country-id");
            let editedCountry = {name: input.val()};

            callAJAX("PUT", `countries/${countryId}`,
                getCountries, JSON.stringify(editedCountry));

            input.val("");
            addEditContainer.hide();
        });
    }

    function deleteCountry() {
        let country = countries.find(":selected");

        let countryId = country.attr("country-id");

        callAJAX("DELETE", `towns/?query={"country_id":"${countryId}"}`, getTowns);

        callAJAX("DELETE", `countries/${countryId}`, getCountries);
    }

    function addCountry() {

        addEditContainer.show();

        submitBtn.one("click", () => {

            let country = {name: input.val()};

            callAJAX("POST", "countries",
                getCountries, JSON.stringify(country));

            input.val("");
            addEditContainer.hide();
        });
    }

    function getCountries() {
        callAJAX("GET", "countries", displayCountries);
    }

    function displayCountries(data) {

        countries.empty();

        for (let country of data) {
            let option = $(`<option country-id="${country._id}">${country.name}</option>`);

            countries.append(option);
        }
    }

    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com/appdata/kid_B1ejodGJV";
        const USER = "guest";
        const PASS = "guest";
        const BASE_64 = btoa(USER + ":" + PASS);
        const AUTH = {"Authorization": "Basic " + BASE_64};

        if (hostAddOn !== "") {
            hostAddOn = "/" + hostAddOn;
        }

        $.ajax({
            method: method,
            url: HOST + hostAddOn,
            headers: AUTH,
            contentType: "application/json; charset=utf-8",
            data: JSON
        }).then(successFunc)
            .catch(displayError);
    }

    function displayError(error) {
        console.log(error);
        alert(JSON.stringify(error));
    }
}