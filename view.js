/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var View = function (model) {
    this.model = model;
    this.tree;
    this.toolbar = $(".toolbar-shadow");
    this.menu = $(".toolbar-shadow > .btn-group > button.btn");

    this.recordButton = $(".toolbar-shadow > #record");

    this.leftPanel = $(".left-sidebar");
    this.leftMenu = $(".left-toolbar > .btn-group > button.btn");

    this.navbar = $(".nav-tabs");
    this.navbarMenu = this.navbar.find("li");

    this.rightPanel = $(".right-sidebar");

    this.leftMenuState = false;
    this.navbarState = false;

    this.content = $("#content");

    this.edit = $("#edit");
    this.summary = $("#summary");
    this.description = $("#description");

    this.testView = $("#testViewSheet");
    this.testSheetRender = $("#sheet-render");
    this.testProceedRender = $("#proceed-render");
    this.testCountRender = $("#count-render");
    this.testSelectionRender = $("#selection-render");
    this.lastProceedRender = $("#last-proceed-render");

    this.context = new Array();
    this.context.push(this.description);
    this.context.push(this.edit);
    this.context.push(this.summary);



    this.initLeftMenu();
    this.renderContext("edit");
    this.navbar.find("#nav-edit").addClass("active");
    this.toolbar.find("#record").prop('disabled', true);
    this.recordButton.css({opacity: 0.5});

    this.constructElement = function (tagName, atributes, style) {
        var element = $("<" + tagName + "></" + tagName + ">");
        element.attr(atributes);
        element.css(style);
        return element;
    };

    this.constructUnarElement = function (tagName, atributes, style) {
        var element = $("<" + tagName + "/>");
        element.attr(atributes);
        element.css(style);
        return element;
    };


};

View.prototype.getTestItem = function () {
    var item = $("#test-item");
    return item;
};

View.prototype.getGroupItem = function () {
    var item = $("#testGroup-item");
    return item;
};



View.prototype.initLeftMenu = function () {
    if (this.leftMenuState === false) {
        this.leftPanel.find("#play").prop('disabled', true);
        this.leftPanel.find("#remove").prop('disabled', true);
    } else {
        this.leftPanel.find("#play").prop('disabled', false);
        this.leftPanel.find("#remove").prop('disabled', false);
    }
};

View.prototype.initToolbar = function (identification) {
    this.navbarMenu.each(function (index, item) {
        $(item).removeClass("active");
    });
};

View.prototype.initNavbar = function () {
    if (this.navbarState === false) {
        this.navbar.find("#nav-description").css({display: "none"});
        this.navbar.find("#nav-summary").css({display: "none"});
    } else {
        this.navbar.find("#nav-description").css({display: "inline-block"});
        this.navbar.find("#nav-summary").css({display: "inline-block"});
    }
};




View.prototype.insertTestSheet = function () {
    this.leftPanel.find("#createS").prop("disabled", true);
    this.leftPanel.find("#createG").prop("disabled", true);
    var form = $("<div></div>").css({display: "block"});
    form.attr({id: "test-item"});
    var input = this.constructUnarElement("input", {type: 'text', class: "form-check-input", id: "actual-test-input", placeholder: "Name of test"}, {});
    var button = this.constructElement("button", {type: 'text', class: "btn-xs", id: "actual-test-button", title: "Save test"}, {display: "inline-block"});
    var span = this.constructElement("span", {class: "glyphicon glyphicon-floppy-disk"}, {});
    var ReturnButton = this.constructElement("button", {type: 'text', class: "btn-xs", id: "actual-test-return-button", title: "Return back"}, {});
    var ReturnSpan = this.constructElement("span", {class: "glyphicon glyphicon-arrow-left"}, {});
    var error = this.constructElement("div", {id: "actual-test-error"}, {visibillity: "hidden"});
    form.append(input);
    button.append(span);
    form.append(button);
    ReturnButton.append(ReturnSpan);
    form.append(ReturnButton);
    form.prepend(error);
    form.appendTo("#testSheet");
};

