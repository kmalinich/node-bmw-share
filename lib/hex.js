// ASCII to hex for IKE/MID message
function a2h(data) {
	const array = [];

	for (let n = 0, l = data.length; n < l; n++) {
		array.push(data.charCodeAt(n));
	}

	return array;
}

// Convert hex to ASCII
function h2a(data) {
	data    = data.toString();
	let str = '';

	for (let i = 0; i < data.length; i += 2) { str += String.fromCharCode(parseInt(data.substr(i, 2), 16)); }

	return str;
}

// Convert hex to string
function h2s(data) {
	data = Buffer.from(data);

	// IKE text, BMBT/MID/GT menu text
	if (data[0] === 0x21) data = data.slice(4); // MID menu
	if (data[0] === 0x23) data = data.slice(4);
	if (data[0] === 0x24) data = data.slice(3);

	// IKE text suffix
	if (data[data.length - 1] === 0x04) data = data.slice(0, -1);

	// Format
	data = data.toString();
	data = data.replace(/�/g, '°');
	data = data.replace(/ {2}/g, ' ');

	data = data.trim();
	return data;
}

// Convert integer to hex string
// Useful for CANBUS ARBIDs, etc
//
// hex.i2s(191) => '0xBF'
function i2s(data, prefix = true, length = 2) {
	if (typeof data === 'undefined' || data === null || data === '') return false;

	let hexstr = data.toString(16).toUpperCase().padStart(length, '0');
	if (prefix === true) hexstr = '0x' + hexstr;
	return hexstr;
}


export default {
	a2h,
	h2a,
	h2s,
	i2s,
};
