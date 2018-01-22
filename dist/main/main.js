module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if(err) {
/******/ 				if(__webpack_require__.onError)
/******/ 					return __webpack_require__.oe(err);
/******/ 				else
/******/ 					throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext("(function(exports) {" + content + "\n})", filename)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if(err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch(e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "2511bfa3afcabbbc12b2"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/debug/src/browser.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This is the web browser implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(\"./node_modules/debug/src/debug.js\");\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = 'undefined' != typeof chrome\n               && 'undefined' != typeof chrome.storage\n                  ? chrome.storage.local\n                  : localstorage();\n\n/**\n * Colors.\n */\n\nexports.colors = [\n  'lightseagreen',\n  'forestgreen',\n  'goldenrod',\n  'dodgerblue',\n  'darkorchid',\n  'crimson'\n];\n\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {\n    return true;\n  }\n\n  // is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||\n    // is firebug? http://stackoverflow.com/a/398120/376773\n    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||\n    // is firefox >= v31?\n    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||\n    // double check webkit in userAgent just in case we are in a worker\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/));\n}\n\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nexports.formatters.j = function(v) {\n  try {\n    return JSON.stringify(v);\n  } catch (err) {\n    return '[UnexpectedJSONParseError]: ' + err.message;\n  }\n};\n\n\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var useColors = this.useColors;\n\n  args[0] = (useColors ? '%c' : '')\n    + this.namespace\n    + (useColors ? ' %c' : ' ')\n    + args[0]\n    + (useColors ? '%c ' : ' ')\n    + '+' + exports.humanize(this.diff);\n\n  if (!useColors) return;\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit')\n\n  // the final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function(match) {\n    if ('%%' === match) return;\n    index++;\n    if ('%c' === match) {\n      // we only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n\n  args.splice(lastC, 0, c);\n}\n\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\nfunction log() {\n  // this hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return 'object' === typeof console\n    && console.log\n    && Function.prototype.apply.call(console.log, console, arguments);\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  try {\n    if (null == namespaces) {\n      exports.storage.removeItem('debug');\n    } else {\n      exports.storage.debug = namespaces;\n    }\n  } catch(e) {}\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  var r;\n  try {\n    r = exports.storage.debug;\n  } catch(e) {}\n\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n\n/**\n * Enable namespaces listed in `localStorage.debug` initially.\n */\n\nexports.enable(load());\n\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\nfunction localstorage() {\n  try {\n    return window.localStorage;\n  } catch (e) {}\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanM/MTcyZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWVcbiAgICAgICAgICAgICAgICYmICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWUuc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgPyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgICAgICAgICAgICAgOiBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICdsaWdodHNlYWdyZWVuJyxcbiAgJ2ZvcmVzdGdyZWVuJyxcbiAgJ2dvbGRlbnJvZCcsXG4gICdkb2RnZXJibHVlJyxcbiAgJ2RhcmtvcmNoaWQnLFxuICAnY3JpbXNvbidcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICAvLyBOQjogSW4gYW4gRWxlY3Ryb24gcHJlbG9hZCBzY3JpcHQsIGRvY3VtZW50IHdpbGwgYmUgZGVmaW5lZCBidXQgbm90IGZ1bGx5XG4gIC8vIGluaXRpYWxpemVkLiBTaW5jZSB3ZSBrbm93IHdlJ3JlIGluIENocm9tZSwgd2UnbGwganVzdCBkZXRlY3QgdGhpcyBjYXNlXG4gIC8vIGV4cGxpY2l0bHlcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzICYmIHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG4gIHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlKSB8fFxuICAgIC8vIGlzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgKHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkpKSB8fFxuICAgIC8vIGlzIGZpcmVmb3ggPj0gdjMxP1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuICAgIC8vIGRvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnIubWVzc2FnZTtcbiAgfVxufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm47XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKVxuXG4gIC8vIHRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG4gIC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cbiAgLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIGlmICgnJSUnID09PSBtYXRjaCkgcmV0dXJuO1xuICAgIGluZGV4Kys7XG4gICAgaWYgKCclYycgPT09IG1hdGNoKSB7XG4gICAgICAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgYXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuICB0cnkge1xuICAgIHIgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cblxuICAvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG4gIGlmICghciAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuICAgIHIgPSBwcm9jZXNzLmVudi5ERUJVRztcbiAgfVxuXG4gIHJldHVybiByO1xufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgbG9jYWxTdG9yYWdlLmRlYnVnYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/debug/src/browser.js\n");

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = createDebug.debug = createDebug['default'] = createDebug;\nexports.coerce = coerce;\nexports.disable = disable;\nexports.enable = enable;\nexports.enabled = enabled;\nexports.humanize = __webpack_require__(\"./node_modules/ms/index.js\");\n\n/**\n * The currently active debug mode names, and names to skip.\n */\n\nexports.names = [];\nexports.skips = [];\n\n/**\n * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n *\n * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n */\n\nexports.formatters = {};\n\n/**\n * Previous log timestamp.\n */\n\nvar prevTime;\n\n/**\n * Select a color.\n * @param {String} namespace\n * @return {Number}\n * @api private\n */\n\nfunction selectColor(namespace) {\n  var hash = 0, i;\n\n  for (i in namespace) {\n    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);\n    hash |= 0; // Convert to 32bit integer\n  }\n\n  return exports.colors[Math.abs(hash) % exports.colors.length];\n}\n\n/**\n * Create a debugger with the given `namespace`.\n *\n * @param {String} namespace\n * @return {Function}\n * @api public\n */\n\nfunction createDebug(namespace) {\n\n  function debug() {\n    // disabled?\n    if (!debug.enabled) return;\n\n    var self = debug;\n\n    // set `diff` timestamp\n    var curr = +new Date();\n    var ms = curr - (prevTime || curr);\n    self.diff = ms;\n    self.prev = prevTime;\n    self.curr = curr;\n    prevTime = curr;\n\n    // turn the `arguments` into a proper Array\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n\n    args[0] = exports.coerce(args[0]);\n\n    if ('string' !== typeof args[0]) {\n      // anything else let's inspect with %O\n      args.unshift('%O');\n    }\n\n    // apply any `formatters` transformations\n    var index = 0;\n    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {\n      // if we encounter an escaped % then don't increase the array index\n      if (match === '%%') return match;\n      index++;\n      var formatter = exports.formatters[format];\n      if ('function' === typeof formatter) {\n        var val = args[index];\n        match = formatter.call(self, val);\n\n        // now we need to remove `args[index]` since it's inlined in the `format`\n        args.splice(index, 1);\n        index--;\n      }\n      return match;\n    });\n\n    // apply env-specific formatting (colors, etc.)\n    exports.formatArgs.call(self, args);\n\n    var logFn = debug.log || exports.log || console.log.bind(console);\n    logFn.apply(self, args);\n  }\n\n  debug.namespace = namespace;\n  debug.enabled = exports.enabled(namespace);\n  debug.useColors = exports.useColors();\n  debug.color = selectColor(namespace);\n\n  // env-specific initialization logic for debug instances\n  if ('function' === typeof exports.init) {\n    exports.init(debug);\n  }\n\n  return debug;\n}\n\n/**\n * Enables a debug mode by namespaces. This can include modes\n * separated by a colon and wildcards.\n *\n * @param {String} namespaces\n * @api public\n */\n\nfunction enable(namespaces) {\n  exports.save(namespaces);\n\n  exports.names = [];\n  exports.skips = [];\n\n  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n  var len = split.length;\n\n  for (var i = 0; i < len; i++) {\n    if (!split[i]) continue; // ignore empty strings\n    namespaces = split[i].replace(/\\*/g, '.*?');\n    if (namespaces[0] === '-') {\n      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n    } else {\n      exports.names.push(new RegExp('^' + namespaces + '$'));\n    }\n  }\n}\n\n/**\n * Disable debug output.\n *\n * @api public\n */\n\nfunction disable() {\n  exports.enable('');\n}\n\n/**\n * Returns true if the given mode name is enabled, false otherwise.\n *\n * @param {String} name\n * @return {Boolean}\n * @api public\n */\n\nfunction enabled(name) {\n  var i, len;\n  for (i = 0, len = exports.skips.length; i < len; i++) {\n    if (exports.skips[i].test(name)) {\n      return false;\n    }\n  }\n  for (i = 0, len = exports.names.length; i < len; i++) {\n    if (exports.names[i].test(name)) {\n      return true;\n    }\n  }\n  return false;\n}\n\n/**\n * Coerce `val`.\n *\n * @param {Mixed} val\n * @return {Mixed}\n * @api private\n */\n\nfunction coerce(val) {\n  if (val instanceof Error) return val.stack || val.message;\n  return val;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzP2JlNmMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixTQUFTO0FBQzFCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUMsU0FBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxTQUFTO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWdbJ2RlZmF1bHQnXSA9IGNyZWF0ZURlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAqL1xuXG52YXIgcHJldlRpbWU7XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcbiAgdmFyIGhhc2ggPSAwLCBpO1xuXG4gIGZvciAoaSBpbiBuYW1lc3BhY2UpIHtcbiAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXG4gIGZ1bmN0aW9uIGRlYnVnKCkge1xuICAgIC8vIGRpc2FibGVkP1xuICAgIGlmICghZGVidWcuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgdmFyIHNlbGYgPSBkZWJ1ZztcblxuICAgIC8vIHNldCBgZGlmZmAgdGltZXN0YW1wXG4gICAgdmFyIGN1cnIgPSArbmV3IERhdGUoKTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuICAgIHNlbGYuZGlmZiA9IG1zO1xuICAgIHNlbGYucHJldiA9IHByZXZUaW1lO1xuICAgIHNlbGYuY3VyciA9IGN1cnI7XG4gICAgcHJldlRpbWUgPSBjdXJyO1xuXG4gICAgLy8gdHVybiB0aGUgYGFyZ3VtZW50c2AgaW50byBhIHByb3BlciBBcnJheVxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlT1xuICAgICAgYXJncy51bnNoaWZ0KCclTycpO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgZnVuY3Rpb24obWF0Y2gsIGZvcm1hdCkge1xuICAgICAgLy8gaWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuICAgICAgaWYgKG1hdGNoID09PSAnJSUnKSByZXR1cm4gbWF0Y2g7XG4gICAgICBpbmRleCsrO1xuICAgICAgdmFyIGZvcm1hdHRlciA9IGV4cG9ydHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBtYXRjaCA9IGZvcm1hdHRlci5jYWxsKHNlbGYsIHZhbCk7XG5cbiAgICAgICAgLy8gbm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuICAgICAgICBhcmdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGluZGV4LS07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG5cbiAgICAvLyBhcHBseSBlbnYtc3BlY2lmaWMgZm9ybWF0dGluZyAoY29sb3JzLCBldGMuKVxuICAgIGV4cG9ydHMuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuXG4gICAgdmFyIGxvZ0ZuID0gZGVidWcubG9nIHx8IGV4cG9ydHMubG9nIHx8IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4gICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cblxuICBkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIGRlYnVnLmVuYWJsZWQgPSBleHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKTtcbiAgZGVidWcudXNlQ29sb3JzID0gZXhwb3J0cy51c2VDb2xvcnMoKTtcbiAgZGVidWcuY29sb3IgPSBzZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXG4gIC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5pbml0KSB7XG4gICAgZXhwb3J0cy5pbml0KGRlYnVnKTtcbiAgfVxuXG4gIHJldHVybiBkZWJ1Zztcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICBleHBvcnRzLm5hbWVzID0gW107XG4gIGV4cG9ydHMuc2tpcHMgPSBbXTtcblxuICB2YXIgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXNwbGl0W2ldKSBjb250aW51ZTsgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3NcbiAgICBuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcbiAgICBpZiAobmFtZXNwYWNlc1swXSA9PT0gJy0nKSB7XG4gICAgICBleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkaXNhYmxlKCkge1xuICBleHBvcnRzLmVuYWJsZSgnJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcbiAgdmFyIGksIGxlbjtcbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ29lcmNlIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb2VyY2UodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtcbiAgcmV0dXJuIHZhbDtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/debug.js\n");

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Detect Electron renderer process, which is node, but we should\n * treat as a browser.\n */\n\nif (typeof process !== 'undefined' && process.type === 'renderer') {\n  module.exports = __webpack_require__(\"./node_modules/debug/src/browser.js\");\n} else {\n  module.exports = __webpack_require__(\"./node_modules/debug/src/node.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzPzQ2OWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGV0ZWN0IEVsZWN0cm9uIHJlbmRlcmVyIHByb2Nlc3MsIHdoaWNoIGlzIG5vZGUsIGJ1dCB3ZSBzaG91bGRcbiAqIHRyZWF0IGFzIGEgYnJvd3Nlci5cbiAqL1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL25vZGUuanMnKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/index.js\n");

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar tty = __webpack_require__(\"tty\");\nvar util = __webpack_require__(\"util\");\n\n/**\n * This is the Node.js implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(\"./node_modules/debug/src/debug.js\");\nexports.init = init;\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\n\n/**\n * Colors.\n */\n\nexports.colors = [6, 2, 3, 4, 5, 1];\n\n/**\n * Build up the default `inspectOpts` object from the environment variables.\n *\n *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js\n */\n\nexports.inspectOpts = Object.keys(process.env).filter(function (key) {\n  return /^debug_/i.test(key);\n}).reduce(function (obj, key) {\n  // camel-case\n  var prop = key\n    .substring(6)\n    .toLowerCase()\n    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });\n\n  // coerce string value into JS value\n  var val = process.env[key];\n  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;\n  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;\n  else if (val === 'null') val = null;\n  else val = Number(val);\n\n  obj[prop] = val;\n  return obj;\n}, {});\n\n/**\n * The file descriptor to write the `debug()` calls to.\n * Set the `DEBUG_FD` env variable to override with another value. i.e.:\n *\n *   $ DEBUG_FD=3 node script.js 3>debug.log\n */\n\nvar fd = parseInt(process.env.DEBUG_FD, 10) || 2;\n\nif (1 !== fd && 2 !== fd) {\n  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()\n}\n\nvar stream = 1 === fd ? process.stdout :\n             2 === fd ? process.stderr :\n             createWritableStdioStream(fd);\n\n/**\n * Is stdout a TTY? Colored output is enabled when `true`.\n */\n\nfunction useColors() {\n  return 'colors' in exports.inspectOpts\n    ? Boolean(exports.inspectOpts.colors)\n    : tty.isatty(fd);\n}\n\n/**\n * Map %o to `util.inspect()`, all on a single line.\n */\n\nexports.formatters.o = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts)\n    .split('\\n').map(function(str) {\n      return str.trim()\n    }).join(' ');\n};\n\n/**\n * Map %o to `util.inspect()`, allowing multiple lines if needed.\n */\n\nexports.formatters.O = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts);\n};\n\n/**\n * Adds ANSI color escape codes if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var name = this.namespace;\n  var useColors = this.useColors;\n\n  if (useColors) {\n    var c = this.color;\n    var prefix = '  \\u001b[3' + c + ';1m' + name + ' ' + '\\u001b[0m';\n\n    args[0] = prefix + args[0].split('\\n').join('\\n' + prefix);\n    args.push('\\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\\u001b[0m');\n  } else {\n    args[0] = new Date().toUTCString()\n      + ' ' + name + ' ' + args[0];\n  }\n}\n\n/**\n * Invokes `util.format()` with the specified arguments and writes to `stream`.\n */\n\nfunction log() {\n  return stream.write(util.format.apply(util, arguments) + '\\n');\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  if (null == namespaces) {\n    // If you set a process.env field to null or undefined, it gets cast to the\n    // string 'null' or 'undefined'. Just delete instead.\n    delete process.env.DEBUG;\n  } else {\n    process.env.DEBUG = namespaces;\n  }\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  return process.env.DEBUG;\n}\n\n/**\n * Copied from `node/src/node.js`.\n *\n * XXX: It's lame that node doesn't expose this API out-of-the-box. It also\n * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.\n */\n\nfunction createWritableStdioStream (fd) {\n  var stream;\n  var tty_wrap = process.binding('tty_wrap');\n\n  // Note stream._type is used for test-module-load-list.js\n\n  switch (tty_wrap.guessHandleType(fd)) {\n    case 'TTY':\n      stream = new tty.WriteStream(fd);\n      stream._type = 'tty';\n\n      // Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    case 'FILE':\n      var fs = __webpack_require__(\"fs\");\n      stream = new fs.SyncWriteStream(fd, { autoClose: false });\n      stream._type = 'fs';\n      break;\n\n    case 'PIPE':\n    case 'TCP':\n      var net = __webpack_require__(\"net\");\n      stream = new net.Socket({\n        fd: fd,\n        readable: false,\n        writable: true\n      });\n\n      // FIXME Should probably have an option in net.Socket to create a\n      // stream from an existing fd which is writable only. But for now\n      // we'll just add this hack and set the `readable` member to false.\n      // Test: ./node test/fixtures/echo.js < /etc/passwd\n      stream.readable = false;\n      stream.read = null;\n      stream._type = 'pipe';\n\n      // FIXME Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    default:\n      // Probably an error on in uv_guess_handle()\n      throw new Error('Implement me. Unknown stream file type!');\n  }\n\n  // For supporting legacy API we put the FD here.\n  stream.fd = fd;\n\n  stream._isStdio = true;\n\n  return stream;\n}\n\n/**\n * Init logic for `debug` instances.\n *\n * Create a new `inspectOpts` object in case `useColors` is set\n * differently for a particular `debug` instance.\n */\n\nfunction init (debug) {\n  debug.inspectOpts = {};\n\n  var keys = Object.keys(exports.inspectOpts);\n  for (var i = 0; i < keys.length; i++) {\n    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];\n  }\n}\n\n/**\n * Enable namespaces listed in `process.env.DEBUG` initially.\n */\n\nexports.enable(load());\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanM/MjUwNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUJBQXlCOztBQUVwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsSUFBSTs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkMsbUJBQW1CO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHR0eSA9IHJlcXVpcmUoJ3R0eScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgTm9kZS5qcyBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFs2LCAyLCAzLCA0LCA1LCAxXTtcblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgZGVmYXVsdCBgaW5zcGVjdE9wdHNgIG9iamVjdCBmcm9tIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gKlxuICogICAkIERFQlVHX0NPTE9SUz1ubyBERUJVR19ERVBUSD0xMCBERUJVR19TSE9XX0hJRERFTj1lbmFibGVkIG5vZGUgc2NyaXB0LmpzXG4gKi9cblxuZXhwb3J0cy5pbnNwZWN0T3B0cyA9IE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gL15kZWJ1Z18vaS50ZXN0KGtleSk7XG59KS5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gIC8vIGNhbWVsLWNhc2VcbiAgdmFyIHByb3AgPSBrZXlcbiAgICAuc3Vic3RyaW5nKDYpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXyhbYS16XSkvZywgZnVuY3Rpb24gKF8sIGspIHsgcmV0dXJuIGsudG9VcHBlckNhc2UoKSB9KTtcblxuICAvLyBjb2VyY2Ugc3RyaW5nIHZhbHVlIGludG8gSlMgdmFsdWVcbiAgdmFyIHZhbCA9IHByb2Nlc3MuZW52W2tleV07XG4gIGlmICgvXih5ZXN8b258dHJ1ZXxlbmFibGVkKSQvaS50ZXN0KHZhbCkpIHZhbCA9IHRydWU7XG4gIGVsc2UgaWYgKC9eKG5vfG9mZnxmYWxzZXxkaXNhYmxlZCkkL2kudGVzdCh2YWwpKSB2YWwgPSBmYWxzZTtcbiAgZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHZhbCA9IG51bGw7XG4gIGVsc2UgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgb2JqW3Byb3BdID0gdmFsO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuXG4vKipcbiAqIFRoZSBmaWxlIGRlc2NyaXB0b3IgdG8gd3JpdGUgdGhlIGBkZWJ1ZygpYCBjYWxscyB0by5cbiAqIFNldCB0aGUgYERFQlVHX0ZEYCBlbnYgdmFyaWFibGUgdG8gb3ZlcnJpZGUgd2l0aCBhbm90aGVyIHZhbHVlLiBpLmUuOlxuICpcbiAqICAgJCBERUJVR19GRD0zIG5vZGUgc2NyaXB0LmpzIDM+ZGVidWcubG9nXG4gKi9cblxudmFyIGZkID0gcGFyc2VJbnQocHJvY2Vzcy5lbnYuREVCVUdfRkQsIDEwKSB8fCAyO1xuXG5pZiAoMSAhPT0gZmQgJiYgMiAhPT0gZmQpIHtcbiAgdXRpbC5kZXByZWNhdGUoZnVuY3Rpb24oKXt9LCAnZXhjZXB0IGZvciBzdGRlcnIoMikgYW5kIHN0ZG91dCgxKSwgYW55IG90aGVyIHVzYWdlIG9mIERFQlVHX0ZEIGlzIGRlcHJlY2F0ZWQuIE92ZXJyaWRlIGRlYnVnLmxvZyBpZiB5b3Ugd2FudCB0byB1c2UgYSBkaWZmZXJlbnQgbG9nIGZ1bmN0aW9uIChodHRwczovL2dpdC5pby9kZWJ1Z19mZCknKSgpXG59XG5cbnZhciBzdHJlYW0gPSAxID09PSBmZCA/IHByb2Nlc3Muc3Rkb3V0IDpcbiAgICAgICAgICAgICAyID09PSBmZCA/IHByb2Nlc3Muc3RkZXJyIDpcbiAgICAgICAgICAgICBjcmVhdGVXcml0YWJsZVN0ZGlvU3RyZWFtKGZkKTtcblxuLyoqXG4gKiBJcyBzdGRvdXQgYSBUVFk/IENvbG9yZWQgb3V0cHV0IGlzIGVuYWJsZWQgd2hlbiBgdHJ1ZWAuXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICByZXR1cm4gJ2NvbG9ycycgaW4gZXhwb3J0cy5pbnNwZWN0T3B0c1xuICAgID8gQm9vbGVhbihleHBvcnRzLmluc3BlY3RPcHRzLmNvbG9ycylcbiAgICA6IHR0eS5pc2F0dHkoZmQpO1xufVxuXG4vKipcbiAqIE1hcCAlbyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGwgb24gYSBzaW5nbGUgbGluZS5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMubyA9IGZ1bmN0aW9uKHYpIHtcbiAgdGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcbiAgcmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKVxuICAgIC5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci50cmltKClcbiAgICB9KS5qb2luKCcgJyk7XG59O1xuXG4vKipcbiAqIE1hcCAlbyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGxvd2luZyBtdWx0aXBsZSBsaW5lcyBpZiBuZWVkZWQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLk8gPSBmdW5jdGlvbih2KSB7XG4gIHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG4gIHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cyk7XG59O1xuXG4vKipcbiAqIEFkZHMgQU5TSSBjb2xvciBlc2NhcGUgY29kZXMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuICB2YXIgbmFtZSA9IHRoaXMubmFtZXNwYWNlO1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgaWYgKHVzZUNvbG9ycykge1xuICAgIHZhciBjID0gdGhpcy5jb2xvcjtcbiAgICB2YXIgcHJlZml4ID0gJyAgXFx1MDAxYlszJyArIGMgKyAnOzFtJyArIG5hbWUgKyAnICcgKyAnXFx1MDAxYlswbSc7XG5cbiAgICBhcmdzWzBdID0gcHJlZml4ICsgYXJnc1swXS5zcGxpdCgnXFxuJykuam9pbignXFxuJyArIHByZWZpeCk7XG4gICAgYXJncy5wdXNoKCdcXHUwMDFiWzMnICsgYyArICdtKycgKyBleHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZikgKyAnXFx1MDAxYlswbScpO1xuICB9IGVsc2Uge1xuICAgIGFyZ3NbMF0gPSBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcbiAgICAgICsgJyAnICsgbmFtZSArICcgJyArIGFyZ3NbMF07XG4gIH1cbn1cblxuLyoqXG4gKiBJbnZva2VzIGB1dGlsLmZvcm1hdCgpYCB3aXRoIHRoZSBzcGVjaWZpZWQgYXJndW1lbnRzIGFuZCB3cml0ZXMgdG8gYHN0cmVhbWAuXG4gKi9cblxuZnVuY3Rpb24gbG9nKCkge1xuICByZXR1cm4gc3RyZWFtLndyaXRlKHV0aWwuZm9ybWF0LmFwcGx5KHV0aWwsIGFyZ3VtZW50cykgKyAnXFxuJyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgLy8gSWYgeW91IHNldCBhIHByb2Nlc3MuZW52IGZpZWxkIHRvIG51bGwgb3IgdW5kZWZpbmVkLCBpdCBnZXRzIGNhc3QgdG8gdGhlXG4gICAgLy8gc3RyaW5nICdudWxsJyBvciAndW5kZWZpbmVkJy4gSnVzdCBkZWxldGUgaW5zdGVhZC5cbiAgICBkZWxldGUgcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH0gZWxzZSB7XG4gICAgcHJvY2Vzcy5lbnYuREVCVUcgPSBuYW1lc3BhY2VzO1xuICB9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LkRFQlVHO1xufVxuXG4vKipcbiAqIENvcGllZCBmcm9tIGBub2RlL3NyYy9ub2RlLmpzYC5cbiAqXG4gKiBYWFg6IEl0J3MgbGFtZSB0aGF0IG5vZGUgZG9lc24ndCBleHBvc2UgdGhpcyBBUEkgb3V0LW9mLXRoZS1ib3guIEl0IGFsc29cbiAqIHJlbGllcyBvbiB0aGUgdW5kb2N1bWVudGVkIGB0dHlfd3JhcC5ndWVzc0hhbmRsZVR5cGUoKWAgd2hpY2ggaXMgYWxzbyBsYW1lLlxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVdyaXRhYmxlU3RkaW9TdHJlYW0gKGZkKSB7XG4gIHZhciBzdHJlYW07XG4gIHZhciB0dHlfd3JhcCA9IHByb2Nlc3MuYmluZGluZygndHR5X3dyYXAnKTtcblxuICAvLyBOb3RlIHN0cmVhbS5fdHlwZSBpcyB1c2VkIGZvciB0ZXN0LW1vZHVsZS1sb2FkLWxpc3QuanNcblxuICBzd2l0Y2ggKHR0eV93cmFwLmd1ZXNzSGFuZGxlVHlwZShmZCkpIHtcbiAgICBjYXNlICdUVFknOlxuICAgICAgc3RyZWFtID0gbmV3IHR0eS5Xcml0ZVN0cmVhbShmZCk7XG4gICAgICBzdHJlYW0uX3R5cGUgPSAndHR5JztcblxuICAgICAgLy8gSGFjayB0byBoYXZlIHN0cmVhbSBub3Qga2VlcCB0aGUgZXZlbnQgbG9vcCBhbGl2ZS5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MjZcbiAgICAgIGlmIChzdHJlYW0uX2hhbmRsZSAmJiBzdHJlYW0uX2hhbmRsZS51bnJlZikge1xuICAgICAgICBzdHJlYW0uX2hhbmRsZS51bnJlZigpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdGSUxFJzpcbiAgICAgIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICBzdHJlYW0gPSBuZXcgZnMuU3luY1dyaXRlU3RyZWFtKGZkLCB7IGF1dG9DbG9zZTogZmFsc2UgfSk7XG4gICAgICBzdHJlYW0uX3R5cGUgPSAnZnMnO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdQSVBFJzpcbiAgICBjYXNlICdUQ1AnOlxuICAgICAgdmFyIG5ldCA9IHJlcXVpcmUoJ25ldCcpO1xuICAgICAgc3RyZWFtID0gbmV3IG5ldC5Tb2NrZXQoe1xuICAgICAgICBmZDogZmQsXG4gICAgICAgIHJlYWRhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBGSVhNRSBTaG91bGQgcHJvYmFibHkgaGF2ZSBhbiBvcHRpb24gaW4gbmV0LlNvY2tldCB0byBjcmVhdGUgYVxuICAgICAgLy8gc3RyZWFtIGZyb20gYW4gZXhpc3RpbmcgZmQgd2hpY2ggaXMgd3JpdGFibGUgb25seS4gQnV0IGZvciBub3dcbiAgICAgIC8vIHdlJ2xsIGp1c3QgYWRkIHRoaXMgaGFjayBhbmQgc2V0IHRoZSBgcmVhZGFibGVgIG1lbWJlciB0byBmYWxzZS5cbiAgICAgIC8vIFRlc3Q6IC4vbm9kZSB0ZXN0L2ZpeHR1cmVzL2VjaG8uanMgPCAvZXRjL3Bhc3N3ZFxuICAgICAgc3RyZWFtLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgICBzdHJlYW0ucmVhZCA9IG51bGw7XG4gICAgICBzdHJlYW0uX3R5cGUgPSAncGlwZSc7XG5cbiAgICAgIC8vIEZJWE1FIEhhY2sgdG8gaGF2ZSBzdHJlYW0gbm90IGtlZXAgdGhlIGV2ZW50IGxvb3AgYWxpdmUuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzI2XG4gICAgICBpZiAoc3RyZWFtLl9oYW5kbGUgJiYgc3RyZWFtLl9oYW5kbGUudW5yZWYpIHtcbiAgICAgICAgc3RyZWFtLl9oYW5kbGUudW5yZWYoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIFByb2JhYmx5IGFuIGVycm9yIG9uIGluIHV2X2d1ZXNzX2hhbmRsZSgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ltcGxlbWVudCBtZS4gVW5rbm93biBzdHJlYW0gZmlsZSB0eXBlIScpO1xuICB9XG5cbiAgLy8gRm9yIHN1cHBvcnRpbmcgbGVnYWN5IEFQSSB3ZSBwdXQgdGhlIEZEIGhlcmUuXG4gIHN0cmVhbS5mZCA9IGZkO1xuXG4gIHN0cmVhbS5faXNTdGRpbyA9IHRydWU7XG5cbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuLyoqXG4gKiBJbml0IGxvZ2ljIGZvciBgZGVidWdgIGluc3RhbmNlcy5cbiAqXG4gKiBDcmVhdGUgYSBuZXcgYGluc3BlY3RPcHRzYCBvYmplY3QgaW4gY2FzZSBgdXNlQ29sb3JzYCBpcyBzZXRcbiAqIGRpZmZlcmVudGx5IGZvciBhIHBhcnRpY3VsYXIgYGRlYnVnYCBpbnN0YW5jZS5cbiAqL1xuXG5mdW5jdGlvbiBpbml0IChkZWJ1Zykge1xuICBkZWJ1Zy5pbnNwZWN0T3B0cyA9IHt9O1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXhwb3J0cy5pbnNwZWN0T3B0cyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGRlYnVnLmluc3BlY3RPcHRzW2tleXNbaV1dID0gZXhwb3J0cy5pbnNwZWN0T3B0c1trZXlzW2ldXTtcbiAgfVxufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgcHJvY2Vzcy5lbnYuREVCVUdgIGluaXRpYWxseS5cbiAqL1xuXG5leHBvcnRzLmVuYWJsZShsb2FkKCkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/node.js\n");

/***/ }),

/***/ "./node_modules/electron-debug recursive":
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tthrow new Error(\"Cannot find module '\" + req + \"'.\");\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/electron-debug recursive\";//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWc/Zjk4ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsV0FBVztBQUNsRDtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcgcmVjdXJzaXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJy5cIik7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9O1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWRlYnVnIHJlY3Vyc2l2ZVwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWRlYnVnXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1kZWJ1ZyByZWN1cnNpdmVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-debug recursive\n");

/***/ }),

