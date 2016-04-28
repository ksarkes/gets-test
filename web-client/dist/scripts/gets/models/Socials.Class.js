
function SocialsClass() {
    this.socialList = null;
    this.needsocialListUpdate = false;
    this.needsocialUpdate = false;
};

/**
 * Check whether socialList is downloaded or not.
 */
SocialsClass.prototype.issocialListDownloaded = function () {
    return !!this.socialList;
};

SocialsClass.prototype.downloadSocials = function(paramsObj, callback) {
    var lat = 0.0, lng = 0.0, radius = 1, categoryId = -1, space = 'public';

    $(paramsObj).each(function (idx, value) {
        if (value.name === 'latitude') {
            lat = value.value;
        } else if (value.name === 'longitude') {
            lng = value.value;
        } else if (value.name === 'radius') {
            radius = value.value;
        } else if (value.name === 'category_id') {
            categoryId = value.value;
        } else if (value.name === 'space') {
            space = value.value;
        }
    });

    var locationCondition = (
    (typeof lat !== 'undefined' && lat != null && lat !== '') &&
    (typeof lng !== 'undefined' && lng != null && lng !== '') &&
    (typeof radius !== 'undefined' && radius != null && radius !== '')
    );

    var categoryCondition = typeof categoryId !== 'undefined' &&
        categoryId != null &&
        categoryId != -1;

    if (!locationCondition && !categoryCondition) {
        throw new GetsWebClientException('socials Error', 'downLoadsocials, request parameters are incorrect.');
    }

    var requestObj = {};

    if (locationCondition && categoryCondition) {
        requestObj.latitude = lat;
        requestObj.longitude = lng;
        requestObj.radius = radius;
        requestObj.category_id = categoryId;
    } else if (locationCondition) {
        requestObj.latitude = lat;
        requestObj.longitude = lng;
        requestObj.radius = radius;
    } else {
        requestObj.category_id = categoryId;
    }

    //requestObj.space = space;

    var getsocialsRequest = $.ajax({
        url: GET_socialS_ACTION,
        type: 'POST',
        async: true,
        contentType: 'application/json',
        dataType: 'xml',
        data: JSON.stringify(requestObj)
    });

    //Logger.debug(getsocialsRequest.responseText);

    getsocialsRequest.fail(function(jqXHR, textStatus) {
        throw new GetsWebClientException('socials Error', 'getsocialsRequest failed ' + textStatus);
    });

    var self = this;
    getsocialsRequest.done(function(data, textStatus, jqXHR) {
        if ($(jqXHR.responseText).find('code').text() !== '0') {
            throw new GetsWebClientException('socials Error', 'getsocialsRequest: ' + $(jqXHR.responseText).find('message').text());
        }

        //Logger.debug(jqXHR.responseText);
        var socialListItems = $($.parseXML(jqXHR.responseText)).find('Placemark');
        var socialsArray = [];
        for (var i = 0, len = socialListItems.length; i < len; i++) {
            var socialObj = {};
            var socialExtendedData = [];
            socialObj.photos = [];

            socialObj.name = $(socialListItems[i]).find('name').length ? $(socialListItems[i]).find('name').text() : '';
            socialObj.description = $(socialListItems[i]).find('description').length ? $(socialListItems[i]).find('description').text() : '';
            socialObj.uuid = $(socialListItems[i]).find("[name='uuid']").length ? $(socialListItems[i]).find("[name='uuid']").text() : '';
            socialObj.access = $(socialListItems[i]).find("[name='access']").length ? $(socialListItems[i]).find("[name='access']").text() : '';
            $(socialListItems[i]).find("gets\\:photo").each(function (idx, val) {
                socialObj.photos.push($(val).text());
            });
            socialObj.audio = $(socialListItems[i]).find("[name='audio']").length ? $(socialListItems[i]).find("[name='audio']").text() : '';
            socialObj.url = $(socialListItems[i]).find("[name='link']").length ? $(socialListItems[i]).find("[name='link']").text() : '';
            socialObj.coordinates = $(socialListItems[i]).find('coordinates').length ? $(socialListItems[i]).find('coordinates').text() : '';
            socialObj.category_id = $(socialListItems[i]).find("[name='category_id']").length ? $(socialListItems[i]).find("[name='category_id']").text() : '';
            socialObj.radius = $(socialListItems[i]).find("[name='radius']").length ? $(socialListItems[i]).find("[name='radius']").text() : '';

            $(socialListItems[i]).find('Data').each(function(index, newValue) {
                socialExtendedData.push({name: $(newValue).attr('name')/*.replace(/_/g, ' ')*/, value: $(newValue).text()});
            });
            socialObj.extendedData = socialExtendedData;

            socialsArray.push(socialObj);
        }

        //Logger.debug(socialsArray);
        self.socialList = socialsArray;
        if (callback) {
            callback();
        }
    });
};

