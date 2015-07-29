var EQUIPMENT = 0;
var CONTRACT = 1;
var COMMODITY = 2;
var TRANSPORTATION = 3;
var CONTINGENCY = 4;

var keys;
var input;
var dataset;

//Autocomplete bar
d3.csv("unitlist.csv",function (csv) {
    keys=csv;
    start();
});

//Call back for when user selects a school
function onSelect() {
  d3.json('Article1.json', function(data) {
    dataset = data;
    console.log(input);
  for (i = 0; i < dataset.length; i++){
    if (dataset[i]['Unit Name'] == input) {
      school = dataset[i];
      update_text(school);
    }
  }
});   
}

function retain(d){
  input = d["Unit Name"];
}

//Setup and render the autocomplete
function start() {
    var mc = autocomplete(document.getElementById('user_school'))
            .keys(keys)
            .dataField("Unit Name")
            .placeHolder("Search School - Start typing here")
            .width(960)
            .height(500)
            .onSelected(retain)
            .render();
}

function update_text(school){
    pushText('custom-school-name1',school['Unit Name']);
    pushText('custom-school-name2',school['Unit Name']);
    pushText('custom-school-name3',school['Unit Name']);
    pushText('custom-school-name4',school['Unit Name']);
    pushText('custom-school-name5',school['Unit Name']);
    pushText('custom-consistency', school['Consistency']);
    pushText('custom-consistency-comparison', consistency_comparison_result());
    pushText('custom-total-budget', school['FY2015ApprovedBudget']);
    pushText('custom-salary', toPercent(school['2015Salary%']));
    pushText('custom-benefits', toPercent(school['2015Benefit%']));
    pushText('custom-third', school['LargestSpending']);
    pushText('custom-usage', label(school['LargestSpending']));
    pushText('custom-service-level', comparison_word(school['2015Contract%'], school['AvgSpending'][CONTRACT], "the same level of", "better", "worse"));

    //comparison
    pushText('custom-service-exp', comparison_word(school['2015Contract%'], school['AvgSpending'][CONTRACT], "similar", "better", "worse"));

    pushText('custom-service-training', comparison_word(school['2015Contract%'], school['AvgSpending'][CONTRACT], "similar amount of", "better", "worse"));

    pushText('custom-logic-1', logic_word(school['2015Commodities%'], school['AvgSpending'][COMMODITY], "fortunately", "unfortunately"));
    pushText('custom-commodity-exp', comparison_word(school['2015Commodities%'], school['AvgSpending'][COMMODITY], "about the same as the", "more", "less"));

    pushText('custom-logic-2', logic_word(school['2015Equipment%'], school['AvgSpending'][EQUIPMENT], "on the other hand", "what's more, "));

    pushText('custom-equipment-exp', comparison_word(school['2015Euipment%'], school['AvgSpending'][EQUIPMENT], "similar", "more than", "less than"));

    pushText('custom-transporation-exp', comparison_word(school['2015Transportation%'], school['AvgSpending'][TRANSPORTATION], "similar", "more than", "less than"));

    //2016
    pushText('custom-budget-2016',school['FY 16 Budget    (Core and Supplemental)']);
    pushText('custom-2016-total-percent-change',toPercent(school['% Change from FY 15']));
    pushText('custom-2016-pupil',school['Change in Per Pupil Enrollment Funding']);
    pushText('custom-2016-overall',school['Change in Per Pupil Enrollment Funding']);
}

  //helper functions
function receive() {
  var input = document.getElementById('user_school');
  console.log(input);
  return input;
}

function pushText(id, text) {
  document.getElementById(id).innerHTML = text;
}

function toPercent(num){
  return (num*100).toPrecision(2);
}

// customize texts
function consistency_comparison_result(){
  if (school['Consistency'] == school['MajorityConsistency']){
    return 'in line of';
  }
  else {
    return 'the oppoosed of';
  }
}

function label(spending){      
  if (spending === 'contingency'){
    return 'emergency expenditures';
  }
  else if (spending === 'contract'){
    return 'the resources to fund seminars and work trips, to spend with printing, delivery services, and phones';
  }
  else if (spending === 'equipment') {
    return 'the money spent to improve school infrastructure including building maintenance and technological resources';
  }
  else if (spending === 'commodity'){
    return 'the purchase of software licenses, instructional material, library books, pay for electricity and gas';
  }
}
// return self-defined comparison words
function comparison_word(s_service, avg, same, better, worse){
  if (Math.abs(s_service - avg) <= 0.01) {
    return same;
  }
  else if (s_service > avg) {
    return better;
  }
  else {
    return worse;
  }
}

// return self-defined logic words
function logic_word(s_service, avg, better, worse){
  if (s_service > avg) {
    return better;
  }
  else {
    return worse;
  }
}