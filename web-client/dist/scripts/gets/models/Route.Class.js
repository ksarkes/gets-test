/**
 * Created by artyo on 03.05.2016.
 */

function RouteClass(dist, weight, type, routeCoods) {
    this.distance = dist;
    this.weight = weight;
    this.obstacles = null;
    this.type = type;
    this.routeCoords = routeCoods;
};

RouteClass.prototype.getDistance = function () {
    return this.distance;
};

RouteClass.prototype.getWeight = function () {
    return this.weight;
};

RouteClass.prototype.getObstacles = function (obstaclesUUID, pointList) {
    return this.obstacles;
};

RouteClass.prototype.getType = function () {
    return this.type;
};

RouteClass.prototype.getRouteCoords = function () {
    return this.routeCoords;
};
