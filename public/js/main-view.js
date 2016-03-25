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

Item = Backbone.Model.extend({});
ItemCollection = Backbone.Collection.extend({
    model: Item
});

ItemListView = Backbone.View.extend({
    tagName: "ul",
    clickAction: null,
    events: {
        "click a": "clicked"
    },
    initialize: function(options) {
    	this.clickAction = options.clickAction;
    },

    clicked: function(e){
        e.preventDefault();
        var name = $(e.currentTarget).data("name");
        if (this.clickAction == null ) {
        	alert(name);
        }
        else {
        	this.clickAction(name);
        }
    },
    
    render: function(){
    	var template = _.template($("#dropdown-item-template").html());
    	var el = $(this.el);
        this.collection.each(function(model){
            var html = template(model.toJSON());
            el.append(html);
        });
    }
});

var genders = new ItemCollection([
    {name: "Any"},
    {name: "Female"},
    {name: "Male"}
]);
var genderSelector = new ItemListView({el: $("#gender-selector"), 
	collection: genders,
	clickAction: filterByGender
});
genderSelector.render();

var ages = new ItemCollection([
    {name: "0"},
    {name: "1"},
    {name: "2"},
    {name: "3"},
    {name: "4"},
    {name: "5"}   
]);
var ageSelector = new ItemListView({el: $("#age-selector"), 
	collection: ages,
	clickAction: filterByAge
});
ageSelector.render();

var countries = new ItemCollection([
    {name: "USA"},
    {name: "CHN"},
    {name: "IND"}
]);
var countrySelector = new ItemListView({el: $("#add-country-selector"), 
	collection: countries, 
	clickAction: addNewTab
});
countrySelector.render();

function filterByGender(gender) {
	alert("filter by" + gender);
	vaccineView.filterByGender(gender);
}

function filterByAge(age) {
	vaccineView.filterByAge(age);
}

function toTableRows(rawData, countryCode, filters) {
	var rows = []
	if (countryCode in rawData) {
		var data = rawData[countryCode];
		for (var idx in data) {
			if (data[idx] == null || isFiltered(filters, data[idx])) {
				continue;
			}
			else {
				rows.push([
					data[idx]['age_from'],data[idx]['name'],
					data[idx]['dose'][0] + ' of ' + data[idx]['dose'][1]
				]);
			}
		}
	}
	return rows;
}

function isFiltered(filters, data) {
	console.log("point 1");
	if (filters == null) {
		console.log("point 2");
		return false;
	}
	else {
		for (var fieldName in filters) {
			console.log("point 3 " + fieldName);
			switch (fieldName.toLowerCase()) {
				case 'age': 
					console.log("point 4 " + filters[fieldName]);
					if (data['age_from'] > filters[fieldName]) {
						return true;
					}
					break;
				default:
					continue;
			}
		}
		return false;
	}
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

var VaccineTab = Backbone.View.extend({
	options: {
		filters: { //e.g.
			//age: 1
		}
	},
    initialize: function(options){
    	if (options) {
    		this.options = options;
    	}
    	else {
    		this.options = {};
    	}
    },
    render: function(tableId, countryCode) {
		vaccineData = toTableRows(rawData, 
				this.options.countryCode, 
				this.options.filters);
		var tableId = this.options.tableId;
		$(document).ready(function() {
		    var table = $('#' + tableId).DataTable( {
		        //data: vaccineData,
		        searching: false,
		        paging: false,
		    	ordering:  false
		    });
		    table.clear();
		    table.rows.add(vaccineData).draw();
		} );    	
    },
    redraw: function(tableId, countryCode) {
    	console.log("tab rendering " + Object.keys(this.options) );
		vaccineData = toTableRows(rawData, 
				this.options.countryCode, 
				this.options.filters);
		console.log("tab rendering2 " + vaccineData );
		var tableId = this.options.tableId;
		var table = $('#' + tableId).DataTable();    
		table.clear();
		table.rows.add(vaccineData).draw();	
    },
    events: {
        "click .add-tab": "addTab",
        "click .del-tab": "deleteTab",
    },
    deleteTab: function() {
    	this.remove();
    },
    filterByAge: function(age) {
    	if (this.options.filters) {
    		this.options.filters['age'] = age;
    	}
    	else {
    		this.options['filters'] = {'age': age};
    	}
    	return this;
    }
});

//initiate the vaccine-view
var VaccineView = Backbone.View.extend({
    el: $('#vaccine-view'),
    options: {
    	tabIdSeq: 0, 
    	tabList: []
    },
    initialize: function(){
    	this.options = {tabIdSeq: 0, tabList: []}; 
    	this.render();
    },
    render: function() {
    	this.addTab("USA"); 	
    },
    addTab: function(countryCode) {
    	//add the vaccine tab for default country "USA"
    	var cId = this.options.tabIdSeq++;
    	var containerId = "vaccine-tab-" + cId;
    	var tableId = "vaccine-table-" + cId;
    	var variables = {
    		tab_container_id: containerId, 
    		vaccine_table_id: tableId,
    		country_code: countryCode
    	};
      	var template = _.template( $("#vaccine-tab-template").html());
      	this.$el.append( template(variables) );
      	if (cId == 0) {
      		this.$('.del-tab').remove();
      	}

      	var newTab = new VaccineTab({
      		'el': $("#" + containerId),
      		'tableId': tableId,
      		'countryCode': countryCode
      	});
      	newTab.render();
      	this.options.tabList.push(newTab);
    },
    filterByAge: function(age) {
    	for (tabIdx in this.options.tabList) {
    		var tab = this.options.tabList[tabIdx];
    		if (tab != null) {
    			tab.filterByAge(age).redraw();
    		}
    	}
    },
    filterByGender: function(gender) {
    	alert("Filter by gender is not ready yet!");
    }
});

var vaccineView = new VaccineView();

function addNewTab(countryCode) {
	vaccineView.addTab(countryCode);
}

