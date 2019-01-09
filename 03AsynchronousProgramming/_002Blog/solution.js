function attachEvents() {

    $("#btnLoadPosts").click(loadPosts);
    $("#btnViewPost").click(displayPostComments);

    const HOST = "https://baas.kinvey.com/appdata/kid_SklkVCsA7";
    const USER = "guest";
    const PASS = "guest";
    const BASE_64 = btoa(USER + ":" + PASS);
    const AUTH = {"Authorization": "Basic " + BASE_64};

    const SELECTOR = $("#posts");

    function loadPosts() {
        $.ajax({
            method: "GET",
            url: HOST + "/posts",
            headers: AUTH
        }).then(attachPostOptions)
            .catch(displayError);


        function attachPostOptions(posts) {
            SELECTOR.empty();

            for (let post of posts) {
                let option = $(`<option postId="${post._id}" postBody="${post.body}">${post.title}</option>`);

                SELECTOR.append(option);
            }
        }
    }

    function displayPostComments() {
        let post = SELECTOR.find(":selected");

        displayPost(post);

        function displayPost(post) {
            let postTitle = post.text();
            let postBody = post.attr("postBody");

            $("#post-title").text(postTitle);
            $("#post-body").text(postBody);

            loadComments(post);
        }

        function loadComments(post) {
            let postId = post.attr("postId");

            console.log(postId);
            $.ajax({
                method: "GET",
                url: HOST + `/comments/?query={"postId":"${postId}"}`,
                headers: AUTH
            }).then(displayComments)
                .catch(displayError);
        }

        function displayComments(comments) {
            let commentsList = $("#post-comments");
            commentsList.empty();

            for (let comment of comments) {
                let li = $(`<li>${comment.text}</li>`);

                commentsList.append(li);
            }
        }
    }


    function displayError(error) {
        console.log(error);
    }
}