const bus_object = {
	arbids  : require('bus-arbids'),  // CANBUS ARBIDs
	cmds    : null,                   // IBUS/KBUS shared commands
	data    : null,                   // Data sender/router (based on dst)
	modules : require('bus-modules'), // DBUS/IBUS/KBUS module IDs
};

switch (app_type) {
	case 'client':
		bus_object.cmds = require('bus-cmds'); // IBUS/KBUS shared commands
		break;
	default:
		bus_object.data = require('bus-data'); // Data sender/router (based on dst)
}

module.exports = bus_object;
