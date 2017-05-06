require('enyo');

/**
* Contains the declaration for the {@link module:enyo/AjaxSource~AjaxSource} kind.
* @module enyo/AjaxSource
*/

var
	kind = require('./kind');

var
	XhrSource = require('./XhrSource'),
	Ajax = require('./Ajax'),
	States = require('./States'),
	AjaxProperties = require('./AjaxProperties');

/**
* An all-purpose [Ajax]{@glossary ajax} [source]{@link module:enyo/Source~Source} designed to communicate
* with REST-ful API backends.
*
* @class AjaxSource
* @extends module:enyo/XhrSource~XhrSource
* @public
*/
module.exports = kind(
	/** @lends module:enyo/AjaxSource~AjaxSource.prototype */ {
	
	name: 'enyo.AjaxSource',
	
	/**
	* @private
	*/
	kind: XhrSource,
	
	/**
	* @see module:enyo/XhrSource~XhrSource#requestKind
	* @default module:enyo/Ajax~Ajax
	* @public
	*/
	requestKind: Ajax,
	
	/**
	* @private
	*/

	
	/**
	* An [array]{@glossary Array} of the keys that will be used for the options passed to
	* the [requestKind]{@link module:enyo/XhrSource~XhrSource#requestKind}.
	*
	* @see module:enyo/AjaxProperties
	* @type {String[]}
	* @readonly
	* @public
	*/
	allowed: Object.keys(AjaxProperties),
	
	/**
	* Implementation of {@link module:enyo/Source~Source#fetch}.
	*
	* @see module:enyo/Source~Source#fetch
	* @public
	*/
	fetch: function (model, opts) {
		opts.method = 'GET';
		opts.url = this.buildUrl(model, opts);
		this.go(opts);
	},
	
	/**
	* Implementation of {@link module:enyo/Source~Source#commit}.
	*
	* @see module:enyo/Source~Source#commit
	* @public
	*/
	commit: function (model, opts) {
		opts.method = (model.status & States.NEW) ? 'POST': 'PUT';
    //BB TEMP LOG
    console.log('In AjaxSource commit: method shoudl be ' + opts.method);
    //BB Assign the status we deferred in Model and Collection
    if (typeof opts.nextStatus !== "undefined"){
      if (typeof model.map !== "undefined") { //BB It should be a Collection
        model.set('status', opts.nextStatus); //BB using set as in Collection.js
      }
      else {
        model.status = opts.nextStatus; //BB Direct assignment as in Model.js
      }
    }
		opts.url = this.buildUrl(model, opts);
		opts.postBody = opts.postBody || model.toJSON();
		this.go(opts);
	},
	
	/**
	* Implementation of {@link module:enyo/Source~Source#destroy}.
	*
	* @see module:enyo/Source~Source#destroy
	* @public
	*/
	destroy: function (model, opts) {
		opts.method = 'DELETE';
		opts.url = this.buildUrl(model, opts);
		this.go(opts);
	}
});
