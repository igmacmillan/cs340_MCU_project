function updatechar(id){
	$.ajax({
		url: '/characters/' + id,
		type: 'PUT',
		data: $('#update_character_form').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};