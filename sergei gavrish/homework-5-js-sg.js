function Menu() {}

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
		var list = this[Object.keys(this)[0]];
		if(Object.keys(this)[1]) list.rest = this[Object.keys(this)[1]];

		for (var el = list; el ; el = el.rest) {
			price += el.price;
		}

	return price;
}

Menu.prototype.calculateCalories = function () {
    var cal = 0;
    var list = this[Object.keys(this)[0]];
    if(Object.keys(this)[1]) list.rest = this[Object.keys(this)[1]];

  	for (var el = list; el ; el = el.rest) {
    	cal += el.cal;
  	}

  return cal;
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

Hamburger.prototype.getSize = function() {
	return this.size.name;
}

Hamburger.prototype.getStuffing = function() {
	var stuffing = {};
	for(var el = this.stuffing; el; el = el.rest) {
		if(!stuffing[el.name]) stuffing[el.name] = 0;
		stuffing[el.name]++;
	}
	return stuffing;
}

function Salad(type) {
	this.type = this.argumentsToList(type);
}

Salad.prototype = Object.create(Menu.prototype);
Salad.prototype.constructor = Salad;

Object.defineProperties(Salad, {
	'TYPE_CAESAR': {
		value: {name: 'caesar', price: 100, cal: 20},
		enumerable: true
	},

	'TYPE_OLIVIE': {
		value: {name: 'olivie', price: 50, cal: 80},
		enumerable: true
	}
})

Salad.prototype.getType = function() {
	return this.type.name;
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

Drink.prototype.getType = function() {
	return this.type.name;
}

function Order() {
	function createInstance(cls) {
		return new (Function.prototype.bind.apply(cls, arguments));
	}

	function itemProp(cls) {
		var itemPar = {};
		if(!itemPar[cls.name]) itemPar[cls.name] = {};
		for(var i = 0; i < Object.keys(cls).length; i++) {
			itemPar[cls.name][Object.keys(cls)[i]] = cls[Object.keys(cls)[i]];
		};
		return (function() {
			return itemPar[cls.name];
		}()); 
	}

	var _count = {};

	Object.defineProperty(this, 'getCount', {
		get: function() {
			return _count;
		}
	});

	Object.defineProperty(this, 'countDown', {
		set: function(cls) {
			_count[cls.name]--;
		}
	});

	Object.defineProperty(this, 'addOrderPosition', {
		value: function(cls, param) {
			if(Object.isFrozen(this)) return;
			if(!this[cls.name]) {
				this[cls.name] = null;
			}

			var element = {
				value: createInstance.apply(cls, Array.prototype.slice.call(arguments))
			};
			element.next = this[cls.name];
			this[cls.name] = element;
			
			if(!_count[cls.name]) _count[cls.name] = 0;
			_count[cls.name]++;
		},
	});

	Object.defineProperty(this, 'getMenuItemOptions', {
		value: itemProp,
	})
}

Order.prototype.removePosition = function(cls, param) {
	if(!this.getCount[cls.name] || this.getCount[cls.name] === 0) {
		return;
	}

	var searchItem = new (Function.prototype.bind.apply(cls, arguments));

	if(deepEqual(this[cls.name].value, searchItem)) {
		this[cls.name] = this[cls.name].next;
		this.countDown = cls;
		return;
	}

	function deepEqual(a, b) {
		if (a === b) return true;
		if (a == null || typeof a != "object" ||
			b == null || typeof b != "object") return false;
		var keysA = Object.keys(a), keysB = Object.keys(b);
		if (keysA.length != keysB.length) return false;
		for (var i = 0; i < keysA.length; i++) {
		if (!keysB.includes(keysA[i]) || !deepEqual(a[keysA[i]], b[keysA[i]])) return false;
		}
		return true;
	}

	var previous = this[cls.name];
	var current = previous.next;
	
	for(var el = current; el; el.next) {
		if(deepEqual(current.value, searchItem)) {
			previous.next = current.next;
			return;
		}
		previous = current;
		current = current.next;
    }
}

Order.prototype.calculatePrice = function() {
	Object.defineProperty(this, 'price', {
		value: 0,
		writable: true
	});
	for(var i = 0; i < Object.keys(this).length; i++) {
		for(var j = this[Object.keys(this)[i]]; j; j = j.next) {
			this.price += j.value.calculatePrice();
		}
	}
	return this.price;
}

Order.prototype.calculateCalories = function() {
	Object.defineProperty(this, 'cal', {
		value: 0,
		writable: true
	});
	for(var i = 0; i < Object.keys(this).length; i++) {
		for(var j = this[Object.keys(this)[i]]; j; j = j.next) {
			this.cal += j.value.calculateCalories();
		}
	}
	return this.cal;
}

Order.prototype.getPaid = function() {
	Object.freeze(this);
}
