
function RouteInfo(document, routeInfo) {
    this.document = document;
    this.routeInfo = routeInfo;
}

RouteInfo.prototype.placeRouteInRouteInfo = function(routes, obstacles, routeType) {
    var btnDistanceSafe = $(this.routeInfo).find('#route-type-safe');
    var btnDistanceNormal = $(this.routeInfo).find('#route-type-normal');
    var btnDistanceFastest = $(this.routeInfo).find('#route-type-fastest');
    var obstaclesDiv = $(this.routeInfo).find('#route-obstacles');
    var weight = $(this.routeInfo).find('#route-weight');

    $(btnDistanceSafe).text('');
    $(btnDistanceNormal).text('');
    $(btnDistanceFastest).text('');
    $(btnDistanceSafe).css("display","none");
    $(btnDistanceNormal).css("display","none");
    $(btnDistanceFastest).css("display","none");
    $(obstaclesDiv).text('');
    $(weight).text('');
    var weightObst = 0;
    var currentRoute;
    $.each(routes, function (key, value) {
        switch (value.getType()) {
            case 'normal':
                $(btnDistanceNormal).css("display","block");
                $(btnDistanceNormal).text(Math.round(value.getDistance())/1000 + " км");
                break;
            case 'safe':
                $(btnDistanceSafe).css("display","block");
                $(btnDistanceSafe).text(Math.round(value.getDistance())/1000 + " км");
                break;
            case 'fastest':
                $(btnDistanceFastest).css("display","block");
                $(btnDistanceFastest).text(Math.round(value.getDistance())/1000 + " км");
                break;
        }
        if(value.getType() == routeType)
            currentRoute = value;
    });
    $.each(currentRoute.getObstacles(), function (id, val) {
        var tmpPoint = obstacles.findPointInPointList(val['uuid']);
        var appDiv = '<div class="obstacles_info" style="border: 1px solid #000; cursor: pointer">' +
            '<div>' + tmpPoint.name + '</div>' +
            '<div class="full_obstacles_info">' +
                '<div class="main-block">' +
                '<label>Координаты</label>' +
                    '<div class="emulate-tab"><label>Широта: &nbsp;</label><div class="inline"></div>' + tmpPoint.coordinates.split(',')[1] + '</div>' +
                    '<div class="emulate-tab"><label>Долгота: &nbsp;</label><div class="inline"></div>' + tmpPoint.coordinates.split(',')[0] + '</div>' +
                    '<div class="emulate-tab"><label>Высота: &nbsp;</label><div class="inline"></div>0</div>' +
                '</div>' +
                '<div class="main-block">' +
                    '<label for="point-info-description">Описание</label>' +
                    '<div id="point-info-description">' + tmpPoint.description + '</div>' +
                '</div>' +
                '<div class="main-block">' +
                '<label for="point-info-url">Ссылка</label>' +
                    '<div id="point-info-url">' +
                        '<a target="_blank">' + tmpPoint.url + '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="main-block">' +
                '<label for="point-info-audio">Дополнительные данные</label>' +
                    '<div id="point-info-extended-data">';
                    $.each(tmpPoint.extendedData, function (id1, value) {
                        appDiv +='<div><b>' + value.name + ':</b>  ' + value.value + '</div>';
                        if(value.name == "rating")
                            weightObst += Number(value.value);
                    });
                    appDiv += '</div>' +
                '</div>' +
            '</div>';
        $(obstaclesDiv).append(appDiv);
    });
    $(weight).text(weightObst);

    $('.obstacles_info').on('click', function (e) {
        $('.full_obstacles_info').css('display','none');
        $(this).children().css('display','block');
    });
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




