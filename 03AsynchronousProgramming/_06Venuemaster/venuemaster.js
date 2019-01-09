function attachEvents() {

    const CONTAINER = $("#venue-info");

    $("#getVenues").click(getVenuesIDs);


    function getVenuesIDs() {

        let date = $("#venueDate");

        let hostAddOn = `rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date.val()}`;

        callAJAX("POST", hostAddOn, getVenuesInfo);

        date.val("");
    }

    function getVenuesInfo(venuesIDs) {
        CONTAINER.empty();

        for (let venueID of venuesIDs) {
            callAJAX("GET", `appdata/kid_BJ_Ke8hZg/venues/${venueID}`, displayVenue);
        }
    }

    function displayVenue(venue) {
        let html = $(`<div class="venue" id="${venue._id}">
    <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
    <div class="venue-details" style="display: none;">
        <table>
            <tr>
                <th>Ticket Price</th>
                <th>Quantity</th>
                <th></th>
            </tr>
            <tr>
                <td class="venue-price">${venue.price} lv</td>
                <td><select class="quantity">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select></td>
                <td><input class="purchase" type="button" value="Purchase"></td>
            </tr>
        </table>
        <span class="head">Venue description:</span>
        <p class="description">${venue.description}</p>
        <p class="description">Starting time: ${venue.startingHour}</p>
    </div>
</div>`);

        html.find(".info").click(function () {
            html.find(".venue-details").toggle();
        });

        html.find(".purchase").click(function () {

            let qty =+ $(this)
                .parent()
                .parent()
                .find(".quantity")
                .find(":selected")
                .val();

            let purchaseHtml = $(`<span class="head">Confirm purchase</span>
<div class="purchase-info">
    <span>${venue.name}</span>
    <span>${qty} x ${venue.price}</span>
    <span>Total: ${qty * venue.price} lv</span>
    <input type="button" value="Confirm">
</div>`);

            purchaseHtml.find("[type=button]").click(function () {
                callAJAX("POST", `rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${venue._id}&qty=${qty}`, displayPurchase)
            });

            CONTAINER.empty();
            CONTAINER.append(purchaseHtml);
        });

        CONTAINER.append(html);
    }

    function displayPurchase(response) {
        CONTAINER.empty();

        CONTAINER.append("You may print this page as your ticket");
        CONTAINER.append($(response.html));
    }


    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com";
        const USER = "guest";
        const PASS = "pass";
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