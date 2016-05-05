<?php

echo    '<div id="route-info-page" class="action-menu-container hidden" data-pagetitle="Информация о маршруте" data-putpoint="Поместить маршрут в окно информации о маршруте">
            <div class="action-menu-inner-content">                               
                <div class="main-block">
                    <div class="distance-route-div" style="width: 100%; height: auto">
                        <div class="distanceBtn" style="background: #2ecc71" id="route-type-safe"></div>
                        <div class="distanceBtn" style="background: #f1c40f" id="route-type-normal"></div>
                        <div class="distanceBtn" style="background: #c0392b" id="route-type-fastest"></div>     
                    </div>
                  
                    <label>Стоимость:</label><div id="route-weight"></div>
                    <div id="route-obstacles"></div>
                </div>   
            </div>
        </div>';

?>