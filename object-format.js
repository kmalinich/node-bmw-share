/* eslint no-console     : 0 */
/* eslint no-unused-vars : 0 */

import colorize from 'json-colorizer';

// 24bit color chalk-style palette
const chalk = {
	black  : '#303030',
	blue   : '#3398db',
	cyan   : '#00c8c8',
	green  : '#2fdf64',
	gray   : '#acacac',
	orange : '#ff9932',
	pink   : '#b2008c',
	purple : '#7253b2',
	red    : '#e74c3c',
	white  : '#e0e0e0',
	yellow : '#ffcc32',
};


function object_format(object) {
	const json = {
		str : JSON.stringify(object, null, 2),
		opt : {
			colors : {
				BOOLEAN_LITERAL : '#FF9932', // italic

				BRACE   : '#ACACAC',
				BRACKET : 'green',

				COLON : 'whiteBright.bold',
				COMMA : 'whiteBright.bold',

				NULL_LITERAL   : 'gray.italic',
				NUMBER_LITERAL : '#00C8C8',

				STRING_KEY     : 'magenta.bold',
				STRING_LITERAL : '#FFCC32',
			},
		},
	};

	console.log(colorize(json.str, json.opt));
}


export default object_format;
