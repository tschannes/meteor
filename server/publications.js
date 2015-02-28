Meteor.publish('posts',function(){
	return Posts.find();
});

/*Meteor.publish('comments', function() {
  return Comments.find();
});*/

Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});