/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var View = function (model) {
    this.model = model;
    this.toolbar = $(".toolbar-shadow");
    this.leftPanel = $(".left-sidebar");
    this.leftMenu = $(".left-toolbar > .btn-group > button.btn");
    this.rightPanel = $(".right-sidebar");
    this.navbar = $(".nav-tabs");
    this.navbarMenu = this.navbar.find("li");
    this.navbarState = false;
    this.leftMenuState = false;
    this.menuRecord = false;
    this.menu = $(".toolbar-shadow > .btn-group > button.btn");
    this.console = $("#console");
    this.summary = $("#summary");
    this.description = $("#description");
    this.testView = $("#testViewSheet");
    this.content = $("#content");
    this.context = new Array();
    this.context.push(this.description);
    this.context.push(this.console);
    this.context.push(this.summary);
    this.initMenu();
    this.initLeftMenu();
    this.initNavbar();
    this.renderContext("console");

};

View.prototype.getTestItem = function () {
    var item = $("#test-item");
    return item;
};

View.prototype.getGroupItem = function () {
    var item = $("#testGroup-item");
    return item;
};

View.prototype.initMenu = function () {
    this.toolbar.find("#reference").prop('disabled', true);
    this.toolbar.find("#copy").prop('disabled', true);
    this.content.find(".cons-record").css({display: "none"});
};

View.prototype.initLeftMenu = function () {
    if(this.leftMenuState === false)
    this.leftPanel.find("#start").prop('disabled', true);
    else{
    this.leftPanel.find("#start").prop('disabled', false);
    }
};

View.prototype.initToolbar = function (identification) {
    this.navbarMenu.each(function (index, item) {
        $(item).removeClass("active");
    });
};

View.prototype.initNavbar = function () {
    if (this.navbarState === false) {
        this.navbar.find("#nav-console").addClass("active");
        this.navbar.find("#nav-description").css({display:"none"});
        this.navbar.find("#nav-summary").css({display:"none"});
    } else {
        this.navbar.find("#nav-description").css({display:"inline-block"});
        this.navbar.find("#nav-summary").css({display:"inline-block"});
    }
};

View.prototype.initMenuRecord = function () {
    if (this.menuRecord === false) {
        this.toolbar.find("#reference").prop("disabled", true);
        this.toolbar.find("#copy").prop("disabled", true);
    } else {
        this.toolbar.find("#reference").prop("disabled", false);
        this.toolbar.find("#copy").prop("disabled", false);
    }
};

View.prototype.insertTestSheet = function () {
    this.leftPanel.find("#createS").prop("disabled", true);
    this.leftPanel.find("#createG").prop("disabled", true);
    var form = $("<div></div>").css({display: "block"});
    form.attr({id: "test-item"});
    var input = $('<input/>').attr({type: 'text', class: "form-check-input", id: "actual-test-input"});
    var button = $('<button></button>').attr({type: 'text', class: "btn-xs", id: "actual-test-button"});
    var span = $("<span><span>").attr({class: "glyphicon glyphicon-floppy-disk"});
    var error = $("<div></div>").css({display: "none"});
    error.attr("id", "actual-test-error");
    button.css({display: "inline-block"});
    form.append(input);
    button.append(span);
    form.append(button);
    form.prepend(error);
    form.appendTo('#testSheet');
};

