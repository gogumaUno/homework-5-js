
function Menu() {
}

Menu.prototype.argumentsToList = function (arg) {

		var args = !arg.length ? [arg] : [].slice.call(arg,1);
		var list = null;

		for (var i = args.length - 1; i >= 0; i--) {
			list = {
				name: args[i].name,
				price: args[i].price,
				cal: args[i].cal,
				rest: list
			}
		}

		return list;
}

Menu.prototype.calculatePrice = function () {
	var price = 0;

	for(var i = 0; i < Object.keys(this).length; i++) {
		for (var el = this[Object.keys(this)[i]]; el ; el = el.rest) {
			price += el.price;
		}
	}

	return price;
}

Menu.prototype.calculateCalories = function () {
    var cal = 0;

    for(var i = 0; i < Object.keys(this).length; i++) {
		for (var el = this[Object.keys(this)[i]]; el ; el = el.rest) {
			cal += el.cal;
		}
	}
  return cal;
}

Menu.prototype.getType = function() {
	return this.constructor.name + ' ' + (this.size || this.type).name;
}

function Hamburger(size, stuffing) {
	if(!stuffing) return new Error('You should choose at least 1 stuffing');
	this.size = this.argumentsToList(size);
	this.stuffing = this.argumentsToList(arguments);
}

Hamburger.prototype = Object.create(Menu.prototype);
Hamburger.prototype.constructor = Hamburger;

Object.defineProperties(Hamburger, {
	'SIZE_SMALL': {
		value: {name: 'small', price: 50, cal: 20},
		enumerable: true
	},

	'SIZE_LARGE': {
		value: {name: 'large', price: 100, cal: 40},
		enumerable: true
	},

	'STUFFING_CHEESE': {
		value: {name: 'cheese', price: 10, cal: 20},
		enumerable: true
	},

	'STUFFING_SALAD': {
		value: {name: 'salad', price: 20, cal: 5},
		enumerable: true
	},

	'STUFFING_POTATO': {
		value: {name: 'potato', price: 15, cal: 10},
		enumerable: true
	}
})


Hamburger.prototype.getStuffing = function() {
	var stuffing = Object.create(null);
	for(var el = this.stuffing; el; el = el.rest) {
		if(!stuffing[el.name]) stuffing[el.name] = 0;
		stuffing[el.name]++;
	}
	return stuffing;
}

function Salad(type, weight) {
	this.type = this.weightCount(this.argumentsToList(type) , weight);
	Object.defineProperty(this, 'weight', {
		value: weight
	});
}

Salad.prototype = Object.create(Menu.prototype);
Salad.prototype.constructor = Salad;

Object.defineProperties(Salad, {
	'SIZE_STANDART': {
		value: 100,
		enumerable: true
	},

	'SIZE_LARGE': {
		value: 200,
		enumerable: true
	},
	'TYPE_CAESAR': {
		value: {name: 'caesar', price: 100, cal: 20},
		enumerable: true
	},

	'TYPE_OLIVIE': {
		value: {name: 'olivie', price: 50, cal: 80},
		enumerable: true
	}
})

Salad.prototype.getWeight = function() {
	return this.weight;
}

Salad.prototype.weightCount = function (obj, weight) {
	for(var i = 0; i < Object.keys(obj).length; i++) {
		if(!isNaN(obj[Object.keys(obj)[i]]) && typeof obj[Object.keys(obj)[i]] === 'number') {
			obj[Object.keys(obj)[i]] *= weight/100; 
		};
	};
	return obj;
}

function Drink(type) {
	this.type = this.argumentsToList(type);
}

Drink.prototype = Object.create(Menu.prototype);
Drink.prototype.constructor = Drink;

Object.defineProperties(Drink, {
	'TYPE_COKE': {
		value: {name: 'coke', price: 50, cal: 40},
		enumerable: true
	},

	'TYPE_COFFEE': {
		value: {name: 'coffee', price: 80, cal: 20},
		enumerable: true
	}
})

function Order() {}

Order.prototype.getMenuItemOptions = function itemProp(cls) {
		var itemPar = Object.create(null);

		if(!itemPar[cls.name]) itemPar[cls.name] = Object.create(null);

		for(var i = 0; i < Object.keys(cls).length; i++) {
			itemPar[cls.name][Object.keys(cls)[i]] = cls[Object.keys(cls)[i]];
		};

		return itemPar[cls.name]; 
}

Order.prototype.addOrderPosition = function(cls, param) {
	if(Object.isFrozen(this)) return;
	
	var item = new (cls.bind.apply(cls, arguments));

	if(item.constructor.name === 'Error') return item;

	if(!this.items) {
		this.items = [];
	}

	this.items.push(item);
}

Order.prototype.getItems = function() {
	var output = function(obj, i) {

		var type = obj.getType(),
			calories = obj.calculateCalories(),
			price = obj.calculatePrice();

		if(obj.constructor.name === 'Hamburger') {
			return console.log('Order position: ' + (i+1), 'Type: ' + type,
			obj.getStuffing(), 'Calories: ' + calories, 'Price: ' + price);
		};

		if(obj.constructor.name === 'Salad') {
			return console.log('Order position: ' + (i+1), 'Type: ' + type,
			'Weight: ' + obj.getWeight(), 'Calories: ' + calories, 'Price: ' + price);
		};

		if(obj.constructor.name === 'Drink') {
			return console.log('Order position: ' + (i+1), 'Type: ' + type,
			'Calories: ' + calories, 'Price: ' + price);
		};
	}

	for(var i = 0; i < this.items.length; i++) {
		output(this.items[i], i);
	}

}

Order.prototype.removePosition = function(index) {
	if(Object.isFrozen(this)) return;
	this.items.splice(index - 1, 1)
}

Order.prototype.calculatePrice = function() {
	Object.defineProperty(this, 'price', {
		value: 0,
		writable: true
	});

	for(var i = 0; i < this.items.length; i++) {
		this.price += this.items[i].calculatePrice();
	}
	return this.price;
}

Order.prototype.calculateCalories = function() {
	Object.defineProperty(this, 'cal', {
		value: 0,
		writable: true
	});

	for(var i = 0; i < this.items.length; i++) {
		this.cal += this.items[i].calculateCalories();
		}

	return this.cal;
}

Order.prototype.getPaid = function() {
	Object.freeze(this);
}
