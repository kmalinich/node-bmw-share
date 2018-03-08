// CANBUS ARBIDs
//
// CON1 : iDrive controller
// NBT1 : NBT_HU (HW07)
const arbids = {
	// Related to iDrive CON1 - ripped from E90/F10/G30
	'0x202' : 'FEM1', // Backlight dimmer

	'0x4F8' : 'KOMBI1', // Ignition status

	// Related to NBT1 retrofit
	'0x12F' : 'CAS1', // NBT1/ZBE1 wakeup
	'0x130' : 'CAS1', // Ignition status, key status

	'0x1D6' : 'SZL1', // Steering wheel controls

	'0x26E' : 'CAS1', // Ignition status
	'0x2FC' : 'CAS1', // Door status
	'0x380' : 'CAS1', // VIN, info
	'0x7C3' : 'CAS1', // Keyfob


	'0xBF'  : 'CON1', // Touchpad
	'0x0BF' : 'CON1', // Touchpad
	'0x264' : 'CON1', // Rotation
	'0x267' : 'CON1', // Buttons
	'0x4E7' : 'CON1', // Status
	'0x5E7' : 'CON1', // Status

	'0x228' : 'NBT1',
	'0x24F' : 'NBT1',
	'0x273' : 'NBT1', // NBT1->CON1 init message
	'0x277' : 'NBT1', // CON1->NBT1 ACK init
	'0x278' : 'NBT1',
	'0x27A' : 'NBT1',
	'0x341' : 'NBT1',
	'0x348' : 'NBT1',
	'0x34A' : 'NBT1',
	'0x34C' : 'NBT1',
	'0x34E' : 'NBT1',
	'0x38A' : 'NBT1',
	'0x38D' : 'NBT1',
	'0x3CC' : 'NBT1',
	'0x3F7' : 'NBT1',
	'0x413' : 'NBT1',
	'0x415' : 'NBT1',
	'0x42C' : 'NBT1',
	'0x436' : 'NBT1',
	'0x43C' : 'NBT1',
	'0x43D' : 'NBT1',
	'0x563' : 'NBT1',
	'0x5E3' : 'NBT1',
	'0x663' : 'NBT1',


	// E65, G30, possibly others
	'0x21A' : '', // Light status
	'0x1F6' : '', // Turn signals
	'0x3B6' : '', // Window status LF
	'0x3B7' : '', // Window status LR
	'0x3B8' : '', // Window status RF
	'0x3B9' : '', // Window status RR
	'0xFA'  : '', // Window commands
	'0x0FA' : '', // Window commands
	'0x1E7' : '', // Seat heating
	'0x1C0' : 'ASC1', // Vehicle speed


	// From E38/E39/E46/E53
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
