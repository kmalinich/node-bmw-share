const module_name = __filename.slice(__dirname.length + 1, -3).replace('-', '_');

// Check if we can get temp data
// (support is on macOS and RPi)
function check(check_callback = null) {
  // Don't check the logic twice, and only notify the first time
  if (host_data.check_result === null) {
    // Save check result
    host_data.check_result = (process.arch == 'arm' || process.platform == 'darwin');

    // Save host type
    host_data.type = process.arch == 'arm' && 'pi-temperature' || 'smc';

    // Load appropriate temperature library
    system_temp = require(host_data.type);

    log.msg({
      src : module_name,
      msg : 'Check passed: '+host_data.check_result+', type: '+host_data.type,
    });
  }

  if (typeof check_callback === 'function') check_callback();
  check_callback = undefined;

  return host_data.check_result;
}

// Init all host data
function init(init_callback = null) {
  let cpus = os.cpus();
  let load = os.loadavg();

  status.system = {
    type : app_type,
    intf : app_intf || null,
    up : os.uptime(),
    temperature : null,
    host : {
      full : os.hostname(),
      short : os.hostname().split('.')[0],
    },
    cpu : {
      arch : os.arch(),
      count : cpus.length,
      load : load,
      load_pct : Math.round((load[0]/4)*100),
      model : cpus[0].model,
      speed : cpus[0].speed,
    },
    memory : {
      free : os.freemem(),
      total : os.totalmem(),
      free_pct : parseFloat(((os.freemem()/os.totalmem()).toFixed(4))*100),
    },
    os : {
      platform : os.platform(),
      type : os.type(),
      release : os.release(),
    },
  };

  refresh_temperature();
  refresh();
  broadcast();

  log.msg({
    src : module_name,
    msg : 'Initialized',
  });

  if (typeof init_callback === 'function') init_callback();
  init_callback = undefined;
}

// Cancel timeouts
function term(term_callback = null) {
  if (host_data.timeouts.broadcast !== null) {
    clearTimeout(host_data.timeouts.broadcast);
    host_data.timeouts.broadcast = null;

    log.module({
      src : module_name,
      msg : 'Unset host data broadcast timeout',
    });
  }

  if (host_data.timeouts.refresh !== null) {
    clearTimeout(host_data.timeouts.refresh);
    host_data.timeouts.refresh = null;

    log.module({
      src : module_name,
      msg : 'Unset host data refresh timeout',
    });
  }

  if (host_data.timeouts.send !== null) {
    clearTimeout(host_data.timeouts.send);
    host_data.timeouts.send = null;

    log.module({
      src : module_name,
      msg : 'Unset host data send timeout',
    });
  }

  log.module({
    src : module_name,
    msg : 'Terminated',
  });

  if (typeof term_callback === 'function') term_callback();
  term_callback = undefined;
}

// Get+save RPi temp
function refresh_temperature() {
  if (!check()) {
    status.system.temperature = 0;
    return false;
  }

  switch (host_data.type) {
    case 'pi-temperature':
      system_temp.measure((error, value) => {
        if (typeof error == 'undefined' || error === null) {
          status.system.temperature = Math.round(value);
          return;
        }

        status.system.temperature = 0;

        log.msg({
          src : module_name,
          msg : host_data.type+' error: '+error,
        });
      });
      break;

    case 'smc':
      // TC0D : Hackintosh
      // TC0E : 2016 rMBP

      // Either TC0D or TC0E is always 0.. so ..
      // .. yeah, that's gross

      // Save rounded temp value
      status.system.temperature = Math.round(system_temp.get('TC0D')+system_temp.get('TC0E'));
      break;
  }

  // log.msg({
  //   src : module_name,
  //   msg : 'System temp: '+status.system.temperature+'c',
  // });
}

// Periodically broadcast this host's data to WebSocket clients to update them
function broadcast() {
  if (host_data.timeouts.broadcast === null) {
    log.module({
      src : module_name,
      msg : 'Set broadcast timeout ('+config.system.host_data.refresh_interval+'ms)',
    });
  }

  host_data.timeouts.broadcast = setTimeout(send, config.system.host_data.refresh_interval);

  send();
}

// Refresh host data
function refresh() {
  refresh_temperature();

  status.system.up       = os.uptime();
  status.system.cpu.load = os.loadavg();

  status.system.memory.free  = os.freemem();
  status.system.memory.total = os.totalmem();

  status.system.memory.free_pct = parseFloat(((os.freemem()/os.totalmem()).toFixed(2))*100);

  if (host_data.timeouts.refresh === null) {
    log.module({
      src : module_name,
      msg : 'Set refresh timeout ('+config.system.host_data.refresh_interval+'ms)',
    });
  }

  host_data.timeouts.refresh = setTimeout(refresh, config.system.host_data.refresh_interval);
}

// Send this host's data to WebSocket clients to update them
function send() {
  log.module({
    src : module_name,
    msg : 'Sending host data',
  });

  socket.send('host-data', status.system);
}

module.exports = {
  check_result : null,
  type         : null,

  timeouts : {
    broadcast : null,
    refresh   : null,
    send      : null,
  },

  check : (check_callback) => { check(check_callback); },
  init  : (init_callback)  => { init(init_callback);   },
  term  : (term_callback)  => { term(term_callback);   },

  broadcast : () => { broadcast(); },
  refresh   : () => { refresh();   },
  send      : () => { send();      },
};
