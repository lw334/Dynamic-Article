$(document).ready(function(){
  var school_selected = window.location.hash;
  school_selected = school_selected.substring(1);
  school_selected = str_replace('%20',' ',school_selected);
  console.log(school_selected);
  select_school(school_selected);
})