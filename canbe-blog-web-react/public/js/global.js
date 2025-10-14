$(function(){
	/*顶部下拉菜单*/
	$('.nav li').hover(function(){
		$(this).addClass('on').children('ul').addClass('show');
	},function(){
		$(this).removeClass('on').children('ul').removeClass('show');
	});
	/*搜索框*/
	$('.schBtn').click(function(){
		$('.search').fadeToggle(0);
		$('.navBtn, .nav').removeClass('open');
	});
	/*手机导航按钮*/
	$('.navBtn').click(function(){
		$(this).toggleClass('open');
		$('body, .nav').toggleClass('open');
		$('.search').removeAttr('style');
	});
	
	/*手机下拉菜单*/
	$('.nav li em').click(function(){
		$(this).toggleClass('open').siblings('ul').toggleClass('open').parent().siblings('li').children('em').removeClass('open').siblings('ul').removeClass('open');
	});	
	/*首页幻灯片*/
	if($('#slides').length > 0){
		$("#slides").on('initialize.owl.carousel initialized.owl.carousel ',
		function(e) {
			$('div.load').remove();                 
		});
		$('#slides').owlCarousel({
			items:1,
			loop:true, 
			mouseDrag:true,
			autoplay:true,
			nav:true,	
			dots:false
		}); 
	}
});