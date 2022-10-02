<?php
$templateOptions = array();

// $templateOptions[] = array(
//     "name"=> "Theme Style",
//     "description" => $this->user->lang("Please select one of the two overall styles you want to use"),
//     "values" => array("Light*", "Dark")
// );
// $templateOptions[] = array(
//     "name"=> "Theme Color",
//     "description" => $this->user->lang("Customize the feel of your client portal by selecting from the availble style colors"),
//     "values" => array("Blue*", "Blue Midnight", "Gray", "Gray Asbestos", "Red", "Green", "Green Turquoise", "Green Emerland", "Orange", "Orange Carrot", "Purple Amethyst")
// );
$templateOptions[] = array(
    "name"=> "Show Action Boxes",
    "description" => $this->user->lang("Shows stylish boxes for most used actions plus any active public snapins"),
    "values" => array("Yes*", "No")
);
$templateOptions[] = array(
    "name"=> "Show Package List in Dashboard",
    "description" => $this->user->lang("In the client portal, have the client's package list appear in the dashboard"),
    "values" => array("Yes*", "No")
);
$templateOptions[] = array(
    "name"=> "Show Domain List in Dashboard",
    "description" => $this->user->lang("In the client portal, have the client's domain list appear in the dashboard"),
    "values" => array("Yes*", "No")
);
