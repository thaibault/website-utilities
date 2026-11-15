#!/usr/bin/env node
// -*- coding: utf-8 -*-
import * as __WEBPACK_EXTERNAL_MODULE_child_process__ from "child_process";
import * as __WEBPACK_EXTERNAL_MODULE_clientnode__ from "clientnode";
import * as __WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3__ from "fs/promises";
import * as __WEBPACK_EXTERNAL_MODULE_path__ from "path";
/******/ var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var clientnode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module deploy *//* !
    region header
    [Project page](https://tsickert.com/website-utilities)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/// region imports
// endregion
await (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.importFilesystemAPI)();const PUBLIC_REPOSITORY_PATH=process.env.PUBLIC_REPOSITORY_PATH||(0,path__WEBPACK_IMPORTED_MODULE_3__.resolve)("../",`${process.env.GIT_PRIVATE_AUTHOR_NAME||""}.github.io`);const log=new clientnode__WEBPACK_IMPORTED_MODULE_0__.Logger({name:"website-utilities.deploy",level:"info"});const run=(command,options={})=>(0,child_process__WEBPACK_IMPORTED_MODULE_1__.execSync)(command,{encoding:"utf-8",shell:"/bin/bash",...options});if(!(await (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.isFile)((0,path__WEBPACK_IMPORTED_MODULE_3__.resolve)(PUBLIC_REPOSITORY_PATH,"CNAME"))))throw new Error(`Missing public website directory in "${PUBLIC_REPOSITORY_PATH}"`);if(process.env.USER_NAME_GITHUB){void log.info(`Set git user name to "${process.env.USER_NAME_GITHUB}".`);void log.info(run(`git config user.name '${process.env.USER_NAME_GITHUB}'`,{cwd:PUBLIC_REPOSITORY_PATH}))}if(process.env.USER_EMAIL_GITHUB){void log.info(`Set git user email to "${process.env.USER_EMAIL_GITHUB}".`);void log.info(run(`git config user.email '${process.env.USER_EMAIL_GITHUB}'`,{cwd:PUBLIC_REPOSITORY_PATH}))}void log.info("Pull latest public website state.");void log.info(run("git pull",{cwd:PUBLIC_REPOSITORY_PATH}));void log.info("Build new web page.");void log.info(run("yarn clear"));void log.info(run("yarn build"));void log.info(`Update page data in "${PUBLIC_REPOSITORY_PATH}".`);for(const name of await (0,fs_promises__WEBPACK_IMPORTED_MODULE_2__.readdir)(PUBLIC_REPOSITORY_PATH))if(![".git",".github","CNAME","readme.md","public-repository"].includes(name))await (0,fs_promises__WEBPACK_IMPORTED_MODULE_2__.rm)((0,path__WEBPACK_IMPORTED_MODULE_3__.resolve)(PUBLIC_REPOSITORY_PATH,name),{force:true,recursive:true});await (0,clientnode__WEBPACK_IMPORTED_MODULE_0__.copyDirectoryRecursive)("dist",PUBLIC_REPOSITORY_PATH,true);void log.info(run("yarn clear"));void log.info("Upload newly build webpage");// NOTE: "git commit --all" only stages tracked files, so add new ones first.
void log.info(run("git add --all",{cwd:PUBLIC_REPOSITORY_PATH}));void log.info(run(`git commit --all --message 'Automatic page build update.'`,{cwd:PUBLIC_REPOSITORY_PATH}));void log.info(run("git push",{cwd:PUBLIC_REPOSITORY_PATH}));
/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "R", 0, /* binding */ log,
/* harmony export */   "v", 0, /* binding */ PUBLIC_REPOSITORY_PATH
/* harmony export */ ]);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["Logger"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.Logger), ["copyDirectoryRecursive"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.copyDirectoryRecursive), ["importFilesystemAPI"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.importFilesystemAPI), ["isFile"]: () => (__WEBPACK_EXTERNAL_MODULE_clientnode__.isFile) });

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["execSync"]: () => (__WEBPACK_EXTERNAL_MODULE_child_process__.execSync) });

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["readdir"]: () => (__WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3__.readdir), ["rm"]: () => (__WEBPACK_EXTERNAL_MODULE_fs_promises_cc1b69f3__.rm) });

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["resolve"]: () => (__WEBPACK_EXTERNAL_MODULE_path__.resolve) });

/***/ })
/******/ ]);
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	const webpackQueues = Symbol("webpack queues");
/******/ 	const webpackExports = Symbol("webpack exports");
/******/ 	const webpackError = Symbol("webpack error");
/******/ 	
/******/ 	const resolveQueue = (queue) => {
/******/ 		if(queue?.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 	
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				const queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				const obj = {};
/******/ 	
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		const ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		let queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		const depQueues = new Set();
/******/ 		const exports = module.exports;
/******/ 		let currentDeps;
/******/ 		let outerResolve;
/******/ 		let reject;
/******/ 		const promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		const handle = (deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			let fn;
/******/ 			const getResult = () => (currentDeps.map((d) => {
/******/ 	
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			const promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.forEach((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}
/******/ 		const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 	
/******/ 		body(handle, done);
/******/ 		queue?.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	if(Array.isArray(definition)) {
/******/ 		var i = 0;
/******/ 		while(i < definition.length) {
/******/ 			var key = definition[i++];
/******/ 			var binding = definition[i++];
/******/ 			var descriptor = binding === 0 ? { enumerable: true, value: definition[i++] } : { enumerable: true, get: binding };
/******/ 			if(!__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, descriptor);
/******/ 		}
/******/ 	} else {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ let __webpack_exports__ = __webpack_require__(0);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ const __webpack_exports__PUBLIC_REPOSITORY_PATH = __webpack_exports__.v;
/******/ const __webpack_exports__log = __webpack_exports__.R;
/******/ export { __webpack_exports__PUBLIC_REPOSITORY_PATH as PUBLIC_REPOSITORY_PATH, __webpack_exports__log as log };
/******/ 
