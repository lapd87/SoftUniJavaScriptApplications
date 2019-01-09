function attachEvents() {

    let btn = $("#btnLoadTowns");

    btn.click(addTowns);

    function addTowns() {
        let towns = $("#towns").val()
            .split(", ")
            .map(t => t.trim())
            .filter(t => t !== "")
            .reduce((acc, cur) => {
                acc.towns.push({"name": cur});
                return acc;
            }, {"towns": []});

        let template = Handlebars.compile($("#towns-template").html())
        let list = template(towns);

        let container = $("#root");
        container.empty().append(list)
    }
}