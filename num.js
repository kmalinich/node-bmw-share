// Math.ceil to specified decimal places (2nd argument, default 2)
function ceil2(value, places = 2) {
	let multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.ceil(value * multiplier + Number.EPSILON) / multiplier;
}

// Math.floor to specified decimal places (2nd argument, default 2)
function floor2(value, places = 2) {
	let multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.floor(value * multiplier + Number.EPSILON) / multiplier;
}

// Math.round to specified decimal places (2nd argument, default 2)
function round2(value, places = 2) {
	let multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.round(value * multiplier + Number.EPSILON) / multiplier;
}

// For use with ADC sensor stats (5V sensors)
function ok2minmax(value) {
	if (value < 0.4) return false;
	if (value > 4.6) return false;
	return true;
}


module.exports = {
	ceil2  : (value) => { return ceil2(value);  },
	floor2 : (value) => { return floor2(value); },
	round2 : (value) => { return round2(value); },

	ok2minmax : (value) => { return ok2minmax(value); },
};
