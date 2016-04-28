
var scopes ="";
var data;
function getData() {
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
                    var point;
                    var pointList = [];
                    alert(data.length);
                    for (var i in data) {
                        alert(data[i].Latitude);
                        point.coordinates = data[i].Latitude + "," + data[i].Longitude;
                        pointList[i] = point;
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
