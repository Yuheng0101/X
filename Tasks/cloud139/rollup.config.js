import defaultConfig from './rollup.default.config.js';
import devConfig from './rollup.dev.config.js';

export default commandLineArgs => {
	if (commandLineArgs.configDev) {
		return devConfig;
	}
	return defaultConfig;
};
