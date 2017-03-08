

$(document).ready(function(event){
                    if($("body").find("#GUITester").length === 0){
                        getBasic();
                        insertPanel();
                       }
                    
		});
        
function getBasic(){
    			var dom = $(":root");
			var title = $(dom).find("h1").first();
			var head = $(dom).find("p").first();
			console.log("VĂ­tejte v nĂˇstroji GUI Tester");
			console.log("StrĂˇnka s titulkem " + $(dom).find("title").text());
			console.log("StrĂˇnka s nadpisem " + $(dom).find("h1").first().text());
			console.log("StrĂˇnka s obsahem " + $(dom).find("p").first().text());	
                        
}



function insertPanel()
{   
    var url = chrome.extension.getURL("scenare.html");
    $.get( url, function( data ) {
         loadPanel(data);
    });
}

function loadPanel(html){
    try{
    var page = $("body").children();  
    $("body").children().remove();
    $("body").append(html);
    $("body").append("<div id='gui'></div");
    $("#gui").append(page);
    
    }
    catch(err){
        console.log(err.message);
    } 
    setListener();
}

function setListener(){
        $("#gui").find("button").each(function(){
            $(this).click(function(){
              addEvent($(this));
            });
        });
        
}

function addEvent(item){
    var event = $("<tr></tr>");
    $("#GUITester").find("#tb").append(event);
    var eventType = $("<td>" + item.prop("tagName")  +  "</td>");
    var par = item.parent();
    var eventTarget = ("<td>" +  par.parent().prop("tagName") + " "
            + par.prop("tagName") + " " + "button " + "</td>");
    var targetValue = $("<td>" + "Označen obsahem " + $(item).text() +  "</td>");
    event.append(eventType); 
    event.append(eventTarget);
    event.append(targetValue);
      
}




    




