import $ from "jquery";

export function addNavbar() {
    let navbar = $("<nav class=\"navbar navbar-default\" style=\"margin-bottom: 1em;\"></nav>");
    navbar.append("<a class=\"navbar-brand \" href=\"#\"><img src=\"src/img/logo.png\" " 
    + " width=\"60\" height=\"60\"></a>");
/*
    let navbarLeftDiv = $("<div class=\"collapse navbar-collapse\"></div>");
    navbarLeftDiv.append("<ul class=\"navbar-nav\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\">RHBS</a></li></ul>")

    let navbarRightDiv = $("<div class=\"collapse navbar-collapse w-100 order-3 dual-collapse2\"></div>");    
    navbarRightDiv.append("<ul class=\"navbar-nav ml-auto\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" id=\"data-specification-link\" data-toggle=\"modal\" data-target=\"#data-specification-dialog\">Data specification</a></li></ul>")
    
    navbar.append(navbarLeftDiv);
    navbar.append(navbarRightDiv);
   */
    $("body").prepend(navbar);
}