
function RouteInfo(document, routeInfo) {
    this.document = document;
    this.routeInfo = routeInfo;
}

RouteInfo.prototype.placeRouteInRouteInfo = function(routes, routeType) {
    var btnDistanceSafe = $(this.routeInfo).find('#route-type-safe');
    var btnDistanceNormal = $(this.routeInfo).find('#route-type-normal');
    var btnDistanceFastest = $(this.routeInfo).find('#route-type-fastest');
    var obstaclesDiv = $(this.routeInfo).find('#route-obstacles');
    var weight = $(this.routeInfo).find('#route-weight');

    $(btnDistanceSafe).text('');
    $(btnDistanceNormal).text('');
    $(btnDistanceFastest).text('');
    $(obstaclesDiv).text('');
    $(weight).text('');

    var currentRoute;
    $.each(routes, function (key, value) {
        switch (value.getType()) {
            case 'normal':
                $(btnDistanceNormal).text(Math.round(value.getDistance())/1000 + " км");
                break;
            case 'safe':
                $(btnDistanceSafe).text(Math.round(value.getDistance())/1000 + " км");
                break;
            case 'fastest':
                $(btnDistanceFastest).text(Math.round(value.getDistance())/1000 + " км");
                break;
        }
        if(value.getType() == routeType)
            currentRoute = value;
    });
    $(weight).text(currentRoute.getWeight());

    $(btnDistanceSafe).on('click', function () {
        window.location = "routes.php?lang=ru#form=route_info&route_type=safe";
    });

    $(btnDistanceNormal).on('click', function () {
        window.location = "routes.php?lang=ru#form=route_info&route_type=normal";
    });

    $(btnDistanceFastest).on('click', function () {
        window.location = "routes.php?lang=ru#form=route_info&route_type=fastest";
    });

};

RouteInfo.prototype.getView = function() {
    return this.routeInfo;
};

/**
 * Show view
 */
RouteInfo.prototype.showView = function() {
    $(this.routeInfo).removeClass('hidden').addClass('show');
};

/**
 * Hide view
 */
RouteInfo.prototype.hideView = function() {
    $(this.routeInfo).removeClass('show').addClass('hidden');
};




