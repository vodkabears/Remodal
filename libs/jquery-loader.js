(function () {

    // Get any lib=___ param from the query string.
    var library = location.search.match(/[?&]lib=(.*?)(?=&|$)/);

    document.write("<script src='../libs/" + library[1] + "'></script>");

}());