/***/ "./node_modules/electron-debug/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst electron = __webpack_require__(\"electron\");\nconst localShortcut = __webpack_require__(\"./node_modules/electron-localshortcut/index.js\");\nconst isDev = __webpack_require__(\"./node_modules/electron-is-dev/index.js\");\n\nconst app = electron.app;\nconst BrowserWindow = electron.BrowserWindow;\nconst isMacOS = process.platform === 'darwin';\n\nfunction devTools(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.toggleDevTools();\n\t}\n}\n\nfunction openDevTools(win, showDevTools) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\tconst mode = showDevTools === true ? undefined : showDevTools;\n\t\twin.webContents.openDevTools({mode});\n\t}\n}\n\nfunction refresh(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.webContents.reloadIgnoringCache();\n\t}\n}\n\nfunction inspectElements() {\n\tconst win = BrowserWindow.getFocusedWindow();\n\tconst inspect = () => {\n\t\twin.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');\n\t};\n\n\tif (win) {\n\t\tif (win.webContents.isDevToolsOpened()) {\n\t\t\tinspect();\n\t\t} else {\n\t\t\twin.webContents.on('devtools-opened', inspect);\n\t\t\twin.openDevTools();\n\t\t}\n\t}\n}\n\nconst addExtensionIfInstalled = (name, getPath) => {\n\tconst isExtensionInstalled = name => {\n\t\treturn BrowserWindow.getDevToolsExtensions &&\n\t\t\t{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), name);\n\t};\n\n\ttry {\n\t\tif (!isExtensionInstalled(name)) {\n\t\t\tBrowserWindow.addDevToolsExtension(getPath(name));\n\t\t}\n\t} catch (err) {}\n};\n\nmodule.exports = opts => {\n\topts = Object.assign({\n\t\tenabled: null,\n\t\tshowDevTools: false\n\t}, opts);\n\n\tif (opts.enabled === false || (opts.enabled === null && !isDev)) {\n\t\treturn;\n\t}\n\n\tapp.on('browser-window-created', (e, win) => {\n\t\tif (opts.showDevTools) {\n\t\t\topenDevTools(win, opts.showDevTools);\n\t\t}\n\t});\n\n\tapp.on('ready', () => {\n\t\taddExtensionIfInstalled('devtron', name => !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\".\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).path);\n\t\t// TODO: Use this when https://github.com/firejune/electron-react-devtools/pull/6 is out\n\t\t// addExtensionIfInstalled('electron-react-devtools', name => require(name).path);\n\t\taddExtensionIfInstalled('electron-react-devtools', name => __webpack_require__(\"path\").dirname(/*require.resolve*/(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\".\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))));\n\n\t\tlocalShortcut.register('CmdOrCtrl+Shift+C', inspectElements);\n\t\tlocalShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);\n\t\tlocalShortcut.register('F12', devTools);\n\n\t\tlocalShortcut.register('CmdOrCtrl+R', refresh);\n\t\tlocalShortcut.register('F5', refresh);\n\t});\n};\n\nmodule.exports.refresh = refresh;\nmodule.exports.devTools = devTools;\nmodule.exports.openDevTools = openDevTools;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcvaW5kZXguanM/MTgzMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0MsS0FBSztBQUNyQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7XG5jb25zdCBsb2NhbFNob3J0Y3V0ID0gcmVxdWlyZSgnZWxlY3Ryb24tbG9jYWxzaG9ydGN1dCcpO1xuY29uc3QgaXNEZXYgPSByZXF1aXJlKCdlbGVjdHJvbi1pcy1kZXYnKTtcblxuY29uc3QgYXBwID0gZWxlY3Ryb24uYXBwO1xuY29uc3QgQnJvd3NlcldpbmRvdyA9IGVsZWN0cm9uLkJyb3dzZXJXaW5kb3c7XG5jb25zdCBpc01hY09TID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2Rhcndpbic7XG5cbmZ1bmN0aW9uIGRldlRvb2xzKHdpbikge1xuXHR3aW4gPSB3aW4gfHwgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cblx0aWYgKHdpbikge1xuXHRcdHdpbi50b2dnbGVEZXZUb29scygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9wZW5EZXZUb29scyh3aW4sIHNob3dEZXZUb29scykge1xuXHR3aW4gPSB3aW4gfHwgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cblx0aWYgKHdpbikge1xuXHRcdGNvbnN0IG1vZGUgPSBzaG93RGV2VG9vbHMgPT09IHRydWUgPyB1bmRlZmluZWQgOiBzaG93RGV2VG9vbHM7XG5cdFx0d2luLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scyh7bW9kZX0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2god2luKSB7XG5cdHdpbiA9IHdpbiB8fCBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKTtcblxuXHRpZiAod2luKSB7XG5cdFx0d2luLndlYkNvbnRlbnRzLnJlbG9hZElnbm9yaW5nQ2FjaGUoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBpbnNwZWN0RWxlbWVudHMoKSB7XG5cdGNvbnN0IHdpbiA9IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXHRjb25zdCBpbnNwZWN0ID0gKCkgPT4ge1xuXHRcdHdpbi5kZXZUb29sc1dlYkNvbnRlbnRzLmV4ZWN1dGVKYXZhU2NyaXB0KCdEZXZUb29sc0FQSS5lbnRlckluc3BlY3RFbGVtZW50TW9kZSgpJyk7XG5cdH07XG5cblx0aWYgKHdpbikge1xuXHRcdGlmICh3aW4ud2ViQ29udGVudHMuaXNEZXZUb29sc09wZW5lZCgpKSB7XG5cdFx0XHRpbnNwZWN0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbi53ZWJDb250ZW50cy5vbignZGV2dG9vbHMtb3BlbmVkJywgaW5zcGVjdCk7XG5cdFx0XHR3aW4ub3BlbkRldlRvb2xzKCk7XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IGFkZEV4dGVuc2lvbklmSW5zdGFsbGVkID0gKG5hbWUsIGdldFBhdGgpID0+IHtcblx0Y29uc3QgaXNFeHRlbnNpb25JbnN0YWxsZWQgPSBuYW1lID0+IHtcblx0XHRyZXR1cm4gQnJvd3NlcldpbmRvdy5nZXREZXZUb29sc0V4dGVuc2lvbnMgJiZcblx0XHRcdHt9Lmhhc093blByb3BlcnR5LmNhbGwoQnJvd3NlcldpbmRvdy5nZXREZXZUb29sc0V4dGVuc2lvbnMoKSwgbmFtZSk7XG5cdH07XG5cblx0dHJ5IHtcblx0XHRpZiAoIWlzRXh0ZW5zaW9uSW5zdGFsbGVkKG5hbWUpKSB7XG5cdFx0XHRCcm93c2VyV2luZG93LmFkZERldlRvb2xzRXh0ZW5zaW9uKGdldFBhdGgobmFtZSkpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyKSB7fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvcHRzID0+IHtcblx0b3B0cyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdGVuYWJsZWQ6IG51bGwsXG5cdFx0c2hvd0RldlRvb2xzOiBmYWxzZVxuXHR9LCBvcHRzKTtcblxuXHRpZiAob3B0cy5lbmFibGVkID09PSBmYWxzZSB8fCAob3B0cy5lbmFibGVkID09PSBudWxsICYmICFpc0RldikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRhcHAub24oJ2Jyb3dzZXItd2luZG93LWNyZWF0ZWQnLCAoZSwgd2luKSA9PiB7XG5cdFx0aWYgKG9wdHMuc2hvd0RldlRvb2xzKSB7XG5cdFx0XHRvcGVuRGV2VG9vbHMod2luLCBvcHRzLnNob3dEZXZUb29scyk7XG5cdFx0fVxuXHR9KTtcblxuXHRhcHAub24oJ3JlYWR5JywgKCkgPT4ge1xuXHRcdGFkZEV4dGVuc2lvbklmSW5zdGFsbGVkKCdkZXZ0cm9uJywgbmFtZSA9PiByZXF1aXJlKG5hbWUpLnBhdGgpO1xuXHRcdC8vIFRPRE86IFVzZSB0aGlzIHdoZW4gaHR0cHM6Ly9naXRodWIuY29tL2ZpcmVqdW5lL2VsZWN0cm9uLXJlYWN0LWRldnRvb2xzL3B1bGwvNiBpcyBvdXRcblx0XHQvLyBhZGRFeHRlbnNpb25JZkluc3RhbGxlZCgnZWxlY3Ryb24tcmVhY3QtZGV2dG9vbHMnLCBuYW1lID0+IHJlcXVpcmUobmFtZSkucGF0aCk7XG5cdFx0YWRkRXh0ZW5zaW9uSWZJbnN0YWxsZWQoJ2VsZWN0cm9uLXJlYWN0LWRldnRvb2xzJywgbmFtZSA9PiByZXF1aXJlKCdwYXRoJykuZGlybmFtZShyZXF1aXJlLnJlc29sdmUobmFtZSkpKTtcblxuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoJ0NtZE9yQ3RybCtTaGlmdCtDJywgaW5zcGVjdEVsZW1lbnRzKTtcblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKGlzTWFjT1MgPyAnQ21kK0FsdCtJJyA6ICdDdHJsK1NoaWZ0K0knLCBkZXZUb29scyk7XG5cdFx0bG9jYWxTaG9ydGN1dC5yZWdpc3RlcignRjEyJywgZGV2VG9vbHMpO1xuXG5cdFx0bG9jYWxTaG9ydGN1dC5yZWdpc3RlcignQ21kT3JDdHJsK1InLCByZWZyZXNoKTtcblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKCdGNScsIHJlZnJlc2gpO1xuXHR9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnJlZnJlc2ggPSByZWZyZXNoO1xubW9kdWxlLmV4cG9ydHMuZGV2VG9vbHMgPSBkZXZUb29scztcbm1vZHVsZS5leHBvcnRzLm9wZW5EZXZUb29scyA9IG9wZW5EZXZUb29scztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWRlYnVnL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1kZWJ1Zy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-debug/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-accelerator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;\nconst keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;\n\nmodule.exports = function (str) {\n\tlet parts = str.split(\"+\");\n\tlet keyFound = false;\n    return parts.every((val, index) => {\n\t\tconst isKey = keyCodes.test(val);\n\t\tconst isModifier = modifiers.test(val);\n\t\tif (isKey) {\n\t\t\t// Key must be unique\n\t\t\tif (keyFound) return false;\n\t\t\tkeyFound = true;\n\t\t}\n\t\t// Key is required\n\t\tif (index === parts.length - 1 && !keyFound) return false;\n        return isKey || isModifier;\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanM/ODA1MyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBLDZDQUE2QyxFQUFFLEVBQUU7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgbW9kaWZpZXJzID0gL14oQ29tbWFuZHxDbWR8Q29udHJvbHxDdHJsfENvbW1hbmRPckNvbnRyb2x8Q21kT3JDdHJsfEFsdHxPcHRpb258QWx0R3J8U2hpZnR8U3VwZXIpJC87XG5jb25zdCBrZXlDb2RlcyA9IC9eKFswLTlBLVopIUAjJCVeJiooOis8Xz4/fnt8fVwiOz0sXFwtLi9gW1xcXFxcXF0nXXxGMSpbMS05XXxGMTB8RjJbMC00XXxQbHVzfFNwYWNlfFRhYnxCYWNrc3BhY2V8RGVsZXRlfEluc2VydHxSZXR1cm58RW50ZXJ8VXB8RG93bnxMZWZ0fFJpZ2h0fEhvbWV8RW5kfFBhZ2VVcHxQYWdlRG93bnxFc2NhcGV8RXNjfFZvbHVtZVVwfFZvbHVtZURvd258Vm9sdW1lTXV0ZXxNZWRpYU5leHRUcmFja3xNZWRpYVByZXZpb3VzVHJhY2t8TWVkaWFTdG9wfE1lZGlhUGxheVBhdXNlfFByaW50U2NyZWVuKSQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0bGV0IHBhcnRzID0gc3RyLnNwbGl0KFwiK1wiKTtcblx0bGV0IGtleUZvdW5kID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnRzLmV2ZXJ5KCh2YWwsIGluZGV4KSA9PiB7XG5cdFx0Y29uc3QgaXNLZXkgPSBrZXlDb2Rlcy50ZXN0KHZhbCk7XG5cdFx0Y29uc3QgaXNNb2RpZmllciA9IG1vZGlmaWVycy50ZXN0KHZhbCk7XG5cdFx0aWYgKGlzS2V5KSB7XG5cdFx0XHQvLyBLZXkgbXVzdCBiZSB1bmlxdWVcblx0XHRcdGlmIChrZXlGb3VuZCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0a2V5Rm91bmQgPSB0cnVlO1xuXHRcdH1cblx0XHQvLyBLZXkgaXMgcmVxdWlyZWRcblx0XHRpZiAoaW5kZXggPT09IHBhcnRzLmxlbmd0aCAtIDEgJiYgIWtleUZvdW5kKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBpc0tleSB8fCBpc01vZGlmaWVyO1xuICAgIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWFjY2VsZXJhdG9yL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1pcy1hY2NlbGVyYXRvci9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-is-accelerator/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-dev/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;\nconst isEnvSet = 'ELECTRON_IS_DEV' in process.env;\n\nmodule.exports = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\\\/]electron[\\\\/]/.test(process.execPath));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtZGV2L2luZGV4LmpzPzBlOTciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWRldi9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmNvbnN0IGdldEZyb21FbnYgPSBwYXJzZUludChwcm9jZXNzLmVudi5FTEVDVFJPTl9JU19ERVYsIDEwKSA9PT0gMTtcbmNvbnN0IGlzRW52U2V0ID0gJ0VMRUNUUk9OX0lTX0RFVicgaW4gcHJvY2Vzcy5lbnY7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbnZTZXQgPyBnZXRGcm9tRW52IDogKHByb2Nlc3MuZGVmYXVsdEFwcCB8fCAvbm9kZV9tb2R1bGVzW1xcXFwvXWVsZWN0cm9uW1xcXFwvXS8udGVzdChwcm9jZXNzLmV4ZWNQYXRoKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1pcy1kZXYvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWRldi9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-is-dev/index.js\n");

