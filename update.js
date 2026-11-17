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
	// Coalesce high-frequency changes: instead of emitting a socket.io update
	// for every individual status/config change, schedule a single flush after
	// a short delay. When many keys change in quick succession (e.g. CAN frame
	// decode), this drastically reduces the number of socket.io emits.
	static flush_delay_ms = 100;

	constructor() {
		super();

		// Pending changes, keyed by full status/config key, to be flushed
		this.pending = {
			config : {},
			status : {},
		};

		// Flush timer per kind, null if no flush is scheduled
		this.flush_timer = {
			config : null,
			status : null,
		};
	} // constructor()


	// Schedule a coalesced flush of all pending changes of a given kind
	// ('config' or 'status')
	flush(kind) {
		const root = (kind === 'config') ? config : status;

		const pending_data = this.pending[kind];
		this.pending[kind] = {};

		for (const key in pending_data) {
			const data = pending_data[key];

			// Emit the local event
			this.emit(kind + '.' + key, data);

			// Emit the socket.io update, if an api module exists
			if (typeof api === 'undefined') continue;

			api.emit(kind + '-tx', {
				key : {
					stub : key.split('.')[0],
					full : key,
				},

				value : {
					stub : object_path.get(root, key),
					full : root[key.split('.')[0]],
				},
			});
		}
	} // flush(kind)


	// Schedule a flush of pending changes of a given kind, if not already scheduled
	schedule_flush(kind) {
		if (this.flush_timer[kind] !== null) return;

		this.flush_timer[kind] = setTimeout(() => {
			this.flush_timer[kind] = null;
			this.flush(kind);
		}, update.flush_delay_ms);
	} // schedule_flush(kind)


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

		// Track the pending change, and schedule a coalesced flush
		this.pending.config[key] = {
			old : value_old,
			new : value_new,
		};

		this.schedule_flush('config');

		return true;
	} // config(key, value_new, quiet)


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

		// Track the pending change, and schedule a coalesced flush
		this.pending.status[key] = {
			old : value_old,
			new : value_new,
		};

		this.schedule_flush('status');

		return true;
	} // status(key, value_new, quiet)
}


module.exports = update;
