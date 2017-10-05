/* global config log status socket */

const module_name = __filename.slice(__dirname.length + 1, -3);

const object_path = require('object-path');

// WIP
const config_transform = {
	engine : {
		rpm : (input) => {
			return Math.round(input);
		},
	},
};


// update('system.host_data.refresh_interval', 15000);
function update_config(key, value_new, verbose = true) {
	let value_old = object_path.get(config, key);

	if (value_new === value_old) {
		return false;
	}

	if (verbose === true) {
		log.change({
			src   : module_name,
			value : 'config.' + key,
			old   : value_old,
			new   : value_new,
		});
	}

	object_path.set(config, key, value_new);

	let path_value = key.split('.')[0];
	if (app_intf !== 'cli') api.emit('config-tx', { key : path_value, value : config[path_value] });

	return true;
}

// update('engine.rpm', 1235, false);
function update_status(key, value_new, verbose = true) {
	let value_old = object_path.get(status, key);

	if (value_new === value_old) {
		return false;
	}

	if (verbose === true) {
		log.change({
			src   : module_name,
			value : 'status.' + key,
			old   : value_old,
			new   : value_new,
		});
	}

	object_path.set(status, key, value_new);

	let path_value = key.split('.')[0];
	if (app_intf !== 'cli') api.emit('status-tx', { key : path_value, value : status[path_value] });

	return true;
}


module.exports = {
	transform : config_transform,

	config : (key, value_new, verbose) => { return update_config(key, value_new, verbose); },
	status : (key, value_new, verbose) => { return update_status(key, value_new, verbose); },
};
