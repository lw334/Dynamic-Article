var EQUIPMENT = 0;
var CONTRACT = 1;
var COMMODITY = 2;
var TRANSPORTATION = 3;
var CONTINGENCY = 4;

var school_data;
var dataset;
var name_to_unit = {}
//Autocomplete bar
d3.csv("./js/data/unitList.csv",function (csv) {
    school_data=csv;
    init_autocomplete();
});

//Call back for when user selects a school
function select_school(school_name) {
  d3.json('./js/data/article1.json', function(error, data) {
    if (error) throw error;
    window.dataset = data;
    for (i = 0; i < dataset.length; i++){
      if (dataset[i]['Unit Name'] == school_name) {
        var school = dataset[i];
        simi = school["SimilarNames"];
        similars = simi.trim().split(",");
        for (j = 0; j < similars.length; j ++){
        similars[j] = similars[j].trim().replace("'","").replace("[","").replace("]","").replace("'","");
        }
      }
    }   
    update_text(school); 
    draw_scatter_plot(school,similars,dataset);
    draw_line_chart(school_name,similars);
    draw_pie_chart(school_name);
  });   
}

//Setup and render the autocomplete
function init_autocomplete() {
    select_school('Stephen F Gale Community Academy');
    var ac_data = [];
    for (var i = 0; i < school_data.length; i++) {
      //ac_data.push({label: school_data[i]['Unit Name'], value: school_data[i]['Unit']})
      ac_data.push(school_data[i]['Unit Name'])
      name_to_unit[school_data[i]['Unit Name']] = school_data[i]['Unit']
    };

    $("#user_school").autocomplete({
      minLength: 4,
      source: ac_data,
      select: function( event, ui ) {
        var school_name = event.target.value;
        console.log("select handler user selected " + school_name + " aka " + name_to_unit[school_name]);
        select_school(school_name);
      }
    }).autocomplete("widget").addClass("fixed-height");
}

function update_text(school){
    pushText('custom-school-name1',school['Unit Name']);
    pushText('custom-school-name2',school['Unit Name']);
    pushText('custom-school-name3',school['Unit Name']);
    pushText('custom-school-name4',school['Unit Name']);
    pushText('custom-school-name5',school['Unit Name']);
    pushText('custom-consistency', school['Consistency']);
    pushText('custom-consistency-comparison', consistency_comparison_result(school));
    pushText('custom-total-budget', currencyFormat(school['FY2015ApprovedBudget']));
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
    pushText('custom-budget-2016',currencyFormat(school['FY 16 Budget    (Core and Supplemental)']));
    pushText('custom-2016-total-percent-change',toPercent(school['% Change from FY 15']) + " " + logic_word(school['% Change from FY 15'], 0, "more", "less"));
    pushText('custom-2016-pupil', currencyFormat(Math.abs(school['Change in Per Pupil Enrollment Funding'])) + " " + logic_word(school['Change in Per Pupil Enrollment Funding'], 0, "more", "less"));
}

function currencyFormat(number)
{
   var decimalplaces = 0;
   var decimalcharacter = "";
   var thousandseparater = ",";
   number = parseFloat(number);
   var sign = number < 0 ? "-" : "";
   var formatted = new String(number.toFixed(decimalplaces));
   if( decimalcharacter.length && decimalcharacter != "." ) { formatted = formatted.replace(/\./,decimalcharacter); }
   var integer = "";
   var fraction = "";
   var strnumber = new String(formatted);
   var dotpos = decimalcharacter.length ? strnumber.indexOf(decimalcharacter) : -1;
   if( dotpos > -1 )
   {
      if( dotpos ) { integer = strnumber.substr(0,dotpos); }
      fraction = strnumber.substr(dotpos+1);
   }
   else { integer = strnumber; }
   if( integer ) { integer = String(Math.abs(integer)); }
   while( fraction.length < decimalplaces ) { fraction += "0"; }
   temparray = new Array();
   while( integer.length > 3 )
   {
      temparray.unshift(integer.substr(-3));
      integer = integer.substr(0,integer.length-3);
   }
   temparray.unshift(integer);
   integer = temparray.join(thousandseparater);
   return "$" + sign + integer + decimalcharacter + fraction;
}
  //helper functions

function pushText(id, text) {
  document.getElementById(id).innerHTML = text;
}

function toPercent(num){
  return (Math.abs(num)*100).toPrecision(2) + "%";
}

// customize texts
function consistency_comparison_result(school){
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
