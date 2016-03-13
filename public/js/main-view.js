var dummyData = [{'vaccineId': '1', 'age_from': 0, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [1,3]},
{'vaccineId': '2', 'age_from': 1, 'age_to': 2, 'country_code': 'USA', 'name': 'Hepatitis B', 
'description': 'Hepatitis B virus (chronic inflammation of the liver, life-long complications)', 
'dose': [2,3]}
];

var headerOptions = {
  valueNames: [ 'age', 'name', 'dose', 'description']
};

var userList = new List('vaccine-view', headerOptions);

var VaccineView = Backbone.View.extend({
    el: 'html', //root of the DOM //TODO: limit the view to vaccine-view div only
    events: {
        "change #age-selector": "filterByAge" 
    },

    filterByAge:function(e){
        userList.search(this.$('#age-selector').val(), ['born']);
    }
});

new VaccineView();

function toTableRows(rawData) {
	var rows = []
	for (var idx in rawData) {
		if (rawData[idx] != null) {
			rows.push({
				'age': rawData[idx]['age_from'],
				'name': rawData[idx]['name'],
				'dose': rawData[idx]['dose'][0] + ' of ' + rawData[idx]['dose'][1],
				'description': rawData[idx]['description'],
			});
		}
	}
	return rows;
}

var vaccineViewRows = toTableRows(dummyData);
for (var idx in vaccineViewRows) {
	userList.add(vaccineViewRows[idx]);
}