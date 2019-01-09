function startApp() {

    //TODO ELEMENTS
    const ELEMENTS = new Map();

    ELEMENTS.set("viewWelcome", $("#viewWelcome"));
    ELEMENTS.set("viewLogin", $("#viewLogin"));
    ELEMENTS.set("viewRegister", $("#viewRegister"));
    ELEMENTS.set("viewCreate", $("#viewCreate"));
    ELEMENTS.set("viewMyPet", $("#viewMyPet"));
    ELEMENTS.set("viewOtherPet", $("#viewOtherPet"));
    ELEMENTS.set("viewDeletePet", $("#viewDeletePet"));
    ELEMENTS.set("viewDetailsMyPet", $("#viewDetailsMyPet"));
    ELEMENTS.set("viewDetailsOtherPet", $("#viewDetailsOtherPet"));
    ELEMENTS.set("viewDashboard", $("#viewDashboard"));
    ELEMENTS.set("viewAllMyPets", $("#viewAllMyPets"));


    sessionStorage.clear();
    preventDefault();
    showHideMenuLinks();
    showWelcomeView();

    // TODO BUTTONS
    $('#registerButton').click(showRegisterView);
    $('#loginButton').click(showLoginView);
    $('#viewMyPetsBtn').click(showMyPetsView);
    $('#dashboard').click(() => showDashboard(""));
    $("#sendRegister").click(sendRegister);
    $("#sendLogin").click(sendLogin);
    $("#logoutBtn").click(sendLogout);
    $("#addPetBtn").click(showAddPetView);
    $("#createPetBtn").click(sendCreate);
    $("#filterAll").click(() => showDashboard(""));
    $("#filterCats").click(() => showDashboard("Cat"));
    $("#filterDogs").click(() => showDashboard("Dog"));
    $("#filterParrots").click(() => showDashboard("Parrot"));
    $("#filterReptiles").click(() => showDashboard("Reptile"));
    $("#filterOther").click(() => showDashboard("Other"));


    //TODO PREVENT LINKS
    function preventDefault() {
        $("body").click(function (event) {
            return $(event.target).hasClass("keepDefault");
        });
    }

    //TODO VIEWS
    function showDeleteView(pet) {
        getDeleteView(pet);
        showHideMenuLinks("viewDeletePet");
    }

    function showDetailsView(selector) {
        showHideMenuLinks(selector);
    }

    function showAddPetView() {
        showHideMenuLinks("viewCreate");
    }

    function showRegisterView() {
        showHideMenuLinks("viewRegister");
    }

    function showLoginView() {
        showHideMenuLinks("viewLogin");
    }

    function showWelcomeView() {
        showHideMenuLinks("viewWelcome");
    }

    function showMyPetsView() {
        getMyPets();
        showHideMenuLinks("viewAllMyPets");
    }

    function showDashboard(filter) {
        getDashboardPets(filter);
        showHideMenuLinks("viewDashboard");
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
        } else {
            $(".showForLogged").hide();
            $(".hideForLogged").show();

            $("#welcomeName").text("");
        }
    }


    //TODO CRUD
    function postDelete(petId) {
        let successFunc = function (res) {

            showInfo("Pet removed successfully!");

            showDashboard("");
        };

        callAJAX("DELETE", `appdata/app_key/pets/${petId}`,
            successFunc);
    }

    function getDeleteView(pet) {

        $("#viewDeletePet").empty();

        let html = $(`<h3>${pet.name}</h3>
            <p>Pet counter: <i class="fas fa-heart"></i> ${pet.likes}</p>
            <p class="img"><img src="${pet.imageURL}"></p>
            <form action="#" method="POST">
                <p class="description">${pet.description}</p>
                <button class="button">Delete</button>
            </form>`);

        html.find("button")
            .click(function () {
                postDelete(pet._id);
            });

        $("#viewDeletePet").append(html);
    }

    function getMyPets() {

        let userId = sessionStorage.getItem('userId');

        let successFunc = function (res) {
            $(".my-pets-list").empty();

            for (let pet of res) {

                let html = $(`<section class="myPet">
                    <h3>Name: ${pet.name}</h3>
                    <p>Category: ${pet.category}</p>
                    <p class="img"><img src="${pet.imageURL}"></p>
                    <p class="description">${pet.description}</p>
                    <div class="pet-info">
                    </div>
                </section>`);

                let deleteBtn = $(`<a href="#">
                            <button class="button">Delete</button>
                        </a>`);

                let editBtn = $(`<a href="#">
                            <button class="button">Edit</button>
                        </a>`);

                let likes = $(`<i class="fas fa-heart"></i> <span>${pet.likes}</span>`);

                editBtn.find("button").click(function () {
                    getPetDetails(pet._id);
                });

                deleteBtn.find("button").click(function () {
                    showDeleteView(pet);
                });

                html.find(".pet-info")
                    .append(editBtn)
                    .append(deleteBtn)
                    .append(likes);

                html.appendTo($(".my-pets-list"));
            }
        };

        callAJAX("GET", `appdata/app_key/pets?query={"_acl.creator":"${userId}"}`,
            successFunc);
    }

    function postEdit(pet, msg) {

        let successFunc = function (res) {
            if (!!msg) {
                if (msg === "getPetDetails") {
                    getPetDetails(pet._id);
                } else {
                    showInfo("Updated successfully!");
                    showDashboard("");
                }
            } else {
                showDashboard("");
            }
        };

        callAJAX("PUT", `appdata/app_key/pets/${pet._id}`,
            successFunc, pet);
    }

    function getPetDetails(petId) {

        let successFunc = function (pet) {

            if (pet._acl.creator === sessionStorage.getItem('userId')) {

                $("#viewDetailsMyPet").empty();

                let html = $(`<h3>${pet.name}</h3>
            <p>Pet counter: <i class="fas fa-heart"></i> ${pet.likes}</p>
            <p class="img"><img src="${pet.imageURL}">
            </p>
            <form action="#" method="POST">
                <textarea type="text" name="description">${pet.description}</textarea>
                <button class="button"> Save</button>
            </form>`);

                html.find(".button").click(function (event) {

                    let newDescription = $(event.target)
                        .parent()
                        .find("textarea")
                        .val();
                    pet.description = newDescription;

                    postEdit(pet, "Updated successfully!");
                });

                $("#viewDetailsMyPet").append(html);

                showDetailsView("viewDetailsMyPet");

            } else {

                $("#viewDetailsOtherPet").empty();

                let html = $(`<h3>${pet.name}</h3>
            <p>Pet counter: ${pet.likes} <a href="#">
                <button class="button"><i class="fas fa-heart"></i>
                    Pet
                </button>
            </a>
            </p>
            <p class="img"><img src="${pet.imageURL}"></p>
            <p class="description">${pet.description}</p>`);

                html.find(".button")
                    .click(function () {
                        pet.likes++;
                        postEdit(pet, "getPetDetails");
                    });

                $("#viewDetailsOtherPet").append(html);

                showDetailsView("viewDetailsOtherPet");
            }
        };

        callAJAX("GET", `appdata/app_key/pets/${petId}`,
            successFunc);
    }

    function getDashboardPets(filter) {

        let successFunc = function (res) {
            $(".other-pets-list").empty();

            for (let pet of res) {

                if (pet._acl.creator === sessionStorage.getItem('userId')) {
                    continue;
                }

                if (!!filter
                    && pet.category !== filter) {
                    continue;
                }

                let html = $(`<li class="otherPet">
                    <h3>Name: ${pet.name}</h3>
                    <p>Category: ${pet.category}</p>
                    <p class="img"><img src="${pet.imageURL}"></p>
                    <p class="description">${pet.description}</p>
                    <div class="pet-info">
                    </div>
                </li>`);

                let likeBtn = $(`<a href="#">
                            <button class="button"><i class="fas fa-heart"></i> Pet</button>
                        </a>`);

                let detailsBtn = $(`<a href="#">
                            <button class="button">Details</button>
                        </a>`);

                let likes = $(`<i class="fas fa-heart"></i> <span> ${pet.likes}</span>`);

                detailsBtn.click(function () {
                    getPetDetails(pet._id);
                });
                likeBtn.click(function () {
                    pet.likes++;
                    postEdit(pet);
                });

                html.find(".pet-info")
                    .append(detailsBtn)
                    .append(likeBtn)
                    .append(likes);

                html.appendTo($(".other-pets-list"));
            }

            showHideMenuLinks("viewDashboard");
        };

        callAJAX("GET", 'appdata/app_key/pets?query={}&sort={"likes": -1}',
            successFunc);
    }

    function sendCreate() {
        let name = $("#name").val();
        let description = $("#description").val();
        let imageURL = $("#image").val();
        let category = $("#category option:selected").text();
        let likes = 0;

        let pet = {
            name,
            description,
            imageURL,
            category,
            likes
        };

        let successFunc = function (res) {
            $("#name").val("");
            $("#description").val("");
            $("#image").val("");
            $("#category").prop('selectedIndex', 0);

            showInfo("Pet created.");

            showDashboard("");
        };

        callAJAX("POST", "appdata/app_key/pets",
            successFunc, pet);
    }


