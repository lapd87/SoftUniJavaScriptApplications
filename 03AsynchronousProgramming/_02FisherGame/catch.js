function attachEvents() {

    $(".add").click(addCatch);
    $(".load").click(loadCatches);

    function addCatch() {
        let angler = $("#aside .angler");
        let weight = $("#aside .weight");
        let species = $("#aside .species");
        let location = $("#aside .location");
        let bait = $("#aside .bait");
        let captureTime = $("#aside .captureTime");

        let newCatch = {
            "captureTime": +captureTime.val(),
            "bait": bait.val(),
            "location": location.val(),
            "species": species.val(),
            "weight": +weight.val(),
            "angler": angler.val(),
        };

        callAJAX("POST", "", clearAddCatch, JSON.stringify(newCatch));

        function clearAddCatch() {
            angler.val("");
            weight.val("");
            species.val("");
            location.val("");
            bait.val("");
            captureTime.val("");
        }
    }

    function loadCatches() {
        callAJAX("GET", "", displayCatches);

        function displayCatches(catches) {
            let catchesContainer = $("#catches");
            let demo = catchesContainer.find("div").first();

            catchesContainer.empty();
            catchesContainer.append(demo);

            for (let loadedCatch of catches) {
                let id = loadedCatch._id;
                let angler = loadedCatch.angler;
                let weight = loadedCatch.weight;
                let species = loadedCatch.species;
                let location = loadedCatch.location;
                let bait = loadedCatch.bait;
                let captureTime = loadedCatch.captureTime;

                let html = `<div class="catch" data-id="${id}">
                        <label>Angler</label>
                        <input type="text" class="angler" value="${angler}">
                        <label>Weight</label>
                        <input type="number" class="weight" value="${weight}">
                        <label>Species</label>
                        <input type="text" class="species" value="${species}">
                        <label>Location</label>
                        <input type="text" class="location" value="${location}">
                        <label>Bait</label>
                        <input type="text" class="bait" value="${bait}">
                        <label>Capture Time</label>
                        <input type="number" class="captureTime" value="${captureTime}">
                        <button class="update">Update</button>
                        <button class="delete">Delete</button>
                    </div>`;

                catchesContainer.append($(html));

                catchesContainer.find(`[data-id=${id}]`)
                    .find(".update").click(updateCatch);
                catchesContainer.find(`[data-id=${id}]`)
                    .find(".delete").click(deleteCatch);
            }
        }
    }

    function updateCatch() {

        let clicked = $(this).parent();

        let angler = clicked.find(".angler");
        let weight = clicked.find(".weight");
        let species = clicked.find(".species");
        let location = clicked.find(".location");
        let bait = clicked.find(".bait");
        let captureTime = clicked.find(".captureTime");

        let updatedCatch = {
            "captureTime": +captureTime.val(),
            "bait": bait.val(),
            "location": location.val(),
            "species": species.val(),
            "weight": +weight.val(),
            "angler": angler.val(),
        };

        let catchId = clicked.attr("data-id");

        callAJAX("PUT", catchId, redrawCatch, JSON.stringify(updatedCatch));

        function redrawCatch() {
        }
    }

    function deleteCatch() {

        let clicked = $(this).parent();

        let catchId = clicked.attr("data-id");

        callAJAX("DELETE", catchId, removeCatch);

        function removeCatch() {
            clicked.remove();
        }
    }


    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com/appdata/kid_HyB_3XTCX/biggestCatches";
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
    }
}