function attachEvents() {

    $(".add").click(addBook);
    $(".load").click(loadBooks);

    function addBook() {
        let author = $("#aside .author");
        let title = $("#aside .title");
        let isbn = $("#aside .isbn");
        let tags = $("#aside .tags");

        let newBook = {
            "isbn": +isbn.val(),
            "title": title.val(),
            "author": author.val(),
            "tags": [tags.val().split(/[,:;\s+]/g)]
        };

        callAJAX("POST", "", clearAddBook, JSON.stringify(newBook));

        function clearAddBook() {
            author.val("");
            title.val("");
            isbn.val("");
            tags.val("");
        }
    }

    function loadBooks() {
        callAJAX("GET", "", displayBooks);

        function displayBooks(books) {

            let booksContainer = $("#books");
            let demo = booksContainer.find("div").first();

            booksContainer.empty();
            booksContainer.append(demo);

            for (let loadedBook of books) {
                let id = loadedBook._id;
                let author = loadedBook.author;
                let title = loadedBook.title;
                let isbn = loadedBook.isbn;
                let tags = loadedBook.tags;

                let html = `<div class="book" data-id="${id}">
                        <label>Author</label>
                        <input type="text" class="author" value="${author}">
                        <label>Title</label>
                        <input type="text" class="title" value="${title}">
                        <label>ISBN</label>
                        <input type="number" class="isbn" value="${isbn}">
                        <label>Tags</label>
                        <input type="text" class="tags" value="${tags}">
                        <button class="update">Edit</button>
                        <button class="delete">Delete</button>
                    </div>`;

                booksContainer.append($(html));

                booksContainer.find(`[data-id=${id}]`)
                    .find(".update").click(updateBook);
                booksContainer.find(`[data-id=${id}]`)
                    .find(".delete").click(deleteBook);
            }
        }
    }

    function updateBook() {

        let clicked = $(this).parent();

        let author = clicked.find(".author");
        let title = clicked.find(".title");
        let isbn = clicked.find(".isbn");
        let tags = clicked.find(".tags");

        let updatedBook = {
            "isbn": +isbn.val(),
            "title": title.val(),
            "author": author.val(),
            "tags": tags.val()
        };

        let bookId = clicked.attr("data-id");

        callAJAX("PUT", bookId, redrawBook, JSON.stringify(updatedBook));

        function redrawBook() {
            alert("Successfully edited " + title);
            console.log("Successfully edited " + title);
        }
    }

    function deleteBook() {

        let clicked = $(this).parent();

        let bookId = clicked.attr("data-id");

        callAJAX("DELETE", bookId, removeBook);

        function removeBook() {
            clicked.remove();
        }
    }


    function callAJAX(method, hostAddOn, successFunc, JSON) {
        const HOST = "https://baas.kinvey.com/appdata/kid_S1y26Ba07/books";
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