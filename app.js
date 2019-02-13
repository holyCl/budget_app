var budgetControlller = (function(){



	var Expense = function(id, desc, value){
		this.id = id;
		this.desc = desc;
		this.value = value;	
		this.percentage = -1;
	}

	Expense.prototype.calculatePercentage = function(totalIncome)
	{
		if (totalIncome > 0)
			this.percentage = Math.round((this.value / totalIncome) * 100);
		else
			this.percentage = -1;
	};

	Expense.prototype.getPercentage = function()
	{
		return this.percentage;
	}

	var Income = function(id, desc, value){
		this.id = id;
		this.desc = desc;
		this.value = value;	
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;
	};


	var data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentSpent: -1
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

		deleteItem: function(type, id)
		{
			var ids, index;
			
			ids = data.allItems[type].map(
				function(current){
					return current.id;
				});
			console.log(ids);
			console.log(id);

			index = ids.indexOf(id);
			console.log(index);

			if (index !== -1)
				data.allItems[type].splice(index, 1);
		},
		
		calculateBudget: function(){
			calculateTotal('exp');
			calculateTotal('inc');
			data.budget = data.totals.inc - data.totals.exp;
			data.totals.inc > 0 ? data.percentSpent = Math.round((data.totals.exp / data.totals.inc) * 100) : 0;
		},

		calculatePercentage: function(){
			data.allItems.exp.forEach(function(cur){
				cur.calculatePercentage(data.totals.inc);

			});

		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentSpent: data.percentSpent
			}
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
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		itemPercent: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var nodeListForEach = function(list, callback){
		for (var i = 0; i<list.length; i++){
			callback(list[i], i);
		}
	};

	var	formatNumber = function(num, type)
	{
		var numSplit, int, dec, type, sign;

		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split('.');
		int = numSplit[0];
		if (int.length > 3){
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}
		dec = numSplit[1];
		type === 'exp' ? sign = '-' : sign = '+';
		return sign + ' ' + int + '.' + dec; 
	};

	return {
		getInput: function(){
			return {
			   type: document.querySelector(DOMstrings.inputType).value,
			   desc: document.querySelector(DOMstrings.inputDesc).value,
			   value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type){
			var html, newHtml, element;

			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			else if (type === 'exp'){
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			newHtml = newHtml.replace('%desc%', obj.desc);


			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorID){
			var element;

			element = document.getElementById(selectorID); 
			element.parentNode.removeChild(element);
		},

		clearFelds: function(){
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
			
			fieldsArr = Array.prototype.slice.call(fields);
		
			fieldsArr.forEach(function(current, index, array){
				current.value = "";

			});
			fieldsArr[0].focus();
		},

		displayBudget: function(obj){

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			if (obj.percentSpent > 0)
				document.querySelector(DOMstrings.percentageLabel).textContent = (obj.percentSpent + '%');
			else
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';

		},


		displayPercentages: function(percentages){

			var fields = document.querySelectorAll(DOMstrings.itemPercent);


			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0)
					current.textContent = percentages[index] + '%';
				else
					current.textContent = '---';
			});
		},

		displayMonth: function(){

			var now, month, year, months;

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			now = new Date();

			month = now.getMonth();

			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month - 1] + ' ' + year;
		},

		changedType: function(){

			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDesc + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function(cur){
				cur.classList.toggle('red-focus');
			})
			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');			

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
	

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

	};



	var updateBudget = function(){
		var budget;

		budgetCtrl.calculateBudget();

		budget = budgetCtrl.getBudget();

		UICtrl.displayBudget(budget);

	}

	var updatePercantages = function() {
		budgetCtrl.calculatePercentage();

		var percentages = budgetCtrl.getPercentages();

		UICtrl.displayPercentages(percentages);

	}

	var ctrlAddItem = function() {
		var input, newItem;

		input = UICtrl.getInput();
		if ((!isNaN(input.value) && input.value > 0)  && input.desc.length > 0){ 
			newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
			UICtrl.addListItem(newItem, input.type);
			UICtrl.clearFelds();
			updateBudget();
			updatePercantages();
		}
	};

	var ctrlDeleteItem = function(event){
		var itemID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;		
		if (itemID)
		{
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);
			budgetCtrl.deleteItem(type,id);
			UICtrl.deleteListItem(itemID);
			updateBudget();
			updatePercantages();

		}

	};

	return {
		init: function() {
			console.log("DAS");
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentSpent: -1
			});
			setupEventListeners();
		}
	}

})(budgetControlller, UIController);

controller.init(); 