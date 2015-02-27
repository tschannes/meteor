Template.postSubmit.events({
	'submit form': function(e) {
		e.preventDefault();
		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val(),
			description: $(e.target).find('[name=description]').val()
		};

		Meteor.call('postInsert', post, function(error, result) {
			if (error) {
				return alert(error.message);
			}
			// show this result but route anyway
			if (result.postExists)
				alert('This link has already been posted');

			//REDIRECTING
			Router.go('postPage', {
				_id: result._id
			});
		});

		/*post._id = Posts.insert(post);*/
	}
});