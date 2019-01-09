(function attachEvents() {

    const DATA = [{
        ID: 141,
        FirstName: "pesho",
        LastName: "peshov",
        FacultyNumber: "54265545",
        Grade: "5"
    }, {
        ID: 132341,
        FirstName: "stamat",
        LastName: "stamatov",
        FacultyNumber: "4254554",
        Grade: "6"
    }];

    addStudents(DATA);
    // getStudents();

    function addStudents(data) {
        callAJAX("POST", "", getStudents, JSON.stringify(data));
    }

    function getStudents() {
        callAJAX("GET", "", displayStudents);
    }

    function displayStudents(students) {
        let table = $("#results");

        $('#results tr').not(':nth-child(1)').remove();

        for (let student of students) {
            let row = $(`<tr>
                    <td>${student.ID}</td>
                    <td>${student.FirstName}</td>
                    <td>${student.LastName}</td>
                    <td>${student.FacultyNumber}</td>
                    <td>${student.Grade}</td>
                </tr>`);

            table.append(row);
        }
    }


    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students";
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
})();