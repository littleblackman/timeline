<?php
include('files.php');

foreach($images as $image) {

  echo $image.'<br/>';

	$url = "http://myclub.energyacademy.fr/images/children/id/originaux/".$image;
	$withName = $image;
  if ($fp_remote = fopen($url, 'rb')) {
      $local_file = "uploads/originaux/" . $withName;
      $fp_local = fopen($local_file, 'wb');
      while ($buffer = fread($fp_remote, 8192)) {
          fwrite($fp_local, $buffer);
      }
      fclose($fp_local);
  }

}
