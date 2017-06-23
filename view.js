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
    this.menu = $(".toolbar-shadow > .btn-group > button.btn");
    this.console = $("#console");
    this.summary = $("#summary");
    this.summary_table = $("#summary-table");
    this.description = $("#description");
    this.testView = $("#testViewSheet");
    this.context = new Array();
    this.context.push(this.description);
    this.context.push(this.console);
    this.context.push(this.summary);
    this.initMenu();   
    this.initLeftMenu();
    this.initNavbar();
    this.renderContext("console");
};
 
View.prototype.getTestItem = function (){
    var item = $("#test-item");
    return item;
};

View.prototype.renderContext = function (identification) {
    this.context.forEach(function (item) {
        if(identification === "summary"){
            this.summary_table.empty();
            this.model.actualItem.commands.forEach(
                    function(row){
                        this.renderRow(row.line, row.command);
                    }.bind(this)); 
        }
        else if(identification === "description"){
            this.description.find("comment").text(this.model.actualItem.comment);
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

View.prototype.initToolbar = function (identification) {
    this.navbarMenu.each(function (index, item) {
        $(item).removeClass("active");
    });
};

View.prototype.initNavbar = function () {
    this.navbar.find("#nav-console").addClass("active");
};

View.prototype.insertTestSheet = function () {
    this.leftPanel.find("#createG").prop("disabled", true);
    var form = $("<div></div>").css({display: "inline-block"});
    form.attr({id:"test-item"});
    var input = $('<input/>').attr({type: 'text', class: "form-check-input", id: "actual-input"});
    var button = $('<button></button>').attr({type: 'text', class: "btn-xs", id: "actual-button"});
    var span = $("<span><span>").attr({class:"glyphicon glyphicon-floppy-disk"});
    var error = $("<div></div>").css({display:"none"});
    error.attr("id","actual-error");
    button.css({display: "inline-block"});
    form.append(input);
    button.append(span);
    form.append(button);
    form.append(error);
    form.appendTo('#testSheet');
};

View.prototype.renderItemTestError = function(){
    var item = $("#actual-error");
    item.text("Name ca not be empty");
    item.css({display : "block"});
};

View.prototype.removeItemTest = function () {
    $("#test-item").remove();
    this.leftPanel.find("#createG").prop("disabled", false);
};


View.prototype.initMenu = function () {
    this.toolbar.find("#reference").prop('disabled', true);
    this.toolbar.find("#copy").prop('disabled', true);
};

View.prototype.initLeftMenu = function () {
    this.leftPanel.find("#start").prop('disabled', true);
    this.leftPanel.find("#stop").prop('disabled', true);
};

View.prototype.activeScenario = function(id){
    this.testView.find("#id").addClass("active");
};

View.prototype.renderScenarios = function(){
    var scenarios = this.model.loadScenarios();
    console.log(scenarios);
    var list = $("<ul></ul>").attr({class:"list-group"});
    scenarios.forEach(function (scenario){
        var item = $("<li></li>").attr({class:"list-group-item list-group-item-action", id:scenario.id});
        item.text(scenario.name);
        list.append(item);
    }.bind(this));
    this.testView.empty();
    this.testView.append(list);
};

View.prototype.renderRow = function(line, command){
        var row = $("<tr></tr>");
        var cell_1 = $("<td></td>");
        var cell_2 = $("<td></td>");
        cell_1.text(line);
        cell_2.text(command);
        this.summary_table.append(row);
};


