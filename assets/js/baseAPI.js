// 每次调用$.ajax()$.get $.post()的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
	// 在发起真正的Ajax的请求之前， 同一拼接请求的根路径
	options.url = 'http://ajax.frontend.itheima.net' + options.url
})