<?php

class Humain {

  /* creee id unique à partir d'un text
  * retourne une string;
  */
  public function createUniqueId()
  {
      $text = "sandy";
      $newText = sha1($text);
      return $newText;
  }

}


///// dans ton fichier main

$perso = new Humain();
