function add_design(tag_mdl, class_mdl, addclass_mdl) {
	var elements = document.getElementsByTagName(tag_mdl);
	var len = elements.length;
	for (var i = 0; i < len; i++) {
		if (elements[i].className === "mdl-card__title-text") {
			elements[i].classList.add(addclass_mdl);
		}
	}
}

add_design("h2", "mdl-card__title-text", "mdl-color-text--white");
(function() {
  'use strict';

  /**
   * Class constructor for Snackbar MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialSnackbar = function MaterialSnackbar(element) {
    this.element_ = element;
    this.active = false;
    this.init();
  };
  window['MaterialSnackbar'] = MaterialSnackbar;

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialSnackbar.prototype.cssClasses_ = {
    SNACKBAR: 'mdl-snackbar',
    MESSAGE: 'mdl-snackbar__text',
    ACTION: 'mdl-snackbar__action',
    ACTIVE: 'is-active'
  };

  /**
   * Create the internal snackbar markup.
   *
   * @private
   */
  MaterialSnackbar.prototype.createSnackbar_ = function() {
    this.snackbarElement_ = document.createElement('div');
    this.textElement_ = document.createElement('div');
    this.snackbarElement_.classList.add(this.cssClasses_.SNACKBAR);
    this.textElement_.classList.add(this.cssClasses_.MESSAGE);
    this.snackbarElement_.appendChild(this.textElement_);
    this.snackbarElement_.setAttribute('aria-hidden', true);

    if (this.actionHandler_) {
      this.actionElement_ = document.createElement('button');
      this.actionElement_.type = 'button';
      this.actionElement_.classList.add(this.cssClasses_.ACTION);
      this.actionElement_.textContent = this.actionText_;
      this.snackbarElement_.appendChild(this.actionElement_);
      this.actionElement_.addEventListener('click', this.actionHandler_);
    }

    this.element_.appendChild(this.snackbarElement_);
    this.textElement_.textContent = this.message_;
    this.snackbarElement_.classList.add(this.cssClasses_.ACTIVE);
    this.snackbarElement_.setAttribute('aria-hidden', false);
    setTimeout(this.cleanup_.bind(this), this.timeout_);

  };

  /**
   * Remove the internal snackbar markup.
   *
   * @private
   */
  MaterialSnackbar.prototype.removeSnackbar_ = function() {
    if (this.actionElement_ && this.actionElement_.parentNode) {
      this.actionElement_.parentNode.removeChild(this.actionElement_);
    }
    this.textElement_.parentNode.removeChild(this.textElement_);
    this.snackbarElement_.parentNode.removeChild(this.snackbarElement_);
  };

  /**
   * Create the internal snackbar markup.
   *
   * @param {Object} data The data for the notification.
   * @public
   */
  MaterialSnackbar.prototype.showSnackbar = function(data) {
    if (data === undefined) {
      throw new Error(
        'Please provide a data object with at least a message to display.');
    }
    if (data['message'] === undefined) {
      throw new Error('Please provide a message to be displayed.');
    }
    if (data['actionHandler'] && !data['actionText']) {
      throw new Error('Please provide action text with the handler.');
    }
    if (this.active) {
      this.queuedNotifications_.push(data);
    } else {
      this.active = true;
      this.message_ = data['message'];
      if (data['timeout']) {
        this.timeout_ = data['timeout'];
      } else {
        this.timeout_ = 8000;
      }
      if (data['actionHandler']) {
        this.actionHandler_ = data['actionHandler'];
      }
      if (data['actionText']) {
        this.actionText_ = data['actionText'];
      }
      this.createSnackbar_();
    }
  };
  MaterialSnackbar.prototype['showSnackbar'] = MaterialSnackbar.prototype.showSnackbar;

  /**
   * Check if the queue has items within it.
   * If it does, display the next entry.
   *
   * @private
   */
  MaterialSnackbar.prototype.checkQueue_ = function() {
    if (this.queuedNotifications_.length > 0) {
      this.showSnackbar(this.queuedNotifications_.shift());
    }
  };

  /**
   * Cleanup the snackbar event listeners and accessiblity attributes.
   *
   * @private
   */
  MaterialSnackbar.prototype.cleanup_ = function() {
    this.snackbarElement_.classList.remove(this.cssClasses_.ACTIVE);
    this.snackbarElement_.setAttribute('aria-hidden', true);
    if (this.actionElement_) {
      this.actionElement_.removeEventListener('click', this.actionHandler_);
    }
    this.setDefaults_();
    this.active = false;
    this.removeSnackbar_();
    this.checkQueue_();
  };

  /**
   * Clean properties to avoid one entry affecting another.
   *
   * @private
   */
  MaterialSnackbar.prototype.setDefaults_ = function() {
    this.actionHandler_ = undefined;
    this.message_ = undefined;
    this.actionText_ = undefined;
  };

  /**
   * Initialize the object.
   *
   * @public
   */
  MaterialSnackbar.prototype.init = function() {
    this.setDefaults_();
    this.queuedNotifications_ = [];
  };
  MaterialSnackbar.prototype['init'] = MaterialSnackbar.prototype.init;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialSnackbar,
    classAsString: 'MaterialSnackbar',
    cssClass: 'mdl-js-snackbar',
    widget: true
  });

})();
