import body_parser from 'body-parser';
import express     from 'express';
import http        from 'http';
import object_path from 'object-path';
import socket_io   from 'socket.io';

const app     = express();
const server  = http.Server(app);

// body-parser to handle POSTed JSON
app.use(body_parser.json());

// Only load socket.io server if this is the client app
const io = socket_io(server);


// Extremely scientifical conversion of very loosely falsey or truthy values to proper boolean
function val2bool(value = null) {
	if (typeof value === 'undefined' || value === null) return false;

	value = value.toString().toLowerCase();

	switch (value) {
		case '1'     :
		case 'go'    :
		case 'on'    :
		case 'one'   :
		case 'start' :
		case 't'     :
		case 'true'  :
		case 'yes'   : return true;

		default : return false;
	}
}

// Ghetto workaround so the different interface processes
// have their respective API servers listening on different
// ports
function get_port() {
	const port_base = config.api.port;

	let port_offset;
	switch (app_intf) {
		case 'can0'   : port_offset = 0; break;
		case 'can1'   : port_offset = 1; break;
		case 'client' : port_offset = 2; break;
		case 'dbus'   : port_offset = 3; break;
		case 'ibus'   : port_offset = 4; break;
		case 'kbus'   : port_offset = 5; break;

		default : port_offset = 7;
	}

	return port_base + port_offset;
}

// Emit WebSocket data/events
function emit(topic, data, emit_cb = null) {
	// Bounce if this isn't the client app
	if (app_intf !== 'client') {
		typeof emit_cb === 'function' && process.nextTick(emit_cb);
		emit_cb = undefined;
		return;
	}

	if (topic !== 'status-tx') {
		typeof emit_cb === 'function' && process.nextTick(emit_cb);
		emit_cb = undefined;
		return;
	}

	switch (data.key.full) {
		case 'dme.voltage' : break;

		case 'engine.atmospheric_pressure.psi' : break;
		case 'engine.aux_fan_speed'            : break;

		case 'engine.torque.after_interventions'  : break;
		case 'engine.torque.before_interventions' : break;
		case 'engine.torque.loss'                 : break;
		case 'engine.torque.output'               : break;

		case 'engine.torque_value.after_interventions'  : break;
		case 'engine.torque_value.before_interventions' : break;
		case 'engine.torque_value.loss'                 : break;
		case 'engine.torque_value.output'               : break;

		case 'engine.horsepower.after_interventions'  : break;
		case 'engine.horsepower.before_interventions' : break;
		case 'engine.horsepower.loss'                 : break;
		case 'engine.horsepower.output'               : break;

		case 'fuel.consumption'  : break;
		case 'fuel.level'        : break;
		case 'fuel.pump.percent' : break;

		case 'gpio.relay_0' : break;
		case 'gpio.relay_1' : break;

		case 'lcm.voltage.terminal_30' : break;

		case 'obc.average_speed.mph'  : break;
		case 'obc.consumption.c1.mpg' : break;
		case 'obc.consumption.c2.mpg' : break;
		case 'obc.range.mi'           : break;

		case 'system.cpu.load_pct' : break;
		case 'system.temperature'  : break;

		case 'temperature.coolant.c'  : break;
		case 'temperature.exhaust.c'  : break;
		case 'temperature.exterior.c' : break;
		case 'temperature.intake.c'   : break;
		case 'temperature.oil.c'      : break;

		case 'vehicle.dsc.torque_reduction_1'  : break;
		case 'vehicle.dsc.torque_reduction_2'  : break;
		case 'vehicle.ignition_level'          : break;
		case 'vehicle.steering.angle'          : break;
		case 'vehicle.wheel_speed.front.left'  : break;
		case 'vehicle.wheel_speed.front.right' : break;
		case 'vehicle.wheel_speed.rear.left'   : break;
		case 'vehicle.wheel_speed.rear.right'  : break;

		default : {
			typeof emit_cb === 'function' && process.nextTick(emit_cb);
			emit_cb = undefined;
			return;
		}
	}

	io.emit(topic, data);
	// log.lib('Emitted ' + topic + ' message');

	typeof emit_cb === 'function' && process.nextTick(emit_cb);
	emit_cb = undefined;
}

