
function SocialsClass() {
    this.socialList = null;
    this.needsocialListUpdate = false;
    this.needsocialUpdate = false;
}

/**
 * Check whether socialList is downloaded or not.
 */
SocialsClass.prototype.isSocialListDownloaded = function () {
    return !!this.socialList;
};

SocialsClass.prototype.downloadSocials = function(paramsObj, callback) {
    var lat = 61.784403, lng = 34.344882, radius = 7, categoryId = 1;

    $(paramsObj).each(function (idx, value) {
        if (value.name === 'category_id') {
            categoryId = value.value;
        }
    });

    /*    var locationCondition = (
     (typeof lat !== 'undefined' && lat != null && lat !== '') &&
     (typeof lng !== 'undefined' && lng != null && lng !== '') &&
     (typeof radius !== 'undefined' && radius != null && radius !== '')
     );*/

    /*    var categoryCondition = typeof categoryId !== 'undefined' &&
     categoryId != null &&
     categoryId != -1;*/

    /*    if (!locationCondition && !categoryCondition) {
     throw new GetsWebClientException('Points Error', 'downLoadPoints, request parameters are incorrect.');
     }*/


    // TODO: временный костыль, загружаем точки всех сфер деятельности
    var scopes = "";
    var socialsList = [];
    var self = this;
    $.ajax({
        type: 'GET',
        url: 'http://ds-karelia.opti-soft.ru/api/getListScopes',
        dataType: 'jsonp',
        success: function (scopeData) {
            for (var i in scopeData) {
                var opt = document.createElement("option");
                opt.innerHTML = scopeData[i].Name;
                opt.value = scopeData[i].Id;
                scopes += "&scopes=" + opt.value;
            }
            $.ajax({
                type: 'GET',
                url: 'http://ds-karelia.opti-soft.ru/api/getPassports?latitude=' + lat + '&longitude=' + lng + scopes + '&radius=' + radius + '&onlyAgreed=false',
                dataType: 'jsonp',
                success: function (data) {
                    for (var i in data) {
                        socialsList[i] = {
                            coordinates: data[i].Latitude + "," + data[i].Longitude,
                            uuid: 123,
                            title: "ololo",
                            category_id: 1,
                            name: "gsom",
                            description: "yatochka"
                        };
                        alert(JSON.stringify(data[i]));
                    }
                    self.socialList = socialsList;
                    if (callback) {
                        callback();
                    }
                },
                error: function () {
                    alert('error');
                }
            });
        },
        error: function () {
            alert('error');
        }
    });


};

/**
 * Create description for add social as object.
 *
 * @param {String} audioURL Audio track url.
 * @param {String} imageURL Description text.
 * @param {String} uuid social's UUID.
 * @param {String} index social's position in a track.
 *
 * @returns {Object} New description object
 */
SocialsClass.prototype.createDescription = function(audioURL, imageURL, index, radius) {
    var descObj = {};

    /*if (!text) {
     descObj.description = '';
     } else {
     descObj.description = text;
     }*/

    if (audioURL) {
        descObj.audio = audioURL;
    }

    if (imageURL) {
        descObj.photo = imageURL;
    }

    if (index) {
        descObj.idx = index;
    }

    if (radius) {
        descObj.radius = radius;
    } else {
        descObj.radius = 63;
    }

    return descObj;
};

SocialsClass.prototype.findSocialInsocialList = function(uuid) {
    if (!uuid || !this.socialList) {
        return;
    }
    for (var i = 0, len = this.socialList.length; i < len; i++) {
        if (this.socialList[i].uuid.trim() === uuid.trim()) {
            this.social = this.socialList[i];
            return this.social;
        }
    }
};

/**
 * Getters
 */
SocialsClass.prototype.getSocialList = function() {
    if (this.isSocialListDownloaded()) {
        return this.socialList;
    }
};

SocialsClass.prototype.getSocial = function() {
    if (!this.social) {
        throw new GetsWebClientException('socials Error', 'getsocial, social undefined or null');
    }
    return this.social;
};

SocialsClass.prototype.setSocial = function(social) {
    this.social = social;
};