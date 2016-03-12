var options = {
  valueNames: [ 'name', 'born' ]
};

var userList = new List('vaccine-view', options);

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