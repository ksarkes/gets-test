
var scopes ="";
var data;
function getData(mapCtrl) {
    $.ajax({
        type: 'GET',
        url: 'http://ds-karelia.opti-soft.ru/api/getListScopes',
        dataType: 'jsonp',
        success: function(scopeData) {
            for (var i in scopeData){
                var opt = document.createElement("option");
                opt.innerHTML = scopeData[i].Name;
                opt.value = scopeData[i].Id;
                scopes += "&scopes="+opt.value;
            }
            $.ajax({
                type: 'GET',
                url: 'http://ds-karelia.opti-soft.ru/api/getPassports?latitude='+61.776193+'&longitude='+34.365181+scopes+'&radius='+ 5 +'&onlyAgreed=false',
                dataType: 'jsonp',
                success: function(newdata) {
                    data = newdata;
                    var point = {};
                    var pointList = [];
                    for (var i in data) {
                        pointList[i]= {
                            coordinates: data[i].Latitude + "," + data[i].Longitude,
                            uuid: 123,
                            title: "ololo",
                            category_id: 1,
                            name: "gsom",
                            description: "yatochka"
                        };
                        //alert(data[i].Accessibility[i].Categorie.Id);
                    }
                    mapCtrl.placePointsOnMap(pointList,{
                        url: '#form=' + PointsPage.POINT_INFO + '&point_uuid=',
                        text: $(that._pointInfo.getView()).data('putpoint')
                    });
                },
                error: function(){
                    alert('error');
                }
            });
        },
        error: function(){
            alert('error');
        }
    });
}