View.prototype.insertGroupSheet = function ()
{

    this.leftPanel.find("#createG").prop("disabled", true);
    this.leftPanel.find("#createS").prop("disabled", true);
    var form = this.constructElement("div", {id: "testGroup-item"}, {display: "block"});
    var input = this.constructUnarElement("input", {type: "text", class: "form-check-input", id: "actual-testGroup-input", placeholder: "Name of Group test"}, {});
    var button = this.constructElement("button", {type: "text", class: "btn-xs", id: "actual-testGroup-button", title: "Save test group"}, {display: "inline-block"});
    var span = this.constructElement("span", {class: "glyphicon glyphicon glyphicon-tasks"}, {});
    var ReturnButton = this.constructElement("button", {type: "text", class: "btn-xs", id: "actual-group-return-button", title: "Return back"}, {});
    var ReturnSpan = this.constructElement("span", {class: "glyphicon glyphicon-arrow-left"}, {});
    var error = this.constructElement("div", {id: "actual-testGroup-error"}, {visibillity: "hidden"});
    form.append(input);
    button.append(span);
    form.append(button);
    ReturnButton.append(ReturnSpan);
    form.append(ReturnButton);
    form.prepend(error);
    form.appendTo("#testSheet");
};


View.prototype.renderItemTestError = function () {
    var item = $("#actual-test-error");
    item.text("Name of test is empty !");
    item.css({display: "block"});
};

View.prototype.renderItemGroupError = function () {
    var item = $("#actual-testGroup-error");
    item.text("Name of test group is empty !");
    item.css({display: "block"});
};

View.prototype.removeItemTest = function () {
    $("#test-item").remove();
    this.leftPanel.find("#createS").prop("disabled", false);
    this.leftPanel.find("#createG").prop("disabled", false);
};

View.prototype.removeItemGroup = function () {
    $("#testGroup-item").remove();
    this.leftPanel.find("#createG").prop("disabled", false);
    this.leftPanel.find("#createS").prop("disabled", false);
};


View.prototype.activeScenario = function () {
    this.recordButton.prop("disabled", true);
    var id = this.model.actualItem;
    this.testSheetRender.find(".list-item").each(function (index, elem) {
        $(elem).removeClass("active");
    });
    this.testSheetRender.find(".test-item[id =" + this.model.actualItem.id + "]").addClass("active");

    this.navbarState = true;
    this.leftMenuState = true;
    this.toolbar.find("#record").prop('disabled', false);

    this.initNavbar();
    this.renderContent();
    this.initLeftMenu();
};

View.prototype.activeScenarioFromGroup = function () {
    this.recordButton.prop("disabled", true);
    this.testSheetRender.find(".list-item").each(function (index, elem) {
        $(elem).removeClass("active");
    });
    var span = this.testSheetRender.find(".test-group-item[id =" + this.model.actualItem.id + "]").addClass("active");
    var icon = this.testSheetRender.find(".test-group-item[id =" + this.model.actualItem.id + "]").parent().parent().parent().find(".glyphicon").first();
    icon.removeClass("glyphicon-folder-close");
    icon.addClass("glyphicon-folder-open");
    var list = span.parent().parent();
    list.css({display: "block"});

    this.navbarState = true;
    this.leftMenuState = true;
    this.toolbar.find("#record").prop('disabled', false);

    this.initNavbar();
    this.initLeftMenu();
    this.renderContent();
};

