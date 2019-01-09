$(() => {
    const PARTIAL_PATHS = {
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        home: "./templates/home/home.hbs",
        about: "./templates/about/about.hbs",
        loginForm: "./templates/login/loginForm.hbs",
        loginPage: "./templates/login/loginPage.hbs",
        registerForm: "./templates/register/registerForm.hbs",
        registerPage: "./templates/register/registerPage.hbs",
        team: "./templates/catalog/team.hbs",
        teamCatalog: "./templates/catalog/teamCatalog.hbs",
        createForm: "./templates/create/createForm.hbs",
        createPage: "./templates/create/createPage.hbs",
        teamControls: "./templates/catalog/teamControls.hbs",
        details: "./templates/catalog/details.hbs",
        editForm: "./templates/edit/editForm.hbs",
        editPage: "./templates/edit/editPage.hbs"
    };
    const PARTIAL = {
        header: "header",
        footer: "footer",
        home: "home",
        about: "about",
        loginForm: "loginForm",
        loginPage: "loginPage",
        registerForm: "registerForm",
        registerPage: "registerPage",
        team: "team",
        teamCatalog: "teamCatalog",
        createForm: "createForm",
        createPage: "createPage",
        teamControls: "teamControls",
        details: "details",
        editForm: "editForm",
        editPage: "editPage"
    };


    const app = Sammy('#main', function () {

        this.use("Handlebars", "hbs");

        this.get("index.html", getHome);
        this.get("#/home", getHome);
        this.get("#/about", getAbout);
        this.get("#/login", getLogin);
        this.post("#/login", postLogin);
        this.get("#/logout", getLogout);
        this.get("#/register", getRegister);
        this.post("#/register", postRegister);
        this.get("#/catalog", getCatalog);
        this.get("#/create", getCreate);
        this.post("#/create", postCreate);
        this.get("#/catalog/:id", getDetails);
        this.get("#/join/:id", getJoin);
        this.get("#/leave", getLeave);
        this.get("#/edit/:id", getEdit);
        this.post("#/edit/:id", postEdit);


        function postEdit(context) {

            let teamId = context.params.id.substring(1);
            let teamName = context.params.name;
            let teamComment = context.params.comment;

            teamsService.edit(teamId, teamName, teamComment)
                .then(function () {
                    auth.showInfo("Successfully edited team!");
                    getDetails(context);
                })
                .catch(auth.handleError);
        }

        function getEdit(context) {

            let teamId = context.params.id.substring(1);

            teamsService.loadTeamDetails(teamId)
                .then(function (teamData) {
                    // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
                    // context.username = sessionStorage.getItem("username");
                    context = getContextData(context);

                    context.teamId = teamId;
                    context.name = teamData.name;
                    context.comment = teamData.comment;

                    // context.loadPartials({
                    //     header: "./templates/common/header.hbs",
                    //     footer: "./templates/common/footer.hbs",
                    //     editForm: "./templates/edit/editForm.hbs"
                    // })
                    context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer,
                        PARTIAL.editForm))
                        .then(function () {
                            // this.partial("./templates/edit/editPage.hbs");
                            this.partial(PARTIAL_PATHS.editPage);
                        })
                })
                .catch(auth.handleError);
        }

        function getLeave(context) {

            teamsService.leaveTeam()
                .then(function (userData) {
                    auth.saveSession(userData);
                    auth.showInfo("Successfully left team!");
                    getCatalog(context);
                })
                .catch(auth.handleError);
        }

        function getJoin(context) {

            let teamId = context.params.id.substring(1);

            teamsService.joinTeam(teamId)
                .then(function (userData) {
                    auth.saveSession(userData);
                    auth.showInfo("Successfully joined team!");
                    getDetails(context);
                })
                .catch(auth.handleError);
        }

        function getDetails(context) {

            let teamId = context.params.id.substring(1);

            teamsService.loadTeamDetails(teamId)
                .then(function (teamData) {
                    // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
                    // context.username = sessionStorage.getItem("username");
                    context = getContextData(context);

                    context.name = teamData.name;
                    context.comment = teamData.comment;
                    context.isAuthor = teamData._acl.creator === sessionStorage.getItem("userId");
                    context.teamId = teamId;
                    context.isOnTeam = teamId === sessionStorage.getItem("teamId");
                    // context.hasNoTeam = ["null", "undefined", ""]
                    //     .includes(sessionStorage.getItem("teamId"));

                    // context.loadPartials({
                    //     header: "./templates/common/header.hbs",
                    //     footer: "./templates/common/footer.hbs",
                    //     teamControls: "./templates/catalog/teamControls.hbs"
                    // })
                    context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer,
                        PARTIAL.teamControls))
                        .then(function () {
                            // this.partial("./templates/catalog/details.hbs");
                            this.partial(PARTIAL_PATHS.details);
                        })
                })
                .catch(auth.handleError);
        }

        function postCreate(context) {

            let teamName = context.params.name;
            let teamComment = context.params.comment;

            teamsService.createTeam(teamName, teamComment)
                .then(function (teamData) {
                    teamsService.joinTeam(teamData._id)
                        .then(function (userData) {
                            auth.saveSession(userData);
                            auth.showInfo("Team successfully created!");
                            context.params.id = ":" + teamData._id;
                            getDetails(context);
                        })
                        .catch(auth.handleError);
                })
                .catch(auth.handleError);
        }

        function getCreate(context) {

            // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            // context.username = sessionStorage.getItem("username");
            context = getContextData(context);

            // context.loadPartials({
            //     header: "./templates/common/header.hbs",
            //     footer: "./templates/common/footer.hbs",
            //     createForm: "./templates/create/createForm.hbs"
            // })
            context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer,
                PARTIAL.createForm))
                .then(function () {
                    // this.partial("./templates/create/createPage.hbs");
                    this.partial(PARTIAL_PATHS.createPage);
                });
        }

        function getCatalog(context) {

            // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            // context.username = sessionStorage.getItem("username");
            context = getContextData(context);

            teamsService.loadTeams()
                .then(function (teams) {
                    context.teams = teams;
                    // context.hasNoTeam = ["null", "undefined", ""]
                    //     .includes(sessionStorage.getItem("teamId"));

                    // context.loadPartials({
                    //     header: "./templates/common/header.hbs",
                    //     footer: "./templates/common/footer.hbs",
                    //     team: "./templates/catalog/team.hbs"
                    // })
                    context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer,
                        PARTIAL.team))
                        .then(function () {
                            // this.partial("./templates/catalog/teamCatalog.hbs");
                            this.partial(PARTIAL_PATHS.teamCatalog);
                        });
                });
        }

        function postRegister(context) {

            let user = context.params.username;
            let pass = context.params.password;
            let confirmPass = context.params.repeatPassword;

            if (pass !== confirmPass) {
                auth.showError("Passwords does not match!")
            } else {
                auth.register(user, pass)
                    .then(function (userData) {
                        auth.saveSession(userData);
                        auth.showInfo("Successfully registered!");
                        getHome(context);
                    }).catch(auth.handleError);
            }
        }

        function getRegister(context) {

            // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            // context.username = sessionStorage.getItem("username");
            context = getContextData(context);

            // context.loadPartials({
            //     header: "./templates/common/header.hbs",
            //     footer: "./templates/common/footer.hbs",
            //     registerForm: "./templates/register/registerForm.hbs"
            // })
            context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer,
                PARTIAL.registerForm))
                .then(function () {
                    // this.partial("./templates/register/registerPage.hbs");
                    this.partial(PARTIAL_PATHS.registerPage);
                });
        }

        function getLogout(context) {

            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showInfo("Successfully logged out!");
                    getHome(context);
                }).catch(auth.handleError);
        }

        function postLogin(context) {

            let user = context.params.username;
            let pass = context.params.password;

            auth.login(user, pass)
                .then(function (userData) {
                    auth.saveSession(userData);
                    auth.showInfo("Successfully logged in!");
                    getHome(context);
                }).catch(auth.handleError);
        }

        function getLogin(context) {

            // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            // context.username = sessionStorage.getItem("username");
            context = getContextData(context);

            // context.loadPartials({
            //     header: "./templates/common/header.hbs",
            //     footer: "./templates/common/footer.hbs",
            //     loginForm: "./templates/login/loginForm.hbs"
            // })
            context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer,
                PARTIAL.loginForm))
                .then(function () {
                    // this.partial("./templates/login/loginPage.hbs");
                    this.partial(PARTIAL_PATHS.loginPage);
                });
        }

        function getAbout(context) {

            // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            // context.username = sessionStorage.getItem("username");
            context = getContextData(context);

            // context.loadPartials({
            //     header: "./templates/common/header.hbs",
            //     footer: "./templates/common/footer.hbs"
            // })
            context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer))
                .then(function () {
                    // this.partial("./templates/about/about.hbs");
                    this.partial(PARTIAL_PATHS.about);
                });
        }

        function getHome(context) {

            // context.loggedIn = sessionStorage.getItem("authtoken") !== null;
            // context.username = sessionStorage.getItem("username");
            context = getContextData(context);

            // context.loadPartials({
            //     header: "./templates/common/header.hbs",
            //     footer: "./templates/common/footer.hbs"
            // })
            context.loadPartials(partialObjLoader(PARTIAL.header, PARTIAL.footer))
                .then(function () {
                    // this.partial("./templates/home/home.hbs");
                    this.partial(PARTIAL_PATHS.home);
                });
        }

        function getContextData(context) {

            let contextData = {
                loggedIn: sessionStorage.getItem("authtoken") !== null,
                username: sessionStorage.getItem("username"),
                hasNoTeam: ["null", "undefined", ""]
                    .includes(sessionStorage.getItem("teamId"))
            };

            for (let property in contextData) {
                context[property] = contextData[property];
            }

            return context;
        }

        function partialObjLoader() {

            let partialsObj = {};

            for (let arg of arguments) {
                partialsObj[arg] = PARTIAL_PATHS[arg];
            }

            return partialsObj;
        }
    });

    app.run();
});