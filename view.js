/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var View = function(model){
    this.model = model;
    this.toolbar = $(".toolbar-shadow");
    this.leftPanel = $(".left-sidebar"); 
    this.rightPanel = $(".right-sidebar");
    this.navbar =  $(".nav-tabs");
    this.menu = $(".btn-group > button.btn");
    this.console = $("#console");
    this.description = $("#description");
    this.context = new Array();
    this.context.push(this.description);
    this.context.push(this.console);
    };

View.prototype.renderContext = function(identification){
    this.context.forEach(function(item){
        if(item.attr("id")=== identification){           
        }
    });
};


