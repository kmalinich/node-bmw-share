// Math.ceil to specified decimal places (2nd argument, default 2)
function ceil2(value, places = 2) {
	const multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.ceil(value * multiplier + Number.EPSILON) / multiplier;
}

// Math.floor to specified decimal places (2nd argument, default 2)
function floor2(value, places = 2) {
	const multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.floor(value * multiplier + Number.EPSILON) / multiplier;
}

// Math.round to specified decimal places (2nd argument, default 2)
function round2(value, places = 2) {
	const multiplier = Number((1).toString().padEnd((places + 1), 0));
	return Math.round(value * multiplier + Number.EPSILON) / multiplier;
}

// For use with ADC sensor stats (5V sensors)
function ok2minmax(value) {
	if (value < 0.9) return false;
	if (value > 4.6) return false;
	return true;
}


export default {
	// Functions
	ceil2  : (value, places = 2) => ceil2(value,  places),
	floor2 : (value, places = 2) => floor2(value, places),
	round2 : (value, places = 2) => round2(value, places),

	ok2minmax : (value) => ok2minmax(value),
};
