var budgetControlller = (function(){



	var Expense = function(id, desc, value){
		this.id = id;
		this.desc = desc;
		this.value = value;	
	}


	var Income = function(id, desc, value){
		this.id = id;
		this.desc = desc;
		this.value = value;	
	}

	var data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, desc, value){
			var newItem, ID;

			if (data.allItems[type].length > 0)
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			else
				ID = 0;
			if (type === 'exp')
				newItem = new Expense(ID, desc, value);
			else if (type === 'inc')
				newItem = new Income(ID, desc, value);
		
			data.allItems[type].push(newItem);
			
			return newItem;

		}, 
		testing: function() {
			console.log(data); 

		}
	};


})();



var UIController  = (function(){

	var DOMstrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};


	return {
		getInput: function(){
			return {
			   type: document.querySelector(DOMstrings.inputType).value,
			   desc: document.querySelector(DOMstrings.inputDesc).value,
			   value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};


})();


var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function(){
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event){
			if (event.keyCode === 13  || event.which === 13)
			ctrlAddItem();
		});
	};


	var ctrlAddItem = function() {
		var input, newItem;

		input = UICtrl.getInput(); 
		newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
	
	};

	return {
		init: function() {
			 setupEventListeners();
		}
	}

})(budgetControlller, UIController);

controller.init(); 