/***/ }),

/***/ "./node_modules/electron-localshortcut/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst {app, BrowserWindow} = __webpack_require__(\"electron\");\nconst isAccelerator = __webpack_require__(\"./node_modules/electron-is-accelerator/index.js\");\nconst equals = __webpack_require__(\"./node_modules/keyboardevents-areequal/index.js\");\nconst {toKeyEvent} = __webpack_require__(\"./node_modules/keyboardevent-from-electron-accelerator/index.js\");\nconst _debug = __webpack_require__(\"./node_modules/debug/src/index.js\");\n\nconst debug = _debug('electron-localshortcut');\n\n// A placeholder to register shortcuts\n// on any window of the app.\nconst ANY_WINDOW = {};\n\nconst windowsWithShortcuts = new WeakMap();\n\nconst title = win => {\n\tif (win) {\n\t\ttry {\n\t\t\treturn win.getTitle();\n\t\t} catch (err) {\n\t\t\treturn 'A destroyed window';\n\t\t}\n\t}\n\n\treturn 'An falsy value';\n};\n\nfunction _checkAccelerator(accelerator) {\n\tif (!isAccelerator(accelerator)) {\n\t\tconst w = {};\n\t\tError.captureStackTrace(w);\n\t\tconst msg = `\nWARNING: ${accelerator} is not a valid accelerator.\n\n${w.stack\n\t\t\t.split('\\n')\n\t\t\t.slice(4)\n\t\t\t.join('\\n')}\n`;\n\t\tconsole.error(msg);\n\t}\n}\n\n/**\n * Disable all of the shortcuts registered on the BrowserWindow instance.\n * Registered shortcuts no more works on the `window` instance, but the module\n * keep a reference on them. You can reactivate them later by calling `enableAll`\n * method on the same window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction disableAll(win) {\n\tdebug(`Disabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = false;\n\t}\n}\n\n/**\n * Enable all of the shortcuts registered on the BrowserWindow instance that\n * you had previously disabled calling `disableAll` method.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction enableAll(win) {\n\tdebug(`Enabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = true;\n\t}\n}\n\n/**\n * Unregisters all of the shortcuts registered on any focused BrowserWindow\n * instance. This method does not unregister any shortcut you registered on\n * a particular window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction unregisterAll(win) {\n\tdebug(`Unregistering all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\t// Remove listener from window\n\tshortcutsOfWindow.removeListener();\n\n\twindowsWithShortcuts.delete(wc);\n}\n\nfunction _normalizeEvent(input) {\n\tconst normalizedEvent = {\n\t\tcode: input.code,\n\t\tkey: input.key\n\t};\n\n\t['alt', 'shift', 'meta'].forEach(prop => {\n\t\tif (typeof input[prop] !== 'undefined') {\n\t\t\tnormalizedEvent[`${prop}Key`] = input[prop];\n\t\t}\n\t});\n\n\tif (typeof input.control !== 'undefined') {\n\t\tnormalizedEvent.ctrlKey = input.control;\n\t}\n\n\treturn normalizedEvent;\n}\n\nfunction _findShortcut(event, shortcutsOfWindow) {\n\tlet i = 0;\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tif (equals(shortcut.eventStamp, event)) {\n\t\t\treturn i;\n\t\t}\n\t\ti++;\n\t}\n\treturn -1;\n}\n\nconst _onBeforeInput = shortcutsOfWindow => (e, input) => {\n\tif (input.type === 'keyUp') {\n\t\treturn;\n\t}\n\n\tconst event = _normalizeEvent(input);\n\n\tdebug(`before-input-event: ${input} is translated to: ${event}`);\n\tfor (const {eventStamp, callback} of shortcutsOfWindow) {\n\t\tif (equals(eventStamp, event)) {\n\t\t\tdebug(`eventStamp: ${eventStamp} match`);\n\t\t\tcallback();\n\t\t\treturn;\n\t\t}\n\t\tdebug(`eventStamp: ${eventStamp} no match`);\n\t}\n};\n\n/**\n* Registers the shortcut `accelerator`on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to register.\n * This argument could be omitted, in this case the function register\n * the shortcut on all app windows.\n * @param  {String} accelerator - the shortcut to register\n * @param  {Function} callback    This function is called when the shortcut is pressed\n * and the window is focused and not minimized.\n * @return {Undefined}\n */\nfunction register(win, accelerator, callback) {\n\tlet wc;\n\tif (typeof callback === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\tcallback = accelerator;\n\t\taccelerator = win;\n\t} else {\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Registering callback for ${accelerator} on window ${title(win)}`);\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tlet shortcutsOfWindow;\n\tif (windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Window has others shortcuts registered.`);\n\t\tshortcutsOfWindow = windowsWithShortcuts.get(wc);\n\t} else {\n\t\tdebug(`This is the first shortcut of the window.`);\n\t\tshortcutsOfWindow = [];\n\t\twindowsWithShortcuts.set(wc, shortcutsOfWindow);\n\n\t\tif (wc === ANY_WINDOW) {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\tconst enableAppShortcuts = (e, win) => {\n\t\t\t\tconst wc = win.webContents;\n\t\t\t\twc.on('before-input-event', keyHandler);\n\t\t\t\twc.once('closed', () =>\n\t\t\t\t\twc.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t};\n\n\t\t\t// Enable shortcut on current windows\n\t\t\tconst windows = BrowserWindow.getAllWindows();\n\n\t\t\twindows.forEach(win => enableAppShortcuts(null, win));\n\n\t\t\t// Enable shortcut on future windows\n\t\t\tapp.on('browser-window-created', enableAppShortcuts);\n\n\t\t\tshortcutsOfWindow.removeListener = () => {\n\t\t\t\tconst windows = BrowserWindow.getAllWindows();\n\t\t\t\twindows.forEach(win =>\n\t\t\t\t\twin.webContents.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t\tapp.removeListener('browser-window-created', enableAppShortcuts);\n\t\t\t};\n\t\t} else {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\twc.on('before-input-event', keyHandler);\n\n\t\t\t// Save a reference to allow remove of listener from elsewhere\n\t\t\tshortcutsOfWindow.removeListener = () =>\n\t\t\t\twc.removeListener('before-input-event', keyHandler);\n\t\t\twc.once('closed', shortcutsOfWindow.removeListener);\n\t\t}\n\t}\n\n\tdebug(`Adding shortcut to window set.`);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\n\tshortcutsOfWindow.push({\n\t\teventStamp,\n\t\tcallback,\n\t\tenabled: true\n\t});\n\n\tdebug(`Shortcut registered.`);\n}\n\n/**\n * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to unregister.\n * This argument could be omitted, in this case the function unregister the shortcut\n * on all app windows. If you registered the shortcut on a particular window instance, it will do nothing.\n * @param  {String} accelerator - the shortcut to unregister\n * @return {Undefined}\n */\nfunction unregister(win, accelerator) {\n\tlet wc;\n\tif (typeof accelerator === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\taccelerator = win;\n\t} else {\n\t\tif (win.isDestroyed()) {\n\t\t\tdebug(`Early return because window is destroyed.`);\n\t\t\treturn;\n\t\t}\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Unregistering callback for ${accelerator} on window ${title(win)}`);\n\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tif (!windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Early return because window has never had shortcuts registered.`);\n\t\treturn;\n\t}\n\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\tconst shortcutIdx = _findShortcut(eventStamp, shortcutsOfWindow);\n\tif (shortcutIdx === -1) {\n\t\treturn;\n\t}\n\n\tshortcutsOfWindow.splice(shortcutIdx, 1);\n\n\t// If the window has no more shortcuts,\n\t// we remove it early from the WeakMap\n\t// and unregistering the event listener\n\tif (shortcutsOfWindow.length === 0) {\n\t\t// Remove listener from window\n\t\tshortcutsOfWindow.removeListener();\n\n\t\t// Remove window from shrtcuts catalog\n\t\twindowsWithShortcuts.delete(wc);\n\t}\n}\n\n/**\n * Returns `true` or `false` depending on whether the shortcut `accelerator`\n * is registered on `window`.\n * @param  {BrowserWindow} win - BrowserWindow instance to check. This argument\n * could be omitted, in this case the function returns whether the shortcut\n * `accelerator` is registered on all app windows. If you registered the\n * shortcut on a particular window instance, it return false.\n * @param  {String} accelerator - the shortcut to check\n * @return {Boolean} - if the shortcut `accelerator` is registered on `window`.\n */\nfunction isRegistered(win, accelerator) {\n\t_checkAccelerator(accelerator);\n}\n\nmodule.exports = {\n\tregister,\n\tunregister,\n\tisRegistered,\n\tunregisterAll,\n\tenableAll,\n\tdisableAll\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9jYWxzaG9ydGN1dC9pbmRleC5qcz9lMTcwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsT0FBTyxtQkFBbUI7QUFDMUI7QUFDQTtBQUNBLE9BQU8sV0FBVztBQUNsQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsWUFBWTs7QUFFdkIsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWTtBQUNaO0FBQ0E7QUFDQSw0Q0FBNEMsV0FBVztBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksY0FBYztBQUMxQixZQUFZO0FBQ1o7QUFDQTtBQUNBLDJDQUEyQyxXQUFXO0FBQ3REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWTtBQUNaO0FBQ0E7QUFDQSxnREFBZ0QsV0FBVztBQUMzRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsS0FBSztBQUMzQjtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsOEJBQThCLE1BQU0scUJBQXFCLE1BQU07QUFDL0QsYUFBYSxxQkFBcUI7QUFDbEM7QUFDQSx3QkFBd0IsV0FBVztBQUNuQztBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUI7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLFNBQVM7QUFDckI7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQSxtQ0FBbUMsWUFBWSxhQUFhLFdBQVc7QUFDdkU7O0FBRUEsVUFBVSxZQUFZOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDLFlBQVksYUFBYSxXQUFXOztBQUV6RTs7QUFFQSxVQUFVLFlBQVk7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksY0FBYztBQUMxQjtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9jYWxzaG9ydGN1dC9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmNvbnN0IHthcHAsIEJyb3dzZXJXaW5kb3d9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbmNvbnN0IGlzQWNjZWxlcmF0b3IgPSByZXF1aXJlKCdlbGVjdHJvbi1pcy1hY2NlbGVyYXRvcicpO1xuY29uc3QgZXF1YWxzID0gcmVxdWlyZSgna2V5Ym9hcmRldmVudHMtYXJlZXF1YWwnKTtcbmNvbnN0IHt0b0tleUV2ZW50fSA9IHJlcXVpcmUoJ2tleWJvYXJkZXZlbnQtZnJvbS1lbGVjdHJvbi1hY2NlbGVyYXRvcicpO1xuY29uc3QgX2RlYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQnKTtcblxuLy8gQSBwbGFjZWhvbGRlciB0byByZWdpc3RlciBzaG9ydGN1dHNcbi8vIG9uIGFueSB3aW5kb3cgb2YgdGhlIGFwcC5cbmNvbnN0IEFOWV9XSU5ET1cgPSB7fTtcblxuY29uc3Qgd2luZG93c1dpdGhTaG9ydGN1dHMgPSBuZXcgV2Vha01hcCgpO1xuXG5jb25zdCB0aXRsZSA9IHdpbiA9PiB7XG5cdGlmICh3aW4pIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIHdpbi5nZXRUaXRsZSgpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuICdBIGRlc3Ryb3llZCB3aW5kb3cnO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiAnQW4gZmFsc3kgdmFsdWUnO1xufTtcblxuZnVuY3Rpb24gX2NoZWNrQWNjZWxlcmF0b3IoYWNjZWxlcmF0b3IpIHtcblx0aWYgKCFpc0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKSkge1xuXHRcdGNvbnN0IHcgPSB7fTtcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh3KTtcblx0XHRjb25zdCBtc2cgPSBgXG5XQVJOSU5HOiAke2FjY2VsZXJhdG9yfSBpcyBub3QgYSB2YWxpZCBhY2NlbGVyYXRvci5cblxuJHt3LnN0YWNrXG5cdFx0XHQuc3BsaXQoJ1xcbicpXG5cdFx0XHQuc2xpY2UoNClcblx0XHRcdC5qb2luKCdcXG4nKX1cbmA7XG5cdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHR9XG59XG5cbi8qKlxuICogRGlzYWJsZSBhbGwgb2YgdGhlIHNob3J0Y3V0cyByZWdpc3RlcmVkIG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlLlxuICogUmVnaXN0ZXJlZCBzaG9ydGN1dHMgbm8gbW9yZSB3b3JrcyBvbiB0aGUgYHdpbmRvd2AgaW5zdGFuY2UsIGJ1dCB0aGUgbW9kdWxlXG4gKiBrZWVwIGEgcmVmZXJlbmNlIG9uIHRoZW0uIFlvdSBjYW4gcmVhY3RpdmF0ZSB0aGVtIGxhdGVyIGJ5IGNhbGxpbmcgYGVuYWJsZUFsbGBcbiAqIG1ldGhvZCBvbiB0aGUgc2FtZSB3aW5kb3cgaW5zdGFuY2UuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gQnJvd3NlcldpbmRvdyBpbnN0YW5jZVxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiBkaXNhYmxlQWxsKHdpbikge1xuXHRkZWJ1ZyhgRGlzYWJsaW5nIGFsbCBzaG9ydGN1dHMgb24gd2luZG93ICR7dGl0bGUod2luKX1gKTtcblx0Y29uc3Qgd2MgPSB3aW4ud2ViQ29udGVudHM7XG5cdGNvbnN0IHNob3J0Y3V0c09mV2luZG93ID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdjKTtcblxuXHRmb3IgKGNvbnN0IHNob3J0Y3V0IG9mIHNob3J0Y3V0c09mV2luZG93KSB7XG5cdFx0c2hvcnRjdXQuZW5hYmxlZCA9IGZhbHNlO1xuXHR9XG59XG5cbi8qKlxuICogRW5hYmxlIGFsbCBvZiB0aGUgc2hvcnRjdXRzIHJlZ2lzdGVyZWQgb24gdGhlIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UgdGhhdFxuICogeW91IGhhZCBwcmV2aW91c2x5IGRpc2FibGVkIGNhbGxpbmcgYGRpc2FibGVBbGxgIG1ldGhvZC5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiBCcm93c2VyV2luZG93IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGVuYWJsZUFsbCh3aW4pIHtcblx0ZGVidWcoYEVuYWJsaW5nIGFsbCBzaG9ydGN1dHMgb24gd2luZG93ICR7dGl0bGUod2luKX1gKTtcblx0Y29uc3Qgd2MgPSB3aW4ud2ViQ29udGVudHM7XG5cdGNvbnN0IHNob3J0Y3V0c09mV2luZG93ID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdjKTtcblxuXHRmb3IgKGNvbnN0IHNob3J0Y3V0IG9mIHNob3J0Y3V0c09mV2luZG93KSB7XG5cdFx0c2hvcnRjdXQuZW5hYmxlZCA9IHRydWU7XG5cdH1cbn1cblxuLyoqXG4gKiBVbnJlZ2lzdGVycyBhbGwgb2YgdGhlIHNob3J0Y3V0cyByZWdpc3RlcmVkIG9uIGFueSBmb2N1c2VkIEJyb3dzZXJXaW5kb3dcbiAqIGluc3RhbmNlLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCB1bnJlZ2lzdGVyIGFueSBzaG9ydGN1dCB5b3UgcmVnaXN0ZXJlZCBvblxuICogYSBwYXJ0aWN1bGFyIHdpbmRvdyBpbnN0YW5jZS5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiBCcm93c2VyV2luZG93IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIHVucmVnaXN0ZXJBbGwod2luKSB7XG5cdGRlYnVnKGBVbnJlZ2lzdGVyaW5nIGFsbCBzaG9ydGN1dHMgb24gd2luZG93ICR7dGl0bGUod2luKX1gKTtcblx0Y29uc3Qgd2MgPSB3aW4ud2ViQ29udGVudHM7XG5cdGNvbnN0IHNob3J0Y3V0c09mV2luZG93ID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdjKTtcblxuXHQvLyBSZW1vdmUgbGlzdGVuZXIgZnJvbSB3aW5kb3dcblx0c2hvcnRjdXRzT2ZXaW5kb3cucmVtb3ZlTGlzdGVuZXIoKTtcblxuXHR3aW5kb3dzV2l0aFNob3J0Y3V0cy5kZWxldGUod2MpO1xufVxuXG5mdW5jdGlvbiBfbm9ybWFsaXplRXZlbnQoaW5wdXQpIHtcblx0Y29uc3Qgbm9ybWFsaXplZEV2ZW50ID0ge1xuXHRcdGNvZGU6IGlucHV0LmNvZGUsXG5cdFx0a2V5OiBpbnB1dC5rZXlcblx0fTtcblxuXHRbJ2FsdCcsICdzaGlmdCcsICdtZXRhJ10uZm9yRWFjaChwcm9wID0+IHtcblx0XHRpZiAodHlwZW9mIGlucHV0W3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0bm9ybWFsaXplZEV2ZW50W2Ake3Byb3B9S2V5YF0gPSBpbnB1dFtwcm9wXTtcblx0XHR9XG5cdH0pO1xuXG5cdGlmICh0eXBlb2YgaW5wdXQuY29udHJvbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRub3JtYWxpemVkRXZlbnQuY3RybEtleSA9IGlucHV0LmNvbnRyb2w7XG5cdH1cblxuXHRyZXR1cm4gbm9ybWFsaXplZEV2ZW50O1xufVxuXG5mdW5jdGlvbiBfZmluZFNob3J0Y3V0KGV2ZW50LCBzaG9ydGN1dHNPZldpbmRvdykge1xuXHRsZXQgaSA9IDA7XG5cdGZvciAoY29uc3Qgc2hvcnRjdXQgb2Ygc2hvcnRjdXRzT2ZXaW5kb3cpIHtcblx0XHRpZiAoZXF1YWxzKHNob3J0Y3V0LmV2ZW50U3RhbXAsIGV2ZW50KSkge1xuXHRcdFx0cmV0dXJuIGk7XG5cdFx0fVxuXHRcdGkrKztcblx0fVxuXHRyZXR1cm4gLTE7XG59XG5cbmNvbnN0IF9vbkJlZm9yZUlucHV0ID0gc2hvcnRjdXRzT2ZXaW5kb3cgPT4gKGUsIGlucHV0KSA9PiB7XG5cdGlmIChpbnB1dC50eXBlID09PSAna2V5VXAnKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgZXZlbnQgPSBfbm9ybWFsaXplRXZlbnQoaW5wdXQpO1xuXG5cdGRlYnVnKGBiZWZvcmUtaW5wdXQtZXZlbnQ6ICR7aW5wdXR9IGlzIHRyYW5zbGF0ZWQgdG86ICR7ZXZlbnR9YCk7XG5cdGZvciAoY29uc3Qge2V2ZW50U3RhbXAsIGNhbGxiYWNrfSBvZiBzaG9ydGN1dHNPZldpbmRvdykge1xuXHRcdGlmIChlcXVhbHMoZXZlbnRTdGFtcCwgZXZlbnQpKSB7XG5cdFx0XHRkZWJ1ZyhgZXZlbnRTdGFtcDogJHtldmVudFN0YW1wfSBtYXRjaGApO1xuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZGVidWcoYGV2ZW50U3RhbXA6ICR7ZXZlbnRTdGFtcH0gbm8gbWF0Y2hgKTtcblx0fVxufTtcblxuLyoqXG4qIFJlZ2lzdGVycyB0aGUgc2hvcnRjdXQgYGFjY2VsZXJhdG9yYG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIC0gQnJvd3NlcldpbmRvdyBpbnN0YW5jZSB0byByZWdpc3Rlci5cbiAqIFRoaXMgYXJndW1lbnQgY291bGQgYmUgb21pdHRlZCwgaW4gdGhpcyBjYXNlIHRoZSBmdW5jdGlvbiByZWdpc3RlclxuICogdGhlIHNob3J0Y3V0IG9uIGFsbCBhcHAgd2luZG93cy5cbiAqIEBwYXJhbSAge1N0cmluZ30gYWNjZWxlcmF0b3IgLSB0aGUgc2hvcnRjdXQgdG8gcmVnaXN0ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAgICBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBzaG9ydGN1dCBpcyBwcmVzc2VkXG4gKiBhbmQgdGhlIHdpbmRvdyBpcyBmb2N1c2VkIGFuZCBub3QgbWluaW1pemVkLlxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiByZWdpc3Rlcih3aW4sIGFjY2VsZXJhdG9yLCBjYWxsYmFjaykge1xuXHRsZXQgd2M7XG5cdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0d2MgPSBBTllfV0lORE9XO1xuXHRcdGNhbGxiYWNrID0gYWNjZWxlcmF0b3I7XG5cdFx0YWNjZWxlcmF0b3IgPSB3aW47XG5cdH0gZWxzZSB7XG5cdFx0d2MgPSB3aW4ud2ViQ29udGVudHM7XG5cdH1cblxuXHRkZWJ1ZyhgUmVnaXN0ZXJpbmcgY2FsbGJhY2sgZm9yICR7YWNjZWxlcmF0b3J9IG9uIHdpbmRvdyAke3RpdGxlKHdpbil9YCk7XG5cdF9jaGVja0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKTtcblxuXHRkZWJ1ZyhgJHthY2NlbGVyYXRvcn0gc2VlbXMgYSB2YWxpZCBzaG9ydGN1dCBzZXF1ZW5jZS5gKTtcblxuXHRsZXQgc2hvcnRjdXRzT2ZXaW5kb3c7XG5cdGlmICh3aW5kb3dzV2l0aFNob3J0Y3V0cy5oYXMod2MpKSB7XG5cdFx0ZGVidWcoYFdpbmRvdyBoYXMgb3RoZXJzIHNob3J0Y3V0cyByZWdpc3RlcmVkLmApO1xuXHRcdHNob3J0Y3V0c09mV2luZG93ID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdjKTtcblx0fSBlbHNlIHtcblx0XHRkZWJ1ZyhgVGhpcyBpcyB0aGUgZmlyc3Qgc2hvcnRjdXQgb2YgdGhlIHdpbmRvdy5gKTtcblx0XHRzaG9ydGN1dHNPZldpbmRvdyA9IFtdO1xuXHRcdHdpbmRvd3NXaXRoU2hvcnRjdXRzLnNldCh3Yywgc2hvcnRjdXRzT2ZXaW5kb3cpO1xuXG5cdFx0aWYgKHdjID09PSBBTllfV0lORE9XKSB7XG5cdFx0XHRjb25zdCBrZXlIYW5kbGVyID0gX29uQmVmb3JlSW5wdXQoc2hvcnRjdXRzT2ZXaW5kb3cpO1xuXHRcdFx0Y29uc3QgZW5hYmxlQXBwU2hvcnRjdXRzID0gKGUsIHdpbikgPT4ge1xuXHRcdFx0XHRjb25zdCB3YyA9IHdpbi53ZWJDb250ZW50cztcblx0XHRcdFx0d2Mub24oJ2JlZm9yZS1pbnB1dC1ldmVudCcsIGtleUhhbmRsZXIpO1xuXHRcdFx0XHR3Yy5vbmNlKCdjbG9zZWQnLCAoKSA9PlxuXHRcdFx0XHRcdHdjLnJlbW92ZUxpc3RlbmVyKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBrZXlIYW5kbGVyKVxuXHRcdFx0XHQpO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gRW5hYmxlIHNob3J0Y3V0IG9uIGN1cnJlbnQgd2luZG93c1xuXHRcdFx0Y29uc3Qgd2luZG93cyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpO1xuXG5cdFx0XHR3aW5kb3dzLmZvckVhY2god2luID0+IGVuYWJsZUFwcFNob3J0Y3V0cyhudWxsLCB3aW4pKTtcblxuXHRcdFx0Ly8gRW5hYmxlIHNob3J0Y3V0IG9uIGZ1dHVyZSB3aW5kb3dzXG5cdFx0XHRhcHAub24oJ2Jyb3dzZXItd2luZG93LWNyZWF0ZWQnLCBlbmFibGVBcHBTaG9ydGN1dHMpO1xuXG5cdFx0XHRzaG9ydGN1dHNPZldpbmRvdy5yZW1vdmVMaXN0ZW5lciA9ICgpID0+IHtcblx0XHRcdFx0Y29uc3Qgd2luZG93cyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpO1xuXHRcdFx0XHR3aW5kb3dzLmZvckVhY2god2luID0+XG5cdFx0XHRcdFx0d2luLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBrZXlIYW5kbGVyKVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRhcHAucmVtb3ZlTGlzdGVuZXIoJ2Jyb3dzZXItd2luZG93LWNyZWF0ZWQnLCBlbmFibGVBcHBTaG9ydGN1dHMpO1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3Qga2V5SGFuZGxlciA9IF9vbkJlZm9yZUlucHV0KHNob3J0Y3V0c09mV2luZG93KTtcblx0XHRcdHdjLm9uKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBrZXlIYW5kbGVyKTtcblxuXHRcdFx0Ly8gU2F2ZSBhIHJlZmVyZW5jZSB0byBhbGxvdyByZW1vdmUgb2YgbGlzdGVuZXIgZnJvbSBlbHNld2hlcmVcblx0XHRcdHNob3J0Y3V0c09mV2luZG93LnJlbW92ZUxpc3RlbmVyID0gKCkgPT5cblx0XHRcdFx0d2MucmVtb3ZlTGlzdGVuZXIoJ2JlZm9yZS1pbnB1dC1ldmVudCcsIGtleUhhbmRsZXIpO1xuXHRcdFx0d2Mub25jZSgnY2xvc2VkJywgc2hvcnRjdXRzT2ZXaW5kb3cucmVtb3ZlTGlzdGVuZXIpO1xuXHRcdH1cblx0fVxuXG5cdGRlYnVnKGBBZGRpbmcgc2hvcnRjdXQgdG8gd2luZG93IHNldC5gKTtcblxuXHRjb25zdCBldmVudFN0YW1wID0gdG9LZXlFdmVudChhY2NlbGVyYXRvcik7XG5cblx0c2hvcnRjdXRzT2ZXaW5kb3cucHVzaCh7XG5cdFx0ZXZlbnRTdGFtcCxcblx0XHRjYWxsYmFjayxcblx0XHRlbmFibGVkOiB0cnVlXG5cdH0pO1xuXG5cdGRlYnVnKGBTaG9ydGN1dCByZWdpc3RlcmVkLmApO1xufVxuXG4vKipcbiAqIFVucmVnaXN0ZXJzIHRoZSBzaG9ydGN1dCBvZiBgYWNjZWxlcmF0b3JgIHJlZ2lzdGVyZWQgb24gdGhlIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gLSBCcm93c2VyV2luZG93IGluc3RhbmNlIHRvIHVucmVnaXN0ZXIuXG4gKiBUaGlzIGFyZ3VtZW50IGNvdWxkIGJlIG9taXR0ZWQsIGluIHRoaXMgY2FzZSB0aGUgZnVuY3Rpb24gdW5yZWdpc3RlciB0aGUgc2hvcnRjdXRcbiAqIG9uIGFsbCBhcHAgd2luZG93cy4gSWYgeW91IHJlZ2lzdGVyZWQgdGhlIHNob3J0Y3V0IG9uIGEgcGFydGljdWxhciB3aW5kb3cgaW5zdGFuY2UsIGl0IHdpbGwgZG8gbm90aGluZy5cbiAqIEBwYXJhbSAge1N0cmluZ30gYWNjZWxlcmF0b3IgLSB0aGUgc2hvcnRjdXQgdG8gdW5yZWdpc3RlclxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKHdpbiwgYWNjZWxlcmF0b3IpIHtcblx0bGV0IHdjO1xuXHRpZiAodHlwZW9mIGFjY2VsZXJhdG9yID09PSAndW5kZWZpbmVkJykge1xuXHRcdHdjID0gQU5ZX1dJTkRPVztcblx0XHRhY2NlbGVyYXRvciA9IHdpbjtcblx0fSBlbHNlIHtcblx0XHRpZiAod2luLmlzRGVzdHJveWVkKCkpIHtcblx0XHRcdGRlYnVnKGBFYXJseSByZXR1cm4gYmVjYXVzZSB3aW5kb3cgaXMgZGVzdHJveWVkLmApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR3YyA9IHdpbi53ZWJDb250ZW50cztcblx0fVxuXG5cdGRlYnVnKGBVbnJlZ2lzdGVyaW5nIGNhbGxiYWNrIGZvciAke2FjY2VsZXJhdG9yfSBvbiB3aW5kb3cgJHt0aXRsZSh3aW4pfWApO1xuXG5cdF9jaGVja0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKTtcblxuXHRkZWJ1ZyhgJHthY2NlbGVyYXRvcn0gc2VlbXMgYSB2YWxpZCBzaG9ydGN1dCBzZXF1ZW5jZS5gKTtcblxuXHRpZiAoIXdpbmRvd3NXaXRoU2hvcnRjdXRzLmhhcyh3YykpIHtcblx0XHRkZWJ1ZyhgRWFybHkgcmV0dXJuIGJlY2F1c2Ugd2luZG93IGhhcyBuZXZlciBoYWQgc2hvcnRjdXRzIHJlZ2lzdGVyZWQuYCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3Qgc2hvcnRjdXRzT2ZXaW5kb3cgPSB3aW5kb3dzV2l0aFNob3J0Y3V0cy5nZXQod2MpO1xuXG5cdGNvbnN0IGV2ZW50U3RhbXAgPSB0b0tleUV2ZW50KGFjY2VsZXJhdG9yKTtcblx0Y29uc3Qgc2hvcnRjdXRJZHggPSBfZmluZFNob3J0Y3V0KGV2ZW50U3RhbXAsIHNob3J0Y3V0c09mV2luZG93KTtcblx0aWYgKHNob3J0Y3V0SWR4ID09PSAtMSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHNob3J0Y3V0c09mV2luZG93LnNwbGljZShzaG9ydGN1dElkeCwgMSk7XG5cblx0Ly8gSWYgdGhlIHdpbmRvdyBoYXMgbm8gbW9yZSBzaG9ydGN1dHMsXG5cdC8vIHdlIHJlbW92ZSBpdCBlYXJseSBmcm9tIHRoZSBXZWFrTWFwXG5cdC8vIGFuZCB1bnJlZ2lzdGVyaW5nIHRoZSBldmVudCBsaXN0ZW5lclxuXHRpZiAoc2hvcnRjdXRzT2ZXaW5kb3cubGVuZ3RoID09PSAwKSB7XG5cdFx0Ly8gUmVtb3ZlIGxpc3RlbmVyIGZyb20gd2luZG93XG5cdFx0c2hvcnRjdXRzT2ZXaW5kb3cucmVtb3ZlTGlzdGVuZXIoKTtcblxuXHRcdC8vIFJlbW92ZSB3aW5kb3cgZnJvbSBzaHJ0Y3V0cyBjYXRhbG9nXG5cdFx0d2luZG93c1dpdGhTaG9ydGN1dHMuZGVsZXRlKHdjKTtcblx0fVxufVxuXG4vKipcbiAqIFJldHVybnMgYHRydWVgIG9yIGBmYWxzZWAgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIHNob3J0Y3V0IGBhY2NlbGVyYXRvcmBcbiAqIGlzIHJlZ2lzdGVyZWQgb24gYHdpbmRvd2AuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gLSBCcm93c2VyV2luZG93IGluc3RhbmNlIHRvIGNoZWNrLiBUaGlzIGFyZ3VtZW50XG4gKiBjb3VsZCBiZSBvbWl0dGVkLCBpbiB0aGlzIGNhc2UgdGhlIGZ1bmN0aW9uIHJldHVybnMgd2hldGhlciB0aGUgc2hvcnRjdXRcbiAqIGBhY2NlbGVyYXRvcmAgaXMgcmVnaXN0ZXJlZCBvbiBhbGwgYXBwIHdpbmRvd3MuIElmIHlvdSByZWdpc3RlcmVkIHRoZVxuICogc2hvcnRjdXQgb24gYSBwYXJ0aWN1bGFyIHdpbmRvdyBpbnN0YW5jZSwgaXQgcmV0dXJuIGZhbHNlLlxuICogQHBhcmFtICB7U3RyaW5nfSBhY2NlbGVyYXRvciAtIHRoZSBzaG9ydGN1dCB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn0gLSBpZiB0aGUgc2hvcnRjdXQgYGFjY2VsZXJhdG9yYCBpcyByZWdpc3RlcmVkIG9uIGB3aW5kb3dgLlxuICovXG5mdW5jdGlvbiBpc1JlZ2lzdGVyZWQod2luLCBhY2NlbGVyYXRvcikge1xuXHRfY2hlY2tBY2NlbGVyYXRvcihhY2NlbGVyYXRvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3Rlcixcblx0dW5yZWdpc3Rlcixcblx0aXNSZWdpc3RlcmVkLFxuXHR1bnJlZ2lzdGVyQWxsLFxuXHRlbmFibGVBbGwsXG5cdGRpc2FibGVBbGxcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2NhbHNob3J0Y3V0L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2NhbHNob3J0Y3V0L2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-localshortcut/index.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _electronDevtoolsInstaller;\n\nfunction _load_electronDevtoolsInstaller() {\n    return _electronDevtoolsInstaller = _interopRequireDefault(__webpack_require__(\"electron-devtools-installer\"));\n}\n\nvar _electronDevtoolsInstaller2;\n\nfunction _load_electronDevtoolsInstaller2() {\n    return _electronDevtoolsInstaller2 = __webpack_require__(\"electron-devtools-installer\");\n}\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// install vue-devtools\n__webpack_require__(\"electron\").app.on(\"ready\", () => {\n    (0, (_electronDevtoolsInstaller || _load_electronDevtoolsInstaller()).default)((_electronDevtoolsInstaller2 || _load_electronDevtoolsInstaller2()).VUEJS_DEVTOOLS).catch(error => {\n        console.log(\"Unable to install `vue-devtools`: \\n\", error);\n    });\n});\n//# sourceMappingURL=vue-main-dev-entry.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvY29uZmlndXJhdG9ycy92dWUvdnVlLW1haW4tZGV2LWVudHJ5LmpzPzBmZjYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2NvbmZpZ3VyYXRvcnMvdnVlL3Z1ZS1tYWluLWRldi1lbnRyeS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXI7XG5cbmZ1bmN0aW9uIF9sb2FkX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXIoKSB7XG4gICAgcmV0dXJuIF9lbGVjdHJvbkRldnRvb2xzSW5zdGFsbGVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCIpKTtcbn1cblxudmFyIF9lbGVjdHJvbkRldnRvb2xzSW5zdGFsbGVyMjtcblxuZnVuY3Rpb24gX2xvYWRfZWxlY3Ryb25EZXZ0b29sc0luc3RhbGxlcjIoKSB7XG4gICAgcmV0dXJuIF9lbGVjdHJvbkRldnRvb2xzSW5zdGFsbGVyMiA9IHJlcXVpcmUoXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIik7XG59XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIGluc3RhbGwgdnVlLWRldnRvb2xzXG5yZXF1aXJlKFwiZWxlY3Ryb25cIikuYXBwLm9uKFwicmVhZHlcIiwgKCkgPT4ge1xuICAgICgwLCAoX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXIgfHwgX2xvYWRfZWxlY3Ryb25EZXZ0b29sc0luc3RhbGxlcigpKS5kZWZhdWx0KSgoX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXIyIHx8IF9sb2FkX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXIyKCkpLlZVRUpTX0RFVlRPT0xTKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGluc3RhbGwgYHZ1ZS1kZXZ0b29sc2A6IFxcblwiLCBlcnJvcik7XG4gICAgfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZ1ZS1tYWluLWRldi1lbnRyeS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi13ZWJwYWNrL291dC9jb25maWd1cmF0b3JzL3Z1ZS92dWUtbWFpbi1kZXYtZW50cnkuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2NvbmZpZ3VyYXRvcnMvdnVlL3Z1ZS1tYWluLWRldi1lbnRyeS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(\"source-map-support/source-map-support.js\").install();\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\nif (socketPath == null) {\n    throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n}\n// module, but not relative path must be used (because this file is used as entry)\nconst HmrClient = __webpack_require__(\"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient;\n// tslint:disable:no-unused-expression\nnew HmrClient(socketPath, module.hot, () => {\n    return __webpack_require__.h();\n});\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/ZDA3NyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9tYWluLWhtci5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKS5pbnN0YWxsKCk7XG5jb25zdCBzb2NrZXRQYXRoID0gcHJvY2Vzcy5lbnYuRUxFQ1RST05fSE1SX1NPQ0tFVF9QQVRIO1xuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgW0hNUl0gRW52IEVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSCBpcyBub3Qgc2V0YCk7XG59XG4vLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5jb25zdCBIbXJDbGllbnQgPSByZXF1aXJlKFwiZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvSG1yQ2xpZW50XCIpLkhtckNsaWVudDtcbi8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5uZXcgSG1yQ2xpZW50KHNvY2tldFBhdGgsIG1vZHVsZS5ob3QsICgpID0+IHtcbiAgICByZXR1cm4gX193ZWJwYWNrX2hhc2hfXztcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./node_modules/keyboardevent-from-electron-accelerator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, '__esModule', { value: true });\n\nconst modifiers = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|Alt|Option|AltGr|Shift|Super)/i;\nconst keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]'])/i;\nconst UNSUPPORTED = {};\n\nfunction reduceModifier({accelerator, event}, modifier) {\n\tswitch (modifier) {\n\t\tcase 'command':\n\t\tcase 'cmd': {\n\t\t\tif (process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'super': {\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Super` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'control':\n\t\tcase 'ctrl': {\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'commandorcontrol':\n\t\tcase 'cmdorctrl': {\n\t\t\tif (process.platform === 'darwin') {\n\t\t\t\tif (event.metaKey) {\n\t\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t\t}\n\n\t\t\t\treturn {\n\t\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'option':\n\t\tcase 'altgr':\n\t\tcase 'alt': {\n\t\t\tif (modifier === 'option' && process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.altKey) {\n\t\t\t\tthrow new Error('Double `Alt` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {altKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'shift': {\n\t\t\tif (event.shiftKey) {\n\t\t\t\tthrow new Error('Double `Shift` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {shiftKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\n\t\tdefault:\n\t\t\tconsole.error(modifier);\n\t}\n}\n\nfunction reducePlus({accelerator, event}) {\n\treturn {\n\t\tevent,\n\t\taccelerator: accelerator.trim().slice(1)\n\t};\n}\n\nconst virtualKeyCodes = {\n\t0: 'Digit0',\n\t1: 'Digit1',\n\t2: 'Digit2',\n\t3: 'Digit3',\n\t4: 'Digit4',\n\t5: 'Digit5',\n\t6: 'Digit6',\n\t7: 'Digit7',\n\t8: 'Digit8',\n\t9: 'Digit9',\n\t'-': 'Minus',\n\t'=': 'Equal',\n\tQ: 'KeyQ',\n\tW: 'KeyW',\n\tE: 'KeyE',\n\tR: 'KeyR',\n\tT: 'KeyT',\n\tY: 'KeyY',\n\tU: 'KeyU',\n\tI: 'KeyI',\n\tO: 'KeyO',\n\tP: 'KeyP',\n\t'[': 'BracketLeft',\n\t']': 'BracketRight',\n\tA: 'KeyA',\n\tS: 'KeyS',\n\tD: 'KeyD',\n\tF: 'KeyF',\n\tG: 'KeyG',\n\tH: 'KeyH',\n\tJ: 'KeyJ',\n\tK: 'KeyK',\n\tL: 'KeyL',\n\t';': 'Semicolon',\n\t'\\'': 'Quote',\n\t'`': 'Backquote',\n\t'/': 'Backslash',\n\tZ: 'KeyZ',\n\tX: 'KeyX',\n\tC: 'KeyC',\n\tV: 'KeyV',\n\tB: 'KeyB',\n\tN: 'KeyN',\n\tM: 'KeyM',\n\t',': 'Comma',\n\t'.': 'Period',\n\t'\\\\': 'Slash',\n\t' ': 'Space'\n};\n\nfunction reduceKey({accelerator, event}, key) {\n\tif (key.length > 1 || event.key) {\n\t\tthrow new Error(`Unvalid keycode \\`${key}\\`.`);\n\t}\n\n\tconst code =\n\t\tkey.toUpperCase() in virtualKeyCodes ?\n\t\t\tvirtualKeyCodes[key.toUpperCase()] :\n\t\t\tnull;\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice(key.length)\n\t};\n}\n\nconst domKeys = Object.assign(Object.create(null), {\n\tplus: 'Add',\n\tspace: ' ',\n\ttab: 'Tab',\n\tbackspace: 'Backspace',\n\tdelete: 'Delete',\n\tinsert: 'Insert',\n\treturn: 'Return',\n\tenter: 'Return',\n\tup: 'ArrowUp',\n\tdown: 'ArrowDown',\n\tleft: 'ArrowLeft',\n\tright: 'ArrowRight',\n\thome: 'Home',\n\tend: 'End',\n\tpageup: 'PageUp',\n\tpagedown: 'PageDown',\n\tescape: 'Escape',\n\tesc: 'Escape',\n\tvolumeup: 'AudioVolumeUp',\n\tvolumedown: 'AudioVolumeDown',\n\tvolumemute: 'AudioVolumeMute',\n\tmedianexttrack: 'MediaTrackNext',\n\tmediaprevioustrack: 'MediaTrackPrevious',\n\tmediastop: 'MediaStop',\n\tmediaplaypause: 'MediaPlayPause',\n\tprintscreen: 'PrintScreen'\n});\n\n// Add function keys\nfor (let i = 1; i <= 24; i++) {\n\tdomKeys[`f${i}`] = `F${i}`;\n}\n\nfunction reduceCode({accelerator, event}, {code, key}) {\n\tif (event.code) {\n\t\tthrow new Error(`Duplicated keycode \\`${key}\\`.`);\n\t}\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice((key && key.length) || 0)\n\t};\n}\n\n/**\n * This function transform an Electron Accelerator string into\n * a DOM KeyboardEvent object.\n *\n * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.\n * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.\n */\nfunction toKeyEvent(accelerator) {\n\tlet state = {accelerator, event: {}};\n\twhile (state.accelerator !== '') {\n\t\tconst modifierMatch = state.accelerator.match(modifiers);\n\t\tif (modifierMatch) {\n\t\t\tconst modifier = modifierMatch[0].toLowerCase();\n\t\t\tstate = reduceModifier(state, modifier);\n\t\t\tif (state === UNSUPPORTED) {\n\t\t\t\treturn {unsupportedKeyForPlatform: true};\n\t\t\t}\n\t\t} else if (state.accelerator.trim()[0] === '+') {\n\t\t\tstate = reducePlus(state);\n\t\t} else {\n\t\t\tconst codeMatch = state.accelerator.match(keyCodes);\n\t\t\tif (codeMatch) {\n\t\t\t\tconst code = codeMatch[0].toLowerCase();\n\t\t\t\tif (code in domKeys) {\n\t\t\t\t\tstate = reduceCode(state, {\n\t\t\t\t\t\tcode: domKeys[code],\n\t\t\t\t\t\tkey: code\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tstate = reduceKey(state, code);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tthrow new Error(`Unvalid accelerator: \"${state.accelerator}\"`);\n\t\t\t}\n\t\t}\n\t}\n\treturn state.event;\n}\n\nexports.UNSUPPORTED = UNSUPPORTED;\nexports.reduceModifier = reduceModifier;\nexports.reducePlus = reducePlus;\nexports.reduceKey = reduceKey;\nexports.reduceCode = reduceCode;\nexports.toKeyEvent = toKeyEvent;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1mcm9tLWVsZWN0cm9uLWFjY2VsZXJhdG9yL2luZGV4LmpzPzFiMTYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEO0FBQ0EscVZBQXFWLEVBQUUsRUFBRTtBQUN6Vjs7QUFFQSx5QkFBeUIsbUJBQW1CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsVUFBVSxjQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFVBQVUsY0FBYztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFVBQVUsY0FBYztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsVUFBVSxjQUFjO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsVUFBVSxjQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkIsVUFBVSxhQUFhO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLFVBQVUsZUFBZTtBQUNwRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLG1CQUFtQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0EsdUNBQXVDLElBQUk7QUFDM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsVUFBVSxJQUFJLFVBQVUsS0FBSztBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBLGVBQWUsU0FBUztBQUN4QixhQUFhLEVBQUUsU0FBUyxFQUFFO0FBQzFCOztBQUVBLHFCQUFxQixtQkFBbUIsR0FBRyxVQUFVO0FBQ3JEO0FBQ0EsMENBQTBDLElBQUk7QUFDOUM7O0FBRUE7QUFDQSx5QkFBeUIsVUFBVSxJQUFJLFVBQVUsS0FBSztBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSTtBQUNKLDZDQUE2QyxrQkFBa0I7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1mcm9tLWVsZWN0cm9uLWFjY2VsZXJhdG9yL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5jb25zdCBtb2RpZmllcnMgPSAvXihDb21tYW5kT3JDb250cm9sfENtZE9yQ3RybHxDb21tYW5kfENtZHxDb250cm9sfEN0cmx8QWx0fE9wdGlvbnxBbHRHcnxTaGlmdHxTdXBlcikvaTtcbmNvbnN0IGtleUNvZGVzID0gL14oUGx1c3xTcGFjZXxUYWJ8QmFja3NwYWNlfERlbGV0ZXxJbnNlcnR8UmV0dXJufEVudGVyfFVwfERvd258TGVmdHxSaWdodHxIb21lfEVuZHxQYWdlVXB8UGFnZURvd258RXNjYXBlfEVzY3xWb2x1bWVVcHxWb2x1bWVEb3dufFZvbHVtZU11dGV8TWVkaWFOZXh0VHJhY2t8TWVkaWFQcmV2aW91c1RyYWNrfE1lZGlhU3RvcHxNZWRpYVBsYXlQYXVzZXxQcmludFNjcmVlbnxGMjR8RjIzfEYyMnxGMjF8RjIwfEYxOXxGMTh8RjE3fEYxNnxGMTV8RjE0fEYxM3xGMTJ8RjExfEYxMHxGOXxGOHxGN3xGNnxGNXxGNHxGM3xGMnxGMXxbMC05QS1aKSFAIyQlXiYqKDorPF8+P357fH1cIjs9LFxcLS4vYFtcXFxcXFxdJ10pL2k7XG5jb25zdCBVTlNVUFBPUlRFRCA9IHt9O1xuXG5mdW5jdGlvbiByZWR1Y2VNb2RpZmllcih7YWNjZWxlcmF0b3IsIGV2ZW50fSwgbW9kaWZpZXIpIHtcblx0c3dpdGNoIChtb2RpZmllcikge1xuXHRcdGNhc2UgJ2NvbW1hbmQnOlxuXHRcdGNhc2UgJ2NtZCc6IHtcblx0XHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuXHRcdFx0XHRyZXR1cm4gVU5TVVBQT1JURUQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldmVudC5tZXRhS2V5KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBDb21tYW5kYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge21ldGFLZXk6IHRydWV9KSxcblx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNhc2UgJ3N1cGVyJzoge1xuXHRcdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYFN1cGVyYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge21ldGFLZXk6IHRydWV9KSxcblx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNhc2UgJ2NvbnRyb2wnOlxuXHRcdGNhc2UgJ2N0cmwnOiB7XG5cdFx0XHRpZiAoZXZlbnQuY3RybEtleSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgQ29udHJvbGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHtjdHJsS2V5OiB0cnVlfSksXG5cdFx0XHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjYXNlICdjb21tYW5kb3Jjb250cm9sJzpcblx0XHRjYXNlICdjbWRvcmN0cmwnOiB7XG5cdFx0XHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcblx0XHRcdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgQ29tbWFuZGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHttZXRhS2V5OiB0cnVlfSksXG5cdFx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2ZW50LmN0cmxLZXkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYENvbnRyb2xgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7Y3RybEtleTogdHJ1ZX0pLFxuXHRcdFx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3Iuc2xpY2UobW9kaWZpZXIubGVuZ3RoKVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y2FzZSAnb3B0aW9uJzpcblx0XHRjYXNlICdhbHRncic6XG5cdFx0Y2FzZSAnYWx0Jzoge1xuXHRcdFx0aWYgKG1vZGlmaWVyID09PSAnb3B0aW9uJyAmJiBwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuXHRcdFx0XHRyZXR1cm4gVU5TVVBQT1JURUQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldmVudC5hbHRLZXkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYEFsdGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHthbHRLZXk6IHRydWV9KSxcblx0XHRcdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNhc2UgJ3NoaWZ0Jzoge1xuXHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBTaGlmdGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHtzaGlmdEtleTogdHJ1ZX0pLFxuXHRcdFx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3Iuc2xpY2UobW9kaWZpZXIubGVuZ3RoKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc29sZS5lcnJvcihtb2RpZmllcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVkdWNlUGx1cyh7YWNjZWxlcmF0b3IsIGV2ZW50fSkge1xuXHRyZXR1cm4ge1xuXHRcdGV2ZW50LFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci50cmltKCkuc2xpY2UoMSlcblx0fTtcbn1cblxuY29uc3QgdmlydHVhbEtleUNvZGVzID0ge1xuXHQwOiAnRGlnaXQwJyxcblx0MTogJ0RpZ2l0MScsXG5cdDI6ICdEaWdpdDInLFxuXHQzOiAnRGlnaXQzJyxcblx0NDogJ0RpZ2l0NCcsXG5cdDU6ICdEaWdpdDUnLFxuXHQ2OiAnRGlnaXQ2Jyxcblx0NzogJ0RpZ2l0NycsXG5cdDg6ICdEaWdpdDgnLFxuXHQ5OiAnRGlnaXQ5Jyxcblx0Jy0nOiAnTWludXMnLFxuXHQnPSc6ICdFcXVhbCcsXG5cdFE6ICdLZXlRJyxcblx0VzogJ0tleVcnLFxuXHRFOiAnS2V5RScsXG5cdFI6ICdLZXlSJyxcblx0VDogJ0tleVQnLFxuXHRZOiAnS2V5WScsXG5cdFU6ICdLZXlVJyxcblx0STogJ0tleUknLFxuXHRPOiAnS2V5TycsXG5cdFA6ICdLZXlQJyxcblx0J1snOiAnQnJhY2tldExlZnQnLFxuXHQnXSc6ICdCcmFja2V0UmlnaHQnLFxuXHRBOiAnS2V5QScsXG5cdFM6ICdLZXlTJyxcblx0RDogJ0tleUQnLFxuXHRGOiAnS2V5RicsXG5cdEc6ICdLZXlHJyxcblx0SDogJ0tleUgnLFxuXHRKOiAnS2V5SicsXG5cdEs6ICdLZXlLJyxcblx0TDogJ0tleUwnLFxuXHQnOyc6ICdTZW1pY29sb24nLFxuXHQnXFwnJzogJ1F1b3RlJyxcblx0J2AnOiAnQmFja3F1b3RlJyxcblx0Jy8nOiAnQmFja3NsYXNoJyxcblx0WjogJ0tleVonLFxuXHRYOiAnS2V5WCcsXG5cdEM6ICdLZXlDJyxcblx0VjogJ0tleVYnLFxuXHRCOiAnS2V5QicsXG5cdE46ICdLZXlOJyxcblx0TTogJ0tleU0nLFxuXHQnLCc6ICdDb21tYScsXG5cdCcuJzogJ1BlcmlvZCcsXG5cdCdcXFxcJzogJ1NsYXNoJyxcblx0JyAnOiAnU3BhY2UnXG59O1xuXG5mdW5jdGlvbiByZWR1Y2VLZXkoe2FjY2VsZXJhdG9yLCBldmVudH0sIGtleSkge1xuXHRpZiAoa2V5Lmxlbmd0aCA+IDEgfHwgZXZlbnQua2V5KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBVbnZhbGlkIGtleWNvZGUgXFxgJHtrZXl9XFxgLmApO1xuXHR9XG5cblx0Y29uc3QgY29kZSA9XG5cdFx0a2V5LnRvVXBwZXJDYXNlKCkgaW4gdmlydHVhbEtleUNvZGVzID9cblx0XHRcdHZpcnR1YWxLZXlDb2Rlc1trZXkudG9VcHBlckNhc2UoKV0gOlxuXHRcdFx0bnVsbDtcblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2tleX0sIGNvZGUgPyB7Y29kZX0gOiBudWxsKSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3IudHJpbSgpLnNsaWNlKGtleS5sZW5ndGgpXG5cdH07XG59XG5cbmNvbnN0IGRvbUtleXMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHtcblx0cGx1czogJ0FkZCcsXG5cdHNwYWNlOiAnICcsXG5cdHRhYjogJ1RhYicsXG5cdGJhY2tzcGFjZTogJ0JhY2tzcGFjZScsXG5cdGRlbGV0ZTogJ0RlbGV0ZScsXG5cdGluc2VydDogJ0luc2VydCcsXG5cdHJldHVybjogJ1JldHVybicsXG5cdGVudGVyOiAnUmV0dXJuJyxcblx0dXA6ICdBcnJvd1VwJyxcblx0ZG93bjogJ0Fycm93RG93bicsXG5cdGxlZnQ6ICdBcnJvd0xlZnQnLFxuXHRyaWdodDogJ0Fycm93UmlnaHQnLFxuXHRob21lOiAnSG9tZScsXG5cdGVuZDogJ0VuZCcsXG5cdHBhZ2V1cDogJ1BhZ2VVcCcsXG5cdHBhZ2Vkb3duOiAnUGFnZURvd24nLFxuXHRlc2NhcGU6ICdFc2NhcGUnLFxuXHRlc2M6ICdFc2NhcGUnLFxuXHR2b2x1bWV1cDogJ0F1ZGlvVm9sdW1lVXAnLFxuXHR2b2x1bWVkb3duOiAnQXVkaW9Wb2x1bWVEb3duJyxcblx0dm9sdW1lbXV0ZTogJ0F1ZGlvVm9sdW1lTXV0ZScsXG5cdG1lZGlhbmV4dHRyYWNrOiAnTWVkaWFUcmFja05leHQnLFxuXHRtZWRpYXByZXZpb3VzdHJhY2s6ICdNZWRpYVRyYWNrUHJldmlvdXMnLFxuXHRtZWRpYXN0b3A6ICdNZWRpYVN0b3AnLFxuXHRtZWRpYXBsYXlwYXVzZTogJ01lZGlhUGxheVBhdXNlJyxcblx0cHJpbnRzY3JlZW46ICdQcmludFNjcmVlbidcbn0pO1xuXG4vLyBBZGQgZnVuY3Rpb24ga2V5c1xuZm9yIChsZXQgaSA9IDE7IGkgPD0gMjQ7IGkrKykge1xuXHRkb21LZXlzW2BmJHtpfWBdID0gYEYke2l9YDtcbn1cblxuZnVuY3Rpb24gcmVkdWNlQ29kZSh7YWNjZWxlcmF0b3IsIGV2ZW50fSwge2NvZGUsIGtleX0pIHtcblx0aWYgKGV2ZW50LmNvZGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQga2V5Y29kZSBcXGAke2tleX1cXGAuYCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2tleX0sIGNvZGUgPyB7Y29kZX0gOiBudWxsKSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3IudHJpbSgpLnNsaWNlKChrZXkgJiYga2V5Lmxlbmd0aCkgfHwgMClcblx0fTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRyYW5zZm9ybSBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcgaW50b1xuICogYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBhY2NlbGVyYXRvciBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcsIGUuZy4gYEN0cmwrQ2Agb3IgYFNoaWZ0K1NwYWNlYC5cbiAqIEByZXR1cm4ge29iamVjdH0gYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QgZGVyaXZhdGUgZnJvbSB0aGUgYGFjY2VsZXJhdG9yYCBhcmd1bWVudC5cbiAqL1xuZnVuY3Rpb24gdG9LZXlFdmVudChhY2NlbGVyYXRvcikge1xuXHRsZXQgc3RhdGUgPSB7YWNjZWxlcmF0b3IsIGV2ZW50OiB7fX07XG5cdHdoaWxlIChzdGF0ZS5hY2NlbGVyYXRvciAhPT0gJycpIHtcblx0XHRjb25zdCBtb2RpZmllck1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2gobW9kaWZpZXJzKTtcblx0XHRpZiAobW9kaWZpZXJNYXRjaCkge1xuXHRcdFx0Y29uc3QgbW9kaWZpZXIgPSBtb2RpZmllck1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRzdGF0ZSA9IHJlZHVjZU1vZGlmaWVyKHN0YXRlLCBtb2RpZmllcik7XG5cdFx0XHRpZiAoc3RhdGUgPT09IFVOU1VQUE9SVEVEKSB7XG5cdFx0XHRcdHJldHVybiB7dW5zdXBwb3J0ZWRLZXlGb3JQbGF0Zm9ybTogdHJ1ZX07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzdGF0ZS5hY2NlbGVyYXRvci50cmltKClbMF0gPT09ICcrJykge1xuXHRcdFx0c3RhdGUgPSByZWR1Y2VQbHVzKHN0YXRlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgY29kZU1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2goa2V5Q29kZXMpO1xuXHRcdFx0aWYgKGNvZGVNYXRjaCkge1xuXHRcdFx0XHRjb25zdCBjb2RlID0gY29kZU1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmIChjb2RlIGluIGRvbUtleXMpIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUNvZGUoc3RhdGUsIHtcblx0XHRcdFx0XHRcdGNvZGU6IGRvbUtleXNbY29kZV0sXG5cdFx0XHRcdFx0XHRrZXk6IGNvZGVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUtleShzdGF0ZSwgY29kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW52YWxpZCBhY2NlbGVyYXRvcjogXCIke3N0YXRlLmFjY2VsZXJhdG9yfVwiYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzdGF0ZS5ldmVudDtcbn1cblxuZXhwb3J0cy5VTlNVUFBPUlRFRCA9IFVOU1VQUE9SVEVEO1xuZXhwb3J0cy5yZWR1Y2VNb2RpZmllciA9IHJlZHVjZU1vZGlmaWVyO1xuZXhwb3J0cy5yZWR1Y2VQbHVzID0gcmVkdWNlUGx1cztcbmV4cG9ydHMucmVkdWNlS2V5ID0gcmVkdWNlS2V5O1xuZXhwb3J0cy5yZWR1Y2VDb2RlID0gcmVkdWNlQ29kZTtcbmV4cG9ydHMudG9LZXlFdmVudCA9IHRvS2V5RXZlbnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWZyb20tZWxlY3Ryb24tYWNjZWxlcmF0b3IvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2tleWJvYXJkZXZlbnQtZnJvbS1lbGVjdHJvbi1hY2NlbGVyYXRvci9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/keyboardevent-from-electron-accelerator/index.js\n");