View.prototype.activeGroup = function () {
    this.recordButton.prop("disabled", false);
    this.testSheetRender.find(".list-item").each(function (index, elem) {
        $(elem).removeClass("active");
    });
    this.testSheetRender.find(".test-group[id =" + this.model.actualItem.id + "]").addClass("active");

    this.navbarState = true;
    this.leftMenuState = true;
    this.toolbar.find("#record").prop('disabled', true);
    var icon = this.toolbar.find("#record").find("span").first();
    if (icon.hasClass("icon-icon_OnRecord")) {
        icon.removeClass("icon-icon_OnRecord");
        icon.addClass("icon-icon_OffRecord");
    }
    this.initNavbar();
    this.initLeftMenu();
    this.renderContent();
};

View.prototype.getItemScenario = function (scenario) {
    var item = this.constructElement("li", {}, {});
    var span = this.constructElement("span", {class: "list-item test-item", id: scenario.id}, {});
    var spanIcon = this.constructElement("span", {class: "span-icon"}, {});
    var spanName = this.constructElement("span", {class: "span-name", id: "span-" + scenario.id}, {});
    spanIcon.append(this.constructElement("span", {class: "glyphicon glyphicon-file", id: "span-" + scenario.id}, {}));
    spanName.text(scenario.name);
    span.append(spanIcon);
    span.append(spanName);
    item.append(span);
    return item;

    return item;
};

View.prototype.getItemGroup = function (group) {
    var item = this.constructElement("li", {}, {});
    var span = this.constructElement("span", {class: "list-item test-group", id: group.id}, {});
    var spanIcon = this.constructElement("span", {class: "span-icon"}, {});
    var spanName = this.constructElement("span", {class: "span-name", id: "span-" + group.id}, {});
    var icon = this.testSheetRender.find(".test-group[id = " + group.id + "]").find(".glyphicon");
    if (icon.hasClass("glyphicon-folder-close")) {
        spanIcon.append(this.constructElement("span", {class: "glyphicon glyphicon-folder-close"}, {}));
    } else {
        spanIcon.append(this.constructElement("span", {class: "glyphicon glyphicon-folder-open"}, {}));
    }
    spanName.text(group.name);
    span.append(spanIcon);
    span.append(spanName);
    item.append(span);
    return item;
};

View.prototype.getItemTestOfGroup = function (scenario) {
    var item = this.constructElement("li", {}, {});
    var span = this.constructElement("span", {class: "list-item test-group-item", id: scenario.id}, {});
    var spanIcon = this.constructElement("span", {class: "span-icon"}, {});
    var spanName = this.constructElement("span", {class: "span-name", id: "span-" + scenario.id}, {});
    spanIcon.append(this.constructElement("span", {class: "glyphicon glyphicon-file"}, {}));
    spanName.text(scenario.name);
    span.append(spanIcon);
    span.append(spanName);
    item.append(span);
    return item;
};


View.prototype.insertCheckTest = function (scenario) {
    var div = this.constructElement("div", {class: "check-div check-test", id: "checkbox-" + scenario.id}, {});
    var input = this.constructUnarElement("input", {type: "checkbox", class: "form-check-input"}, {});
    div.append(input);
    this.testSelectionRender.append(div);
};



View.prototype.insertProceedTest = function (scenario) {
    var div = this.constructElement("div", {class: "proceed-div group-proceed-div", id: "proceed-" + scenario.id}, {});
    var span = this.constructElement("span", {class: "proceed-div-span"}, {});
    if (scenario.runs.length !== 0 && scenario.runs[scenario.runs.length - 1].result === true)
        span.addClass("procced");
    if (scenario.runs.length !== 0 && scenario.runs[scenario.runs.length - 1].result === false)
        span.addClass("unprocced");
    if (scenario.runs.length === 0)
        span.addClass("nonprocced");
    div.append(span);
    this.testProceedRender.append(div);
    div.append(span);
    this.testProceedRender.append(div);
};

View.prototype.insertCountTest = function (scenario) {
    var div = this.constructElement("div", {class: "count-div test-count-div", id: "count-" + scenario.id}, {});
    var span = this.constructElement("span", {class: "count-div-span"}, {});
    span.text("-");
    div.append(span);
    this.testCountRender.append(div);
};


