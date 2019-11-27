// CANBUS ARBIDs
//
// Kind of a mish-mash
// From E39, E46, E60, E90, F10, G30

// 'ALBV' : E60 M5 active backrest width
// 'ALBV' : E60 M5 active backrest width
// 'BEHO' : Authority/agency module

const arbids = {
	// Ripped from E60, E65, E90, G30
	'0x0A8' : 'DME',   // Engine torque 1 (KCAN)
	'0x0A9' : 'DME',   // Engine torque 2 (KCAN)
	'0x0AA' : 'DME',   // Engine torque 3 (KCAN)
	'0x0AC' : 'DME',   // Wheel torque drivetrain 2
	'0x0AD' : 'ACC',   // Delay request
	'0x0B3' : 'AFS',   // Control steering assistance
	'0x0B4' : 'DME',   // Wheel torque powertrain 1
	'0x0B5' : 'EGS',   // Torque requirement
	'0x0B6' : 'DSC',   // Torque request
	'0x0B7' : 'ACC',   // Torque request
	'0x0B8' : 'DCT',   // Torque requirement
	'0x0B9' : 'AFS',   // Torque request
	'0x0BA' : 'EGS',   // Transmission data
	'0x0BB' : 'DXC',   // Target torque request
	'0x0BC' : 'VGSG',  // Nominal torque conversion status
	'0x0BD' : 'SMG',   // Torque request
	'0x0BE' : 'ARS',   // Alive counter ARS
	'0x0BF' : 'CON',   // Touchpad
	'0x0C0' : 'KGM',   // Alive counter KGM/ZGM
	'0x0C1' : 'TEL',   // Alive counter TEL
	'0x0C4' : 'DSC',   // Steering wheel angle (KCAN)
	'0x0C8' : 'SZL',   // Steering wheel angle top (KCAN)
	'0x0CE' : 'DSC',   // Wheel speeds (KCAN)
	'0x0D2' : 'SZM',   // Operation seat adjustment BF
	'0x0D5' : 'LDM',   // Requirement wheel torque brake
	'0x0D7' : 'ACSM',  // Alive counter ACSM
	'0x0DA' : 'SZM',   // Operation seat adjustment FA
	'0x0E1' : 'DSC',   // Wheel torque (braking)
	'0x0E2' : 'KGM',   // Central locking status, passenger, front
	'0x0E6' : 'KBM',   // Central locking status, passenger, rear
	'0x0EA' : 'KGM',   // Central locking status, driver,    front
	'0x0EE' : 'KBM',   // Central locking status, driver,    rear
	'0x0F2' : 'KBM',   // Central locking status, rear lid
	'0x0F6' : 'KGM',   // Control, exterior mirrors
	'0x0FA' : 'KGM',   // Control, window regulator, driver,    front
	'0x0FB' : 'KGM',   // Control, window regulator, passenger, front
	'0x0FC' : 'KBM',   // Control, window regulator, driver,    rear
	'0x0FD' : 'KBM',   // Control, window regulator, passenger, rear
	'0x12F' : 'CAS',   // CON/NBT power on/off (but may actually be something IHKA related?)
	'0x130' : 'CAS',   // Ignition/key status
	'0x135' : 'ACSM',  // Control crash shutdown EKP
	'0x15F' : 'LDM',   // Requirement angle FFP
	'0x172' : 'NBT',   // Acknowledgment request KOMBI
	'0x190' : 'ACC',   // Display ACC
	'0x192' : 'SZL',   // Operation gear selector switch
	'0x193' : 'LDM',   // Display ACC DCC
	'0x194' : 'SZL',   // Operation cruise control/ACC
	'0x198' : 'GWS',   // Operation gear selection switch 2
	'0x19E' : 'DSC',   // Status DSC (KCAN)
	'0x1A0' : 'DSC',   // Vehicle speed (KCAN)
	'0x1A1' : 'DSC',   // Vehicle speed (KCAN2)
	'0x1A2' : 'EGS',   // Transmission data 2
	'0x1A3' : 'SMG',   // Raw data longitudinal acceleration
	'0x1A6' : 'DSC',   // Distance
	'0x1AA' : 'NBT',   // Effect, controller
	'0x1AC' : 'ARS',   // Status
	'0x1B4' : 'KOMBI', // Status, KOMBI
	'0x1B5' : 'IHKA',  // Heat flow/load moment climate
	'0x1B6' : 'DME',   // Heat flow motor
	'0x1B8' : 'CON',   // Operation, controller
	'0x1C0' : 'DSC',   // Vehicle speed
	'0x1C2' : 'PDC',   // Distance
	'0x1C3' : 'PDC',   // Distance 2
	'0x1C6' : 'PDC',   // Acoustic message
	'0x1D0' : 'DME',   // Motor data
	'0x1D2' : 'EGS',   // Gearbox
	'0x1D6' : 'SZL',   // Steering wheel controls
	'0x1D8' : 'NBT',   // Operation, climate, driver, air distribution
	'0x1D9' : 'SZL',   // Button push, M-Drive
	'0x1DA' : 'CAS',   //
	'0x1DC' : 'NBT',   // Operation, seat heating, layering
	'0x1E0' : 'NBT',   // Operation, climate, passenger, air distribution
	'0x1E2' : 'NBT',   // Operation, climate, front
	'0x1E7' : 'SZM',   // Seat climate/heating, driver,    front
	'0x1E8' : 'SZM',   // Seat climate/heating, passenger, front
	'0x1EA' : 'SZL',   //
	'0x1EB' : 'SZM',   // Seat active massage, driver,    front
	'0x1EC' : 'SZM',   // Seat active massage, passenger, front
	'0x1ED' : 'SZM',   // Seat active bolster, driver,    front
	'0x1EE' : 'SZL',   //
	'0x1EF' : 'SZM',   // Seat active bolster, passenger, front
	'0x1F2' : 'SZM',   // Operation seat memory, passenger
	'0x1F6' : 'LM',    // Turn signals
	'0x1FC' : 'AFS',   //
	'0x1FE' : 'ACSM',  //
	'0x200' : 'DME',   //
	'0x202' : 'FEM',   // Backlight dimmer
	'0x205' : 'KOMBI', // Acoustic requirement
	'0x206' : 'DME',   //
	'0x20B' : 'SZM',   // Memory adjustment
	'0x20C' : 'SM',    // Seat module, driver, front
	'0x20D' : 'SZM',   // Steering column position
	'0x210' : 'NBT',   // Operation HUD
	'0x211' : 'HUD',   //
	'0x212' : 'EHC',   //
	'0x21A' : 'LM',    // Light status
	'0x21C' : 'NBT',   // Gateway
	'0x21E' : 'NVC',   //
	'0x226' : 'RLS',   //
	'0x228' : 'NBT',   // Operation special function
	'0x22A' : 'SM',    // Status, passenger, front
	'0x22E' : 'SM',    // Status, passenger, rear
	'0x232' : 'SM',    // Status, driver,    front
	'0x236' : 'SM',    // Status, driver,    rear
	'0x237' : 'ALBV',  // Status, passenger, front
	'0x239' : 'ALBV',  // Status, driver,    front
	'0x23A' : 'CAS',   //
	'0x23B' : 'IHKA',  //
	'0x23C' : 'SM',    // Seat module, driver,    front
	'0x23F' : 'SM',    // Seat module, passenger, front
	'0x242' : 'IHKA',  //
	'0x24A' : 'PDC',   //
	'0x24F' : 'NBT',   // ??
	'0x252' : 'KBM',   //
	'0x256' : 'CAS',   //
	'0x258' : 'PGS',   //
	'0x25C' : 'NBT',   // Operation, climate, additional programs
	'0x264' : 'CON',   // Rotation
	'0x267' : 'CON',   // Buttons
	'0x26C' : 'KGM',   //
	'0x26E' : 'CAS',   //
	'0x273' : 'NBT',   // NBT->CON init message
	'0x277' : 'CON',   // CON->NBT ACK init
	'0x278' : 'NBT',   // Navigation graph
	'0x27A' : 'NBT',   // Synchronization navigation graph
	'0x27E' : 'CVMV',  //
	'0x284' : 'CAS',   //
	'0x285' : 'SZM',   // Control roller blinds
	'0x28C' : 'GWS',   //
	'0x292' : 'FLA',   //
	'0x29F' : 'CAS',   //
	'0x2A0' : 'CAS',   //
	'0x2A2' : 'NBT',   // Operation, climate, standing heat/vent
	'0x2A4' : 'NBT',   // Operation, personalization
	'0x2A6' : 'SZL',   //
	'0x2B2' : 'DSC',   //
	'0x2B3' : 'DSC',   //
	'0x2B4' : 'DWA',   //
	'0x2B6' : 'DWA',   //
	'0x2B8' : 'NBT',   // Operation, OBC
	'0x2BA' : 'KOMBI', // Stopwatch
	'0x2C0' : 'KOMBI', // LCD luminance
	'0x2CA' : 'KOMBI', // Exterior temp
	'0x2CE' : 'NBT',   // Control, monitor
	'0x2D5' : 'IHKA',  //
	'0x2DA' : 'HKL',   //
	'0x2E2' : 'NVC',   //
	'0x2E4' : 'AHM',   //
	'0x2E6' : 'IHKA',  //
	'0x2EA' : 'IHKA',  //
	'0x2EC' : 'SHZH',  //
	'0x2EE' : 'IHKA',  //
	'0x2F0' : 'IHKA',  //
	'0x2F4' : 'IHKA',  //
	'0x2F6' : 'KBM',   //
	'0x2F7' : 'NBT',   // Units
	'0x2F8' : 'KOMBI', // Date/time
	'0x2FA' : 'ACSM',  // Status, seat occupancy strap contacts
	'0x2FC' : 'CAS',   // Status, door
	'0x304' : 'EGS',   // Status, gear (automatic transmission)
	'0x306' : 'LM',    //
	'0x308' : 'DME',   //
	'0x310' : 'KOMBI', // Outside temp/relative tim
	'0x311' : 'KOMBI', // Refueling amount
	'0x312' : 'KOMBI', // Service call teleservices
	'0x313' : 'NBT',   // Status, teleservice call
	'0x314' : 'RLS',   //
	'0x315' : 'SZM',   // Vehicle mode (sport mode)
	'0x317' : 'SZM',   // PDC button
	'0x318' : 'PGS',   //
	'0x319' : 'SZM',   // RDC button
	'0x31C' : 'RDC',   //
	'0x31D' : 'DSC',   //
	'0x322' : 'EDCK',  //
	'0x326' : 'EDCK',  //
	'0x328' : 'KOMBI', // Relative time
	'0x32A' : 'LM',    //
	'0x32D' : 'DXCRB', //
	'0x32E' : 'IHKA',  //
	'0x330' : 'KOMBI', // Mileage/Range
	'0x331' : 'NBT',   // Program, cruise control
	'0x332' : 'DME',   //
	'0x335' : 'EKP',   //
	'0x336' : 'KOMBI', // Display check control message
	'0x337' : 'DME',   //
	'0x339' : 'NBT',   // Status, display functions, external
	'0x33A' : 'CID',   //
	'0x341' : 'NBT',   // ??
	'0x348' : 'NBT',   // Match navigation graph
	'0x34A' : 'NBT',   // Navigation GPS 1
	'0x34B' : 'SM',    // Seat module, driver, front
	'0x34C' : 'NBT',   // Navigation GPS 2
	'0x34D' : 'SM',    // Seat module, passenger, front
	'0x34E' : 'NBT',   // Navigation system information
	'0x35A' : 'NBT',   // CBS appointment
	'0x35C' : 'KOMBI', // Status, OBC
	'0x35E' : 'KOMBI', // OBC data, travel data
	'0x360' : 'KOMBI', // OBC data, start of journey
	'0x362' : 'KOMBI', // OBC data, average values
	'0x364' : 'KOMBI', // OBC data, arrival
	'0x366' : 'KOMBI', // Display, KOMBI/external display
	'0x367' : 'KOMBI', // Control display, demand-oriented service
	'0x374' : 'DSC',   //
	'0x376' : 'VGSG',  //
	'0x380' : 'CAS',   // VIN, info
	'0x381' : 'DME',   //
	'0x382' : 'DME',   //
	'0x388' : 'CAS',   //
	'0x38A' : 'NBT',   // ??
	'0x38D' : 'NBT',   // ??
	'0x38E' : 'DME',   //
	'0x394' : 'KOMBI', // RDA request/data storage
	'0x395' : 'CAS',   //
	'0x398' : 'NBT',   // Operation, suspension
	'0x399' : 'DME',   //
	'0x39E' : 'NBT',   // Operation, date/time
	'0x3A0' : 'KGM',   //
	'0x3A3' : 'NBT',   // Request, remote services
	'0x3AC' : 'KGM',   //
	'0x3B0' : 'LM',    //
	'0x3B1' : 'EGS',   //
	'0x3B3' : 'DME',   //
	'0x3B4' : 'DME',   //
	'0x3B5' : 'IHKA',  //
	'0x3B6' : 'KBM',   // Window status, driver,    front
	'0x3B7' : 'KBM',   // Window status, driver,    rear
	'0x3B8' : 'KBM',   // Window status, passenger, front
	'0x3B9' : 'KBM',   // Window status, passenger, rear
	'0x3BA' : 'SHD',   //
	'0x3BD' : 'KBM',   //
	'0x3BE' : 'CAS',   //
	'0x3BF' : 'CVMV',  //
	'0x3C0' : 'SM',    // Seat module, driver,    front
	'0x3C1' : 'SM',    // Seat module, passenger, front
	'0x3CA' : 'NBT',   // Config, M-Drive
	'0x3CC' : 'NBT',   // ??
	'0x3D3' : 'LM',    // Status, solar sensor
	'0x3D4' : 'NBT',   // CKM, config, central locking
	'0x3D5' : 'CAS',   // CKM, status, central locking
	'0x3D6' : 'NBT',   // CKM, config, DWA
	'0x3D7' : 'DWA',   // CKM, status, DWA
	'0x3D8' : 'NBT',   // CKM, config, RLS
	'0x3D9' : 'RLS',   // CKM, status, RLS
	'0x3DA' : 'NBT',   // CKM, config, seat memory
	'0x3DB' : 'SM',    // CKM, status, seat memory
	'0x3DC' : 'NBT',   // CKM, config, light
	'0x3DD' : 'LM',    // CKM, status, light
	'0x3DE' : 'NBT',   // CKM, config, climate
	'0x3DF' : 'IHKA',  // CKM, status, climate
	'0x3E0' : 'NBT',   // CKM, config, ALC
	'0x3E1' : 'LM',    // CKM, status, ALC
	'0x3E2' : 'NBT',   // CKM, config, tailgate
	'0x3E3' : 'HKL',   // CKM, status, tailgate
	'0x3EF' : 'DME',   // OBD data, engine
	'0x3F0' : 'NBT',   // CKM, config, light extended
	'0x3F1' : 'LM',    // CKM, status, light extended
	'0x3F4' : 'NBT',   // CKM, config, cargo cover
	'0x3F5' : 'KBM',   // CKM, status, cargo cover
	'0x3F7' : 'NBT',   // ??
	'0x3FE' : 'DIA',   // CAN Test tool SI-Bus
	'0x413' : 'NBT',   // ??
	'0x415' : 'NBT',   // ??
	'0x42C' : 'NBT',   // ??
	'0x436' : 'NBT',   // ??
	'0x43C' : 'NBT',   // ??
	'0x43D' : 'NBT',   // ??
	'0x480' : 'KGM',   // Network management
	'0x481' : 'ACSM',  // Network management
	'0x482' : 'SZL',   // Network management
	'0x492' : 'DME',   // Network management
	'0x496' : 'AFS',   // Network management
	'0x497' : 'EKP',   // Network management
	'0x498' : 'EGS',   // Network management
	'0x499' : 'VGSG',  // Network management
	'0x49B' : 'VVT1',  // Network management
	'0x49C' : 'LDM',   // Network management
	'0x49E' : 'VVT2',  // Network management
	'0x4A0' : 'RDC',   // Network management
	'0x4A1' : 'ACC',   // Network management
	'0x4A3' : 'ARS',   // Network management
	'0x4A4' : 'CVMV',  // Network management
	'0x4A5' : 'RSC',   // Network management
	'0x4A7' : 'PGS',   // Network management
	'0x4A9' : 'DSC',   // Network management
	'0x4B6' : 'TEL',   // Network management
	'0x4B7' : 'AMP',   // Network management
	'0x4B8' : 'EHC',   // Network management
	'0x4B9' : 'EDCK',  // Network management
	'0x4BA' : 'KHM',   // Network management
	'0x4BB' : 'JNAV',  // Network management
	'0x4BC' : 'CDC',   // Network management
	'0x4BD' : 'HUD',   // Network management
	'0x4C0' : 'CAS',   // Network management
	'0x4C1' : 'DWA',   // Network management
	'0x4C4' : 'SHD',   // Network management
	'0x4C5' : 'RLS',   // Network management
	'0x4CB' : 'VM',    // Network management
	'0x4D0' : 'DWAS',  // Network management
	'0x4D3' : 'IBOC',  // Network management
	'0x4D4' : 'SDARS', // Network management
	'0x4D5' : 'SVS',   // Network management
	'0x4D7' : 'NVC',   // Network management
	'0x4D9' : 'ALBV',  // Network management
	'0x4DA' : 'ALBV',  // Network management
	'0x4DB' : 'DAB',   // Network management
	'0x4DC' : 'BEHO',  // Network management
	'0x4DD' : 'TLC',   // Network management
	'0x4DE' : 'GWS',   // Network management
	'0x4DF' : 'FLA',   // Network management
	'0x4E0' : 'KOMBI', // Network management
	'0x4E2' : 'NBT',   // Network management (gateway)
	'0x4E3' : 'NBT',   // Network management
	'0x4E4' : 'PDC',   // Network management
	'0x4E5' : 'SZM',   // Network management
	'0x4E7' : 'CON',   // Network management
	'0x4EB' : 'HKL',   // Network management
	'0x4ED' : 'SM',    // Network management
	'0x4EE' : 'SM',    // Network management
	'0x4F0' : 'LM',    // Network management
	'0x4F1' : 'AHM',   // Network management
	'0x4F2' : 'KBM',   // Network management
	'0x4F3' : 'CID',   // Network management
	'0x4F8' : 'KOMBI', // Ignition status
	'0x4FA' : 'SHZH',  // Network management
	'0x4FD' : 'DIA',   // Network management
	'0x4FE' : 'DIA',   // Network management
	'0x500' : 'LM',    // Data transfer (potentially also IHKA)
	'0x509' : '2LSMC', // Network management
	'0x50A' : '2RSMC', // Network management
	'0x50B' : 'CNV',   // Network management
	'0x563' : 'NBT',   // ??
	'0x571' : 'DIA',   // Network management
	'0x580' : 'KGM',   // Services
	'0x581' : 'ACSM',  // Services
	'0x582' : 'SZL',   // Services
	'0x592' : 'DME',   // Services
	'0x596' : 'AFS',   // Services
	'0x597' : 'EKP',   // Services
	'0x598' : 'EGS',   // Services
	'0x599' : 'VGSG',  // Services
	'0x59B' : 'VVT1',  // Services
	'0x59C' : 'LDM',   // Services
	'0x59E' : 'VVT2',  // Services
	'0x5A0' : 'RDC',   // Services
	'0x5A1' : 'ACC',   // Services
	'0x5A3' : 'ARS',   // Services
	'0x5A4' : 'CVMV',  // Services
	'0x5A5' : 'RSC',   // Services
	'0x5A7' : 'PGS',   // Services
	'0x5A9' : 'DSC',   // Services
	'0x5B6' : 'TEL',   // Services
	'0x5B7' : 'AMP',   // Services
	'0x5B8' : 'EHC',   // Services
	'0x5B9' : 'EDCK',  // Services
	'0x5BA' : 'KHM',   // Services
	'0x5BB' : 'JNAV',  // Services
	'0x5BC' : 'CDC',   // Services
	'0x5BD' : 'HUD',   // Services
	'0x5C0' : 'CAS',   // Services
	'0x5C1' : 'DWA',   // Services
	'0x5C4' : 'SHD',   // Services
	'0x5C5' : 'RLS',   // Services
	'0x5CB' : 'VM',    // Services
	'0x5D0' : 'DWAS',  // Services
	'0x5D3' : 'IBOC',  // Services
	'0x5D4' : 'SDARS', // Services
	'0x5D5' : 'SVS',   // Services
	'0x5D7' : 'NVC',   // Services
	'0x5D9' : 'ALBV',  // Services
	'0x5DA' : 'ALBV',  // Services
	'0x5DB' : 'DAB',   // Services
	'0x5DC' : 'BEHO',  // Services
	'0x5DD' : 'TLC',   // Services
	'0x5DE' : 'GWS',   // Services
	'0x5DF' : 'FLA',   // Services
	'0x5E0' : 'KOMBI', // Services
	'0x5E2' : 'NBT',   // Services
	'0x5E3' : 'NBT',   // Services
	'0x5E4' : 'PDC',   // Services
	'0x5E5' : 'SZM',   // Services
	'0x5E7' : 'CON',   // Services
	'0x5EB' : 'HKL',   // Services
	'0x5ED' : 'SM',    // Services
	'0x5EE' : 'SM',    // Services
	'0x5F0' : 'LM',    // Services
	'0x5F1' : 'AHM',   // Services
	'0x5F2' : 'KBM',   // Services
	'0x5F3' : 'CID',   // Services
	'0x5F8' : 'IHKA',  // Services
	'0x5FA' : 'SHZH',  // Services
	'0x5FD' : 'DIA',   // Services
	'0x5FE' : 'DIA',   // Services
	'0x609' : '2LSMC', // Services
	'0x60A' : '2RSMC', // Services
	'0x60B' : 'CNV',   // Services
	'0x663' : 'NBT',   // ??
	'0x671' : 'DIA',   // Services
	'0x7C0' : 'CAS',   // CAS programming end 1
	'0x7C1' : 'CAS',   // CAS programming end 2
	'0x7C2' : 'CAS',   // CAS application 1
	'0x7C3' : 'CAS',   // CAS application 2 (keyfob)

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
	'0x0CE',
	'0x12F',
	'0x130',
	'0x153',
	'0x1A1',
	'0x1B4',
	'0x1EB',
	'0x1EC',
	'0x1ED',
	'0x1EF',
	'0x1F0',
	'0x1F3',
	'0x1F5',
	'0x1F8',
	'0x202',
	'0x22A',
	'0x23A',
	'0x232',
	'0x264',
	'0x267',
	'0x273',
	'0x277',
	'0x2FC',
	'0x304',
	'0x315',
	'0x316',
	'0x317',
	'0x319',
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
	const hex_str = '0x' + hex.toString(16).padStart(3, 0).toUpperCase();
	if (arbids[hex_str]) return arbids[hex_str];

	// Didn't find it
	return 'unk';
}


export default  {
	// Variables
	arbids,
	arbids_allow,

	// Functions
	h2n,
};
