Template.layout.helpers({
	pageTitle:function(){return Session.get('pageTitle');}
});
Template.layout.rendered = function() {
  this.find('#main')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  }
}