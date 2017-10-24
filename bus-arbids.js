// const module_name = __filename.slice(__dirname.length + 1, -3).replace('-', '_');

const arbids = {
	// These are related to E39/E46/E53
	'0x153' : 'ASC1', // Speed/DSC light
	'0x1F0' : 'ASC1', // Wheel speeds
	'0x1F3' : 'ASC1', // Transverse acceleration/VSS
	'0x1F5' : 'ASC1', // Steering angle
	'0x1F8' : 'ASC1', // Brake pressure

	'0x316' : 'DME1', // RPM
	'0x329' : 'DME1', // Temp/Brake pedal depressed/Throttle position
	'0x338' : 'DME1', // Sport mode status
	'0x545' : 'DME1', // CEL/Fuel cons/Overheat/Oil temp/Charging/Brake light switch/Cruise control
	'0x610' : 'DME1', // VIN/info
	'0x613' : 'DME1', // Odometer/Running clock/Fuel level [0x615 ACK]
	'0x615' : 'DME1', // A/C request/Outside air temp/Intake air temp/Parking brake/door contacts

	// Below are related to iDrive CON - ripped from E90
	'0x202' : 'FRM1',   // FRM backlight dimmer
	'0x264' : 'CON1',   // CON rotation
	'0x267' : 'CON1',   // CON buttons
	'0x273' : 'CIC1',   // CIC->CON init message
	'0x277' : 'CON1',   // CON->CIC ACK of init
	'0x4E7' : 'CON1',   // CON status
	'0x4F8' : 'KOMBI1', // Ignition status
	'0x5E7' : 'CON1',   // CON status

	// Nobody has ever heard of these..
	'0x77C' : '',
	'0x77F' : '',
	'0x7B5' : '',
};

module.exports = {
	arbids : arbids,

	// 0x273 -> CIC
	h2n : (hex) => {
		let hex_str = '0x' + hex.toString(16).toUpperCase();
		if (arbids[hex_str]) return arbids[hex_str];

		// Didn't find it
		return 'unk';
	},
};
