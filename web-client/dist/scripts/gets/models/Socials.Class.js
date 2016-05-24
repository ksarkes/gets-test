
function SocialsClass() {
    this.socialList = null;
    this.scopeList = null;
    this.social = null;
    this.needsocialListUpdate = false;
    this.needsocialUpdate = false;
}

/**
 * Check whether socialList is downloaded or not.
 */
SocialsClass.prototype.isSocialListDownloaded = function () {
    return !!this.socialList;
};

SocialsClass.prototype.isScopeListDownloaded = function () {
    return !!this.scopeList;
};

SocialsClass.prototype.downloadSocials = function(paramsObj, callback) {
    var lat = 61.784403, lng = 34.344882, radius = 7, categoryId = 3;

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
    var scopeList = [];
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
                scopeList[i] = {
                    id: scopeData[i].Id,
                    name: scopeData[i].Name
                };
            }
            self.scopeList = scopeList;

            $.ajax({
                type: 'GET',
                url: 'http://ds-karelia.opti-soft.ru/api/getPassports?latitude=' + lat + '&longitude=' + lng + scopes + '&radius=' + radius + '&onlyAgreed=false',
                dataType: 'jsonp',
                success: function (data) {
                    for (var i in data) {
                        var imgUrl;
                        if (data[i].Accessibility[categoryId - 1].Categorie.Id == categoryId && data[i].Accessibility[categoryId - 1].MaintenanceForm)
                            switch (data[i].Accessibility[categoryId - 1].MaintenanceForm.Id) {
                                // mother of god
                                case 0:
                                    imgUrl = 'http://st09.karelia.ru/nvd4j6/a37ecbd31898aa68cd57465999baf0aa/27a5e607be77703bb9462083ca9576f0/ic_location_green.png';
                                    break;
                                case 1:
                                    imgUrl = 'http://st09.karelia.ru/nvd4j6/0f1cfd750b34259c406741763eb371aa/f2b19583ecdf5324b8660e3ad49b6116/ic_location_yellow.png';
                                    break;
                                case 2:
                                    imgUrl = 'http://st09.karelia.ru/nvd4j6/2549e824fcd0f795821b6a319070bbaa/af29b0af99d42367513bd3a075dc0a0d/ic_location_red.png';
                                    break;
                                case 3:
                                    imgUrl = 'http://st09.karelia.ru/nvd4j6/19f0ae0a47fe5277c118b218e66864aa/1c7c30bdf2cbc1da9c839d3452369cfc/ic_location_gray.png';
                                    break;
                                default:
                                    continue;
                            }
                        var access = "";
                        for(var j in data[i].Accessibility)
                        {
                            if(data[i].Accessibility[j].Categorie.Id == categoryId)
                                access += '<div>';
                            else
                                access += '<div class = invisibleAccessibility>';
                            if (data[i].Accessibility[j].Categorie)
                                access += '<br><div align="center"><b>' + data[i].Accessibility[j].Categorie.Name + '</b></b></div>';
                            if (data[i].Accessibility[j].MaintenanceForm)
                                access += '<div align="center"><i>' + data[i].Accessibility[j].MaintenanceForm.Name + '</i></div><br>';
                            for (var k in data[i].Accessibility[j].FunctionalAreas)
                            {
                                access += '<div align="left">' + data[i].Accessibility[j].FunctionalAreas[k].FunctionalArea.Name + ' - ' +
                                data[i].Accessibility[j].FunctionalAreas[k].Type.Name + '</div>';
                            }
                            access += '</div>';
                        }
                        access += '<div id = "showAccessibility" class = "controlButtons">Показать все категории</div>';


                        socialsList[i] = {
                            coordinates: data[i].Latitude + "," + data[i].Longitude,
                            // our internal uuid ¯\_(ツ)_/¯
                            uuid: i,
                            title: data[i].Name,
                            route: data[i].Route,
                            address: data[i].Address,
                            objectName: data[i].ObjectName,
                            category_id: 1,
                            icon: imgUrl,
                            access: access,
                            scope: data[i].Scopes[0].Id
                        };
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

SocialsClass.prototype.getScopeList = function() {
    if (this.isScopeListDownloaded()) {
        return this.scopeList;
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