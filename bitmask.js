// All 9 bitmasks in hex and dec
const b   = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x00 ];
const bit = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x00 ];
const dec = [    1,    2,    4,    8,   16,   32,   64,  128,    0 ];

// Test number for all bitmasks and return object
// Example output as JSON with 0x89/137 as input
// {
//   "data": {
//     "dec": 137,
//     "hex": "0x89",
//     "set": 3,
//     "unset": 6
//   },
//   "array": {
//     "bits": [ 1, 2, 4, 8, 16, 32, 64, 128, 0 ],
//     "bits_h": [ "0x01", "0x02", "0x04", "0x08", "0x10", "0x20", "0x40", "0x80", "0x00" ],
//     "mask": [ true, false, false, true, false, false, false, true, false ],
//   },
//   "bits": {
//     "bit0": 1,
//     "bit1": 2,
//     "bit2": 4,
//     "bit3": 8,
//     "bit4": 16,
//     "bit5": 32,
//     "bit6": 64,
//     "bit7": 128,
//     "bit8": 0
//   },
//   "bits_h": {
//     "bit0": "0x01",
//     "bit1": "0x02",
//     "bit2": "0x04",
//     "bit3": "0x08",
//     "bit4": "0x10",
//     "bit5": "0x20",
//     "bit6": "0x40",
//     "bit7": "0x80",
//     "bit8": "0x00"
//   },
//   "mask": {
//     "bit0": true,
//     "bit1": false,
//     "bit2": false,
//     "bit3": true,
//     "bit4": false,
//     "bit5": false,
//     "bit6": false,
//     "bit7": true,
//     "bit8": false
//   }
// }
function check(num) {
	// Bounce if it's over a single-bit bitmask (over 0xFF/255)
	if (num > 0xFF) return false;
	if (typeof num === 'undefined' || num === null || num === '') return false;

	// Init return object
	const object = {
		data : {
			dec   : num,
			hex   : hex.i2s(num),
			set   : 0,
			unset : 0,
		},
		array : {
			bits : [],
			mask : [],
		},
		bits : {},
		mask : {},
	};

	// Init loop counter
	let count = 0;

	// Loop bits and push results into return array
	bitmask.bit.forEach((bit) => {
		let result;

		// Alter logic if it's the fake "9th" bitmask
		// Test if number completely equals the bit
		if (bit === bitmask.bit[8]) {
			result = num === bit;
		}
		else { // Test number for bit
			result = bitmask.test(num, bit);
		}

		// Adjust total counters accordingly
		object.data.set   +=  result;
		object.data.unset += !result;

		// Add data to array output
		object.array.bits.push(bit);
		object.array.mask.push(result);

		// Add data to object output
		object.bits['b' + count] = bit;
		object.mask['b' + count] = result;

		object.bits['bit' + count] = bit;
		object.mask['bit' + count] = result;

		// Increment counter
		count++;
	});

	return object;
}

// Create a complete bitmask by setting multiple bits
function create(object) {
	let mask = 0x00;

	// Init loop counter
	let count = 0;

	// Loop bits and set bits based on input object
	bitmask.bit.forEach((bit) => {
		// Skip fake 9th bitmask
		if (count === 8) return;

		if (object['b' + count] || object['bit' + count]) mask = bitmask.set(mask, bit);

		// Increment counter
		count++;
	});

	return mask;
}

// Set a bit in a bitmask
function set(num, bit) {
	num |= bit;
	return num;
}

// Test number for bitmask
function test(num, bit) {
	return num & bit && true || false;
}

// Toggle a bit in a bitmask
function toggle(num, bit) {
	num ^= bit;
	return num;
}

// Unset a bit in a bitmask
function unset(num, bit) {
	num &= ~bit;
	return num;
}


export default  {
	// Variables
	b,
	bit,
	dec,

	// Functions
	check,
	create,
	set,
	test,
	toggle,
	unset,
};
