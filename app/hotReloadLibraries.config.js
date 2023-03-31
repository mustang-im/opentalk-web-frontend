// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
const path = require('path');

/* Hot reload config for external libraries */

/* STEP-BY-STEP GUIDE:

	1. Set hot reload to true:

		externalLibsConfig {
			enableHotReload: true, <---
	  	}

	2. Make sure that the local library flag is also enabled for hot reload:

		 externalLibsConfig {
			components: {
				enabled: true, <--
			}
		}

	2. Add your local path of the components library:

		externalLibsConfig {
			components: {
				path: {
					local: ../path_to_your_local_components_library  <---
				}
			}
		}

	3. Uncoment the tsconfig.json line:

		"baseUrl": "./",
      	"paths": {
        	"@opentalk/components": [
          		"../path_to_your_local_components_library"
        	]
      	}

	4. Components library (@opentalk/components):

		-  Delete all build version (dist/build etc.)
		-  Delete node_modules
		-  run -> yarn cache clean && yarn install

	5. Run yarn start in the frontend app and enjoy the magic


	* NOTICE
	- In case this doesn't work just uninstall the @opentalk/common library from the @opentalk/components library and re-install it again

*/

/* EXPLANATION:
  - enableHotReload - is the flag that will enable or disable the hot reload for the external libraries (false by default)
  - externalModules - object that contains all local libraries for which we want to enable/disable hot reload
    - enabled - should hot reload be turned on or off
	- path - location to the library
		- local - relative path where the librarie is located in your machine
		- nodeModule - relative path to the node modules (which shouldn't be changes)
  - pathResolver - function that will return the right path to the module depending of the enabled flag of the module/library
  - dependencies - getter that will create an object from all relevant dependencies for hot reload to work
*/

var externalLibsConfig = {
  enableHotReload: false,
  externalModules: {
    components: {
      enabled: true,
      path: {
        local: '../../module-component',
        nodeModule: '../node_modules/@opentalk/components',
      },
    },
    common: {
      enabled: false,
      path: {
        local: '../packages/common',
        nodeModule: '../node_modules/@opentalk/common',
      },
    },
  },
  pathResolver(module) {
    return module.enabled ? module.path.local : module.path.nodeModule;
  },
  get dependencies() {
    return {
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
      'react-redux': path.resolve(__dirname, '../node_modules/react-redux'),
      '@opentalk/notistack': path.resolve(__dirname, '../node_modules/@opentalk/notistack'),
      '@mui/styles': path.resolve(__dirname, '../node_modules/@mui/styles'),
      '@mui/material': path.resolve(__dirname, '../node_modules/@mui/material'),
      'react-i18next': path.resolve(__dirname, '../node_modules/react-i18next'),
      '@opentalk/common': path.resolve(__dirname, this.pathResolver(this.externalModules.common)),
      '@opentalk/components': path.resolve(__dirname, this.pathResolver(this.externalModules.components)),
    };
  },
};

module.exports = externalLibsConfig;
