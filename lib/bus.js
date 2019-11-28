import bus_arbids  from './bus-arbids.js';
import bus_modules from './bus-modules.js';

export default {
	arbids  : bus_arbids,  // CANBUS ARBIDs
	cmds    : null,        // IBUS/KBUS shared commands
	data    : null,        // Data sender/router (based on dst)
	modules : bus_modules, // DBUS/IBUS/KBUS module IDs
};