View.prototype.insertCheckTestOfGroup = function (scenario) {
    var div = this.constructElement("div", {class: "check-div group-item-check", id: "checkbox-" + scenario.id}, {});
    var input = this.constructUnarElement("input", {type: 'checkbox', class: "form-check-input"}, {});
    div.append(input);
    this.testSelectionRender.append(div);
};



View.prototype.insertProceedTestOfGroup = function (scenario) {
    var div = this.constructElement("div", {class: "proceed-div group-item-proceed-div", id: "proceed-" + scenario.id}, {});
    var span = this.constructElement("span", {class: "proceed-div-span"}, {});
    div.append(span);
    if (scenario.runs.length !== 0 && scenario.runs[scenario.runs.length - 1].result === true)
        span.addClass("procced");
    if (scenario.runs.length !== 0 && scenario.runs[scenario.runs.length - 1].result === false)
        span.addClass("unprocced");
    if (scenario.runs.length === 0)
        span.addClass("nonprocced");
    div.append(span);
    this.testProceedRender.append(div);
};

View.prototype.insertCountTestOfGroup = function (scenario) {
    var div = this.constructElement("div", {class: "count-div group-item-count-div", id: "count-" + scenario.id}, {});
    var span = this.constructElement("span", {class: "count-div-span"}, {});
    span.text("-");
    div.append(span);
    this.testCountRender.append(div);
};




View.prototype.insertCheckGroup = function (group) {
    var div = this.constructElement("div", {class: "check-div check-group", id: "checkbox-" + group.id}, {});
    var input = this.constructUnarElement("input", {type: "checkbox", class: "form-check-input"}, {});
    div.append(input);
    this.testSelectionRender.append(div);
};



View.prototype.insertProceedGroup = function (group, passed) {
    var div = this.constructElement("div", {class: "proceed-div group-proceed-div", id: "proceed-" + group.id}, {});
    var span = this.constructElement("span", {class: "proceed-div-span"}, {});
    span.text(passed + "/" + group.scenarios.length);
    div.append(span);
    this.testProceedRender.append(div);
};

View.prototype.insertCountGroup = function (group) {
    var div = this.constructElement("div", {class: "count-div group-count-div", id: "count-" + group.id}, {});
    var span = this.constructElement("span", {class: "count-div-span"}, {});
    span.text(group.scenarios.length);
    div.append(span);
    this.testCountRender.append(div);
};

View.prototype.renderScenarios = function () {

    this.testSheetRender.empty();
    this.testProceedRender.empty();
    this.testCountRender.empty();
    this.testSelectionRender.empty();
    this.navbarState = true;

    var scenarios = this.model.loadScenarios();
    var list = this.constructElement("ul", {class: "list"}, {});

    scenarios.forEach(function (item) {
        if (item instanceof window.ScenareGroup) {
            var passed = 0;
            item.scenarios.forEach(function (scenario) {
                if (scenario.runs.length !== 0 && scenario.runs[scenario.runs.length - 1].result === true)
                    passed++;
            }.bind(this));

            this.insertProceedGroup(item, passed);
            this.insertCheckGroup(item);
            this.insertCountGroup(item);

            var Grouplist = this.getItemGroup(item);

            var _Grouplist = this.constructElement("ul",{class: "list scenareGroup-list"},{});
            if (Grouplist.find(".glyphicon").hasClass("glyphicon-folder-close")) {
                _Grouplist.css({display: "none"});
            } else {
                _Grouplist.css({display: "block"});
            }

            item.scenarios.forEach(function (scenario) {

                this.insertProceedTestOfGroup(scenario);
                this.insertCheckTestOfGroup(scenario);
                this.insertCountTestOfGroup(scenario);

                var _item = this.getItemTestOfGroup(scenario);
                _Grouplist.append(_item);

            }.bind(this));

            Grouplist.append(_Grouplist);
            list.append(Grouplist);

        } else if (item instanceof window.Scenare)
        {
            this.insertProceedTest(item);
            this.insertCheckTest(item);
            this.insertCountTest(item);

            var Test = this.getItemScenario(item);
            list.append(Test);
        }
    }.bind(this));
    this.testSheetRender.append(list);
};