//TODO LOGS
    function sendLogout() {

        let successFunc = function (res) {
            sessionStorage.clear();

            showInfo("Logout successful.");

            showWelcomeView();
        };

        callAJAX("POST", "user/app_key/_logout",
            successFunc);
    }

    function sendLogin() {
        let username = $(".logUser").val();
        let password = $(".logPass").val();

        if (username.length < 3) {
            showError("Username must be at least 3 symbols");
        } else if (password.length < 6) {
            showError("Password must be at least 6 symbols");

        } else {
            let userData = {username, password};

            let successFunc = function (res) {
                $(".logUser").val("");
                $(".logPass").val("");

                saveAuthInSession(res);
                showInfo("Login successful.");

                showWelcomeView();
            };

            callAJAX("POST", "user/app_key/login",
                successFunc, userData);
        }
    }

    function sendRegister() {
        let username = $(".regUser").val().trim();
        let password = $(".regPass").val().trim();

        if (username.length < 3) {
            showError("Username must be at least 3 symbols");
        } else if (password.length < 6) {
            showError("Password must be at least 6 symbols");

        } else {
            let userData = {username, password};

            let successFunc = function (res) {
                $("#viewRegister > #username").val("");
                $("#viewRegister > #password").val("");

                saveAuthInSession(res);
                showInfo("User registration successful.");

                showWelcomeView();
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
        const APP_KEY = "kid_S1Q1q4GeE";
        const APP_SECRET = "4ada4fed20bc46829f588c115d0ca1b0";
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