function knock() {

    let answer = {message: "Knock Knock.", answer: ""};
    let body = $("body");

    call(answer);

    function call(response) {
        answer = response;

        body.append($("<div>").text(answer.answer));

        body.append($("<div>").text(answer.message));

        callAJAX("GET", answer.message, call);
    }

    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock?query=";
        const USER = "guest";
        const PASS = "guest";
        const BASE_64 = btoa(USER + ":" + PASS);
        const AUTH = {"Authorization": "Basic " + BASE_64};

        // if (hostAddOn !== "") {
        //     hostAddOn = "/" + hostAddOn;
        // }

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
        body.append($("<div>").text("Finish"));
    }
}