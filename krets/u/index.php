<?php
$family = "https://docs.google.com/forms/d/e/1FAIpQLSeBgsHqnCwPUiHd2FDYsvxkDtTEDi94BeoGiNz9_Erf-CnWeg/viewform";
$normal = "https://docs.google.com/forms/d/e/1FAIpQLScW4rGFQtjVOr3FcQQ-QofNYsOKeYEP1VADefRVsRGIGjrf8A/viewform";
$param = "link";
$matches = [];
if (array_key_exists($param, $_GET) && preg_match("/^([nf]).*/", $_GET[$param], $matches)){
    //Something to write to txt log
    $log  = $_SERVER['REMOTE_ADDR'].'; '.date("Y-m-d H:i:s").'; '.$_GET[$param].PHP_EOL;
    //Save string to log, use FILE_APPEND to append.
    file_put_contents('./log_'.date("Ymd").'.log', $log, FILE_APPEND);
    $link = $normal;
    print_r($matches);
    if ($matches[1] == "f"){
        $link = $family;
    }
    header("Location: $link");
    exit();
}
header("HTTP/1.0 404 Not Found");
?>