/***/ }),

/***/ "./node_modules/keyboardevents-areequal/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _lower(key) {\n\tif (typeof key !== 'string') {\n\t\treturn key;\n\t}\n\treturn key.toLowerCase();\n}\n\nfunction areEqual(ev1, ev2) {\n\tif (ev1 === ev2) {\n\t\t// Same object\n\t\t// console.log(`Events are same.`)\n\t\treturn true;\n\t}\n\n\tfor (const prop of ['altKey', 'ctrlKey', 'shiftKey', 'metaKey']) {\n\t\tconst [value1, value2] = [ev1[prop], ev2[prop]];\n\n\t\tif (Boolean(value1) !== Boolean(value2)) {\n\t\t\t// One of the prop is different\n\t\t\t// console.log(`Comparing prop ${prop}: ${value1} ${value2}`);\n\t\t\treturn false;\n\t\t}\n\t}\n\n\tif ((_lower(ev1.key) === _lower(ev2.key) && ev1.key !== undefined) ||\n\t\t(ev1.code === ev2.code && ev1.code !== undefined)) {\n\t\t// Events are equals\n\t\treturn true;\n\t}\n\n\t// Key or code are differents\n\t// console.log(`key or code are differents. ${ev1.key} !== ${ev2.key} ${ev1.code} !== ${ev2.code}`);\n\n\treturn false;\n}\n\nmodule.exports = areEqual;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudHMtYXJlZXF1YWwvaW5kZXguanM/MjJmMSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQyxLQUFLLElBQUksT0FBTyxHQUFHLE9BQU87QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0MsUUFBUSxPQUFPLFFBQVEsR0FBRyxTQUFTLE9BQU8sU0FBUzs7QUFFbEc7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50cy1hcmVlcXVhbC9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2xvd2VyKGtleSkge1xuXHRpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4ga2V5O1xuXHR9XG5cdHJldHVybiBrZXkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gYXJlRXF1YWwoZXYxLCBldjIpIHtcblx0aWYgKGV2MSA9PT0gZXYyKSB7XG5cdFx0Ly8gU2FtZSBvYmplY3Rcblx0XHQvLyBjb25zb2xlLmxvZyhgRXZlbnRzIGFyZSBzYW1lLmApXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHByb3Agb2YgWydhbHRLZXknLCAnY3RybEtleScsICdzaGlmdEtleScsICdtZXRhS2V5J10pIHtcblx0XHRjb25zdCBbdmFsdWUxLCB2YWx1ZTJdID0gW2V2MVtwcm9wXSwgZXYyW3Byb3BdXTtcblxuXHRcdGlmIChCb29sZWFuKHZhbHVlMSkgIT09IEJvb2xlYW4odmFsdWUyKSkge1xuXHRcdFx0Ly8gT25lIG9mIHRoZSBwcm9wIGlzIGRpZmZlcmVudFxuXHRcdFx0Ly8gY29uc29sZS5sb2coYENvbXBhcmluZyBwcm9wICR7cHJvcH06ICR7dmFsdWUxfSAke3ZhbHVlMn1gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRpZiAoKF9sb3dlcihldjEua2V5KSA9PT0gX2xvd2VyKGV2Mi5rZXkpICYmIGV2MS5rZXkgIT09IHVuZGVmaW5lZCkgfHxcblx0XHQoZXYxLmNvZGUgPT09IGV2Mi5jb2RlICYmIGV2MS5jb2RlICE9PSB1bmRlZmluZWQpKSB7XG5cdFx0Ly8gRXZlbnRzIGFyZSBlcXVhbHNcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIEtleSBvciBjb2RlIGFyZSBkaWZmZXJlbnRzXG5cdC8vIGNvbnNvbGUubG9nKGBrZXkgb3IgY29kZSBhcmUgZGlmZmVyZW50cy4gJHtldjEua2V5fSAhPT0gJHtldjIua2V5fSAke2V2MS5jb2RlfSAhPT0gJHtldjIuY29kZX1gKTtcblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJlRXF1YWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50cy1hcmVlcXVhbC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudHMtYXJlZXF1YWwvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/keyboardevents-areequal/index.js\n");