View.prototype.insertGroupSheet = function ()
{

    this.leftPanel.find("#createG").prop("disabled", true);
    this.leftPanel.find("#createS").prop("disabled", true);
    var form = $("<div></div>").css({display: "block"});
    form.attr({id: "testGroup-item"});
    var input = $('<input/>').attr({type: 'text', class: "form-check-input", id: "actual-testGroup-input"});
    var button = $('<button></button>').attr({type: 'text', class: "btn-xs", id: "actual-testGroup-button"});
    var span = $("<span><span>").attr({class: "glyphicon glyphicon glyphicon-tasks"});
    var error = $("<div></div>").css({display: "none"});
    error.attr("id", "actual-testGroup-error");
    button.css({display: "inline-block"});
    form.append(input);
    button.append(span);
    form.append(button);
    form.prepend(error);
    form.appendTo('#testSheet');
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

View.prototype.renderPlayError = function () {
    var error = $("<div></div>").css({display: "none"});
    error.attr("id", "play-error");
    error.text("Not checked tests or test group!");
    error.css({display: "block"});
    error.appendTo('#testSheet');  
};

View.prototype.removePlayError = function () {
    $("#testSheet").find("#play-error").remove();
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


View.prototype.activeScenario = function (id) {
    this.testView.find(".list-group-item").each(function (index, elem) {
        $(elem).removeClass("active");
    });
    this.testView.find(".test-item[id =" + id + "]").addClass("active");
    this.navbarState = true;
    this.menuRecord = true;
    this.leftMenuState = true;
    this.console.find(".cons-record").css({display: "block"});
    this.console.find(".cons-edit").css({display: "block"});
    this.initMenuRecord();
    this.initNavbar();
    this.renderContent();
    this.initLeftMenu();
};

View.prototype.activeScenarioFromGroup = function (id) {
    this.testView.find(".list-group-item").each(function (index, elem) {
        $(elem).removeClass("active");
    });
    this.testView.find(".scenareGroup-item-test[id =" + id + "]").addClass("active");
    this.navbarState = true;
    this.menuRecord = true;
    this.leftMenuState = true;
    this.console.find(".cons-record").css({display: "block"});
    this.console.find(".cons-edit").css({display: "block"});
    this.initMenuRecord();
    this.initNavbar();
    this.renderContent();
    this.initLeftMenu();
};

View.prototype.activeGroup = function (id) {
    this.testView.find(".list-group").each(function (index, elem) {
        $(elem).removeClass("active");
    });
    this.testView.find(".scenareGroup-item[id =" + id + "]").addClass("active");
    this.navbarState = true;
    this.menuRecord = false;
    this.console.find(".cons-record").css({display: "none"});
    this.console.find(".cons-edit").css({display: "block"});
    this.initMenuRecord();
    this.initNavbar();
    this.renderContent();
    this.initLeftMenu();
};

View.prototype.renderScenarios = function () {
    this.navbarState = true;
    var scenarios = this.model.loadScenarios();
    console.log(scenarios);
    var list = $("<ul></ul>").attr({class: "list-group"});
    scenarios.forEach(function (item) {
        if (item instanceof window.ScenareGroup) {
            var Grouplist = $("<li></li>").attr({class: "list-group-item scenareGroup-item", id: item.id});
            var label = $("<label></label>").attr({class: "form-check-label"});
            var _input = $('<input/>').attr({type: 'checkbox', class: "form-check-input check-group",id: "check-" + item.id});
            label.text(item.name);
            label.prepend(_input);
            Grouplist.append(label);
            var _Grouplist = $("<ul></ul>").attr({class: "list-group scenareGroup-list"});
            item.scenarios.forEach(function (scenario) {
                var _item = $("<li></li>").attr({class: "list-group-item scenareGroup-item-test", id: scenario.id});
                var _label = $("<label></label>").attr({class: "form-check-label"});
                var input = $('<input/>').attr({type: 'checkbox', class: "form-check-input check-group-test",id: "check-" + scenario.id});
                _label.text(scenario.name);
                _label.prepend(input);
                _item.append(_label);
                _Grouplist.append(_item);
            });
            Grouplist.append(_Grouplist);
            list.append(Grouplist);
        } else if (item instanceof window.Scenare)
        {
            var ScItem = $("<li></li>").attr({class: "list-group-item test-item", id: item.id});
            var ScInput = $('<input/>').attr({type: 'checkbox', class: "form-check-input check-test", id: "check-" + item.id});
            var ScLabel = $("<label></label>").attr({class: "form-check-label"});
            ScLabel.text(item.name); 
            ScLabel.prepend(ScInput);
            ScItem.append(ScLabel);
            list.append(ScItem);
        }
    }.bind(this));
    this.testView.empty();
    this.testView.append(list);
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
        } else if (this.model.actualItem instanceof window.ScenareGroup) {
            if (identification === "summary")
                this.renderSummaryTestGroup();
            else if (identification === "description")
                this.renderDescriptionTestGroup();
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
    var title = $("<h5></h5>").attr({class: "test-comment-title"});
    title.text("Description Of " + this.model.actualItem.name);
    this.description.append(title);
    var textBox = $("<textarea></textarea>").attr({class: "form-control", rows: "5", id: "test-comment-" + this.model.actualItem.id});
    textBox.text(this.model.actualItem.comment);
    this.description.append(textBox);
    var button = $("<button></button>").attr({type: 'text', class: "btn-xs btn-info btn-test-comment", id: "comment-button-" + this.model.actualItem.id});
    button.text("Save");
    this.description.append(textBox);
    this.description.append(button);
    console.log(this.description);
};

View.prototype.renderDescriptionTestGroup = function () {
    this.description.empty();
    var title = $("<h4></h4>").attr({class: "group-comment-title"});
    title.text("Description Of " + this.model.actualItem.name);
    this.description.append(title);
    var textBox = $("<textarea></textarea>").attr({class: "form-control", rows: "5", id: "group-comment-" + this.model.actualItem.id});
    textBox.text(this.model.actualItem.comment);
    this.description.append(textBox);
    var button = $("<button></button>").attr({type: 'text', class: "btn-xs btn-info btn-group-comment", id: "comment-button-" + this.model.actualItem.id});
    button.text("Save");
    this.description.append(textBox);
    this.description.append(button);
    this.model.actualItem.scenarios.forEach(function (scenario) { 
        var _title = $("<h5></h5>").attr({class: "test-comment-title"});
        _title.text("Description Of " + scenario.name);
        this.description.append(_title);
        var _textBox = $("<textarea></textarea>").attr({class: "form-control", rows: "5", id: "test-comment-" + scenario.id});
        _textBox.text(scenario.comment);
        this.description.append(_textBox);
        var _button = $("<button></button>").attr({type: 'text', class: "btn-xs btn-info btn-test-comment", id: "comment-button-" + scenario.id});
        _button.text("Save");
        this.description.append(_textBox);
        this.description.append(_button);
    }.bind(this));
};

View.prototype.renderSummaryTestGroup = function () {
    this.summary.empty();
    this.model.actualItem.scenarios.forEach(function (scenario) {
        var title = $("<h5></h5>").attr({class: "test-title"});
        title.text(scenario.name);
        this.summary.append(title);
        var table = $("<table></table>").attr({class: "table"});
        var thead = $("<thead></thead>").attr({class: "thead-inverse"});
        var thRow = $("<tr></tr>");
        var thCell_I = $("<td></td>");
        var thCell_II = $("<td></td>");
        thCell_I.text("Line Number");
        thCell_II.text("Command");
        thRow.append(thCell_I);
        thRow.append(thCell_II);
        thead.append(thRow);
        table.append(thead);
        var tbody = $("<tbody></tbody>");
        scenario.commands.forEach(function (cmd) {
            console.log(cmd);
            var cmdRow = $("<tr></tr>");
            var cmdCell_I = $("<td></td>");
            var cmdCell_II = $("<td></td>");
            cmdCell_I.text(cmd.line);
            cmdCell_II.text(cmd.command);
            cmdRow.append(cmdCell_I);
            cmdRow.append(cmdCell_II);
            tbody.append(cmdRow);
        }.bind(this));
        table.append(tbody);
        this.summary.append(table);
    }.bind(this));
};

View.prototype.renderSummaryTest = function () {
    this.summary.empty();
    var title = $("<h5></h5>").attr({class: "test-title"});
    title.text(this.model.actualItem.name);
    this.summary.append(title);
    var table = $("<table></table>").attr({class: "table"});
    var thead = $("<thead></thead>").attr({class: "thead-inverse"});
    var thRow = $("<tr></tr>");
    var thCell_I = $("<td></td>");
    var thCell_II = $("<td></td>");
    thCell_I.text("Line Number");
    thCell_II.text("Command");
    thRow.append(thCell_I);
    thRow.append(thCell_II);
    thead.append(thRow);
    table.append(thead);
    var tbody = $("<tbody></tbody>");
    this.model.actualItem.commands.forEach(function (cmd) {
        console.log(cmd);
        var cmdRow = $("<tr></tr>");
        var cmdCell_I = $("<td></td>");
        var cmdCell_II = $("<td></td>");
        cmdCell_I.text(cmd.line);
        cmdCell_II.text(cmd.command);
        cmdRow.append(cmdCell_I);
        cmdRow.append(cmdCell_II);
        tbody.append(cmdRow);
    }.bind(this));
    table.append(tbody);
    this.summary.append(table);
};

