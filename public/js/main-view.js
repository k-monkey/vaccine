function toTableRows(rawData) {
	var rows = []
	for (var idx in rawData) {
		if (rawData[idx] != null) {
			rows.push([
				rawData[idx]['age_from'],rawData[idx]['name'],
				rawData[idx]['dose'][0] + ' of ' + rawData[idx]['dose'][1]

								,rawData[idx]['age_from'],rawData[idx]['name'],
				rawData[idx]['dose'][0] + ' of ' + rawData[idx]['dose'][1],
			]);
		}
	}
	return rows;
}

var dummyData = {'USA': [{'vaccineCode': 'HepB1', 'age_from': 0, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [1,3]},
{'vaccineCode': 'HepB2', 'age_from': 1, 'age_to': 2, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [2,3]}
],
'CHN': [{'vaccineCode': 'HepB1', 'age_from': 0, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [1,3]},
{'vaccineCode': 'HepB2', 'age_from': 1, 'age_to': 2, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [2,3]}
]};

var rawData = dummyData;

var visibleTabs = {'default': 'USA', 'tab1': 'CHN'};
var	columnNames = ["Age", "Vaccine", "Dose"];

function toTableHeaders(data) {
	var headers = "<thead>";

	//add country name as first level header
	headers += "<tr>";
	for (tab in visibleTabs) {
		if (visibleTabs[tab] in data) {
			headers += "<th colspan=3>" + visibleTabs[tab] + "</th>";
		}
	}
	headers += "</tr>";

	//add 2nd level headers
	headers += "<tr>";
	for (tab in visibleTabs) {
		if (visibleTabs[tab] in data) {
			for (nameIdx in columnNames) {
				headers += "<th>" + columnNames[nameIdx] + "</th>";
			}
		}
	}
	headers += "</thead>"; 
	return headers;
}

/**
Add a vaccine table into the given tableContainer.
tableContainer: a <div> object in which we add the table
tableId: the id of the table.
countryCode: the country from which the data should be pulled.
*/
function addVaccineTable(tableContainer, tableId, countryCode) {
	tableContainer.innerHTML = "<table id='" + tableId + "' class='display' cellspacing='0' width='100%'/>" +
		toTableHeaders(rawData) + "</table>"; 
	vaccineData = toTableRows(rawData[countryCode]);
	$(document).ready(function() {
	    $('#' + tableId).DataTable( {
	        data: vaccineData,
	        searching: false,
	        paging: false,
	    	ordering:  false
	    });
	} );
} 

addVaccineTable(document.getElementById('vaccine-tab-default'), 'vaccine-table-default', 'USA');


//list of countries for which we display the vaccine view
//we allow at most 3 countries
var viewList = {'default-view': 'USA', '1st-view': null, '2nd-view': null};

var VaccineView = Backbone.View.extend({
    el: 'html', //root of the DOM //TODO: limit the view to vaccine-view div only
    events: {
        "change #age-selector": "filterByAge" 
    },

    filterByAge:function(e){
        vaccineList.search(this.$('#age-selector').val(), ['age']);
    }
});

new VaccineView();
