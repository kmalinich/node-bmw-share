/* eslint-disable no-redeclare */

const EventEmitter = require('events');
const object_path  = require('object-path');

// WIP
// const status_transform = {
//   engine : {
//     rpm : (input) => {
//       return Math.round(input);
//     },
//   },
// };


class update extends EventEmitter {
	// update.config('system.host_data.refresh_interval', 15000, true);
	config(key, value_new, quiet = true) {
		const value_old = object_path.get(config, key);

		if (value_new === value_old) return false;

		if (quiet === false) {
			log.change({
				value : 'config.' + key,
				old   : value_old,
				new   : value_new,
			});
		}

		object_path.set(config, key, value_new);

		if (app_intf === 'cli') return true;

		const data_emit_key = 'config.' + key;
		const data_emit     = {
			old : value_old,
			new : value_new,
		};

		this.emit(data_emit_key, data_emit);

		if (typeof api === 'undefined') return true;

		api.emit('config-tx', {
			key : {
				stub : key.split('.')[0],
				full : key,
			},

			value : {
				stub : object_path.get(config, key),
				full : config[key.split('.')[0]],
			},
		});

		return true;
	}

	// update.status('engine.rpm', 1235, false);
	status(key, value_new, quiet = true) {
		const value_old = object_path.get(status, key);

		if (value_new === value_old) return false;

		if (quiet === false) {
			log.change({
				value : 'status.' + key,
				old   : value_old,
				new   : value_new,
			});
		}

		object_path.set(status, key, value_new);

		if (app_intf === 'cli') return true;

		const data_emit_key = 'status.' + key;
		const data_emit     = {
			old : value_old,
			new : value_new,
		};

		this.emit(data_emit_key, data_emit);

		if (typeof api === 'undefined') return true;

		api.emit('status-tx', {
			key : {
				stub : key.split('.')[0],
				full : key,
			},

			value : {
				stub : object_path.get(status, key),
				full : status[key.split('.')[0]],
			},
		});

		return true;
	}
}


module.exports = update;
