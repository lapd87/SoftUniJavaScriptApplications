function startApp() {

    //TODO ELEMENTS
    const ELEMENTS = new Map();

    ELEMENTS.set("viewRegister", $("#viewRegister"));
    ELEMENTS.set("viewLogin", $("#viewLogin"));
    ELEMENTS.set("viewCatalog", $("#viewCatalog"));
    ELEMENTS.set("viewAddFlight", $("#viewAddFlight"));
    ELEMENTS.set("viewFlightDetails", $("#viewFlightDetails"));
    ELEMENTS.set("viewEditFlight", $("#viewEditFlight"));
    ELEMENTS.set("viewMyFlights", $("#viewMyFlights"));


    sessionStorage.clear();
    showHideMenuLinks();
    showLoginView();


    // TODO BUTTONS
    $('#registerButton').click(showRegisterView);
    $('#loginButton').click(showLoginView);
    $('#flightsButton').click(showMyFlightView);
    $('#homeButton').click(showHomeMenuView);
    $("#sendRegister").click(sendRegister);
    $("#sendLogin").click(sendLogin);
    $("#logoutBtn").click(sendLogout);
    $("#addFlightBtn").click(showAddFlightView);
    $("#createFlightBtn").click(sendCreate);


    //TODO PREVENT LINKS
    $("body").click(function (event) {
        return $(event.target).hasClass("keepDefault");
    });


    //TODO VIEWS
    function showEditView() {
        showHideMenuLinks("viewEditFlight");
    }

    function showDetailsView() {
        showHideMenuLinks("viewFlightDetails");
    }

    function showAddFlightView() {
        showHideMenuLinks("viewAddFlight");
    }

    function showRegisterView() {
        showHideMenuLinks("viewRegister");
    }

    function showLoginView() {
        showHideMenuLinks("viewLogin");
    }

    function showMyFlightView() {
        getMyFlights();
        showHideMenuLinks("viewMyFlights");
    }

    function showHomeMenuView() {
        getFlights();
        showHideMenuLinks("viewCatalog");
    }

    function showHideMenuLinks() {
        ELEMENTS.forEach(e => e.hide());

        for (let arg of arguments) {
            ELEMENTS.get(arg).show();
        }

        if (hasLoggedUser()) {
            $(".showForLogged").show();
            $(".hideForLogged").hide();

            let username = sessionStorage.getItem('username');
            $("#welcomeName").text(`Welcome, ${username} |`);
            $("#welcome").show();
        } else {
            $(".showForLogged").hide();
            $(".hideForLogged").show();

            $("#welcomeName").text("");
            $("#welcome").hide();
        }
    }


    //TODO CRUD
    function postDelete(flightId) {
        console.log(flightId);
        let successFunc = function (res) {

            showInfo("Deleted");

            showMyFlightView();
        };

        callAJAX("DELETE", `appdata/app_key/flights/${flightId}`,
            successFunc);
    }

    function getMyFlights() {

        let userId = sessionStorage.getItem('userId');

        let successFunc = function (res) {

            let header = $("<h3>Your Flights</h3>");

            $("#viewMyFlights").empty();
            $("#viewMyFlights").append(header);

            for (let flight of res) {
                let html = $(`<div class="flight-ticket">
            <div class="flight-left">
                <img src="${flight.image}" alt="">
            </div>
            <div class="flight-right">
                <div>
                    <h3>${flight.destination}</h3><span>${flight.departure}</span>
                </div>
                <div>
                    from ${flight.origin} <span>${flight.time}</span>
                </div>
                <p>${flight.seats} Seats (${flight.price}$ per seat) </p>
            </div>
        </div>`);

                let removeBtn = $(`<a href="" class="remove">REMOVE</a>`);
                let detailsBtn = $(`<a href="" class="details">Details</a>`);

                removeBtn.click(function () {
                    postDelete(flight._id);
                });

                detailsBtn.click(function () {
                    getDetails(flight._id);
                });

                html.find(".flight-right").append(removeBtn);
                html.find(".flight-right").append(detailsBtn);

                $("#viewMyFlights").append(html);
            }
        };

        callAJAX("GET", `appdata/app_key/flights?query={"_acl.creator":"${userId}"}`,
            successFunc);
    }

    function postEdit(flightId) {
        let destination = $("#editDest").val();
        let origin = $("#editOrigin").val();
        let departure = $("#editDate").val();
        let time = $("#editTime").val();
        let seats = +$("#editSeats").val();
        let cost = +$("#editCost").val();
        let image = $("#editImg").val();
        let isPublished = $("#editPublic").prop("checked");

        if (validateData(destination, origin, departure,
            time, seats, cost, image)) {

            showError("Invalid inputs");

        } else {

            let flightData = {
                destination,
                origin,
                departure,
                time,
                seats,
                cost,
                image,
                isPublished
            };

            let successFunc = function (res) {
                $("#editDest").val("");
                $("#editOrigin").val("");
                $("#editDate").val("");
                $("#editTime").val("");
                $("#editSeats").val("");
                $("#editCost").val("");
                $("#editImg").val("");
                $("#editPublic").prop("checked", false);

                showInfo("Edited");

                showHomeMenuView();
            };

            callAJAX("PUT", `appdata/app_key/flights/${flightId}`,
                successFunc, flightData);
        }
    }

    function getEdit(flightId) {
        let successFunc = function (flight) {

            $("#editDest").val(flight.destination);
            $("#editOrigin").val(flight.origin);
            $("#editDate").val(flight.departure);
            $("#editTime").val(flight.time);
            $("#editSeats").val(flight.seats);
            $("#editCost").val(flight.cost);
            $("#editImg").val(flight.image);
            $("#editPublic").prop("checked", flight.isPublished);

            $("#editFlightBtn").click(function () {
                postEdit(flightId);
            });

            showEditView();
        };

        callAJAX("GET", `appdata/app_key/flights/${flightId}`,
            successFunc);
    }

    function getDetails(flightId) {

        let successFunc = function (flight) {

            $("#viewFlightDetails").empty();

            let html = $(` <div class="ticket-area">
            <div class="ticket-area-left">
                <img src="http://airportcluj.ro/fisiere/userfiles/Bari_28.03.07_088.jpg" alt="">
            </div>
            <div class="ticket-area-right">
                <h3>${flight.destination}</h3>
                <div>from ${flight.origin}</div>
                <div class="data-and-time">
                    ${flight.departure} ${flight.time}
                </div>
                <div>
                    ${flight.seats} Seats (${flight.cost} per seat)
                </div>
            </div>
        </div>`);

            let isCreator = sessionStorage.getItem('userId') === flight._acl.creator;

            if (isCreator) {
                let editBtn = $(`<a href="" class="edit-flight-detail"></a>`);

                editBtn.click(function () {
                    getEdit(flight._id);
                });

                html.find(".data-and-time").append(editBtn);
            }

            $("#viewFlightDetails").append(html);

            showDetailsView();
        };

        callAJAX("GET", `appdata/app_key/flights/${flightId}`,
            successFunc);
    }

    function getFlights() {

        let successFunc = function (res) {

            $("#allFlights").empty();

            for (let flight of res) {
                let html = `<a href="" class="added-flight">
                <img src="${flight.image}" alt=""
                     class="picture-added-flight">
                <h3>${flight.destination}</h3>
                <span>from ${flight.origin}</span><span>${flight.departure} ${flight.time}</span>
            </a>`;

                $(html).click(function () {
                    getDetails(flight._id);
                }).appendTo($("#allFlights"));
            }
        };

        callAJAX("GET", 'appdata/app_key/flights?query={"isPublished":true}',
            successFunc);
    }

    function sendCreate() {
        let destination = $("#createDest").val();
        let origin = $("#createOrigin").val();
        let departure = $("#createDate").val();
        let time = $("#createTime").val();
        let seats = +$("#createSeats").val();
        let cost = +$("#createCost").val();
        let image = $("#createImg").val();
        let isPublished = $("#createPublic").prop("checked");

        if (validateData(destination, origin, departure,
            time, seats, cost, image)) {

            showError("Invalid inputs");

        } else {

            let flightData = {
                destination,
                origin,
                departure,
                time,
                seats,
                cost,
                image,
                isPublished
            };

            let successFunc = function (res) {
                $("#createDest").val("");
                $("#createOrigin").val("");
                $("#createDate").val("");
                $("#createTime").val("");
                $("#createSeats").val("");
                $("#createCost").val("");
                $("#createImg").val("");
                $("#createPublic").prop("checked", false);

                showInfo("Created");

                showHomeMenuView();
            };

            callAJAX("POST", "appdata/app_key/flights",
                successFunc, flightData);
        }
    }

    function validateData(destination, origin, departure,
                          time, seats, cost, image) {
        return destination === ""
            || origin === ""
            || departure === ""
            || time === ""
            || cost < 0
            || seats < 0
            || image === "";
    }


    //TODO LOGS
    function sendLogout() {

        let successFunc = function (res) {
            sessionStorage.clear();

            showInfo("Goodbye");

            showLoginView();
        };

        callAJAX("POST", "user/app_key/_logout",
            successFunc);
    }

    function sendLogin() {
        let username = $("#usernameLog").val();
        let password = $("#passLog").val();

        let userData = {username, password};

        let successFunc = function (res) {
            $("#usernameLog").val("");
            $("#passLog").val("");

            saveAuthInSession(res);
            showInfo("Logged");

            showHomeMenuView();
        };

        callAJAX("POST", "user/app_key/login",
            successFunc, userData);
    }

    function sendRegister() {
        let username = $("#usernameReg").val();
        let password = $("#passReg").val();
        let checkPass = $("#checkPassReg").val();

        if (username.length < 5
            || password === ""
            || checkPass === ""
            || password !== checkPass) {

            showError("Invalid inputs");

        } else {
            let userData = {username, password};

            let successFunc = function (res) {
                $("#usernameReg").val("");
                $("#passReg").val("");
                $("#checkPassReg").val("");

                saveAuthInSession(res);
                showInfo("Registered");

                showHomeMenuView();
            };

            callAJAX("POST", "user/app_key/",
                successFunc, userData);
        }
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username)
    }

    function hasLoggedUser() {
        let authToken = sessionStorage.getItem('authToken');
        return authToken !== null && authToken !== "";
    }


    // TODO NOTIFICATIONS
    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    });

    function showInfo(message) {
        $('#infoBox').show();
        $('#infoBox > span').text(message);
        $('#infoBox').on('click', function () {
            $(this).fadeOut();
        });
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(error) {
        $('#errorBox').show();
        $('#errorBox > span').text(error);
        $('#errorBox').on('click', function () {
            $(this).fadeOut();
        })
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }


    // TODO AJAX
    function callAJAX(method, hostAddOn, successFunc, JSONObj) {
        const HOST = "https://baas.kinvey.com";
        const APP_KEY = "kid_HJNYsbxxV";
        const APP_SECRET = "36d98aa711a34af687dfd9b357a4b9d9";
        const BASE_64 = btoa(APP_KEY + ":" + APP_SECRET);
        let authorization = {"Authorization": "Basic " + BASE_64};

        if (hasLoggedUser()) {
            let authToken = sessionStorage
                .getItem('authToken');

            authorization = {"Authorization": "Kinvey " + authToken};
        }

        if (hostAddOn !== "") {
            hostAddOn = "/" + hostAddOn;
            hostAddOn = hostAddOn.replace("app_key", APP_KEY);
        }

        $.ajax({
            method: method,
            url: HOST + hostAddOn,
            headers: authorization,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(JSONObj)
        }).then(function (res) {
            successFunc(res);
        })
            .catch(handleAjaxError);
    }
}