View.prototype.renderOnRecord = function () {
    this.recordButton.css({opacity: 1});

    this.recordButton.attr({title: "Recording On"});
};

View.prototype.renderOffRecord = function () {
    this.recordButton.css({opacity: 0.5});
    this.recordButton.attr({title: "Recording Off"});
};


View.prototype.renderContent = function () {
    var item = this.navbar.find(".nav-item.active");
    var IdItem = item.attr("id");
    IdItem = IdItem.replace("nav-", "");
    this.renderContext(IdItem);
};


View.prototype.renderContext = function (identification) {
    this.context.forEach(function (item) {
        if (this.model.actualItem instanceof window.Scenare) {
            if (identification === "summary")
                this.renderSummaryTest();
            else if (identification === "description")
                this.renderDescriptionTest();
            else if (identification === "edit") {
                this.edit.find(".edit-editor").css({display: "block"});
            }
        } else if (this.model.actualItem instanceof window.ScenareGroup) {
            if (identification === "summary")
                this.renderSummaryTestGroup();
            else if (identification === "description")
                this.renderDescriptionTestGroup();
            else if (identification === "edit") {
                this.edit.find(".edit-editor").css({display: "none"});
            }
        }
        if (item.attr("id") === identification) {
            item.css("display", "block");
        } else {
            item.css("display", "none");
        }
    }.bind(this));
};

View.prototype.clearNavBarMenu = function (identification) {
    this.navbarMenu.each(function (index, item) {
        $(item).removeClass("active");
    });
};

View.prototype.renderDescriptionTest = function () {
    this.description.empty();
    var div = this.constructElement("div", {class: "test-comment"}, {});
    var title = this.constructElement("h5", {class: "test-comment-title"}, {});
    title.text("Description Of " + this.model.actualItem.name);
    var textBox = this.constructElement("textarea", {class: "form-control", rows: "5", id: "test-comment-" + this.model.actualItem.id}, {});
    textBox.text(this.model.actualItem.comment);
    this.description.append(textBox);
    var button = this.constructElement("button", {type: 'text', class: "btn-xs btn-info btn-test-comment", id: "comment-button-" + this.model.actualItem.id}, {});
    button.text("Save");
    div.append(title);
    div.append(textBox);
    div.append(button);
    this.description.append(div);
};

View.prototype.renderDescriptionTestGroup = function () {
    this.description.empty();
    var div = this.constructElement("div", {class: "group-comment"}, {});
    var title = this.constructElement("h4", {class: "group-comment-title"},{});
    title.text("Description Of " + this.model.actualItem.name);
    this.description.append(title);
    var textBox = this.constructElement("textarea", {class: "form-control", rows: "5", id: "group-comment-" + this.model.actualItem.id}, {});
    textBox.text(this.model.actualItem.comment);
    this.description.append(textBox);
    var button = this.constructElement("button", {type: 'text', class: "btn-xs btn-info btn-group-comment", id: "comment-button-" + this.model.actualItem.id}, {});
    button.text("Save");
    div.append(title);
    div.append(textBox);
    div.append(button);
    this.description.append(div);
    this.model.actualItem.scenarios.forEach(function (scenario) {
        var _div = this.constructElement("div", {class: "group-test-comment"}, {});
        var _title = this.constructElement("h5", {class: "test-comment-title"}, {});
        _title.text("Description Of " + scenario.name);
        var _textBox = this.constructElement("textarea", {class: "form-control", rows: "5", id: "test-comment-" + scenario.id}, {});
        _textBox.text(scenario.comment);
        var _button = this.constructElement("button", {type: 'text', class: "btn-xs btn-info btn-test-comment", id: "comment-button-" + scenario.id}, {});
        _button.text("Save");
        _div.append(_title);
        _div.append(_textBox);
        _div.append(_button);
        this.description.append(_div);
    }.bind(this));
};


