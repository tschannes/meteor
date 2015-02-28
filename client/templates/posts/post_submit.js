Template.postSubmit.created = function() {
	Session.set('postSubmitErrors', {});
};

Template.postSubmit.helpers({
	errorMessage: function(field) {
		return Session.get('postSubmitErrors')[field];
	},
	errorClass: function(field) {
		return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
	}
});

Template.postSubmit.events({
	'submit form': function(e) {
		e.preventDefault();
		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val(),
			description: $(e.target).find('[name=description]').val()
		};

		var errors = validatePost(post);
		if (errors.title || errors.url || errors.description)
			return Session.set('postSubmitErrors', errors);

		Meteor.call('postInsert', post, function(error, result) {
			if (error) {
				/*return alert(error.message);*/
				return throwError(error.reason);
			}
			// show this result but route anyway
			if (result.postExists)
			/*alert('This link has already been posted');*/
				throwError('This link has already been posted!');

			//REDIRECTING
			Router.go('postPage', {
				_id: result._id
			});
		});

		/*post._id = Posts.insert(post);*/
	}
});