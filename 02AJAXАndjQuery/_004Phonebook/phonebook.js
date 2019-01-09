$(function () {
    $("#btnLoad").click(loadContacts);
    $("#btnCreate").click(createContacts);

    let phonebook = $("#phonebook");

    let baseServiceUrl = "https://testapp-2e902.firebaseio.com/PhoneBook/";

    function loadContacts() {
        phonebook.empty();
        $.get(baseServiceUrl + ".json")
            .then(displayContacts)
            .catch(displayError);

        function displayContacts(contacts) {
            for (let key in contacts) {
                let person = contacts[key].name;
                let phone = contacts[key].phone;

                let li = $("<li>").text(`${person}: ${phone} `);
                let button = $("<button>Delete</button>")
                    .click(deleteContact.bind(this, key));

                li.append(button);

                phonebook.append(li);
            }

            function deleteContact(key) {
                let request = {
                    method: "DELETE",
                    url: baseServiceUrl + `/${key}.json`
                };

                $.ajax(request)
                    .then(loadContacts)
                    .catch(displayError);
            }
        }
    }

    function createContacts() {
        let personInput = $("#person");
        let phoneInput = $("#phone");

        let newContactJSON = JSON.stringify({
            name: personInput.val(),
            phone: phoneInput.val()
        });

        $.post(baseServiceUrl + ".json", newContactJSON)
            .then(loadContacts)
            .catch(displayError);

        personInput.val("");
        phoneInput.val("");
    }

    function displayError(error) {
        phonebook.append($("<li>Error</li>"));
    }
});