/***/ }),

/***/ "./node_modules/ms/index.js":
/***/ (function(module, exports) {

eval("/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isNaN(val) === false) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  return plural(ms, d, 'day') ||\n    plural(ms, h, 'hour') ||\n    plural(ms, m, 'minute') ||\n    plural(ms, s, 'second') ||\n    ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanM/MTFhYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixXQUFXLE9BQU87QUFDbEIsWUFBWSxNQUFNO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWwpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhcbiAgICBzdHJcbiAgKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIH1cbiAgaWYgKG1zID49IGgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICB9XG4gIGlmIChtcyA+PSBtKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgfVxuICBpZiAobXMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIH1cbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdExvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpIHx8XG4gICAgcGx1cmFsKG1zLCBoLCAnaG91cicpIHx8XG4gICAgcGx1cmFsKG1zLCBtLCAnbWludXRlJykgfHxcbiAgICBwbHVyYWwobXMsIHMsICdzZWNvbmQnKSB8fFxuICAgIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG1zIDwgbiAqIDEuNSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lO1xuICB9XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/ms/index.js\n");

/***/ }),

/***/ "./src/main/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(\"electron\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);\n\n\nvar cov_21h9us3pfq = function () {\n  var path = 'C:\\\\Users\\\\xdk78\\\\WebstormProjects\\\\ansi-downloader\\\\src\\\\main\\\\index.js',\n      hash = '8dbf806e2b69ae1cf09339cee424c9cc01b0deab',\n      global = new Function('return this')(),\n      gcv = '__coverage__',\n      coverageData = {\n    path: 'C:\\\\Users\\\\xdk78\\\\WebstormProjects\\\\ansi-downloader\\\\src\\\\main\\\\index.js',\n    statementMap: {\n      '0': {\n        start: {\n          line: 6,\n          column: 0\n        },\n        end: {\n          line: 6,\n          column: 49\n        }\n      },\n      '1': {\n        start: {\n          line: 12,\n          column: 0\n        },\n        end: {\n          line: 14,\n          column: 1\n        }\n      },\n      '2': {\n        start: {\n          line: 13,\n          column: 2\n        },\n        end: {\n          line: 13,\n          column: 85\n        }\n      },\n      '3': {\n        start: {\n          line: 17,\n          column: 15\n        },\n        end: {\n          line: 19,\n          column: 36\n        }\n      },\n      '4': {\n        start: {\n          line: 25,\n          column: 2\n        },\n        end: {\n          line: 30,\n          column: 4\n        }\n      },\n      '5': {\n        start: {\n          line: 32,\n          column: 2\n        },\n        end: {\n          line: 32,\n          column: 28\n        }\n      },\n      '6': {\n        start: {\n          line: 34,\n          column: 2\n        },\n        end: {\n          line: 36,\n          column: 4\n        }\n      },\n      '7': {\n        start: {\n          line: 35,\n          column: 4\n        },\n        end: {\n          line: 35,\n          column: 21\n        }\n      },\n      '8': {\n        start: {\n          line: 39,\n          column: 0\n        },\n        end: {\n          line: 39,\n          column: 29\n        }\n      },\n      '9': {\n        start: {\n          line: 41,\n          column: 0\n        },\n        end: {\n          line: 45,\n          column: 2\n        }\n      },\n      '10': {\n        start: {\n          line: 42,\n          column: 2\n        },\n        end: {\n          line: 44,\n          column: 3\n        }\n      },\n      '11': {\n        start: {\n          line: 43,\n          column: 4\n        },\n        end: {\n          line: 43,\n          column: 14\n        }\n      },\n      '12': {\n        start: {\n          line: 47,\n          column: 0\n        },\n        end: {\n          line: 51,\n          column: 2\n        }\n      },\n      '13': {\n        start: {\n          line: 48,\n          column: 2\n        },\n        end: {\n          line: 50,\n          column: 3\n        }\n      },\n      '14': {\n        start: {\n          line: 49,\n          column: 4\n        },\n        end: {\n          line: 49,\n          column: 18\n        }\n      }\n    },\n    fnMap: {\n      '0': {\n        name: 'createWindow',\n        decl: {\n          start: {\n            line: 21,\n            column: 9\n          },\n          end: {\n            line: 21,\n            column: 21\n          }\n        },\n        loc: {\n          start: {\n            line: 21,\n            column: 25\n          },\n          end: {\n            line: 37,\n            column: 1\n          }\n        },\n        line: 21\n      },\n      '1': {\n        name: '(anonymous_1)',\n        decl: {\n          start: {\n            line: 34,\n            column: 26\n          },\n          end: {\n            line: 34,\n            column: 27\n          }\n        },\n        loc: {\n          start: {\n            line: 34,\n            column: 32\n          },\n          end: {\n            line: 36,\n            column: 3\n          }\n        },\n        line: 34\n      },\n      '2': {\n        name: '(anonymous_2)',\n        decl: {\n          start: {\n            line: 41,\n            column: 28\n          },\n          end: {\n            line: 41,\n            column: 29\n          }\n        },\n        loc: {\n          start: {\n            line: 41,\n            column: 34\n          },\n          end: {\n            line: 45,\n            column: 1\n          }\n        },\n        line: 41\n      },\n      '3': {\n        name: '(anonymous_3)',\n        decl: {\n          start: {\n            line: 47,\n            column: 19\n          },\n          end: {\n            line: 47,\n            column: 20\n          }\n        },\n        loc: {\n          start: {\n            line: 47,\n            column: 25\n          },\n          end: {\n            line: 51,\n            column: 1\n          }\n        },\n        line: 47\n      }\n    },\n    branchMap: {\n      '0': {\n        loc: {\n          start: {\n            line: 12,\n            column: 0\n          },\n          end: {\n            line: 14,\n            column: 1\n          }\n        },\n        type: 'if',\n        locations: [{\n          start: {\n            line: 12,\n            column: 0\n          },\n          end: {\n            line: 14,\n            column: 1\n          }\n        }, {\n          start: {\n            line: 12,\n            column: 0\n          },\n          end: {\n            line: 14,\n            column: 1\n          }\n        }],\n        line: 12\n      },\n      '1': {\n        loc: {\n          start: {\n            line: 17,\n            column: 15\n          },\n          end: {\n            line: 19,\n            column: 36\n          }\n        },\n        type: 'cond-expr',\n        locations: [{\n          start: {\n            line: 18,\n            column: 4\n          },\n          end: {\n            line: 18,\n            column: 27\n          }\n        }, {\n          start: {\n            line: 19,\n            column: 4\n          },\n          end: {\n            line: 19,\n            column: 36\n          }\n        }],\n        line: 17\n      },\n      '2': {\n        loc: {\n          start: {\n            line: 42,\n            column: 2\n          },\n          end: {\n            line: 44,\n            column: 3\n          }\n        },\n        type: 'if',\n        locations: [{\n          start: {\n            line: 42,\n            column: 2\n          },\n          end: {\n            line: 44,\n            column: 3\n          }\n        }, {\n          start: {\n            line: 42,\n            column: 2\n          },\n          end: {\n            line: 44,\n            column: 3\n          }\n        }],\n        line: 42\n      },\n      '3': {\n        loc: {\n          start: {\n            line: 48,\n            column: 2\n          },\n          end: {\n            line: 50,\n            column: 3\n          }\n        },\n        type: 'if',\n        locations: [{\n          start: {\n            line: 48,\n            column: 2\n          },\n          end: {\n            line: 50,\n            column: 3\n          }\n        }, {\n          start: {\n            line: 48,\n            column: 2\n          },\n          end: {\n            line: 50,\n            column: 3\n          }\n        }],\n        line: 48\n      }\n    },\n    s: {\n      '0': 0,\n      '1': 0,\n      '2': 0,\n      '3': 0,\n      '4': 0,\n      '5': 0,\n      '6': 0,\n      '7': 0,\n      '8': 0,\n      '9': 0,\n      '10': 0,\n      '11': 0,\n      '12': 0,\n      '13': 0,\n      '14': 0\n    },\n    f: {\n      '0': 0,\n      '1': 0,\n      '2': 0,\n      '3': 0\n    },\n    b: {\n      '0': [0, 0],\n      '1': [0, 0],\n      '2': [0, 0],\n      '3': [0, 0]\n    },\n    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'\n  },\n      coverage = global[gcv] || (global[gcv] = {});\n\n  if (coverage[path] && coverage[path].hash === hash) {\n    return coverage[path];\n  }\n\n  coverageData.hash = hash;\n  return coverage[path] = coverageData;\n}();\n\n\n\n// Install `electron-debug` with `devtron`\ncov_21h9us3pfq.s[0]++;\n__webpack_require__(\"./node_modules/electron-debug/index.js\")({ showDevTools: true });\n\n/**\n * Set `__static` path to static files in production\n * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html\n */\ncov_21h9us3pfq.s[1]++;\nif (process.env.NODE_ENV !== 'development') {\n  cov_21h9us3pfq.b[0][0]++;\n  cov_21h9us3pfq.s[2]++;\n\n  global.__static = __webpack_require__(\"path\").join(__dirname, '/static').replace(/\\\\/g, '\\\\\\\\');\n} else {\n  cov_21h9us3pfq.b[0][1]++;\n}\n\nlet mainWindow;\nconst winURL = (cov_21h9us3pfq.s[3]++, process.env.NODE_ENV === 'development' ? (cov_21h9us3pfq.b[1][0]++, `http://localhost:9080`) : (cov_21h9us3pfq.b[1][1]++, `file://${__dirname}/index.html`));\n\nfunction createWindow() {\n  cov_21h9us3pfq.f[0]++;\n  cov_21h9us3pfq.s[4]++;\n\n  /**\n   * Initial window options\n   */\n  mainWindow = new __WEBPACK_IMPORTED_MODULE_0_electron__[\"BrowserWindow\"]({\n    width: 1200,\n    height: 700,\n    useContentSize: true,\n    frame: false\n  });\n\n  cov_21h9us3pfq.s[5]++;\n  mainWindow.loadURL(winURL);\n\n  cov_21h9us3pfq.s[6]++;\n  mainWindow.on('closed', () => {\n    cov_21h9us3pfq.f[1]++;\n    cov_21h9us3pfq.s[7]++;\n\n    mainWindow = null;\n  });\n}\n\ncov_21h9us3pfq.s[8]++;\n__WEBPACK_IMPORTED_MODULE_0_electron__[\"app\"].on('ready', createWindow);\n\ncov_21h9us3pfq.s[9]++;\n__WEBPACK_IMPORTED_MODULE_0_electron__[\"app\"].on('window-all-closed', () => {\n  cov_21h9us3pfq.f[2]++;\n  cov_21h9us3pfq.s[10]++;\n\n  if (process.platform !== 'darwin') {\n    cov_21h9us3pfq.b[2][0]++;\n    cov_21h9us3pfq.s[11]++;\n\n    __WEBPACK_IMPORTED_MODULE_0_electron__[\"app\"].quit();\n  } else {\n    cov_21h9us3pfq.b[2][1]++;\n  }\n});\n\ncov_21h9us3pfq.s[12]++;\n__WEBPACK_IMPORTED_MODULE_0_electron__[\"app\"].on('activate', () => {\n  cov_21h9us3pfq.f[3]++;\n  cov_21h9us3pfq.s[13]++;\n\n  if (mainWindow === null) {\n    cov_21h9us3pfq.b[3][0]++;\n    cov_21h9us3pfq.s[14]++;\n\n    createWindow();\n  } else {\n    cov_21h9us3pfq.b[3][1]++;\n  }\n});\n\n/**\n * Auto Updater\n *\n * Uncomment the following code below and install `electron-updater` to\n * support auto updating. Code Signing with a valid certificate is required.\n * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating\n */\n\n/*\nimport { autoUpdater } from 'electron-updater'\n\nautoUpdater.on('update-downloaded', () => {\n  autoUpdater.quitAndInstall()\n})\n\napp.on('ready', () => {\n  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()\n})\n */\n/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, \"src\\\\main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5qcz8yYmY2Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaG93RGV2VG9vbHMiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJnbG9iYWwiLCJfX3N0YXRpYyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJyZXBsYWNlIiwibWFpbldpbmRvdyIsIndpblVSTCIsImNyZWF0ZVdpbmRvdyIsIndpZHRoIiwiaGVpZ2h0IiwidXNlQ29udGVudFNpemUiLCJmcmFtZSIsImxvYWRVUkwiLCJvbiIsImFwcCIsInBsYXRmb3JtIiwicXVpdCJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBRUE7O0FBQ0EsbUJBQUFBLENBQVEsd0NBQVIsRUFBMEIsRUFBRUMsY0FBYyxJQUFoQixFQUExQjs7QUFFQTs7Ozs7QUFJQSxJQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsYUFBN0IsRUFBNEM7QUFBQTtBQUFBOztBQUMxQ0MsU0FBT0MsUUFBUCxHQUFrQixtQkFBQU4sQ0FBUSxNQUFSLEVBQWdCTyxJQUFoQixDQUFxQkMsU0FBckIsRUFBZ0MsU0FBaEMsRUFBMkNDLE9BQTNDLENBQW1ELEtBQW5ELEVBQTBELE1BQTFELENBQWxCO0FBQ0QsQ0FGRDtBQUFBO0FBQUE7O0FBSUEsSUFBSUMsVUFBSjtBQUNBLE1BQU1DLGlDQUFTVCxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsYUFBekIsOEJBQ1YsdUJBRFUsK0JBRVYsVUFBU0ksU0FBVSxhQUZULENBQVQsQ0FBTjs7QUFJQSxTQUFTSSxZQUFULEdBQXlCO0FBQUE7QUFBQTs7QUFDdkI7OztBQUdBRixlQUFhLElBQUksdURBQUosQ0FBa0I7QUFDN0JHLFdBQU8sSUFEc0I7QUFFN0JDLFlBQVEsR0FGcUI7QUFHN0JDLG9CQUFnQixJQUhhO0FBSTdCQyxXQUFPO0FBSnNCLEdBQWxCLENBQWI7O0FBSnVCO0FBV3ZCTixhQUFXTyxPQUFYLENBQW1CTixNQUFuQjs7QUFYdUI7QUFhdkJELGFBQVdRLEVBQVgsQ0FBYyxRQUFkLEVBQXdCLE1BQU07QUFBQTtBQUFBOztBQUM1QlIsaUJBQWEsSUFBYjtBQUNELEdBRkQ7QUFHRDs7O0FBRUQsNkNBQUFTLENBQUlELEVBQUosQ0FBTyxPQUFQLEVBQWdCTixZQUFoQjs7O0FBRUEsNkNBQUFPLENBQUlELEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQUE7QUFBQTs7QUFDaEMsTUFBSWhCLFFBQVFrQixRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQUE7QUFBQTs7QUFDakNELElBQUEsNkNBQUFBLENBQUlFLElBQUo7QUFDRCxHQUZEO0FBQUE7QUFBQTtBQUdELENBSkQ7OztBQU1BLDZDQUFBRixDQUFJRCxFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQUE7QUFBQTs7QUFDdkIsTUFBSVIsZUFBZSxJQUFuQixFQUF5QjtBQUFBO0FBQUE7O0FBQ3ZCRTtBQUNELEdBRkQ7QUFBQTtBQUFBO0FBR0QsQ0FKRDs7QUFNQTs7Ozs7Ozs7QUFRQSIsImZpbGUiOiIuL3NyYy9tYWluL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdyB9IGZyb20gJ2VsZWN0cm9uJ1xuXG4vLyBJbnN0YWxsIGBlbGVjdHJvbi1kZWJ1Z2Agd2l0aCBgZGV2dHJvbmBcbnJlcXVpcmUoJ2VsZWN0cm9uLWRlYnVnJykoeyBzaG93RGV2VG9vbHM6IHRydWUgfSlcblxuLyoqXG4gKiBTZXQgYF9fc3RhdGljYCBwYXRoIHRvIHN0YXRpYyBmaWxlcyBpbiBwcm9kdWN0aW9uXG4gKiBodHRwczovL3NpbXVsYXRlZGdyZWcuZ2l0Ym9va3MuaW8vZWxlY3Ryb24tdnVlL2NvbnRlbnQvZW4vdXNpbmctc3RhdGljLWFzc2V0cy5odG1sXG4gKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ2RldmVsb3BtZW50Jykge1xuICBnbG9iYWwuX19zdGF0aWMgPSByZXF1aXJlKCdwYXRoJykuam9pbihfX2Rpcm5hbWUsICcvc3RhdGljJykucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxufVxuXG5sZXQgbWFpbldpbmRvd1xuY29uc3Qgd2luVVJMID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcbiAgPyBgaHR0cDovL2xvY2FsaG9zdDo5MDgwYFxuICA6IGBmaWxlOi8vJHtfX2Rpcm5hbWV9L2luZGV4Lmh0bWxgXG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdyAoKSB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG4gICAqL1xuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHdpZHRoOiAxMjAwLFxuICAgIGhlaWdodDogNzAwLFxuICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxuICAgIGZyYW1lOiBmYWxzZVxuICB9KVxuXG4gIG1haW5XaW5kb3cubG9hZFVSTCh3aW5VUkwpXG5cbiAgbWFpbldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgIG1haW5XaW5kb3cgPSBudWxsXG4gIH0pXG59XG5cbmFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpXG5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgIGFwcC5xdWl0KClcbiAgfVxufSlcblxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcbiAgICBjcmVhdGVXaW5kb3coKVxuICB9XG59KVxuXG4vKipcbiAqIEF1dG8gVXBkYXRlclxuICpcbiAqIFVuY29tbWVudCB0aGUgZm9sbG93aW5nIGNvZGUgYmVsb3cgYW5kIGluc3RhbGwgYGVsZWN0cm9uLXVwZGF0ZXJgIHRvXG4gKiBzdXBwb3J0IGF1dG8gdXBkYXRpbmcuIENvZGUgU2lnbmluZyB3aXRoIGEgdmFsaWQgY2VydGlmaWNhdGUgaXMgcmVxdWlyZWQuXG4gKiBodHRwczovL3NpbXVsYXRlZGdyZWcuZ2l0Ym9va3MuaW8vZWxlY3Ryb24tdnVlL2NvbnRlbnQvZW4vdXNpbmctZWxlY3Ryb24tYnVpbGRlci5odG1sI2F1dG8tdXBkYXRpbmdcbiAqL1xuXG4vKlxuaW1wb3J0IHsgYXV0b1VwZGF0ZXIgfSBmcm9tICdlbGVjdHJvbi11cGRhdGVyJ1xuXG5hdXRvVXBkYXRlci5vbigndXBkYXRlLWRvd25sb2FkZWQnLCAoKSA9PiB7XG4gIGF1dG9VcGRhdGVyLnF1aXRBbmRJbnN0YWxsKClcbn0pXG5cbmFwcC5vbigncmVhZHknLCAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXMoKVxufSlcbiAqL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4vaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/index.js\n");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
__webpack_require__("./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js");
module.exports = __webpack_require__("./src/main/index.js");


