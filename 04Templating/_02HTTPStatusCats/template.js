$(() => {

    renderCatTemplate();

    function renderCatTemplate() {

        let template = Handlebars.compile($("#cat-template").html())
        let catDivs = template({cats});

        let container = $("#allCats");
        container.append(catDivs);
    }

});

function showHide(event) {
    const SHOW = "Show status code";
    const HIDE = "Hide status code";

    let btn = $(event);

    if (btn.text() === SHOW) {
        btn.next().toggle();
        btn.text(HIDE);
    } else if (btn.text() === HIDE) {
        btn.next().toggle();
        btn.text(SHOW);
    }
}
