function do_something(msg) {
    $("#object").append( 
            "<tr>" + 
            "<td>" + msg.point.x + "</td>" +
            "<td>" + msg.point.y + "</td>" +
            "<td>" + msg.width + "</td>" +
            "<td>" + msg.height + "</td>" +
            "</tr>" );
}

