function RoutesPage(document, window) {
    this.document = document;
    this.window = window;

    // Models
    this._socials = null;
    this._points = null;
    this._categories = null;
    this._user = null;
    this._utils = null;

    this._mapCtrl = null;

    // Views
    this._socialsMain = null;
    this._headerView = null;
    this._socialInfo = null;
    this._routeInfo = null;

    this.currentView = null;
}

// Forms
RoutesPage.MAIN = 'main';
RoutesPage.SOCIAL_INFO = 'social_info';
RoutesPage.ROUTE_INFO = 'route_info';

RoutesPage.prototype.changeForm = function () {
    var form = this._utils.getHashVar('form');
    Logger.debug('changeForm form = ' + form);
    if (form === RoutesPage.MAIN) {
        this.showSocialsMain();
    } else if (form === RoutesPage.SOCIAL_INFO) {
        this.showSocialInfo();
    } else if (form === RoutesPage.ROUTE_INFO) {
        this.showRouteInfo();
    } else if (typeof form === 'undefined') {
        this.window.location.replace('#form=' + RoutesPage.MAIN);
    }
};

RoutesPage.prototype.initPage = function () {
    var self = this;

    //TODO: почистить говно
    // try {

    // Init map
    if (this._mapCtrl == null) {
        this._mapCtrl = new MapController(this.document, this.window);
        this._mapCtrl.initMap();
    }

    // Init models
    if (!this._points) {
        this._points = new PointsClass();
    }
    if (!this._categories) {
        this._categories = new CategoriesClass();
    }
    if (!this._socials) {
        this._socials = new SocialsClass();
    }
    if (!this._user) {
        this._user = new UserClass(this.window);
        this._user.fetchAuthorizationStatus();
        Logger.debug('is Auth: ' + this._user.isLoggedIn());
    }
    if (!this._utils) {
        this._utils = new UtilsClass(this.window);
    }

    // Init views
    if (!this._socialsMain) {
        this._socialsMain = new SocialsMain(this.document, $(this.document).find('#socials-main-page'));
    }
    if (!this._headerView) {
        this._headerView = new HeaderView(this.document, $(this.document).find('.navbar'));
    }

    if (!this._socialInfo) {
        this._socialInfo = new SocialInfo(this.document, $(this.document).find('#social-info-page'));
    }
/*    if (!this._routeInfo) {
        this._routeInfo = new RouteInfo(this.document, $(this.document).find('#route-info-page'));
    } */

    //Init first page
    this.currentView = this._socialsMain;
    this.changeForm();

    // Init Socials main
    this._socialsMain.toggleOverlay();
    this._socialsMain.setLatitude(this._mapCtrl.getMapCenter().lat);
    this._socialsMain.setLongitude(this._mapCtrl.getMapCenter().lng);


    // Hash change handler
    $(this.window).on('hashchange', function () {
        Logger.debug('hashchanged');
        self.changeForm();
    });

    // Sign in handler
    $(this.document).on('click', '#sign-in-btn', function (e) {
        e.preventDefault();
        self._user.authorizeGoogle();
    });

    // Sign out handler
    $(this.document).on('click', '#sign-out-btn', function (e) {
        e.preventDefault();
        self._user.logout();
    });

    $(this.document).on('click', '#social-map-focus', function(e) {
        e.preventDefault();
        // TODO:
        var asd = self._socials.social.uuid;
        self._mapCtrl.setMapCenterOnSocial(asd);

    });

    this.downloadSocialsHandler();

    // get user's coordinates
    if (this.window.navigator.geolocation) {
        this.window.navigator.geolocation.getCurrentPosition(function (position) {
            Logger.debug(position);
            self._user.setUserGeoPosition(position);
            self._mapCtrl.setMapCenter(position.coords.latitude, position.coords.longitude);
            self._socialsMain.setLatitude(Math.floor(position.coords.latitude * 10000) / 10000);
            self._socialsMain.setLongitude(Math.floor(position.coords.longitude * 10000) / 10000);

            //self.downloadSocialsHandler();

        }, this.handleGeoLocationError);
    } else {
        Logger.debug('geolocation is not supported by this browser');
    }
};

RoutesPage.prototype.handleGeoLocationError = function (error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            Logger.debug('user denied the request for Geolocation');
            break;
        case error.POSITION_UNAVAILABLE:
            Logger.debug('location information is unavailable');
            break;
        case error.TIMEOUT:
            Logger.debug('the request to get user location timed out');
            break;
        case error.UNKNOWN_ERROR:
            Logger.debug('an unknown error occurred');
            break;
    }
};

RoutesPage.prototype.showSocialsMain = function () {
    try {
        this._headerView.clearOption();

        // this._socialsMain.placeCategoriesInPointMain(this._categories.getCategories());

        this.currentView.hideView();
        this.currentView = this._socialsMain;
        this.currentView.showView();
    } catch (Exception) {
        MessageBox.showMessage(Exception.toString(), MessageBox.ERROR_MESSAGE);
        Logger.error(Exception.toString());
    }
};

RoutesPage.prototype.showSocialInfo = function () {
    try {
        this._headerView.changeOption($(this._socialInfo.getView()).data('pagetitle'), 'glyphicon-chevron-left', '#form=main');
        var socialUUID = decodeURIComponent(this._utils.getHashVar('social_uuid'));
        if (!socialUUID) {
            throw new GetsWebClientException('Track Page Error', 'showSocialInfo, hash parameter social uuid undefined');
        }

        var social = this._socials.findSocialInsocialList(socialUUID);
        this._socialInfo.placeSocialInSocialInfo(social, this._mapCtrl);


        this.currentView.hideView();
        this.currentView = this._socialInfo;
        this.currentView.showView();
    } catch (Exception) {
        MessageBox.showMessage(Exception.toString(), MessageBox.ERROR_MESSAGE);
        Logger.error(Exception.toString());
    }
};

RoutesPage.prototype.showRouteInfo = function () {
    try {

        // TODO: отобразить в панели инфо о маршруте
/*        this._headerView.changeOption($(this._socialAdd.getView()).data('pagetitleAdd'), 'glyphicon-chevron-left', '#form=main');
        this._utils.clearAllInputFields(this._pointAdd.getView());
        this._pointAdd.removeCustomFields();

        this._pointAdd.placeCategoriesInPointAdd(this._categories.getCategories());

        this.currentView.hideView();
        this.currentView = this._pointAdd;
        this.currentView.showView();*/
    } catch (Exception) {
        MessageBox.showMessage(Exception.toString(), MessageBox.ERROR_MESSAGE);
        Logger.error(Exception.toString());
    }
};

RoutesPage.prototype.downloadSocialsHandler = function () {
    var that = this;
    try {
        this._socialsMain.showOverlay();
        // TODO: сюда запихать выбранные в списке категории
        var formData = $(this.document).find('#socials-main-form').serializeArray();

        this._socials.downloadSocials(formData, function () {
            var socialList = that._socials.getSocialList();
            var scopeList = that._socials.getScopeList();
            that._mapCtrl.removeSocialsFromMap();
            that._socialsMain.placeSocialsInSocialList(socialList);
            that._socialsMain.placeScopesInScopeList(scopeList);
            that._mapCtrl.placeSocialsOnMap(socialList);
            that._socialsMain.hideOverlay();
        });
    } catch (Exception) {
        MessageBox.showMessage(Exception.toString(), MessageBox.ERROR_MESSAGE);
        Logger.error(Exception.toString());
    }
};

