var model = new window.Model();
var controller;
var view;

$(document).ready(function (event) {
    view = new window.View(model);
    controller = new window.Controller(model, view, "console");
});











