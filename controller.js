/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Controller = function (model, view, terminal_edit, terminal_rec) {
    this.model = model;
    this.view = view;
    this.record = false;
    this.edit_terminal;
    this.rec_terminal;
    this.LeftMenuBehaviour();
    this.MenuBehaviour();
    this.ContextBehaviour();
    this.TermInitEdit(terminal_edit);
    this.TermInitRec(terminal_rec);
};

Controller.prototype.MenuBehaviour = function () {
    this.view.menu.each(function (index, elem) {
        $(elem).click(function () {
            this.view.menu.each(function (index, elem) {
                $(elem).removeClass("active");
            });
            chrome.devtools.inspectedWindow.eval("window.guitest.clearListeners();");
            var item = $(elem).attr("id");
            $(elem).addClass("active");
            if (item === "reference") {
                this.record = true;
                chrome.devtools.inspectedWindow.eval("window.guitest.setListenerGetObject();");
            } else if (item === "vyber") {
                chrome.devtools.inspectedWindow.eval("window.guitest.setListenerGetObject();");
                this.record = false;
            } else if (item === "offset") {
                chrome.devtools.inspectedWindow.eval("window.guitest.OffsetOnMouseClick();");
                this.record = false;
            }
        }.bind(this));
    }.bind(this));
};


Controller.prototype.LeftMenuBehaviour = function () {
    this.view.leftMenu.each(function (index, element) {
        $(element).click(function () {
            var item = $(element).attr("id");
            console.log(item);
            if (item === "createG") {
                this.view.insertGroupSheet();
                this.testGroupBehaviour();

            } else if (item === "createS") {
                this.view.insertTestSheet();
                this.testItemBehaviour();
            }
        }.bind(this));
    }.bind(this));
};

Controller.prototype.testItemBehaviour = function () {
    var element = this.view.getTestItem();
    var button = $(element).find("#actual-test-button");
    button.click(function () {
        var name = $(element).find("#actual-test-input").val();
        if (name === "")
        {
            this.view.renderItemTestError();
        } else {
            var wasGroup = this.model.actualItem instanceof window.ScenareGroup;
            this.model.InitScenario(name);
            this.view.removeItemTest();
            this.view.renderScenarios();
            if(wasGroup){
                this.view.activeScenarioFromGroup(this.model.idScenare - 1);
            }
            else{
                this.view.activeScenario(this.model.actualItem.id);
            }   
            this.testSheetBehaviour();
             this.ItemPlayBehaviour();
        }
    }.bind(this));
};

Controller.prototype.testGroupBehaviour = function () {
    var element = this.view.getGroupItem();
    var button = $(element).find("#actual-testGroup-button");
    button.click(function () {
        var name = $(element).find("#actual-testGroup-input").val();
        if (name === "")
        {
            this.view.renderItemGroupError();
        } else {
            this.model.InitGroup(name);
            this.view.removeItemGroup();
            this.view.renderScenarios();
            this.view.activeGroup(this.model.actualItem.id);
             this.testSheetBehaviour();
             this.ItemPlayBehaviour();
        }
    }.bind(this));
};

Controller.prototype.ContextBehaviour = function () {
    var elem = this.view.navbarMenu;
    elem.each(function (index, element) {
        $(element).click(function () {
            this.view.clearNavBarMenu();
            $(element).addClass("active");
            this.view.renderContent();
            if($(element).attr("id") === "nav-description"){
                if(this.model.actualItem instanceof window.Scenare){
               
                    this.btnTestCommentBehaviour();
                }
                else if(this.model.actualItem instanceof window.ScenareGroup){
             
                    this.btnTestCommentBehaviour();
                    this.btnGroupCommentBehaviour();
                }
            }
        }.bind(this));
    }.bind(this));
};

Controller.prototype.ItemPlayBehaviour = function(){
    var play = this.view.leftPanel.find("#play");
    var listener = function(){
        var checks = this.view.testView.find(".form-check-input");
        if(checks.length <= 0){
            this.view.renderPlayError();
        }
        else{
            this.view.removePlayError();
        }
    }.bind(this);
    play.unbind("click", listener);
    play.click(listener);
};