function init_client(init_client_cb = null) {
	// Only load socket.io server if this is the client app
	if (app_intf !== 'client') {
		log.lib('Not loading client-only API functions');

		typeof init_client_cb === 'function' && process.nextTick(init_client_cb);
		init_client_cb = undefined;
		return;
	}

	io.on('connection', (socket_conn) => {
		socket_conn.on('disconnect', (reason) => {
			log.lib('socket.io client disconnected, reason: ' + reason);
		});

		log.lib('socket.io client connected');

		const array_status = [
			'engine',
			'dme',
			'fuel',
			'gpio',
			'lcm',
			'obc',
			'system',
			'temperature',
			'vehicle',
		];

		array_status.forEach((key) => {
			socket_conn.emit('status-tx', {
				key : {
					stub : key.split('.')[0],
					full : key,
				},

				value : {
					stub : object_path.get(status, key),
					full : status[key.split('.')[0]],
				},
			});
		});

		// Force refresh data
		setTimeout(() => {
			IKE.obc_refresh();
		}, 500);
	});


	// Some of these are shameful

	// DME
	app.get('/dme/encode-316/:rpm', (req, res) => {
		DME.encode_316(parseInt(req.params.rpm));
		res.send(status.dme);
	});


	// DSP
	app.get('/dsp/eq/:band/:value', (req, res) => {
		DSP.eq_delta(req.params.band, req.params.value);
		res.send(status.dsp);
	});

	app.get('/dsp/get/:value', (req, res) => {
		DSP.request(req.params.value);
		res.send(status.dsp);
	});

	app.get('/dsp/loudness/:state', (req, res) => {
		DSP.loudness(req.params.state);
		res.send(status.dsp);
	});

	app.get('/dsp/m-audio/:mode', (req, res) => {
		DSP.m_audio(req.params.mode);
		res.send(status.dsp);
	});

	app.get('/dsp/mode/:mode', (req, res) => {
		DSP.dsp_mode(req.params.mode);
		res.send(status.dsp);
	});

	app.get('/dsp/speaker-test/:command', (req, res) => {
		DSP.speaker_test(req.params.command);
		res.send(status.dsp);
	});

	app.post('/dsp/eq', (req, res) => {
		DSP.eq_encode(req.body);

		// Update config object value
		config.media.dsp.eq = req.body;

		res.send(status.dsp);
	});


	// FEM
	app.get('/fem/backlight/:value', (req, res) => {
		FEM.backlight(parseInt(req.params.value));
		res.send(status.fem);
	});


	// GM
	app.get('/gm/doors/closed/:value', (req, res) => {
		const value = val2bool(req.params.value);
		update.status('doors.closed',  value, false);
		update.status('doors.open',   !value, false);
		res.send(status.doors);
	});

	app.get('/gm/doors/open/:value', (req, res) => {
		const value = val2bool(req.params.value);
		update.status('doors.closed', !value, false);
		update.status('doors.open',    value, false);
		res.send(status.doors);
	});

	app.get('/gm/doors/sealed/:value', (req, res) => {
		const value = val2bool(req.params.value);
		update.status('doors.sealed', value, false);
		res.send(status.doors);
	});

	app.get('/gm/get/:value', (req, res) => {
		GM.request(req.params.value);
		res.send(status.gm);
	});

	app.get('/gm/interior-light/:value', (req, res) => {
		GM.interior_light(parseInt(req.params.value));
		res.send(status.gm);
	});

	app.get('/gm/mirror/:mirror/:action', (req, res) => {
		GM.mirrors({
			action : req.params.action,
			mirror : req.params.mirror,
		});

		res.send(status.gm);
	});

	app.get('/gm/windows/closed/:value', (req, res) => {
		const value = val2bool(req.params.value);
		update.status('windows.closed',  value, false);
		update.status('windows.open',   !value, false);
		res.send(status.windows);
	});

	app.get('/gm/windows/open/:value', (req, res) => {
		const value = val2bool(req.params.value);
		update.status('windows.closed', !value, false);
		update.status('windows.open',    value, false);
		res.send(status.windows);
	});

	app.post('/gm/decode_status_open', (req, res) => {
		GM.decode_status_open(req.body);
		res.send(status.gm);
	});

	app.post('/gm/locks', (req, res) => {
		GM.locks(req.body);
		res.send(status.gm);
	});

	app.post('/gm/mirrors', (req, res) => {
		GM.mirrors(req.body);
		res.send(status.gm);
	});

	app.post('/gm/windows', (req, res) => {
		GM.windows(req.body);
		res.send(status.gm);
	});


	// GPIO
	app.get('/gpio/set/:relay/:value', (req, res) => {
		gpio.set(req.params.relay, req.params.value);
		res.send(status.gpio);
	});

	app.get('/gpio/toggle/:relay', (req, res) => {
		gpio.toggle(req.params.relay);
		res.send(status.gpio);
	});


	// HDMI
	app.get('/hdmi/cec/command/:action', (req, res) => {
		hdmi_cec.command(req.params.action);
		res.send(status.hdmi.cec);
	});

	app.get('/hdmi/rpi/command/:action', (req, res) => {
		hdmi_rpi.command(req.params.action);
		res.send(status.hdmi.rpi);
	});


	// IHKA
	app.get('/ihka/get/:value', (req, res) => {
		IHKA.request(req.params.value);
		res.send(status.ihka);
	});

	app.get('/ihka/recirc', (req, res) => {
		IHKA.recirc();
		res.send(status.ihka);
	});

	app.post('/ihka/aux', (req, res) => {
		IHKA.aux(req.body);
		res.send(status.ihka);
	});


	// IKE
	app.get('/ike/get/:value', (req, res) => {
		IKE.request(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/ignition/:value', (req, res) => {
		IKE.ignition(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/nopad/:value', (req, res) => {
		IKE.text_nopad(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/normal/:value', (req, res) => {
		IKE.text(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/override/:value', (req, res) => {
		IKE.text_override(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/urgent/:value', (req, res) => {
		IKE.text_urgent(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/urgent/off', (req, res) => {
		IKE.text_urgent_off();
		res.send(status.ike);
	});

	app.get('/ike/text/warning/:value', (req, res) => {
		IKE.text_warning(req.params.value);
		res.send(status.ike);
	});


	// LCM
	app.get('/lcm/backlight/:value', (req, res) => {
		update.status('lcm.dimmer.value_1', parseInt(req.params.value), false);
		res.send(status.lcm);
	});

	app.get('/lcm/comfort-turn/:action', (req, res) => {
		update.status('lights.turn.depress_elapsed', 0, false);
		LCM.comfort_turn_flash(req.params.action);
		res.send(status.lcm);
	});

	app.get('/lcm/get/:value', (req, res) => {
		LCM.request(req.params.value);
		res.send(status.lcm);
	});

	app.get('/lcm/io-encode', (req, res) => {
		LCM.io_encode(req.query);
		res.send(status.lcm);
	});

	app.post('/lcm/io-encode', (req, res) => {
		LCM.io_encode(req.body);
		res.send(status.lcm);
	});

	app.get('/lcm/police-lights/:action', (req, res) => {
		const value = val2bool(req.params.value);
		LCM.police(value);
		res.send(status.lcm);
	});

	app.get('/lcm/welcome-lights/:action', (req, res) => {
		const value = val2bool(req.params.value);
		LCM.welcome_lights(value);
		res.send(status.lcm);
	});


	// MFL
	app.get('/mfl/translate-button-media/:action/:button', (req, res) => {
		MFL.translate_button_media({
			action : req.params.action,
			button : req.params.button,
		});

		res.send(status.mfl);
	});


	// OBC
	app.get('/obc/get-all', (req, res) => {
		IKE.obc_refresh();
		res.send(status.obc);
	});

	app.get('/obc/get/:value', (req, res) => {
		IKE.obc_data('get', req.params.value);
		res.send(status.obc);
	});

	app.get('/obc/reset/:value', (req, res) => {
		IKE.obc_data('reset', req.params.value);
		res.send(status.obc);
	});

	app.get('/obc/set/clock', (req, res) => {
		IKE.obc_clock();
		res.send(status.obc);
	});


	// POWER
	app.get('/power/:state', (req, res) => {
		power.power(req.params.state);
		res.send(status.power);
	});


	// RAD
	app.get('/rad/cassette/:command', (req, res) => {
		RAD.cassette_control(req.params.command);
		res.send(status.rad);
	});

	app.get('/rad/power/:command', (req, res) => {
		RAD.audio_power(req.params.command);
		res.send(status.rad);
	});

	app.get('/rad/source/:command', (req, res) => {
		RAD.audio_control(req.params.command);
		res.send(status.rad);
	});

	app.get('/rad/volume/:command', (req, res) => {
		RAD.volume_control(parseInt(req.params.command));
		res.send(status.rad);
	});


	// RLS
	app.get('/rls/get/:value', (req, res) => {
		RLS.request(req.params.value);
		res.send(status.rls);
	});

	app.post('/rls/light-control', (req, res) => {
		RLS.light_control_status(req.body);
		res.send(status.rls);
	});


	// SZM
	app.get('/szm/button/:button', (req, res) => {
		SZM.encode_button(req.params.button);
		res.send(status.szm);
	});


	// TEL
	app.post('/tel/led', (req, res) => {
		TEL.led(req.body);
		res.send(status.tel);
	});


	log.lib('Initialized client-only API functions');

	typeof init_client_cb === 'function' && process.nextTick(init_client_cb);
	init_client_cb = undefined;
}

function init(init_cb = null) {
	app.all('*', (req, res, next) => {
		log.lib('[' + req.method + '] ' + req.originalUrl);
		res.set('Content-Type', 'application/json');
		next();
	});

	// Force-run garbage collection
	app.get('/app/gc', (req, res) => {
		if (typeof global.gc !== 'function') {
			res.send({ success : false });
			return;
		}

		global.gc();
		res.send({ success : true });
	});

	app.get('/config', (req, res) => {
		res.send(config);
	});

	app.post('/config', (req, res) => {
		config = req.body;
		json.config_write();
		res.send(config);
	});

	app.get('/console', (req, res) => {
		update.config('console.output', !config.console.output);
		res.send(config.console);
	});

	app.get('/status', (req, res) => {
		res.send(status);
	});

	server.listen(get_port(), () => {
		log.lib('Express listening on port ' + get_port());
	});

	init_client(init_cb);
}

function term(term_cb = null) {
	log.lib('Terminated');

	typeof term_cb === 'function' && process.nextTick(term_cb);
	term_cb = undefined;
}


export default {
	// Main functions
	emit,

	// Start/stop functions
	init,
	term,
};
