$(function () {
	// 切换到登录界面
	$('#link_reg').on('click', function () {
		$('.login-box').hide()
		$('.reg-box').show()
	})
	// 切换到注册界面
	$('#link_login').on('click', function () {
		$('.login-box').show()
		$('.reg-box').hide()
	})
	// 获取要操作的layui中的form模块
	var form = layui.form
	// 获取要操作的layui中的layer模块
	var layer = layui.layer
	// 添加自定义的校验规则
	form.verify({
		pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
		repwd: function (value) {
			var pwd = $('.reg-box [name=password]').val()
			if (pwd !== value) {
				// return layer.msg('两次结果不一样')
				// alert('两次结果不一样')
				return '两次结果不一样'
			}

		}
	})
	// 监听注册表单提交事件
	$('#form_reg').on('submit', function (e) {
		// 阻止表单默认提交行为
		e.preventDefault()
		var data = {
			username: $('#form_reg [name=username]').val(),
			password: $('#form_reg [name=password]').val(),
		}
		// 发起POST请求
		// $.post('/api/reguser', data, function (res) {
		// 	console.log(res);
		// })
		// 发起ajax的POST请求
		$.ajax({
			type: 'POST',
			url: '/api/reguser',
			data,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				layer.msg('注册成功，去登录！')
				$('#link_login').click()

			}
		})
	})
	// 监听登录表单提交事件
	$('#form_login').on('submit', function (e) {
		// 阻止默认提交行为
		e.preventDefault()
		$.ajax({
			url: '/api/login',
			type: 'POST',
			data: $(this).serialize(),
			success: function (res) {
				console.log(res);
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				console.log(res.token);
				layer.msg(res.message)
				// 将服务器返回的用户唯一标识 保存到本地存储
				localStorage.setItem('token', res.token)
				// 跳转到后台主页
				location.href = '/index.html'
			}
		})
	})
})