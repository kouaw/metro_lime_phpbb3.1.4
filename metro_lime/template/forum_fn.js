/**
* phpBB3 forum functions
*/

/**
* Find a member
*/
function find_username(url) {
	'use strict';

	popup(url, 760, 570, '_usersearch');
	return false;
}

/**
* Window popup
*/
function popup(url, width, height, name){
	'use strict';
	
	if (!name) {
		name = '_popup';
	}

	window.open(url.replace(/&amp;/g, '&'), name, 'height=' + height + ',resizable=yes,scrollbars=yes, width=' + width);
	return false;
}

/**
* Jump to page
*/
function function pageJump(item) {
	'use strict';

	var page = item.val(),
		perPage = item.attr('data-per-page'),
		baseUrl = item.attr('data-base-url'),
		startName = item.attr('data-start-name');

	if (page !== null && !isNaN(page) && page == Math.floor(page) && page > 0) {
		if (baseUrl.indexOf('?') === -1) {
			document.location.href = baseUrl + '?' + startName + '=' + ((page - 1) * perPage);
		} else {
			document.location.href = baseUrl.replace(/&amp;/g, '&') + '&' + startName + '=' + ((page - 1) * perPage);
		}
	}
}

/**
* Mark/unmark checklist
* id = ID of parent container, name = name prefix, state = state [true/false]
*/
function marklist(id, name, state){
	'use strict';

	var rb = parent.getElementsByTagName('input');
	
	jQuery('#' + id + ' input[type=checkbox][name]').each(function() {
		var $this = jQuery(this);
		if ($this.attr('name').substr(0, name.length) === name) {
			$this.prop('checked', state);
 		}
	});
}

/**
* Resize viewable area for attached image or topic review panel (possibly others to come)
* e = element
*/

function viewableArea(e, itself) {
	'use strict';

	if (!e) {
		return;
	}

	if (!itself) {
		e = e.parentNode;
	}
	
	if (!e.vaHeight) {
		// Store viewable area height before changing style to auto
		e.vaHeight = e.offsetHeight;
		e.vaMaxHeight = e.style.maxHeight;
		e.style.height = 'auto';
		e.style.maxHeight = 'none';
		e.style.overflow = 'visible';
	} else {
		// Restore viewable area height to the default
		e.style.height = e.vaHeight + 'px';
		e.style.overflow = 'auto';
		e.style.maxHeight = e.vaMaxHeight;
		e.vaHeight = false;
	}
}

/**
* Alternate display of subPanels
*/
jQuery(function($) {
	'use strict';
	var i, e, t;

	$('.sub-panels').each(function() {

		var $childNodes = $('a[data-subpanel]', this),
			panels = $childNodes.map(function () {
				return this.getAttribute('data-subpanel');
			}),
			showPanel = this.getAttribute('data-show-panel');

		if (panels.length) {
			activateSubPanel(showPanel, panels);
			$childNodes.click(function () {
				activateSubPanel(this.getAttribute('data-subpanel'), panels);
				return false;
			});
 		}
	});
});

/**
* Activate specific subPanel
*/
function activateSubPanel(p, panels) {
	'use strict';
	var i, showPanel;

	if (typeof(p) === 'string') {
		showPanel = p;
 	}
	$('input[name="show_panel"]').val(showPanel);
	
	if (typeof panels === 'undefined') {
		panels = jQuery('.sub-panels a[data-subpanel]').map(function() {
			return this.getAttribute('data-subpanel');
		});
	}
	
	for (i = 0; i < panels.length; i++) {
		jQuery('#' + panels[i]).css('display', panels[i] === showPanel ? 'block' : 'none');
		jQuery('#' + panels[i] + '-tab').toggleClass('activetab', panels[i] === showPanel);
	}
}

function selectCode(a){
	'use strict';
	
	// Get ID of code block
	var e = a.parentNode.parentNode.getElementsByTagName('CODE')[0];
	var s, r;
	
	// Not IE and IE9+
	if (window.getSelection) {
		s = window.getSelection();
		// Safari
		if (s.setBaseAndExtent) {
			var l = (e.innerText.length > 1) ? e.innerText.length - 1 : 1;
			s.setBaseAndExtent(e, 0, e, l);
		}
		// Firefox and Opera
		else
		{
			// workaround for bug # 42885
			if (window.opera && e.innerHTML.substring(e.innerHTML.length - 4) == '<BR>') {
				e.innerHTML = e.innerHTML + '&nbsp;';
			}

			r = document.createRange();
			r.selectNodeContents(e);
			s.removeAllRanges();
			s.addRange(r);
		}
	}
	// Some older browsers
	else if (document.getSelection) {
		s = document.getSelection();
		r = document.createRange();
		r.selectNodeContents(e);
		s.removeAllRanges();
		s.addRange(r);
	}
	// IE
	else if (document.selection) {
		r = document.body.createTextRange();
		r.moveToElementText(e);
		r.select();
	}
}

