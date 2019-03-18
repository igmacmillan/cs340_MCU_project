function deleteWeaponPower(wid, pid){
	$.ajax({
		url: '/weapons/' + wid + '/' + pid, 
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};