var bWait = true;
/*
 * SPA FrameWork
 */
//$(document).ready(function() {

	//content._init("config/config.js");
//});

var content = {
	initState : false,
	loadedPage : null,
	configUri : null,
	subElement : [],
	cache : true,
	memory : true,
	_prev_memory : null,
	_prev_cache : null,
	_prev_changed : false,
	_memory_storage : [],
	debugLevel : "info",
	log : function() {
		if (this.debugLevel == "debug") {
			var tmpStr = "";
			for ( var key in arguments) {
				tmpStr = tmpStr + " " + arguments[key];
			}
			console.info("  Melon :  " + tmpStr);
		}
	},

	_init : function(uri) {

		this.configUri = uri;
		this.log("========= melon SPA Framework initialize======== ");
		this.log("Cache:", this.cache);
		this.log("Memory:", this.memory);
		this.log("configUri:", this.configUri);
		this.log("================================================ ");
		var that = this;
		console.log(window.location.hash);

		this._getConfigFile(function () {
			that._initHashData(that._loadInit);
		});

	},

	_loadInit : function() {

		content.log("========= melon SPA Initial Page Load Request ======== ");
		content.log("initial_alias:", initial_alias);
		content.log("Cache:", content.cache);
		content.log("Memory:", content.memory);
		content.log("====================================================== ");

		content.load(initial_alias);
		var hash = location.hash.split("#").join("");
		if (hash == initial_alias) {
			content._runScript(hash);
		}
	},

	_getConfigFile : function(fn) {
		var thatFn = fn;
		var that = this;
		$.cachedScript(this.configUri).done(function(data) {
			eval(thatFn());
		});
	},


	_initHashData : function(fn) {
		var that = content;//this;
		var hash = location.hash.split("#").join("");

		$(window).bind('hashchange', function() {
			//var hash = location.hash.split("#").join("");
			var hash = location.hash.split("#").join("").split('?')[0];
			var hashConfiged = false;
			for ( var key in map_config) {
				if (hash == map_config[key]["alias"])
					hashConfiged = true;
			}
			if (hashConfiged) {
				if (that.loadedPage != null) {
					that._procHashData(hash);
				}
			}

		});

		//QQQ...
		//console.log('spa init...');
		var _that = this;
		var _nextJob = function() {
			if (initial_alias == hash || hash == "") {
				that.initState = true;
				eval(fn());
			} else {
				if (that.initState) {
					that._procHashData(hash);
				} else {
					var _tmpHashArr = window.location.hash.split("#");
					var _tmpExist = false;
					var _tmpCallBack = "";
					for (var key in _injection_map) {

						if (_injection_map[key]["alias"] == _tmpHashArr[1]) {
							_tmpExist = true;
							_tmpCallBack = _injection_map[key]["func"];
							//QQQ break;
							break;
						}

					}

					if (_tmpExist) {
						that._procHashData(_tmpHashArr[1]);
						var thatCallBack = [_tmpCallBack, _tmpHashArr[2]];
						setTimeout(function () {
							eval(thatCallBack[0] + "('" + thatCallBack[1] + "');");
						}, 500);
					}
				}
			}
		}

		var _wait = setInterval(function(){
			if(bWait === false){
				//console.log('spa idling clearing');
				clearTimeout(_wait);
				eval(_nextJob());
			}else {
				//console.log('spa idling--');
			}
		},10);
	},

	_procHashData : function(hash) {

		var _tmpHtml, _tmpJs;
		var config_base_html_path = base_config["contentHTMLDir"];
		var config_base_js_path = base_config["contentJSDir"];

		_tmpHtml = map_config[this._getConfigMap(hash)]["html"];
		_tmpJs = map_config[this._getConfigMap(hash)]["js"];

		if (hash == "" || hash == initial_alias) {
			hash == initial_alias
			config_base_html_path = initial_path;
			config_base_js_path = initial_path + "js";
		}
		//alert(_tmpHtml);
		this._getRemoteData(config_base_html_path + "/" + _tmpHtml, hash);
	},

	_getRemoteData : function(uri, hash) {

		var thatHash = hash;
		var that = this;

		if (!this.memory) {
			that._getData(uri, thatHash);
		} else {
			var _tmpLoadedState = false;
			var _tmpData = null;
			if (this._memory_storage.length > 0) {
				for ( var key in this._memory_storage) {
					if (this._memory_storage[key]["alias"] == thatHash) {
						_tmpLoadedState = true;
						_tmpData = this._memory_storage[key]["body"];
					}
				}
			}
			if (!_tmpLoadedState) {
				this._getData(uri, thatHash);
			} else {
				this._setMemData(_tmpData, thatHash);
			}
		}
	},

	_setMemData : function(data, hash) {
		var body = (data.split("<body>")[1]).split("</body>")[0];
		var save = $('div[data-detach="true"]').detach();

		$('body').empty().append(save);
		$("body").append(body);

		var tmp_title = (data.split("<title>")[1]).split("</title>")[0];
		$("title").empty();
		$("title").html(tmp_title);

		this._runScript(hash, true);
	},

	_getData : function(uri, hash) {

		var that = this;
		var thatHash = hash;
		$.getData(uri).done(function(data) {
			var body = (data.split("<body>")[1]).split("</body>")[0];
			var save = $('div[data-detach="true"]').detach();

			$('body').empty().append(save);
			$("body").append(body);

			var tmp_title = (data.split("<title>")[1]).split("</title>")[0];
			$("title").empty();
			$("title").html(tmp_title);

			that._runScript(thatHash);
			if (that.memory) {
				that._push_memdata(thatHash, data);
			}
		});
	},

	_push_memdata : function(alias, data) {
		this._memory_storage.push({
			"alias" : alias,
			"body" : data,
			"js" : ""
		});
	},

	load : function(alias, option) {

		if (option != null) {
			this.log("load option exist", option);
			this._prev_memory = this.memory;
			this._prev_cache = this.cache;
			this.memory = option["memory"];
			this.cache = option["cache"];
			this._prev_changed = true;
		}

		this.log("========= melon SPA Page Load Request ======== ");
		this.log("alias:", alias);
		this.log("Chache:", this.cache);
		this.log("Memory:", this.memory);
		this.log("====================================================== ");
		this._changeHash(map_config[this._getConfigMap(alias)]);
	},

	_changeHash : function(obj) {
		$(location).attr('href', window.location.pathname + '#' + obj["alias"]);
	},

	_runScript : function(alias, option) {

		var config_base_js_path = base_config["contentJSDir"];
		var that = this;

		if (alias == initial_alias) {
			config_base_js_path = initial_path + "js";
		}

		var thatAlias = alias;
		var thatOption = option;

		if (thatOption && that.memory) {
			for ( var key in this._memory_storage) {
				if (this._memory_storage[key]["alias"] == thatAlias) {
					eval(this._memory_storage[key]["js"]);
					this.loadedPage = thatAlias;
				}
			}
		} else {
			$
					.cachedScript(
							config_base_js_path
									+ "/"
									+ map_config[this._getConfigMap(alias)]["js"])
					.done(
							function(data) {
								that.loadedPage = thatAlias;
								if (option != true && that.memory) {
									for ( var key in that._memory_storage) {
										if (that._memory_storage[key]["alias"] == thatAlias) {
											that._memory_storage[key]["js"] = data;
										}
									}
								}
							});
		}

		if (this._prev_changed) {

			this.memory = this._prev_memory;
			this.cache = this._prev_cache;
			this._prev_changed = false;
		}

	},

	_getConfigMap : function(alias) {
		for ( var key in map_config) {
			if (map_config[key]["alias"] == alias) {
				return key;
			}
		}
	},

	attach : function(alias) {
		var thatAlias = alias;
		var that = this;
		if (this.subElement.indexOf(alias) > -1) {

		} else {
			$
					.getData(
							base_ele_config["contentHTMLDir"]
									+ "/"
									+ map_ele_config[this
											._getEleConfigMap(alias)]["html"],
							function(data) {
								if (map_ele_config[that
										._getEleConfigMap(thatAlias)]["prepend"]) {
									$("body")
											.prepend(
													"<div id = '"
															+ thatAlias
															+ "' data-detach = '"
															+ map_ele_config[that
																	._getEleConfigMap(thatAlias)]["detach"]
															+ "'>" + data
															+ "</div>");
								} else {
									$("body")
											.append(
													"<div id = '"
															+ thatAlias
															+ "' data-detach = '"
															+ map_ele_config[that
																	._getEleConfigMap(thatAlias)]["detach"]
															+ "'>" + data
															+ "</div>");
								}

								$
										.cachedScript(
												base_ele_config["contentJSDir"]
														+ "/"
														+ map_ele_config[that
																._getEleConfigMap(thatAlias)]["js"],
												function() {
													eval(map_ele_config[that
															._getEleConfigMap(thatAlias)]["startHandler"]
															+ "();");
												});
							});

			this.subElement.push(alias);
		}
	},

	remove : function(alias) {
		$("#" + alias).remove();
		this.subElement.splice(this.subElement.indexOf(alias), 1);

	},

	_getEleConfigMap : function(alias) {
		for ( var key in map_ele_config) {
			if (map_ele_config[key]["alias"] == alias) {
				return key;
			}
		}
	}

};

