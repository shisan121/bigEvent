// 每次调用$.ajax()$.get $.post()的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
	// 在发起真正的Ajax的请求之前， 同一拼接请求的根路径

	options.url = 'http://ajax.frontend.itheima.net' + options.url
	// 统一为有权限的接口，设置headers请求头
	if (options.url.indexOf('/my/') !== -1) {
		options.headers = {
			Authorization: localStorage.getItem('token') || ''
		}
	}
	// 设置访问权限，全局统一挂载complete回调函数
	options.complete = function (res) {
		// 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
		if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
			// 清空token
			localStorage.removeItem('token')
			// 跳转到登录界面
			location.href = '/login.html'
		}
	}
})