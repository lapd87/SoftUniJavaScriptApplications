function attachEvents() {
    $("#submit").click(postMsg);
    $("#refresh").click(loadMsgs);

    let baseServiceUrl = "https://testapp-2e902.firebaseio.com/Messenger";

    let result = $("#messages");

    function postMsg() {
        let msgAuthor = $("#author");
        let msgContent = $("#content");

        let newMsgJSON = JSON.stringify({
            author: msgAuthor.val(),
            content: msgContent.val(),
            timestamp: Date.now()
        });

        $.post(baseServiceUrl + ".json", newMsgJSON)
            .then(loadMsgs)
            .catch(displayError);

        msgAuthor.val("");
        msgContent.val("");
    }

    function loadMsgs() {
        // &#13;&#10; = /r/n
        $.get(baseServiceUrl + ".json")
            .then(displayContacts)
            .catch(displayError);

        function displayContacts(messages) {
            let msgsToText = Object.values(messages)
                .sort((a, b) => a["timestamp"] - b["timestamp"])
                .map(a => a["author"] + ": " + a["content"])
                .join("\r\n");

            result.text(msgsToText);
        }
    }

    function displayError(error) {
        result.text("Error: " + error);
    }
}