/**
* Play quicktime file by determining it's width/height
* from the displayed rectangle area
*/
function play_qt_file(obj) {
	'use strict';
	
	var rectangle = obj.GetRectangle();
	var width, height;
	
	if (rectangle) {
		rectangle = rectangle.split(',');
		var x1 = parseInt(rectangle[0], 10);
		var x2 = parseInt(rectangle[2], 10);
		var y1 = parseInt(rectangle[1], 10);
		var y2 = parseInt(rectangle[3], 10);

		width = (x1 < 0) ? (x1 * -1) + x2 : x2 - x1;
		height = (y1 < 0) ? (y1 * -1) + y2 : y2 - y1;
	}
	else
	{
		width = 200;
		height = 0;
	}

	obj.width = width;
	obj.height = height + 16;

	obj.SetControllerVisible(true);
	obj.Play();
}

var inAutocomplete = false;
var lastKeyEntered = '';

/**
* Check event key
*/
function phpbbCheckKey(event) {
	'use strict';

	// Keycode is array down or up?
	if (event.keyCode && (event.keyCode === 40 || event.keyCode === 38)) {
		inAutocomplete = true;
	}

	// Make sure we are not within an "autocompletion" field
	if (inAutocomplete) {
		// If return pressed and key changed we reset the autocompletion
		if (!lastKeyEntered || lastKeyEntered === event.which) {
			inAutocomplete = false;
			return true;
		}
	}

	// Keycode is not return, then return. ;)
	if (event.which !== 13) {
		lastKeyEntered = event.which;
		return true;
	}

	return false;
}

/**
* Apply onkeypress event for forcing default submit button on ENTER key press
*/
jQuery(function($) {
	'use strict';
	
	var result, element, i = 0, length = node.childNodes.length;

	$('form input[type=text], form input[type=password]').on('keypress', function (e) {
		var defaultButton = $(this).parents('form').find('input[type=submit].default-submit-action');
 
		if (!element || element.nodeType != 1) continue;

		if (!defaultButton || defaultButton.length <= 0) {
			return true;
 		}

		if (phpbbCheckKey(e)) {
			return true;
		}

		if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
			defaultButton.click();
			return false;
		}
		
		return true;
	});
});
 

/**
* Functions for user search popup
*/
function insertUser(formId, value) {
	'use strict';

	var $form = jQuery(formId),
		formName = $form.attr('data-form-name'),
		fieldName = $form.attr('data-field-name'),
		item = opener.document.forms[formName][fieldName];

	if (item.value.length && item.type == 'textarea') {
		value = item.value + '\n' + value;
	}

	item.value = value;
}

function insert_marked_users(formId, users) {
	'use strict';

	for (var i = 0; i < users.length; i++) {
		if (users[i].checked) {
			insertUser(formId, users[i].value);
		}
 	}

	window.close();
}

function insert_single_user(formId, user) {
	'use strict';

	insertUser(formId, user);
	window.close();
}

/**
* Usually used for onkeypress event, to submit a form on enter
*/
function submit_default_button(event, selector, class_name)
{
	// Add which for key events
	if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode))
		event.which = event.charCode || event.keyCode;

	if (phpbb_check_key(event))
		return true;

	var current = selector['parentNode'];

	// Search parent form element
	while (current && (!current.nodeName || current.nodeType != 1 || !is_node_name(current, 'form')) && current != document)
		current = current['parentNode'];

	// Find the input submit button with the class name
	//current = find_in_tree(current, 'input', 'submit', class_name);
	var input_tags = current.getElementsByTagName('input');
	current = false;

	for (var i = 0, element = input_tags[0]; i < input_tags.length; element = input_tags[++i])
	{
		if (element.type == 'submit' && is_in_array(class_name, (element.className || element).toString().split(/\s+/)) > -1)
			current = element;
	}

	if (!current)
		return true;

	// Submit form
	current.focus();
	current.click();
	return false;
}

/**
* Apply onkeypress event for forcing default submit button on ENTER key press
* The jQuery snippet used is based on http://greatwebguy.com/programming/dom/default-html-button-submit-on-enter-with-jquery/
* The non-jQuery code is a mimick of the jQuery code ;)
*/
function apply_onkeypress_event()
{
	// jQuery code in case jQuery is used
	if (jquery_present)
	{
		jQuery('form input[type=text], form input[type=password]').live('keypress', function (e)
		{
			var default_button = jQuery(this).parents('form').find('input[type=submit].default-submit-action');
			
			if (!default_button || default_button.length <= 0)
				return true;

			if (phpbb_check_key(e))
				return true;

			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13))
			{
				default_button.click();
				return false;
			}

			return true;
		});
	
		return;
	}

	var input_tags = document.getElementsByTagName('input');

	for (var i = 0, element = input_tags[0]; i < input_tags.length ; element = input_tags[++i])
	{
		if (element.type == 'text' || element.type == 'password')
		{
			// onkeydown is possible too
			element.onkeypress = function (evt) { submit_default_button((evt || window.event), this, 'default-submit-action'); };
		}
	}
}

/**
* Detect JQuery existance. We currently do not deliver it, but some styles do, so why not benefit from it. ;)
*/
var jquery_present = typeof jQuery == 'function';