View.prototype.getPanelBody = function (run, panel, body) {
    if (typeof run.error === "undefined") {
        panel.addClass("panel-success");
        run.commands.forEach(function (item) {
            var span = this.constructElement("span", {class: "success-command"}, {});
            span.text(item.command);
            body.append(span);
        }.bind(this));
        panel.append(body);
    } else if (run.error instanceof window.Error) {
        var footer = this.constructElement("div",{class: "panel-footer"}, {});
        panel.addClass("panel-danger");
        run.commands.forEach(function (item) {
            var _span = this.constructElement("span",{},{});
            _span.text(item.commmand);
            if (item.line < run.error.line) {
                _span.attr({class: "exec-command"});
            } else if (item.line === run.error.line) {
                _span.attr({class: "error-command"});
            } else if (item.line > run.error.line) {
                _span.attr({class: "unexec-command"});
            }
            _span.text(item.command);
            body.append(_span);
            footer.text(run.error.error);
        }.bind(this));
        panel.append(body);
        panel.append(footer);
    }
};

View.prototype.renderSummaryTestGroup = function () {
    //vyprázdnění obsahu 
    this.summary.empty();
    //vložení titulku
    var groupTitle = this.constructElement("h2",{class: "group-summary-title"},{});
    groupTitle.text(this.model.actualItem.name);
    this.summary.append(groupTitle);
    this.model.actualItem.scenarios.forEach(function (scenario) {
        var title = this.constructElement("h3",{class: "test-summary-title"},{});
        title.text(scenario.name);
        this.summary.append(title);
        scenario.runs.forEach(function (run, index) {
            var panel = this.constructElement("div",{class: "panel"},{});
            var header = this.constructElement("div",{class: "panel-heading"},{});
            header.text(run.timestamp.format("HH:mm").toString());
            var body = this.constructElement("div",{class: "panel-body"},{});
            panel.append(header);
            this.getPanelBody(run, panel, body);      
            this.summary.append(panel);
        }.bind(this));
    }.bind(this));
};

View.prototype.renderSummaryTest = function () {
    this.summary.empty();
    var title = this.constructElement("h2",{class: "test-summary-title"},{});
    title.text(this.model.actualItem.name);
    this.summary.append(title);
    this.model.actualItem.runs.forEach(function (run, index) {
        var panel = this.constructElement("div",{class: "panel"},{});
        var header = this.constructElement("div",{class: "panel-heading"},{});
        header.text(run.timestamp.format("HH:mm").toString());
        var body = this.constructElement("div",{class: "panel-body"},{});
        panel.append(header);
        this.getPanelBody(run, panel, body);
        this.summary.append(panel);
    }.bind(this));
};

View.prototype.renderTestSummary = function (run, name) {
    var panel = this.constructElement("div",{class: "panel"},{});
    var header = this.constructElement("div",{class: "panel-heading"},{});
    header.text(name);
    var body = this.constructElement("div",{class: "panel-body"},{});
    panel.append(header);
    this.getPanelBody(run, panel, body);
this.lastProceedRender.append(panel);
};

View.prototype.renderTestSummaryFromGroup = function (run, name, groupName) {
    var panel = this.constructElement("div",{class: "panel"},{});
    var header = this.constructElement("div",{class: "panel-heading"},{});
    var strong = this.constructElement("strong",{},{});
    strong.text(groupName + " / ");
    header.text(name);
    header.prepend(strong);
    var body = this.constructElement("div",{class: "panel-body"},{});
    panel.append(header);
    this.getPanelBody(run, panel, body);
this.lastProceedRender.append(panel);
};