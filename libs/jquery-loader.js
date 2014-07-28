(function () {
    // Default to the local version.
    var path = '../libs/jquery/jquery-1.11.1.js';
    // Get any jquery=___ param from the query string.
    var library = location.search.match(/[?&]library=(.*?)(?=&|$)/);
    // If a version was specified, use that version from code.jquery.com.
    if (library) {
        path = '../libs/' + library[1];
    }

    document.write('<script src="' + path + '"></script>');
}());
