// jQuery plugin
$.fn.tmpl = function(tmplId, data) {
	var tmpl = doT.template($('#tmpl_' + tmplId).html());
	if (!$.isArray(data)) data = [data];

	return this.each(function() {
		var html = '';
		for (var itemIdx = 0; itemIdx < data.length; itemIdx++) {
			html += tmpl(data[itemIdx]);
		}
		$(this).html(html);
	});
};

jQuery(function ($) {

	/*==========  show/hide navigation  ==========*/
	$(".menu-trigger").on('click', function(){
		$(".nav-menu").fadeIn(300);
	});

	$(".dismiss-button").on('click', function(){
		$(".nav-menu").slideUp(300);
	});

	/*==========  main-slider  ==========*/
	var slideHeight = $(window).height();
	$('#home-slider .item').css('height',slideHeight);

	$(window).resize(function(){'use strict',
		$('#home-slider .item').css('height',slideHeight);
	});

	/*==========  Scroll Menu  ==========*/
	$(window).on('scroll', function(){
		if( $(window).scrollTop()>slideHeight ){
			$('.main-nav').addClass('main-nav-change');
		} else {
			$('.main-nav').removeClass('main-nav-change');
		}
	});

	/*==========  Progress Bar  ==========*/
	$('#our-skills').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$.each($('div.progress-bar'),function(){
				$(this).css('width', $(this).attr('data-valuetransitiongoal')+'%');
			});
			$(this).unbind('inview');
		}
	});

	/*==========  Initiat WOW JS  ==========*/
	new WOW().init();

	/*==========  client feedback   ==========*/
	$(document).ready(function () {
		if ($("#client-feedback").length) {
			var carousel = $("#client-feedback");

			carousel.owlCarousel({
				navigation:true,
				navigationText: [
					"<i class='fa-angle-left icon-nav'></i>",
					"<i class='fa-angle-right icon-nav'></i>"
				],
				itemsCustom: [
					[0,3]
				],
				afterAction: function(el){
					//remove class active
					this
						.$owlItems
						.removeClass('active')

						//add class active
						this
						.$owlItems //owl internal $ object containing items
						.eq(this.currentItem + 1)
						.addClass('active')
				}
			});
		}
	});

	$(function() {
		if ($("#book-certificates-slider").length) {
			$("#book-certificates-slider").owlCarousel({
				autoPlay: 3000,
				navigation:true,
				navigationText: [
					"<i class='fa-angle-left icon-nav'></i>",
					"<i class='fa-angle-right icon-nav'></i>"
				],
				items : 4,
				itemsDesktop : [1199,2],
				itemsDesktopSmall : [979,1]
			})
		};
	});

	/*==========  animate.css on hover  ==========*/
	function animationHover(element, animation){
		element = $(element);
		element.hover(
			function() {
				element.addClass('animated ' + animation);
			},
			function(){
			//wait for animation to finish before removing classes
			window.setTimeout( function(){
				element.removeClass('animated ' + animation);
			}, 2000);
		});
	}

	/*==========  Countdown  ==========*/
	$('#count-down').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$(this).find('.counter').each(function () {
				var $this = $(this);
				$({ Counter: 0 }).animate({ Counter: $this.text() }, {
					duration: 2000,
					easing: 'swing',
					step: function () {
						$this.text(Math.ceil(this.Counter));
					}
				});
			});
			$(this).unbind('inview');
		}
	});

	/*==========  isotope  ==========*/
	$(window).load(function(){'use strict';
		var $portfolio_selectors = $('.work-filter >li>a');
		var $portfolio = $('.all-work-items');

		if ($('.all-work-items').length) {
			$portfolio.isotope({
				itemSelector : '.work-item',
				layoutMode : 'fitRows'
			});
		};

		$portfolio_selectors.on('click', function(){
			$portfolio_selectors.removeClass('active');
			$(this).addClass('active');
			var selector = $(this).attr('data-filter');
			$portfolio.isotope({ filter: selector });
			return false;
		});
	});

	$(function() {
		if ($(".servise-icon").length ){
			$(".servise-icon").each(function(index, el) {
				var content = $(el).siblings('.webui-popover-content').html()
				$(el).webuiPopover({
					content: function  () {
						return content;
					}
				})
			});
		};
	});

	$(function() {
		if ($("a.popup-modal").length ){
			$('.popup-modal').magnificPopup({
				type: 'inline',
				preloader: false,
			});
		};

		if ($("#freewall").length ){
			var wall = new Freewall("#freewall");
			wall.reset({
				selector: '.brick',
				animate: true,
				cellW: 250,
				cellH: 'auto',
				onResize: function() {
					wall.fitWidth();
				}
			});
			wall.container.find('.brick img').load(function() {
				wall.fitWidth();
			});
			wall.fitWidth();
		}
	});
});


//скрываем прелоадер при загрузки страницы
$(window).on('load', function () {
	var $preloader = $('.preload-bg');

	$preloader.delay(350).fadeOut('slow');
});

// http://arhont.beta.indev-group.eu/api/v1/news/?period=1&page=1

$(function() {
	var currentDateItem = 1;
	var currentPageItem = 1;
	var nextPageItem = 1;
	var prevPageItem = 1;

	function getNewsItems(date, page) {
		if (!date) {throw new Error("Date argument not found!!!")}
		if (!page) {throw new Error("Date argument not found!!!")}

		$.ajax({
			url: 'http://private-4074d-zular.apiary-mock.com/request',
			type: 'GET',
			data: { period: date, page: page },
		})
		.done(function(data) {
			$('#container').tmpl('photo', data.results);

			nextPageItem = data.next;
			// currentPageItem = data.next + 1
			prevPageItem = data.previous;

			if (data.next == null && data.previous == null) {
				$("ul.pagination").hide()
			} else {
				$("ul.pagination").show()
				if (data.next) {
					$(".next-arrow").removeClass("disabled")
					$(".previous-arrow").addClass("disabled")
				} else if (data.previous) {
					$(".next-arrow").addClass("disabled")
					$(".previous-arrow").removeClass('disabled')
				}
			}
		});
	}

	if ($('.get-date-select').length) {
		$('.get-date-select').styler({
			onSelectClosed: function() {
				currentDateItem = $("select.get-date-select").val();
				console.log('currentDateItem', currentDateItem)

				getNewsItems(currentDateItem, currentPageItem);
			}
		});
	}

	$('.blog-pagination .next-arrow').on('click', function() {
		if ($(this).hasClass("disabled")) {return false}
		getNewsItems(currentDateItem, nextPageItem);
	})

	$('.blog-pagination .previous-arrow').on('click', function() {
		if ($(this).hasClass("disabled")) {return false}
		getNewsItems(currentDateItem, prevPageItem);
	})

	getNewsItems(currentDateItem, currentPageItem);
});

