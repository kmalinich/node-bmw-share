// CANBUS ARBIDs
//
// Kind of a mish-mash
// From E39, E46, E60, E90, F10, G30
const arbids = {
	// Ripped from E60, E65, E90, G30
	'0x0A8' : 'DME',
	'0x0A9' : 'DME',
	'0x0AA' : 'DME',
	'0x0AC' : 'DME',
	'0x0AD' : 'ACC',
	'0x0B3' : 'AFS',
	'0x0B4' : 'DME',
	'0x0B5' : 'EGS',
	'0x0B6' : 'DSC',
	'0x0B7' : 'ACC',
	'0x0B8' : 'DCT',
	'0x0B9' : 'AFS',
	'0x0BA' : 'EGS',
	'0x0BB' : 'DXC',
	'0x0BC' : 'VGSG',
	'0x0BD' : 'SMG',
	'0x0BE' : 'ARS',
	'0x0BF' : 'CON', // Touchpad
	'0x0C0' : 'KGM',
	'0x0C1' : 'TEL',
	'0x0C4' : 'DSC',
	'0x0C8' : 'SZL',
	'0x0CE' : 'DSC',
	'0x0D2' : 'SZM',
	'0x0D5' : 'LDM',
	'0x0D7' : 'ACSM',
	'0x0DA' : 'SZM',
	'0x0E1' : 'DSCB',
	'0x0E2' : 'KGM',
	'0x0E6' : 'KBM',
	'0x0EA' : 'KGM',
	'0x0EE' : 'KBM',
	'0x0F2' : 'KBM',
	'0x0F6' : 'KGM',
	'0x0FA' : 'KGM', // Window commands
	'0x0FB' : 'KGM',
	'0x0FC' : 'KBM',
	'0x0FD' : 'KBM',
	'0x12F' : 'CAS', // CON/NBT power on/off (but may actually be something IHKA related?)
	'0x130' : 'CAS', // Ignition/key status
	'0x135' : 'ACSM',
	'0x15F' : 'LDM',
	'0x172' : 'NBT',
	'0x190' : 'ACC',
	'0x192' : 'SZL',
	'0x193' : 'LDM',
	'0x194' : 'SZL',
	'0x198' : 'GWS',
	'0x19E' : 'DSC',
	'0x1A0' : 'DSC',
	'0x1A1' : 'DSC', // KCAN2 Vehicle speed
	'0x1A2' : 'EGS',
	'0x1A3' : 'SMG',
	'0x1A6' : 'DSC',
	'0x1AA' : 'NBT',
	'0x1AC' : 'ARS',
	'0x1B4' : 'KOMBI',
	'0x1B5' : 'IHKA',
	'0x1B6' : 'DME',
	'0x1B8' : 'CON', // KCAN1 CON
	'0x1C0' : 'DSC', // Vehicle speed
	'0x1C2' : 'PDC',
	'0x1C3' : 'PDC',
	'0x1C6' : 'PDC',
	'0x1D0' : 'DME',
	'0x1D2' : 'EGS', // Gearbox
	'0x1D6' : 'SZL', // Steering wheel controls
	'0x1D8' : 'NBT',
	'0x1D9' : 'SZL',
	'0x1DA' : 'CAS',
	'0x1DC' : 'NBT',
	'0x1E0' : 'NBT',
	'0x1E2' : 'NBT',
	'0x1E7' : 'SZM', // Seat heating
	'0x1E8' : 'SZM',
	'0x1EA' : 'SZL',
	'0x1EB' : 'SZM',
	'0x1EC' : 'SZM',
	'0x1ED' : 'SZM',
	'0x1EE' : 'SZL',
	'0x1EF' : 'SZM',
	'0x1F2' : 'SZM',
	'0x1F6' : 'LM', // Turn signals
	'0x1FC' : 'AFS',
	'0x1FE' : 'ACSM',
	'0x200' : 'DME',
	'0x202' : 'FEM', // Backlight dimmer
	'0x205' : 'KOMBI',
	'0x206' : 'DME',
	'0x20B' : 'SZM',
	'0x20C' : 'SM', // Seat module, front driver
	'0x20D' : 'SZM',
	'0x210' : 'NBT',
	'0x211' : 'HUD',
	'0x212' : 'EHC',
	'0x21A' : 'LM',  // Light status
	'0x21C' : 'NBT', // Gateway
	'0x21E' : 'NVC',
	'0x226' : 'RLS',
	'0x228' : 'NBT',  // Operation special function
	'0x22A' : 'SM',   // Seat module,                  front passenger
	'0x22E' : 'SM',   // Seat module,                  rear  passenger
	'0x232' : 'SM',   // Seat module,                  front driver
	'0x236' : 'SM',   // Seat module,                  rear  driver
	'0x237' : 'ALBV', // E60 M5 active backrest width, front passenger
	'0x239' : 'ALBV', // E60 M5 active backrest width, front driver
	'0x23A' : 'CAS',
	'0x23B' : 'IHKA',
	'0x23C' : 'SM', // Seat module, front driver
	'0x23F' : 'SM', // Seat module, front passenger
	'0x242' : 'IHKA',
	'0x24A' : 'PDC',
	'0x24F' : 'NBT',
	'0x252' : 'KBM',
	'0x256' : 'CAS',
	'0x258' : 'PGS',
	'0x25C' : 'NBT',
	'0x264' : 'CON', // Rotation
	'0x267' : 'CON', // Buttons
	'0x26C' : 'KGM',
	'0x26E' : 'CAS',
	'0x273' : 'NBT', // NBT->CON init message
	'0x277' : 'CON', // CON->NBT ACK init
	'0x278' : 'NBT', // Navigation graph
	'0x27A' : 'NBT', // Synchronization navigation graph
	'0x27E' : 'CVMV',
	'0x284' : 'CAS',
	'0x285' : 'SZM',
	'0x28C' : 'GWS',
	'0x292' : 'FLA',
	'0x29F' : 'CAS',
	'0x2A0' : 'CAS',
	'0x2A2' : 'NBT',
	'0x2A4' : 'NBT',
	'0x2A6' : 'SZL',
	'0x2B2' : 'DSC',
	'0x2B3' : 'DSC',
	'0x2B4' : 'DWA',
	'0x2B6' : 'DWA',
	'0x2B8' : 'NBT',
	'0x2BA' : 'KOMBI',
	'0x2C0' : 'KOMBI',
	'0x2CA' : 'KOMBI',
	'0x2CE' : 'NBT',
	'0x2D5' : 'IHKA',
	'0x2DA' : 'HKL',
	'0x2E2' : 'NVC',
	'0x2E4' : 'AHM',
	'0x2E6' : 'IHKA',
	'0x2EA' : 'IHKA',
	'0x2EC' : 'SHZH',
	'0x2EE' : 'IHKA',
	'0x2F0' : 'IHKA',
	'0x2F4' : 'IHKA',
	'0x2F6' : 'KBM',
	'0x2F7' : 'NBT',
	'0x2F8' : 'KOMBI',
	'0x2FA' : 'ACSM',
	'0x2FC' : 'CAS', // Door status
	'0x304' : 'EGS', // Gear status (automatic transmission)
	'0x306' : 'LM',
	'0x308' : 'DME',
	'0x310' : 'KOMBI',
	'0x311' : 'KOMBI',
	'0x312' : 'KOMBI',
	'0x313' : 'NBT',
	'0x314' : 'RLS',
	'0x315' : 'SZM',
	'0x317' : 'SZM',
	'0x318' : 'PGS',
	'0x319' : 'SZM',
	'0x31C' : 'RDC',
	'0x31D' : 'DSC',
	'0x322' : 'EDCK',
	'0x326' : 'EDCK',
	'0x328' : 'KOMBI',
	'0x32A' : 'LM',
	'0x32D' : 'DXCRB',
	'0x32E' : 'IHKA',
	'0x330' : 'KOMBI',
	'0x331' : 'NBT',
	'0x332' : 'DME',
	'0x335' : 'EKP',
	'0x336' : 'KOMBI',
	'0x337' : 'DME',
	'0x339' : 'NBT',
	'0x33A' : 'CID',
	'0x341' : 'NBT',
	'0x348' : 'NBT', // Match navigation graph
	'0x34A' : 'NBT', // Navigation GPS 1
	'0x34B' : 'SM',  // Seat module, front driver
	'0x34C' : 'NBT', // Navigation GPS 2
	'0x34D' : 'SM',  // Seat module, front passenger
	'0x34E' : 'NBT', // Navigation system information
	'0x35A' : 'NBT',
	'0x35C' : 'KOMBI',
	'0x35E' : 'KOMBI',
	'0x360' : 'KOMBI',
	'0x362' : 'KOMBI',
	'0x364' : 'KOMBI',
	'0x366' : 'KOMBI',
	'0x367' : 'KOMBI',
	'0x374' : 'DSC',
	'0x376' : 'VGSG',
	'0x380' : 'CAS', // VIN, info
	'0x381' : 'DME',
	'0x382' : 'DME',
	'0x388' : 'CAS',
	'0x38A' : 'NBT',
	'0x38D' : 'NBT',
	'0x38E' : 'DME',
	'0x394' : 'KOMBI',
	'0x395' : 'CAS',
	'0x398' : 'NBT',
	'0x399' : 'DME',
	'0x39E' : 'NBT',
	'0x3A0' : 'KGM',
	'0x3A3' : 'NBT',
	'0x3AC' : 'KGM',
	'0x3B0' : 'LM',
	'0x3B1' : 'EGS',
	'0x3B3' : 'DME',
	'0x3B4' : 'DME',
	'0x3B5' : 'IHKA',
	'0x3B6' : 'KBM', // Window status, front left
	'0x3B7' : 'KBM', // Window status, rear  left
	'0x3B8' : 'KBM', // Window status, front right
	'0x3B9' : 'KBM', // Window status, rear  right
	'0x3BA' : 'SHD',
	'0x3BD' : 'KBM',
	'0x3BE' : 'CAS',
	'0x3BF' : 'CVMV',
	'0x3C0' : 'SM', // Seat module, front driver
	'0x3C1' : 'SM', // Seat module, front passenger
	'0x3CA' : 'NBT',
	'0x3CC' : 'NBT',
	'0x3D3' : 'LM',
	'0x3D4' : 'NBT',
	'0x3D5' : 'CAS',
	'0x3D6' : 'NBT',
	'0x3D7' : 'DWA',
	'0x3D8' : 'NBT',
	'0x3D9' : 'RLS',
	'0x3DA' : 'NBT',
	'0x3DB' : 'SM', // Seat module, front driver
	'0x3DC' : 'NBT',
	'0x3DD' : 'LM',
	'0x3DE' : 'NBT',
	'0x3DF' : 'IHKA',
	'0x3E0' : 'NBT',
	'0x3E1' : 'LM',
	'0x3E2' : 'NBT',
	'0x3E3' : 'HKL',
	'0x3EF' : 'DME',
	'0x3F0' : 'NBT',
	'0x3F1' : 'LM',
	'0x3F4' : 'NBT',
	'0x3F5' : 'KBM',
	'0x3F7' : 'NBT',
	'0x3FE' : 'DIA',
	'0x413' : 'NBT',
	'0x415' : 'NBT',
	'0x42C' : 'NBT',
	'0x436' : 'NBT',
	'0x43C' : 'NBT',
	'0x43D' : 'NBT',
	'0x480' : 'KGM',
	'0x481' : 'ACSM',
	'0x482' : 'SZL',
	'0x492' : 'DME',
	'0x496' : 'AFS',
	'0x497' : 'EKP',
	'0x498' : 'EGS',
	'0x499' : 'VGSG',
	'0x49B' : 'VVT1',
	'0x49C' : 'LDM',
	'0x49E' : 'VVT2',
	'0x4A0' : 'RDC',
	'0x4A1' : 'ACC',
	'0x4A3' : 'ARS',
	'0x4A4' : 'CVMV',
	'0x4A5' : 'RSC',
	'0x4A7' : 'PGS',
	'0x4A9' : 'DSC',
	'0x4B6' : 'TEL',
	'0x4B7' : 'AMP',
	'0x4B8' : 'EHC',
	'0x4B9' : 'EDCK',
	'0x4BA' : 'KHM',
	'0x4BB' : 'JNAV',
	'0x4BC' : 'CDC',
	'0x4BD' : 'HUD',
	'0x4C0' : 'CAS',
	'0x4C1' : 'DWA',
	'0x4C4' : 'SHD',
	'0x4C5' : 'RLS',
	'0x4CB' : 'VM',
	'0x4D0' : 'DWAS',
	'0x4D3' : 'IBOC',
	'0x4D4' : 'SDARS',
	'0x4D5' : 'SVS',
	'0x4D7' : 'NVC',
	'0x4D9' : 'ALBV', // E60 M5 active backrest width, front driver
	'0x4DA' : 'ALBV', // E60 M5 active backrest width, front passenger
	'0x4DB' : 'DAB',
	'0x4DC' : 'BEHO', // Authority/agency module
	'0x4DD' : 'TLC',
	'0x4DE' : 'GWS',
	'0x4DF' : 'FLA',
	'0x4E0' : 'KOMBI',
	'0x4E2' : 'NBT', // Gateway
	'0x4E3' : 'NBT',
	'0x4E4' : 'PDC',
	'0x4E5' : 'SZM',
	'0x4E7' : 'CON', // Status
	'0x4EB' : 'HKL',
	'0x4ED' : 'SM', // Seat module, front driver
	'0x4EE' : 'SM', // Seat module, front passenger
	'0x4F0' : 'LM',
	'0x4F1' : 'AHM',
	'0x4F2' : 'KBM',
	'0x4F3' : 'CID',
	'0x4F8' : 'KOMBI', // Ignition status
	'0x4FA' : 'SHZH',
	'0x4FD' : 'DIA',
	'0x4FE' : 'DIA',
	'0x500' : 'LM',
	'0x509' : '2LSMC',
	'0x50A' : '2RSMC',
	'0x50B' : 'CNV',
	'0x563' : 'NBT',
	'0x571' : 'DIA',
	'0x580' : 'KGM',
	'0x581' : 'ACSM',
	'0x582' : 'SZL',
	'0x592' : 'DME',
	'0x596' : 'AFS',
	'0x597' : 'EKP',
	'0x598' : 'EGS',
	'0x599' : 'VGSG',
	'0x59B' : 'VVT1',
	'0x59C' : 'LDM',
	'0x59E' : 'VVT2',
	'0x5A0' : 'RDC',
	'0x5A1' : 'ACC',
	'0x5A3' : 'ARS',
	'0x5A4' : 'CVMV',
	'0x5A5' : 'RSC',
	'0x5A7' : 'PGS',
	'0x5A9' : 'DSC',
	'0x5B6' : 'TEL',
	'0x5B7' : 'AMP',
	'0x5B8' : 'EHC',
	'0x5B9' : 'EDCK',
	'0x5BA' : 'KHM',
	'0x5BB' : 'JNAV',
	'0x5BC' : 'CDC',
	'0x5BD' : 'HUD',
	'0x5C0' : 'CAS',
	'0x5C1' : 'DWA',
	'0x5C4' : 'SHD',
	'0x5C5' : 'RLS',
	'0x5CB' : 'VM',
	'0x5D0' : 'DWAS',
	'0x5D3' : 'IBOC',
	'0x5D4' : 'SDARS',
	'0x5D5' : 'SVS',
	'0x5D7' : 'NVC',
	'0x5D9' : 'ALBV', // E60 M5 active backrest width, front driver
	'0x5DA' : 'ALBV', // E60 M5 active backrest width, front passenger
	'0x5DB' : 'DAB',
	'0x5DC' : 'BEHO', // Authority/agency module
	'0x5DD' : 'TLC',
	'0x5DE' : 'GWS',
	'0x5DF' : 'FLA',
	'0x5E0' : 'KOMBI',
	'0x5E2' : 'NBT',
	'0x5E3' : 'NBT', // Services
	'0x5E4' : 'PDC',
	'0x5E5' : 'SZM',
	'0x5E7' : 'CON', // Status
	'0x5EB' : 'HKL',
	'0x5ED' : 'SM', // Seat module, front driver
	'0x5EE' : 'SM', // Seat module, front passenger
	'0x5F0' : 'LM',
	'0x5F1' : 'AHM',
	'0x5F2' : 'KBM',
	'0x5F3' : 'CID',
	'0x5F8' : 'IHKA',
	'0x5FA' : 'SHZH',
	'0x5FD' : 'DIA',
	'0x5FE' : 'DIA',
	'0x609' : '2LSMC',
	'0x60A' : '2RSMC',
	'0x60B' : 'CNV',
	'0x663' : 'NBT',
	'0x671' : 'DIA',
	'0x7C3' : 'CAS', // Keyfob

	// '0x1F3' : 'SZM',
	// '0x338' : 'KOMBI',


	// From E38/E39/E46/E53
	'0x153' : 'DSC', // Speed, DSC light
	'0x1F0' : 'DSC', // Wheel speeds
	'0x1F3' : 'DSC', // Transverse acceleration, VSS
	'0x1F5' : 'DSC', // Steering angle
	'0x1F8' : 'DSC', // Brake pressure
	'0x77F' : 'DSC', // E39 DSC 5.7 brake pressure
	'0x7B5' : 'DSC', // E39 DSC 5.7 brake pressure

	'0x316' : 'DME', // RPM
	'0x329' : 'DME', // Temp, brake pedal depressed, throttle position
	'0x338' : 'DME', // Sport mode status
	'0x545' : 'DME', // CEL, fuel cons, overheat, oil temp, charging, brake light switch, cruise control
	'0x610' : 'DME', // VIN, info
	'0x613' : 'DME', // Odometer, running clock, fuel level [0x615 ACK]
	'0x615' : 'DME', // A/C request, outside air temp, parking brake, door contacts

	// MSS5x secondary/SMG CANBUS messages
	'0x701' : 'DME',
	'0x702' : 'DME',
	'0x710' : 'DME',
	'0x711' : 'DME',
	'0x712' : 'DME',
	'0x720' : 'DME', // Coolant temp/Intake air temp/Exhaust gas temp/Oil temp/Voltage/Speed/Fuel pump duty

	// Might be "message priority inversion"
	'0x77C' : '',
};

// Array of CANBUS ARBIDs to allow
const arbids_allow = [
	'0x0BF',
	'0x12F',
	'0x130',
	'0x153',
	'0x1A1',
	'0x1B4',
	'0x1F0',
	'0x1F3',
	'0x1F5',
	'0x1F8',
	'0x202',
	'0x264',
	'0x267',
	'0x273',
	'0x277',
	'0x2FC',
	'0x304',
	'0x316',
	'0x329',
	'0x338',
	'0x34E',
	'0x38D',
	'0x4E7',
	'0x4F8',
	'0x545',
	'0x563',
	'0x5E3',
	'0x5E7',
	'0x610',
	'0x613',
	'0x615',
	'0x720',
	'0xFA8',
];


// 0x273 -> NBT
function h2n(hex) {
	let hex_str = '0x' + hex.toString(16).padStart(0, 0).toUpperCase();
	if (arbids[hex_str]) return arbids[hex_str];

	// Didn't find it
	return 'unk';
}

module.exports = {
	arbids       : arbids,
	arbids_allow : arbids_allow,

	h2n : h2n,
};
