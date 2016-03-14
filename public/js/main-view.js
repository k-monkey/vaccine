function toTableRows(rawData) {
	var rows = []
	for (var idx in rawData) {
		if (rawData[idx] != null) {
			rows.push({
				'age': rawData[idx]['age_from'],
				'name': rawData[idx]['name'],
				'dose': rawData[idx]['dose'][0] + ' of ' + rawData[idx]['dose'][1],
				'description': rawData[idx]['description']
			});
		}
	}
	return rows;
}

var dummyData = {'USA': [{'vaccineId': '1', 'age_from': 0, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [1,3]},
{'vaccineId': '2', 'age_from': 1, 'age_to': 2, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [2,3]}
],
'CHN': [{'vaccineId': '1', 'age_from': 0, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [1,3]},
{'vaccineId': '2', 'age_from': 1, 'age_to': 2, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [2,3]}
]};

//list of countries for which we display the vaccine view
//we allow at most 3 countries
var viewList = {'default-view': 'USA', '1st-view': null, '2nd-view': null};

var headerOptions = {
  valueNames: [ 'age', 'name', 'dose']
};

var vaccineList = new List('vaccine-view', headerOptions); 

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

var vaccineViewRows = toTableRows(dummyData['USA']);
for (var idx in vaccineViewRows) {
	vaccineList.add(vaccineViewRows[idx]);
}

vaccineList.remove('name', 'dummy');