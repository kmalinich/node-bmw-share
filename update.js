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
	config(key, value_new, verbose = true) {
		let value_old = object_path.get(config, key);

		if (value_new === value_old) return false;

		if (verbose === true) {
			log.change({
				value : 'config.' + key,
				old   : value_old,
				new   : value_new,
			});
		}

		object_path.set(config, key, value_new);

		if (app_intf === 'cli') return true;

		let data_api = {
			key : {
				stub : key.split('.')[0],
				full : key,
			},
			value : {
				stub : object_path.get(config, key),
				full : config[key.split('.')[0]],
			},
		};

		api.emit('config-tx', data_api);

		this.emit(key, value_new);

		return true;
	}

	// update.status('engine.rpm', 1235, false);
	status(key, value_new, verbose = true) {
		let value_old = object_path.get(status, key);

		if (value_new === value_old) return false;

		if (verbose === true) {
			log.change({
				value : 'status.' + key,
				old   : value_old,
				new   : value_new,
			});
		}

		object_path.set(status, key, value_new);

		if (app_intf === 'cli') return true;

		let data_api = {
			key : {
				stub : key.split('.')[0],
				full : key,
			},
			value : {
				stub : object_path.get(status, key),
				full : status[key.split('.')[0]],
			},
		};

		api.emit('status-tx', data_api);

		this.emit(key, value_new);

		return true;
	}
}


module.exports = update;
