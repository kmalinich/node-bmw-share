const module_name = __filename.slice(__dirname.length + 1, -3).replace('-', '_');

const arbids = {
	// These are related to E39/E46/E53
	'0x153' : 'ASC1',  // ABS/ASC/DSC - Speed (E46)
	'0x1F0' : 'ASC1',  // ABS/ASC/DSC - Wheel speeds (E46)
	'0x1F3' : '',
	'0x1F5' : 'ASC1',  // ABS/ASC/DSC - Steering angle sensor (E46)
	'0x316' : 'DME1',  // DME - RPM (E46)
	'0x329' : 'DME1',  // DME - Temp (E46)
	'0x545' : 'DME1',  // DME - CEL/Fuel cons/Overheat/Oil temp/Charging (E46)
	'0x610' : 'DME1',  // DME - VIN/info (E46)
	'0x613' : 'DME1',  // DME - Odometer/Running clock (E46)
	'0x615' : 'DME1',  // DME - A/C request/Outside air temp (E46)
	'0x77C' : '',
	'0x77F' : '',
	'0x7B5' : '',

	// Below are related to iDrive CON - ripped from E90
	'0x273' : 'CIC',   // CIC->CON init message
	'0x264' : 'CON',   // CON rotation
	'0x267' : 'CON',   // CON buttons
	'0x277' : 'CON',   // CON->CIC ACK of init
	'0x4E7' : 'CON',   // CON status
	'0x5E7' : 'CON',   // CON status
	'0x4F8' : 'KOMBI', // Ignition status
	'0x202' : 'FRM1',  // FRM backlight dimmer
};

module.exports = {
	arbids : arbids,

	// 0x273 -> CIC
	h2n : (hex) => {
		let hex_str = '0x'+hex.toString(16).toUpperCase();
		if (arbids[hex_str]) return arbids[hex_str];

		// Didn't find it
		return 'unk';
	},
};
