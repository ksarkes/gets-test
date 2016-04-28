<?php

include_once('../include/methods_url.inc');
include_once('../include/utils.inc');

header ('Content-Type:text/xml');

$xml_post = file_get_contents('php://input');

if (!$xml_post) {
    send_error(1, 'Error: no input file');
    die();
}

libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadXML($xml_post);

if (!$dom) {
    send_error(1, 'Error: resource isn\'t XML document.');
    die();
}

if (!$dom->schemaValidate('schemes/uploadFile.xsd')) {
    send_error(1, 'Error: not valid input XML document.');
    die();
}

$auth_token = get_request_argument($dom, 'auth_token');
$title = get_request_argument($dom, 'title');

session_start();
$sess_id = session_id();

$post_url = UPLOAD_URL . '?id=' . $sess_id;
$response = '<post_url>' . htmlspecialchars($post_url) . '</post_url>';

$_SESSION['auth_token'] = $auth_token;
$_SESSION['title'] = $title;

send_result(0, 'success', $response);

?>
