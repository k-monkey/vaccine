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


function toTableRows(rawData, countryCode) {
	var rows = []
	if (countryCode in rawData) {
		var data = rawData[countryCode];
		for (var idx in data) {
			if (data[idx] != null) {
				rows.push([
					data[idx]['age_from'],data[idx]['name'],
					data[idx]['dose'][0] + ' of ' + data[idx]['dose'][1]
				]);
			}
		}
	}
	return rows;
}


function toTableHeaders(data, countryCode) {
	var headers = "<thead>";
	headers += "<tr><th colspan=3>" + countryCode + 
			"</th></tr>";

	//add 2nd level headers
	headers += "<tr>";
	if (countryCode in data) {
		for (nameIdx in columnNames) {
			headers += "<th>" + columnNames[nameIdx] + "</th>";
		}
	}
	headers += "</thead>"; 
	return headers;
}

//list of countries for which we display the vaccine view
//we allow at most 3 countries
var viewList = {'default-view': 'USA', '1st-view': null, '2nd-view': null};

var VaccinePanel = Backbone.View.extend({
    el: 'html', //root of the DOM //TODO: limit the view to vaccine-view div only
    events: {
        "change #age-selector": "filterByAge",
    	"change #add-country-selector": "addTabFromSelector" 
    },
    filterByAge:function(e){
        vaccineList.search(this.$('#age-selector').val(), ['age']);
    },
    addTabFromSelector: function() {
    	addNewTab($('#add-country-selector').val());
    }
});

new VaccinePanel();

var VaccineTab = Backbone.View.extend({
    initialize: function(){
    },
    render: function(tableId, countryCode) {
		vaccineData = toTableRows(rawData, countryCode);
		$(document).ready(function() {
		    $('#' + tableId).DataTable( {
		        data: vaccineData,
		        searching: false,
		        paging: false,
		    	ordering:  false
		    });
		} );    	
    },
    events: {
        "click .add-tab": "addTab",
        "click .del-tab": "deleteTab",
    },
    addTab: function() {
    	addNewTab("CHN");
    },
    deleteTab: function() {
    	this.remove();
    }
});

//initiate the vaccine-view
var VaccineView = Backbone.View.extend({
    el: $('#vaccine-view'),
    variables: {},
    initialize: function(){
    	this.variables = {tabCount: 0, tabList: []}; 
    	this.render();
    },
    render: function() {
    	this.addTab("USA"); 	
    },
    addTab: function(countryCode) {
    	//add the vaccine tab for default country "USA"
    	var cId = this.variables.tabCount++;
    	var containerId = "vaccine-tab-" + cId;
    	var tableId = "vaccine-table-" + cId;
    	var variables = {
    		tab_container_id: containerId, 
    		vaccine_table_id: tableId,
    		country_code: countryCode};
      	var template = _.template( $("#vaccine-tab-template").html());
      	this.$el.append( template(variables) );
      	if (cId == 0) {
      		this.$('.del-tab').remove();
      	}

      	var newTab = new VaccineTab({el: $("#" + containerId)});
      	newTab.render(tableId, countryCode);
      	this.variables.tabList.push(newTab);
    }
});

var vaccineView = new VaccineView();

function addNewTab(countryCode) {
	vaccineView.addTab(countryCode);
}

