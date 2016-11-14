$( function () {

	var apiUrl = mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php?action=pagecomments&format=json';

	/**
	 * @constructor
	 */
	function pageComments ( element ) {
		this.$element = element;
		this.$commentsList = null;
		this.init();
	}

	pageComments.prototype.init = function() {
		// Check user rights
		this.renderHeader();
		if( this.isAllowedToPost() ) {
			this.renderInput();
		}
		this.renderCommentsWrapper();
		// Load comments
		this.loadComments();
	};

	pageComments.prototype.renderHeader = function() {
		this.$element.append('<div class="right-comments-header">'+mw.msg('pagecomments-comments')+'</div>');
	};

	pageComments.prototype.renderCommentsWrapper = function() {
		this.$commentsList = $('<div class="right-comments-comments-list">Loading comments..</div>');
		this.$element.append( this.$commentsList );
	};

	pageComments.prototype.renderInput = function() {
		var templater = mw.template.get('ext.pagecomments.foo', 'comments_input.mustache');
		this.$element.append( templater.render() );
		this.$element.find('.right-comment-btn').bind('click', this.postComment.bind(this));
	};

	pageComments.prototype.isAllowedToPost = function() {
		return mw.config.get('wgUserId') > 0;
	};

	pageComments.prototype.loadComments = function() {
		var templater = mw.template.get('ext.pagecomments.foo', 'comment_new.mustache');
		var self  = this;
		this.clearList();
		$.get( apiUrl + '&do=pagecomments&page_id=' + mw.config.get('wgArticleId'), function(data) {
			if( data.pagecomments && data.pagecomments.comments.length ) {
				// Process comments
				$.each( data.pagecomments.comments, function(i, comment) {
					data.pagecomments.comments[i].created_at = moment.unix( parseInt( comment.created_at ) ).fromNow();
				});
				self.$commentsList.html( templater.render( data.pagecomments ) );
			}
		});
	};

	pageComments.prototype.clearList = function() {
		this.$commentsList.html('');
	};

	pageComments.prototype.postComment = function(e) {
		var text = this.$element.find('input').val();
		if( !text ) {
			return false;
		}
		var templater = mw.template.get('ext.pagecomments.foo', 'comment_new.mustache');
		var html = templater.render(
			{
				'comments': [
					{
						user_id: mw.config.get('wgUserId'),
						user_name: mw.config.get('wgUserName'),
						page_id: mw.config.get('wgArticleId'),
						comment: text,
						created_at: moment.unix(Date.now() / 1000).fromNow()
					}
				]
			}
		);
		this.$commentsList.prepend(html);
		$.get( apiUrl + '&do=addcomment&page_id=' + mw.config.get('wgArticleId') +'&comment=' + text );
		e.preventDefault();
		return false;
	};

	mw.pageComments = pageComments;

    // Clear up form
/*    if( $('.comments-popup-form').length ) {
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

    }*/

/*    $('#show-comments-link').unbind().click(function(e){

        $('.comments-popup-form').css('height', $(window).height() / 5 +'px' ).fadeIn();

        return false;
    });*/

});