jQuery.getData = function(url, callback, options) {

	options = $.extend(options || {}, {
		dataType : "html",
		cache : content.cache,
		url : url
	});

	return jQuery.ajax(options).done(eval(callback));
};

jQuery.cachedScript = function(url, callback, options) {

	options = $.extend(options || {}, {
		dataType : "script",
		cache : content.cache,
		url : url
	});

	return jQuery.ajax(options).done(eval(callback));
};

function getParams(){
	var _hash = window.location.hash.split('#')[1], _tmpParam = '';
	var _params = [], _paramOut = {};
	if(_hash && _hash.indexOf('?')>-1){
		_tmpParam = _hash.split('?')[1];
	}

	if(_tmpParam !== '' && _tmpParam.indexOf('=') > -1){
		var _params = [];
		if(_tmpParam.indexOf('&')>-1){
			_params = _tmpParam.split('&');
		}else{
			_params.push(_tmpParam);
		}
		$.each(_params,function(i,o){
			var _pair = o.split('=');
			_paramOut[_pair[0]]=_pair[1];
		});
		//var _pair = _tmpParam.split('=');
		//_params[_pair[0]] = _pair[1];
	}
	return _paramOut;
}

function hasConfigured(_target){
	var hashConfiged = false;
	for ( var key in map_config) {
		if (_target === map_config[key]["alias"]) {
			hashConfiged = true;
			break;
		}
	}
	return hashConfiged;
}