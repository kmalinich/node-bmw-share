// Process to N decimal places
function ceil2(value, places = 2) {
	let multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.ceil(value * multiplier + Number.EPSILON) / multiplier;
}

function floor2(value, places = 2) {
	let multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.floor(value * multiplier + Number.EPSILON) / multiplier;
}

function round2(value, places = 2) {
	let multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.round(value * multiplier + Number.EPSILON) / multiplier;
}


module.exports = {
	ceil2  : (value) => { return ceil2(value);  },
	floor2 : (value) => { return floor2(value); },
	round2 : (value) => { return round2(value); },
};