/**
 * Upload social to a given track in the GeTS Server.
 *
 * @param {Object} paramsObj An array of objects in format {name: "someName", value: "someValue"}
 * @param {String} paramsObj[i].name="title" Name of a social (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="description" Description of a social (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="url" Link of a social (value stored in paramsObj[i].value)
 * @param {Double} paramsObj[i].name="latitude" Latitude of a social (value stored in paramsObj[i].value)
 * @param {Double} paramsObj[i].name="longitude" Longitude of a social (value stored in paramsObj[i].value)
 * @param {Double} paramsObj[i].name="altitude" Altitude of a social (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="imageURL" ImageURL of a social (optional) (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="audioURL" AudioURL of a social (optional) (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="uuid" UUID of a social (optional) (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="channel" Track in which social need to be uploaded (value stored in paramsObj[i].value)
 * @param {String} paramsObj[i].name="time" Time when social was created (value stored in paramsObj[i].value)
 * @param {Positive Integer} paramsObj[i].name="index" Position of a social in a track (optional) (value stored in paramsObj[i].value)
 * @param {Boolean} update Set true if social should be updated
 *
 * @throws {GetsWebClientException}
 */
SocialsClass.prototype.addsocial = function (paramsObj, update, callback) {
    if (!paramsObj) {
        throw new GetsWebClientException('socials Error', 'addsocial, paramsObj is undefined or null');
    }
    if (update && !this.social) {
        throw new GetsWebClientException('socials Error', 'addsocial, there is no social to update');
    }

    Logger.debug(paramsObj);

    var newParamsObj = {};
    var channel = null;
    var category = null;

    if (update) {
        newParamsObj.uuid = this.social.uuid;
    }

    $(paramsObj).each(function (idx, value) {
        Logger.debug(idx, value);
        if (value.name === 'altitude') return true;
        if (value.name === 'title') {
            newParamsObj.title = value.value;
        } else if (value.name === 'description') {
            newParamsObj.description = value.value;
        } else if (value.name === 'category') {
            category = value.value;
        } else if (value.name === 'channel') {
            channel = value.value;
        } else if (value.name === 'url') {
            newParamsObj.link = value.value;
        } else if (value.name === 'latitude') {
            newParamsObj.latitude = value.value;
        } else if (value.name === 'longitude') {
            newParamsObj.longitude = value.value;
        } else if (value.name === 'photo') {
            newParamsObj.photos = newParamsObj.photos || [];
            newParamsObj.photos.push({
                photo: value.value
            });
        } else {
            if (value.value !== '') {
                newParamsObj.extended_data = newParamsObj.extended_data || {};
                newParamsObj.extended_data[value.name.replace(/ /g, '_')] = value.value;
            }
        }
    });

    // Temprorary fix for altitude
    newParamsObj.altitude = 0.0;

    if (channel) {
        newParamsObj.channel = channel;
    } else {
        newParamsObj.category_id = category;
    }

    Logger.debug(newParamsObj);
    Logger.debug(JSON.stringify(newParamsObj));

    var addsocialRequest = $.ajax({
        url: update ? UPDATE_social_ACTION : ADD_social_ACTION,
        type: 'POST',
        async: false,
        contentType: 'application/json',
        dataType: 'xml',
        data: JSON.stringify(newParamsObj)
    });

    addsocialRequest.fail(function( jqXHR, textStatus ) {
        throw new GetsWebClientException('socials Error', 'addsocial, addsocialRequest failed ' + textStatus);
    });

    addsocialRequest.done(function (data, textStatus, jqXHR) {
        if ($(jqXHR.responseText).find('code').text() !== '0') {
            throw new GetsWebClientException('socials Error', 'addsocial, ' + $(jqXHR.responseText).find('message').text());
        }

        if (callback) {
            callback();
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

SocialsClass.prototype.removesocial = function (callback) {
    var social = this.getsocial();
    if (social.access === 'r') {
        throw new GetsWebClientException('socials Error', 'removesocial, "social" is read only');
    }

    var request = {};

    // Check if it's social from track or from category
    if (social.hasOwnProperty('track')) {
        request.track_name = social.track;
    }
    for (var i = 0, len = social.extendedData.length; i < len; i++) {
        if (social.extendedData[i].name === 'category_id') {
            request.category_id = social.extendedData[i].value;
        }
    }

    request.uuid = social.uuid;

    var removesocialRequest = $.ajax({
        url: REMOVE_social_ACTION,
        type: 'POST',
        async: false,
        contentType: 'application/json',
        dataType: 'xml',
        data: JSON.stringify(request)
    });

    removesocialRequest.fail(function(jqXHR, textStatus) {
        throw new GetsWebClientException('socials Error', 'removesocial, removesocialRequest failed ' + textStatus);
    });

    if ($(removesocialRequest.responseText).find('code').text() !== '0') {
        throw new GetsWebClientException('socials Error', 'removesocial, removesocialRequest: ' + $(removesocialRequest.responseText).find('message').text());
    }

    if (callback) {
        callback();
    }
};

SocialsClass.prototype.findsocialInsocialList = function(uuid) {
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
SocialsClass.prototype.getsocialList = function() {
    if (this.issocialListDownloaded()) {
        return this.socialList;
    }
};

SocialsClass.prototype.getsocial = function() {
    if (!this.social) {
        throw new GetsWebClientException('socials Error', 'getsocial, social undefined or null');
    }
    return this.social;
};

SocialsClass.prototype.setsocial = function(social) {
    this.social = social;
};