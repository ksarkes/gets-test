<?php
echo   '<div id="socials-main-page" class="action-menu-container hidden">
            <div id="socials-main-overlay" class="busy-overlay"></div>
            <div class="action-menu-toolbar-container">
                <div class="btn-group btn-group-justified">
                    <div class="btn-group">
                        <a id="socials-main-add-social" class="btn btn-default" href="#form=social_add" title="' . getString('add-social','Add social') . '" role="button">
                            <span class="glyphicon glyphicon-plus"></span> ' . getString('add-social','Add social') . '
                        </a>
                    </div>                   
                </div>
            </div>
             <div id = "category" class = "Interface" align="center">
                <label><input type="radio" name="disabilities" id = "blind" checked = "checked" class="disabilitiesSelect" ><div id = "blind_img" title="С нарушениями зрения"></div></label>
                <label><input type="radio" name="disabilities" id = "deaf" class="disabilitiesSelect"><div id = "deaf_img" title="С нарушениями слуха"></div></label>
                <label><input type="radio" name="disabilities" id = "mental" class="disabilitiesSelect"><div id = "mental_img" title="С нарушениями умственного развития"></div></label>
                <label><input type="radio" name="disabilities" id = "muscle" class="disabilitiesSelect"><div id = "muscle_img" title="С нарушениями опорно-двигательного аппарата"></div></label>
                <label><input type="radio" name="disabilities" id = "wheelchair" class="disabilitiesSelect"><div id = "wheelchair_img" title="Передвигающиеся на креслах-колясках"></div></label>
                </div>
            <div class="action-menu-inner-content">
                <ul id="scopes-list" class="list-group">
                </ul>
            </div>
            <div class="action-menu-inner-content">
                <ul id="social-list" class="list-group">
                </ul>
            </div>
        </div>';

?>