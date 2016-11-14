$(function(){

	console.log('Comments initialized.');
	if( $('.right-col-comments-block').length ) {
		new mw.pageComments( $('.right-col-comments-block') );
	}

});