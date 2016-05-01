
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
                    }
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
