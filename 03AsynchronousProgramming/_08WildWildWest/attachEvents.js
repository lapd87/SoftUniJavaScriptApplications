function attachEvents() {

    let currentPlayerId = "";
    let currentPlayer = {};

    getPlayers();
    $("#addPlayer").click(addPlayer);
    $("#save").click(saveGame);


    function saveGame() {
        if (currentPlayerId !== "") {
            getCurrentPlayer();

            callAJAX("PUT", currentPlayerId,
                setCurrentPlayer, JSON.stringify(currentPlayer));
        }

        //TODO

        $("#save").toggle();
        $("#reload").toggle();
        $("#canvas").toggle();
    }

    function getCurrentPlayer() {
        return callAJAX("GET", currentPlayerId, setCurrentPlayer);
    }

    function setCurrentPlayer(response) {
        currentPlayer = response;
    }

    function addPlayer() {
        let input = $("#addName");

        let player = {
            name: input.val(),
            money: 500,
            bullets: 6
        };

        callAJAX("POST", "",
            getPlayers, JSON.stringify(player));

        input.val("");
    }

    function getPlayers() {
        callAJAX("GET", "", displayPlayers);
    }

    function displayPlayers(players) {
        let container = $("#players");
        container.empty();

        for (let player of players) {

            let html = $(` <div class="player" data-id="${player._id}">
            <div class="row">
                <label>Name:</label>
                <label class="name">${player.name}</label>
            </div>
            <div class="row">
                <label>Money:</label>
                <label class="money">${player.money}</label>
            </div>
            <div class="row">
                <label>Bullets:</label>
                <label class="bullets">${player.bullets}</label>
            </div>
            <button class="play">Play</button>
            <button class="delete">Delete</button>
        </div>`);

            html.find(".play").click(function () {
                let clicked = $(this).parent();
                let currentPlayerId = clicked.attr("data-id");

//TODO
            });

            html.find(".delete").click(function () {
                let clicked = $(this).parent();
                let playerId = clicked.attr("data-id");

                callAJAX("DELETE", playerId, getPlayers);
            });

            container.append(html);
        }
    }


    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com/appdata/kid_B1gzLJ4k4/players";
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