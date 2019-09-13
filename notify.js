const chump = require('chump');

// Send Pushover notification
function notify(string) {
	// Skip if config isn't loaded yet
	if (typeof config                     === 'undefined' || config                     === null) return false;
	if (typeof config.notification        === 'undefined' || config.notification        === null) return false;
	if (typeof config.notification.method === 'undefined' || config.notification.method === null) return false;

	let method = config.notification.method;
	if (method !== 'pushover') return false;

	let conf = config.notification.config;
	if (typeof conf[method] === 'undefined' || conf[method] === null) return false;

	conf = config.notification.config[method];

	// Instantiate client with Pushover API token
	let client = new chump.Client(conf.token);

	// Instantiate destination user
	let user;
	if (typeof conf.device !== 'undefined' && conf.device !== null) { user = new chump.User(conf.user_id, conf.device); }
	else { user = new chump.User(conf.user_id); }

	let priority = new chump.Priority(conf.priority);
	let sound    = new chump.Sound(conf.sound);

	// Instantiate a message
	let message_opts = {
		user       : user,
		message    : string,
		title      : conf.title,
		enableHtml : conf.html,
		url        : conf.url.string,
		urlTitle   : conf.url.title,
		priority   : priority,
		sound      : sound,
	};

	let message = new chump.Message(message_opts);

	// Send the message, handle result within a Promise
	client.sendMessage(message)
		.then(() => {
			log.lib(method + ' notification sent');
		})
		.catch((error) => {
			log.lib(method + ' error occured: ' + error);
		});
}


module.exports = {
	// Functions
	notify : notify,
};
