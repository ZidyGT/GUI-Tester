/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    $("table").css("visibility", "hidden");
    $("#param").change(
           
           //zvešení textového pole z dùvodu vstupu vìtšího poètu znakù
           function(){
               if($(this).val() === "TV"){
                  $("#valid").attr("rows","8");
           }
           else{
               $("#valid").attr("rows","3");
                
           }
           
           //ošetøení zadání zbyteèného cíle
           if($(this).val() === "O"){
                  $('#target').prop('disabled', true);
           }
           else{
               $('#target').prop('disabled', false);
           }
           
           //ošetøení zadání zbyteèné hodnoty
           if($(this).val() === "LC"){
                  $('#valid').prop('disabled', true);
           }
           else{
               $('#valid').prop('disabled', false);
           }
       });
    $("#add").click(function(){
        rowAdd();
        $("input").val("");
        $("texarea").val("");
        if($("table").css("visibility") === 'hidden')
        $("table").css("visibility", "visible");
    });
    $("#run").click(function(){
           var act = $("tr").each(function(){
               var parts = $(this).children();
               executeAction(parts.eq(0).text(), parts.eq(1).text(), parts.eq(2).text());
           });
    });
});



function rowAdd(){
        var row = $("<tr></tr>"); 
        var par = $("<td></td>").text($("#param").val());
        var elem = $("<td></td>").text($("#target").val());
        var val = $("<td></td>").text($("#valid").val());
        row.append(par);
        row.append(elem);
        row.append(val);
        $("#tb").append(row); 
}


function executeAction(parametre, element, value){
    if (parametre === "O")
        window.open(value);
    else if (parametre === "LC")
        $(element).trigger("click");    
    else if (parametre === "T")
        $(element).val(value);
}


