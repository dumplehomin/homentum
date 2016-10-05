"use strict";
var setting_load = require("../ajax/ajax");
var Store = require("../storage/storage");
var Buttons = require("./button");
var _$content = _$.query(".content_container");
var Encryption = require("../encryption");

var _$setting_widget;

var _$setting_list;

var JSON = global.JSON;

var setting_html_url = "module/widget/setting.html";

module.exports = function(){
	setting_load.html( setting_html_url, setupSetting );
};

function setupSetting( data ){
	_$content.insertAdjacentHTML("beforeend", data);

	_$setting_widget = _$.query(".setting_widget");
	_$setting_widget.classList.add("on");

	var _$setting =  _$.query(".setting");
	_$setting_list = _$.query(".setting_list");
	Buttons( _$setting );

	settingButton();
	passwordChangeSetting();
	userReset();
}

function settingButton(){
	var setting_btn = _$.query(".setting>span");
	var _$setting_list = _$.query(".setting_list");
	var _$password = _$.query(".setting_password");

	_$.eventsOn( setting_btn, "click", function( event ){
		var _this = event.target;
		var _$show_list = _$.query(".show", _$setting_list);

		if( _$show_list ){
			_$show_list.classList.remove("show");
		}

		_$password.classList.add("show");
	});

	setupListBtn();
}

function setupListBtn(){
	var _$btn = _$.queryAll( ".btn", _$setting_list );

	_$.each( _$btn, function( btn, index ){
		_$.eventsOn( btn, "click", setupBtnClickHandler);
	});

	function setupBtnClickHandler( event ){
		var _$show_btn = _$.query(".show", _$setting_list);

		_$show_btn.classList.remove("show");
		event.target.parentNode.classList.add("show");
	}
}

function passwordChangeSetting(){
	var _$password_container = _$.query(".password_setting");
	var _$pass_btn = _$.query( "button", _$password_container );
	var _$password_input = _$.queryAll( "input", _$password_container );

	_$.eventsOn( _$pass_btn, "click", function( event ){
		var user_info;
		var current_password;
		var input_password;
		var de_password;
		var en_password;

		for( var t = 0; t < _$password_input.length; t++ ){
			if( _$password_input[t].value === "" ){
				classAddRemove( _$password_input[t], "add" );
				break;
			}else {
				classAddRemove( _$password_input[t], "remove" );
			}

			switch( t ){
				case 0 :
					user_info = Store.get("user");
					input_password = _$password_input[t].value;
					de_password = Encryption.de( user_info.password );

					if( input_password !== de_password ){
						classAddRemove( _$password_input[t], "add" );
						return false;
					}
				break;
				case 1 :
					current_password = _$password_input[t].value;
				break;
				case 2 :
					if( current_password !== _$password_input[t].value ){
						classAddRemove( _$password_input[1], "add" );
						return false;
					}else {
						en_password = Encryption.en( _$password_input[t].value );
						user_info.password = en_password;
						Store.del("user");
						Store.set( "user", user_info );
						_$.each( _$password_input, function( input, index ){
							input.value = "";
						});
						alert("Password Change Success");
					}
				break;
			}
		}
	});
}

function userReset(){
	var _$reset_container = _$.query(".reset_setting");
	var _$reset_btn = _$.query( "button", _$reset_container );
	var _$reset_input = _$.query( "input", _$reset_container );

	var user_info;
	var de_password;
	var input_password;

	_$.eventsOn( _$reset_btn, "click", function( event ){
		if( _$reset_input.value === "" ){
			classAddRemove( _$reset_input, "add" );
		}else {
			user_info = Store.get("user");
			input_password = _$reset_input.value;
			de_password = Encryption.de( user_info.password );

			if( input_password !== de_password ){
				classAddRemove( _$reset_input, "add" );
			}else {
				Store.del("user");
				alert("Reset User");
				global.location.reload(true);
			}
		}
	});
}

function classAddRemove( target, type ){
	target.parentNode.classList[type]("error");
}






















