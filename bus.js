const bus_object = {
	arbids  : require('bus-arbids'),  // CANBUS ARBIDs
	cmds    : null,                   // IBUS/KBUS shared commands
	data    : require('bus-data'),    // Data sender/router (based on dst)
	modules : require('bus-modules'), // DBUS/IBUS/KBUS module IDs
};


switch (app_intf) {
	case 'client' : {
		bus_object.cmds = require('bus-cmds'); // IBUS/KBUS shared commands
	}
}


export default  bus_object;
