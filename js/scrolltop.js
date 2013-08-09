(function($){
	$.fn.ScrollTop = function(options) {

		var defaults = {
			text: 'Back To Top',
			ID: 'back-to-top',
			minHeight: 200,
			inDelay: 500,
			outDelay: 400,
			skins: 'skin-1',
			easingType: 'easing-1'
		},
			settings = $.extend(defaults, options),
			containerID = '#' + settings.ID;

		$('body').append('<a href="#" id="'+settings.ID+'">'+settings.text+'</a>');
		$(containerID).addClass(settings.skins)
		.hide()
		.on('click', function(){
			pos = $(window).scrollTop();
			$("body").css({
				"margin-top": -pos+"px",
				"overflow-y": "scroll",
			});
			$(window).scrollTop(0);
			$("body").addClass(settings.easingType).css("margin-top","0")
					.on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd",function(){
						$(this).removeClass(settings.easingType);
					});
			return false;
		});


		$(window).scroll(function(){
			if($(this).scrollTop() > settings.minHeight) {
				$(containerID).fadeIn(settings.inDelay);
			}else {
				$(containerID).fadeOut(settings.outDelay);
			}
		});
	}
})(jQuery);