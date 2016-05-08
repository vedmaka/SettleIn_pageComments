$( function () {

    // Clear up form
    if( $('.comments-popup-form').length ) {
        var $commentsContainer = $('.comments-popup-form .comments-list > ul');
        $commentsContainer.html(''); // Clear up container

        // Load comments for page
        // TODO: ...
        var apiUrl = mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php?action=pagecomments&format=json';
        var termplater = mw.template.get('ext.pagecomments.foo', 'comment.mustache');

        $.get( apiUrl + '&do=pagecomments&page_id=' + mw.config.get('wgArticleId'), function(data) {
            var comments = data.pagecomments.comments;
            if( comments.length ) {
                // Process comments
                $.each( comments, function(i, comment) {
                    comment.created_at = moment.unix( parseInt( comment.created_at ) ).fromNow();
                    var html = termplater.render( comment );
                    $commentsContainer.append( html );
                })
            }
        });

        if( mw.config.get('wgUserId') ) {
            $('.comments-popup-form .form-group .btn-primary').click(function(e){
                var $text = $(this).parent().find('input.form-control');
                if( !$text.val() ) {
                    return false;
                }
                var html = termplater.render( {
                    user_id: mw.config.get('wgUserId'),
                    user_name: mw.config.get('wgUserName'),
                    page_id: mw.config.get('wgArticleId'),
                    comment: $text.val(),
                    created_at: moment.unix( Date.now() / 1000 ).fromNow()
                } );
                $commentsContainer.prepend( html );
                $.get( apiUrl + '&do=addcomment&page_id=' + mw.config.get('wgArticleId') +'&comment=' + $text.val() );
                $text.val('');
                e.preventDefault();
                return false;
            });
        }else{
            $('.comments-popup-form .form-group').html( mw.msg('pagecomments-error-unathorized') );
        }

    }

/*    $('#show-comments-link').unbind().click(function(e){

        $('.comments-popup-form').css('height', $(window).height() / 5 +'px' ).fadeIn();

        return false;
    });*/

});