/***/ }),

/***/ "electron":
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImVsZWN0cm9uXCJcbi8vIG1vZHVsZSBpZCA9IGVsZWN0cm9uXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-devtools-installer":
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-devtools-installer\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIj8wMGI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiXG4vLyBtb2R1bGUgaWQgPSBlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///electron-devtools-installer\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9mMGM5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiXG4vLyBtb2R1bGUgaWQgPSBlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "fs":
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiPzJlMDkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImZzXCJcbi8vIG1vZHVsZSBpZCA9IGZzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///fs\n");

/***/ }),

/***/ "net":
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXRcIj9lYjg1Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6Im5ldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5ldFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm5ldFwiXG4vLyBtb2R1bGUgaWQgPSBuZXRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///net\n");

/***/ }),

/***/ "path":
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NWIyYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gcGF0aFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/YTMyNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInNvdXJjZS1tYXAtc3VwcG9ydC9zb3VyY2UtbWFwLXN1cHBvcnQuanNcIlxuLy8gbW9kdWxlIGlkID0gc291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "tty":
/***/ (function(module, exports) {

eval("module.exports = require(\"tty\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0dHlcIj9iZjFjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InR0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInR0eVwiXG4vLyBtb2R1bGUgaWQgPSB0dHlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///tty\n");

/***/ }),

/***/ "util":
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCI/NzBjNSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInV0aWxcIlxuLy8gbW9kdWxlIGlkID0gdXRpbFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///util\n");

/***/ })

/******/ });