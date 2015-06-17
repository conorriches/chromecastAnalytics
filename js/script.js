$(document).ready(function () {
    var cast_api, cv_activity, receiver;
    var APP_ID = "3A344528";

    if (window.cast && window.cast.isAvailable) {
        initializeApi();
    } else {
        window.addEventListener("message", function(event) {
            if (event.source == window && event.data &&
                event.data.source == "CastApi" &&
                event.data.event == "Hello")
                initializeApi();
        });
    };

    initializeApi = function() {
        cast_api = new cast.Api();
        $("#cast-list").castReceiverList({
            api : cast_api,
            appId : APP_ID,
            onSelect : function(r) {
                receiver = r;
                $(".unlaunchedOption").removeAttr("disabled");
            }
        });
    };

});