Controller.prototype.testSheetBehaviour = function(event){
   var listener = function(event){
                  this.view.testView.find(".list-group-item").each(
                          function(index, elem){
                              $(elem).removeClass("active");
                          }.bind(this));
                  if(this.model.actualItem instanceof window.ScenareGroup){
                      this.model.saveScenareGroup(this.model.actualItem.id);
                  }
                  else if(this.model.actualItem instanceof window.Scenare){
                      this.model.saveScenare(this.model.actualItem.id);
                  }
                  if($(event.target).hasClass("scenareGroup-item")){
                      this.edit_terminal.clear();
                      this.model.loadScenareGroup(parseInt($(event.target).attr("id")));
                      this.view.activeGroup(parseInt($(event.target).attr("id")));                      
                      
                  }
                  else if($(event.target).hasClass("test-item")){
                      this.edit_terminal.clear();
                      this.rec_terminal.clear();
                      this.model.loadScenare(parseInt($(event.target).attr("id")));
                      this.view.activeScenario(parseInt($(event.target).attr("id")));    
                  }
                  else if($(event.target).hasClass("scenareGroup-item-test")){
                      this.edit_terminal.clear();
                      this.rec_terminal.clear();
                      var parent = $(event.target).parent().parent().attr("id");
                      console.log(parent);
                      this.model.loadScenareFromGroup(parseInt($(event.target).attr("id")), parseInt(parent));
                      this.view.activeScenarioFromGroup(parseInt($(event.target).attr("id")));   
                  }
                if(this.model.actualItem instanceof window.Scenare && this.view.navbar.find(".active").attr("id")=== "nav-description"){
               
                    this.btnTestCommentBehaviour();
                }
                else if(this.model.actualItem instanceof window.ScenareGroup && this.view.navbar.find(".active").attr("id")=== "nav-description"){
             
                    this.btnTestCommentBehaviour();
                    this.btnGroupCommentBehaviour();
                }
            }.bind(this);  
  this.view.testView.find(".list-group-item").each(  
          function(index, elem){
              $(elem).unbind("click",listener);
          });
    this.view.testView.find(".list-group-item").each(  
          function(index, elem){
              $(elem).click(listener);
          });
};

Controller.prototype.btnTestCommentBehaviour = function() {
      var listener = function(event){
          var id = $(event.target).attr("id").replace("comment-button-","");
          this.model.saveDescriptionTest($("#test-comment-" + id).val(),parseInt(id));
            }.bind(this);  
  this.view.description.find(".btn-test-comment").each(  
          function(index, elem){
              $(elem).unbind("click",listener);
          });
    this.view.description.find(".btn-test-comment").each(  
          function(index, elem){
              $(elem).click(listener);
          });
};

Controller.prototype.btnGroupCommentBehaviour = function() {
      var listener = function(event){
           var id = $(event.target).attr("id").replace("comment-button-","");
               this.model.saveDescriptionGroup($("#group-comment-" + id).val());       
            }.bind(this);  
  this.view.description.find(".btn-group-comment").each(  
          function(index, elem){
              $(elem).unbind("click",listener);
          });
    this.view.description.find(".btn-group-comment").each(  
          function(index, elem){
              $(elem).click(listener);
          });
};

/*Console plugin
 * method riding this plugin
 */
Controller.prototype.TermInitEdit = function (cons) {
    $(function () {
        $("#" + cons).terminal(function (command) {
            if (command !== '') {
                try {
                    chrome.devtools.inspectedWindow.eval(command,
                            function (result, exception) {
                                if (typeof (result) !== "undefined") {
                                    if (typeof (result) === "boolean") {
                                        this.terminal.echo(result.toString());
                                    }
                                } else if (typeof (exception) !== "undefined") {
                                    if (exception.isException === true)
                                    {
                                        this.edit_terminal.error(exception.value);
                                    } else if (exception.isError === true)
                                        console.error(new String(exception.code));
                                }
                            }.bind(this));
                } catch (e) {
                    console.error(new String(e));
                }
            } else {
                this.echo('');
            }
        }.bind(this), {
            greetings: false,
            height: '200',
            prompt: '> '
        });
        this.edit_terminal = $("#" + cons).terminal();
    }.bind(this));
};


Controller.prototype.TermInitRec = function (cons) {
    $(function () {
        $("#" + cons).terminal(function (command) {
            if (command !== '') {
                try {
                        this.model.actualItem.Add(command);
                    chrome.devtools.inspectedWindow.eval(command,
                            function (result, exception) {
                                if (typeof (result) !== "undefined") {
                                    if (typeof (result) === "boolean") {
                                        this.terminal.echo(result.toString());
                                    }
                                } else if (typeof (exception) !== "undefined") {
                                    if (exception.isException === true)
                                    {
                                        this.model.actualItem.AddError(command, exception.value);
                                        this.rec_terminal.error(exception.value);
                                    } else if (exception.isError === true)
                                        console.error(new String(exception.code));
                                }
                            }.bind(this));
                } catch (e) {
                    console.error(new String(e));
                }
            } else {
                this.echo('');
            }
        }.bind(this), {
            greetings: false,
            height: '200',
            prompt: '>>'
        });
        this.rec_terminal = $("#" + cons).terminal();
    }.bind(this));
};

Controller.prototype.insertCommandObject = function () {
    var cmd = "var x" + this.model.count + " = window.ObjectOfCanvas";
    this.model.count++;
    if (this.record === true) {
        this.rec_terminal.exec(cmd, false);
    } else {
        this.edit_terminal.exec(cmd, false);
    }
    console.log(cmd);
    if (this.record === true)
        this.model.reference.push(cmd);
};

Controller.prototype.insertCommandCanvas = function () {
    var cmd = 'var x = window.MainCanvas';
    this.edit_terminal.exec(cmd, false);
    this.model.reference.push(cmd);
};

Controller.prototype.insertCommandOffset = function () {
    var cmd = "var x" + this.model.count + " = window.guitest.MouseOffset";
    this.model.count++;
    if (this.record === true) {
        this.rec_terminal.exec(cmd, false);
    } else {
        this.edit_terminal.exec(cmd, false);
    }
    console.log(cmd);
};

