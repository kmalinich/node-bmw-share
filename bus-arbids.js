// CANBUS ARBIDs
//
// CON1 : iDrive controller
// NBT1 : NBT_HU (HW07)
const arbids = {
	'0x0BF' : 'CON1', // CON1 touchpad
	'0x264' : 'CON1', // CON1 rotation
	'0x267' : 'CON1', // CON1 buttons
	'0x277' : 'CON1', // CON1->NBT1 ACK of init
	'0x4E7' : 'CON1', // CON1 status
	'0x5E7' : 'CON1', // CON1 status

	// Below are related to iDrive CON1 - ripped from E90/F10/G30
	'0x202' : 'FRM1',   // FRM backlight dimmer
	'0x4F8' : 'KOMBI1', // Ignition status

	// Below are related to NBT1 retrofit
	'0x12F' : 'CAS1', // NBT1/ZBE1 wakeup
	'0x130' : 'CAS1', // Ignition status, key status
	'0x1D6' : 'SZL1', // Steering wheel controls
	'0x26E' : 'CAS1', // Ignition status
	'0x2FC' : 'CAS1', // Door status
	'0x380' : 'CAS1', // VIN, info
	'0x7C3' : 'CAS1', // Keyfob
	'0x273' : 'NBT1', // NBT1->CON1 init message
	'0x000' : 'NBT1',


	// These are related to E38/E39/E46/E53
	'0x153' : 'ASC1', // Speed, DSC light
	'0x1F0' : 'ASC1', // Wheel speeds
	'0x1F3' : 'ASC1', // Transverse acceleration, VSS
	'0x1F5' : 'ASC1', // Steering angle
	'0x1F8' : 'ASC1', // Brake pressure

	'0x316' : 'DME1', // RPM
	'0x329' : 'DME1', // Temp, brake pedal depressed, throttle position
	'0x338' : 'DME1', // Sport mode status
	'0x545' : 'DME1', // CEL, fuel cons, overheat, oil temp, charging, brake light switch, cruise control
	'0x610' : 'DME1', // VIN, info
	'0x613' : 'DME1', // Odometer, running clock, fuel level [0x615 ACK]
	'0x615' : 'DME1', // A/C request, outside air temp, intake air temp, parking brake, door contacts


	// Appears to be message priority inversion
	'0x77C' : '',
	'0x77F' : '',
	'0x7B5' : '',
};

// Array of CANBUS ARBIDs to ignore
const arbids_ignore = [
	'0x77C',
	'0x77F',
	'0x7B5',
];


// 0x273 -> NBT1
function h2n(hex) {
	let hex_str = '0x' + hex.toString(16).padStart(0, 0).toUpperCase();
	if (arbids[hex_str]) return arbids[hex_str];

	// Didn't find it
	return 'unk';
}

module.exports = {
	arbids        : arbids,
	arbids_ignore : arbids_ignore,

	h2n : h2n,
};
