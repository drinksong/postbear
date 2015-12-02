var GLOBAL = {};

// 对json格式化
function stringifyJSON(json) {
    if (typeof json === 'object') {
        return JSON.stringify(json, null, 4);
    }
	else {
        return JSON.stringify($.parseJSON(json), null, 4);
    }
}

// remove parameter line
function removeItem(elm) {
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
	
	GLOBAL.url = concatUrl(urlObjs);
	GLOBAL.author = $('#author').val();
	GLOBAL.story = $('#story').val();
	GLOBAL.description = $('#description').val();
	GLOBAL.responses = GLOBAL.createEditor.getValue();

    // check url
	if (!GLOBAL.url) {
		$('.form-url .err-msg').html('Url must be required');
		$(urlObjs[0]).focus();
		return false;
	}

	// responses = format(responses);
	if (!GLOBAL.responses || GLOBAL.responses.replace(/\s/g, '') === '{}') {
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
			GLOBAL.responses = JSON.parse(GLOBAL.responses);
		}
	}

	params.each(function (i) {
		var key = '';
		var value = '';
		var inputObjs = $(this).find('input');
		GLOBAL.parameters = {};

		key = $(inputObjs[0]).val();
		value = $(inputObjs[1]).val();
		GLOBAL.parameters[key] = value;
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
	var editor = ace.edit('editor');
	GLOBAL.createEditor = ace.edit('createEditor');

	// remove warning of acejs
	editor.$blockScrolling = Infinity;
    GLOBAL.createEditor.$blockScrolling = Infinity;

	// set options for editor in retrieve tab
    editor.setTheme("ace/theme/xcode");
    editor.session.setMode("ace/mode/json");
    editor.setOptions({
    	fontSize: '14px'
    });
    editor.setReadOnly(true);
    

    // set options for editor in create tab
    GLOBAL.createEditor.setTheme("ace/theme/xcode");
    GLOBAL.createEditor.session.setMode("ace/mode/json");
    GLOBAL.createEditor.setOptions({
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
        var $urlToolTip = $('#urlTooltip');

		url = concatUrl(urlObjs);
        $urlToolTip.attr('title', url);
        $urlToolTip.attr('data-original-title', url);
	});

    var tpl = ''
        + '<% for (var i = 0; i < data.length; i ++) { %>'
        + '<tr>'
        +    '<td><%= i+1 %></td>'
        +    '<td><%= data[i].author %></td>'
        +    '<td><%= data[i].story %></td>'
        +    '<td title="<%= data[i].description %>"><%= data[i].description %></td>'
        +    '<% data[i].responses = JSON.stringify(data[i].responses) %>'
        +    '<td>'
        +        '<div class="response-edit l"  data-responses="<%= data[i].responses %>">'
        +            '<span class="glyphicon glyphicon-eye-open"></span>'
        +        '</div>'
        +    '<% data[i].responses = JSON.parse(data[i].responses); %>'
        +    '<% var timestamp = data[i].timestamp; delete data[i].timestamp; data[i] = JSON.stringify(data[i]); %>'
        +        '<div class="response-edit l"  data-responses="<%= data[i] %>" data-id="<%= timestamp %>">'
        +            '<span class="glyphicon glyphicon-pencil"></span>'
        +        '</div>'
        +        '<div class="response-edit l">'
        +            '<span class="glyphicon glyphicon-trash"></span>'
        +        '</div>'
        +    '</td>'
        +    '</tr>'
        + '<% } %>';

	// click send for retrieve
	$('#send').click(function () {
		$('#successEidtor').hide();
        $('#successTable').hide();
		$('#failed').hide();
		$('#waiting').show();

		var request = $('#request').val();
		var key = $('#key').attr('data-key');


		$.get('/search', {key: key, request: request}, function (data, status, xhr) {
			$('#waiting').hide();
            GLOBAL.data = '';
			if (data.length) {
                if (data.length === 1) {
                    $('#successEidtor').show();
                    GLOBAL.id = data[0].timestamp;
                    delete data[0].timestamp;
                    GLOBAL.data = stringifyJSON(data[0]);

                    var responses = stringifyJSON(data[0].responses);

                    editor.setValue(responses);
                }
				else {
                    $('#successTable').show();
                    var html = ejs.render(tpl, {
                        data: data
                    });

                    $('.table tbody').empty().append(html);
                }
			}
			else {
				$('#failed').show();
			}
		}, 'json');
	});

    $('.response-preview').on('click', '.glyphicon-pencil', function (e) {
        $('#editDialog').modal();
        var $commit = $('#commit');
        var $errMsg = $('.edit-dialog .err-msg');

        $commit.css('visibility', '');
        $errMsg.css('visibility', '');

        GLOBAL.editEditor = ace.edit("editEditor");
        GLOBAL.editEditor.setTheme("ace/theme/xcode");
        GLOBAL.editEditor.session.setMode("ace/mode/json");
        GLOBAL.editEditor.setOptions({
            fontSize: '14px'
        });
        GLOBAL.editEditor.setReadOnly(false);

        if (GLOBAL.data) {
            GLOBAL.editEditor.setValue(GLOBAL.data);
        }
        else {
            var target = e.target;
            var targetTd = $(target).closest('div');
            var responses = $(targetTd).attr('data-responses');

            GLOBAL.id = $(targetTd).attr('data-id');
            responses = stringifyJSON(responses);
            GLOBAL.editEditor.setValue(responses);
        }
    });

	$('.response-preview').on('click', '.glyphicon-eye-open', function (e) {
		$('#editDialog').modal();
        var $commit = $('#commit');
        var $errMsg = $('.edit-dialog .err-msg');

        $commit.css('visibility', 'hidden');
        $errMsg.css('visibility', 'hidden');

		GLOBAL.editEditor = ace.edit("editEditor");
		GLOBAL.editEditor.setTheme("ace/theme/xcode");
    	GLOBAL.editEditor.session.setMode("ace/mode/json");
    	GLOBAL.editEditor.setOptions({
	    	fontSize: '14px'
	    });
        GLOBAL.editEditor.setReadOnly(true);

        var target = e.target;
        var targetTd = $(target).closest('div');
        var responses = $(targetTd).attr('data-responses');

        responses = stringifyJSON(responses);
        GLOBAL.editEditor.setValue(responses);

	});

	// commit
	$('#commit').click(function () {
		var editContent = GLOBAL.editEditor.getValue();
        editContent = editContent.replace(/\s/g, '');

		if (!editContent || editContent === '{}') {
			$('.edit-dialog .err-msg').html('Responses must be required');
			return false;
		}
		else {
			// check syntax for ace editor
			if ($('.edit-dialog .ace_error').length > 0) {
				$('.edit-dialog .err-msg').html('Please check your syntax');
				return false;
			}
			else {
				//console.log($.parseJSON(GLOBAL.editEditor.getValue()));
                var newObject = $.parseJSON(GLOBAL.editEditor.getValue());
                var count = 5;
                newObject.timestamp = GLOBAL.id;
                $.get('/updateRecord', newObject, function (data) {
                    if (data.success) {
                        $('#editDialog').modal('hide');
                        $('#successDialog').modal();
                        countDown('count', count);
                    }
                    else {
                        $('#editDialog').modal('hide');
                        $('#failedDialog').modal();
                        countDown('count', count);
                    }
                }, 'json');
			}
		}

	});

	// reset in retrieve
	$('#reset').click(function () {
		$('#successEidtor').hide();
        $('#successTable').hide();
		$('#failed').hide();
		$('#waiting').hide();
		$('#request').val('');
	});

	// reset in create
	$('#createReset').click(function () {
		$('.form-group input').val('');
		$('.form-group textarea').val('');
		GLOBAL.createEditor.setValue('');
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
		+ '<button class="btn btn-danger" onclick="removeItem(this);">'
		+ '<span class="glyphicon glyphicon-remove"></span>'
		+ '</button>'
		+ '</div>'
		+ '</li>';

	$('#add').click(function () {
		$('.create-parameters').append(paraHtml); 
	});

	// submit in create
	$('#createSubmit').click(function () {
		if (validate()) {
			var $btn = $(this).button('loading');
            var count = 5;
            var timestamp = new Date().getTime();

			$.get('/create', {
				url: GLOBAL.url,
				author: GLOBAL.author,
				story: GLOBAL.story,
				description: GLOBAL.description || '暂无描述信息',
				parameters: GLOBAL.parameters,
				responses: GLOBAL.responses,
                timestamp: timestamp
			}, function (data) {
				if (data.success) {
					$('#successDialog').modal();
					countDown('count', count);
				}
				else {
					$('#failedDialog').modal();
					countDown('count', count);
				}
			}, 'json');
		}
	});

	$('.success-dialog-close').click(function () {
		window.location.reload();
	});

})(jQuery);