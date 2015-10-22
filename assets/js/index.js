var url = '';
var author = '';
var story = '';
var description = '';
var parameters = {};
var reponses = '';
var createEditor;

function stringifyJSON(json) {
	return JSON.stringify(json, null, 4);
}

// remove parameter line
function remove(elm) {
	$(elm).closest('.parameters-item').remove();
}

// concat url
function concatUrl(obj) {
	var url = '';

	obj.each(function (i) {
		var shortCut = $(this).val();
		if (shortCut) {
			url += shortCut + '\/';
		}
	});

	return url;
}

// validate
function validate() {
	var params = $('.create-parameters li');
	var urlObjs = $('.url-control input');
	
	url = concatUrl(urlObjs);
	author = $('#author').val();
	story = $('#story').val();
	description = $('#description').val();
	reponses = createEditor.getValue();

	// check url
	if (url === '') {
		$('.form-url .err-msg').html('Url must be required');
		$(urlObjs[0]).focus();
		return false;
	}

	// reponses = format(reponses);
	if (reponses === '') {
		$('.form-response .err-msg').html('Response must be required');
		return false;
	}
	else {
		// check syntax for ace editor
		if ($('.ace_error').length > 0) {
			$('.form-response .err-msg').html('Please check your syntax');
			return false;
		}
		else {
			reponses = JSON.parse(reponses);
		}
	}

	params.each(function (i) {
		var key = '';
		var value = '';
		var inputObjs = $(this).find('input');

		key = $(inputObjs[0]).val();
		value = $(inputObjs[1]).val();
		parameters[key] = value;
	});

	return true;
}

// count down
function countDown(elm ,count) {
	$('#' + elm).html(count);
	(function time() {
		count--;
		var t = setTimeout(time, 1000);
		$('#' + elm).html(count);
		if (count <= 0) {
			window.location.reload();
			clearTimeout(t);
		}
	})();
}

(function ($) {
	var editor = ace.edit("editor");
	createEditor = ace.edit('createEditor');

	// remove warning of acejs
	editor.$blockScrolling = Infinity;

	// set options for editor in retrieve tab
    editor.setTheme("ace/theme/xcode");
    editor.session.setMode("ace/mode/json");
    editor.setOptions({
    	fontSize: '14px'
    });
    editor.setReadOnly(true);
    

    // set options for editor in create tab
    createEditor.setTheme("ace/theme/xcode");
    createEditor.session.setMode("ace/mode/json");
    createEditor.setOptions({
    	fontSize: '14px'
    });

    // init tooltip 
    $('[data-toggle="tooltip"]').tooltip();

    // change the condition for search
    $('.dropdown-menu li a').on('click', function () {
    	var key = $(this).attr('data-key');
    	var value = $(this).text();
    	var $key = $('#key');
    	var $request = $('#request');

    	$key.attr('data-key', key);
    	$key.text(value);
    	$request.val('');
    	$request.attr('placeholder', 'Please enter ' + key + ' here');
    });

    // 
	$('.url-control').keyup(function () {
		var url = '';
		var urlObjs = $('.url-control input');

		url = concatUrl(urlObjs);
		$('#urlTooptip').attr('title', url);
		$('#urlTooptip').attr('data-original-title', url);
	});

	$('#send').click(function () {
		$('#success').hide();
		$('#failed').hide();
		$('#waiting').show();

		var request = $('#request').val();
		var key = $('#key').attr('data-key');

		console.log(key + request);

		$.get('/search', {key: key, request: request}, function (data, status, xhr) {
			$('#waiting').hide();
			if (data) {
				$('#success').show();
				editor.setValue(stringifyJSON(data));
				$('#status').html(xhr.status + ' ' + xhr.statusText);
			}
			else {
				$('#failed').show();
			}
		}, 'json');
	});

	$('#reset').click(function () {
		$('#success').hide();
		$('#failed').hide();
		$('#waiting').hide();
		$('#request').val('');
	});

	$('#createReset').click(function () {
		$('.form-group input').val('');
		$('.form-group textarea').val('');
		createEditor.setValue('');
		$('#url').focus();
	});

	var urlHtml = '<input type="text" class="form-control" placeholder="Home">\n';

	$('#addUrl').click(function (e) {
		$(this).before(urlHtml);
	});

	var paraHtml = ''
		+ '<li class="parameters-item">'
		+ '<div class="form-inline form-width">'
		+ '<input type="text" class="form-control" id="parameter" name="parameter" placeholder="Parameter">\n'
		+ '<input type="text" class="form-control" id="description" name="description" placeholder="Description">\n'
		+ '<button class="btn btn-danger" onclick="remove(this);">'
		+ '<span class="glyphicon glyphicon-remove"></span>'
		+ '</button>'
		+ '</div>'
		+ '</li>';

	$('#add').click(function () {
		$('.create-parameters').append(paraHtml); 
	});

	// remove err-msg
	// $('#url').keyup(function () {
	// 	$('.err-msg').html('');
	// });

	// submit in create
	$('#createSubmit').click(function () {
		if (validate()) {
			var $btn = $(this).button('loading');
			$.get('/create', {
				url: url,
				author: author,
				story: story,
				description: description || '暂无描述信息',
				parameters: parameters,
				reponses: reponses
			}, function (data) {
				if (data.success) {
					var count = 5;
					$('#successDialog').modal();
					countDown('count', count);
				}
				else {
					var count = 5;
					$('#failedDialog').modal();
					countDown('count', count);
				}
			}, 'json');
		}
	});

	$('.close-modal').click(function () {
		window.location.reload();
	});

})(jQuery);