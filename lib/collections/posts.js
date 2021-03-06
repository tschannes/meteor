Posts = new Mongo.Collection('posts');

Posts.allow({
	update: function(userId, post) {
		return ownsDocument(userId, post);
	},
	remove: function(userId, post) {
		return ownsDocument(userId, post);
	},
});

Posts.deny({
	update: function(userId, post, fieldNames) {
		// may only edit the following two fields:
		return (_.without(fieldNames, 'url', 'title', 'description').length > 0);
	}
});

/*Posts.allow({
	insert:function(userId,doc){
		return !! userId;
	}
});*/

validatePost = function(post) {
	var errors = {};

	if (!post.title)
		errors.title = "Please fill in a headline";

	if (!post.url)
		errors.url = "Please fill in a URL";

	if (!post.description)
		errors.description = "Please describe your URL!";

	return errors;
};

Meteor.methods({
	postInsert: function(postAttributes) {
		check(Meteor.userId(), String);
		check(postAttributes, {
			title: String,
			url: String,
			description: String
		});

		var errors = validatePost(postAttributes);
		if (errors.title || errors.url || errors.description)
			throw new Meteor.Error('invalid-post', "You must set a title, description and URL for your post");

		/*		if (Meteor.isServer) {
					postAttributes.title += "(server)";
					// wait for 5 seconds
					Meteor._sleepForMs(5000);
				} else {
					postAttributes.title += "(client)";
				}*/

		var postWithSameLink = Posts.findOne({
			url: postAttributes.url
		});
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			};
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			commentsCount: 0,
			submitted: new Date(),
			upvoters: [],
			votes: 0
		});
		var postId = Posts.insert(post);
		return {
			_id: postId
		};
	},
	upvote: function(postId) {
		check(this.userId, String);
		check(postId, String);

		/*var post = Posts.findOne(postId);
		if (!post)
			throw new Meteor.Error('invalid', 'Post not found');

		if (_.include(post.upvoters, this.userId))
			throw new Meteor.Error('invalid', 'Already upvoted this post');

		if(post.userId === this.userId)
			throw new Meteor.Error('You cannot upvote your own posts.');*/

		var affected = Posts.update({
			_id: postId,
			userId: {
				$ne: this.userId
			},
			upvoters: {
				$ne: this.userId
			}
		}, {
			$addToSet: {
				upvoters: this.userId
			},
			$inc: {
				votes: 1
			}
		});

		if (!affected)
			throw new Meteor.Error('invalid', "You weren't able to upvote that post");

		/*		Posts.update(post._id, {
					$addToSet: {
						upvoters: this.userId
					},
					$inc: {
						votes: 1
					}
				});*/
	}
});