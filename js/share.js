$(document).ready(function(){
  var school_selected = window.location.hash;
  school_selected = school_selected.substring(1);
  console.log(school_selected);
  select_school(school_selected);
})