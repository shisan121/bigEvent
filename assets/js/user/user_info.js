$(function () {
	// 获取表单模块
	const form = layui.form
	const layer = layui.layer
	// 自定义昵称的校验规则
	form.verify({
		nickname: function (value) {
			if (value.length > 6 || value.length < 1) {
				return '昵称长度必须在 1 ~ 6 个字符之间'
			}
		}
	})
	// 获取用户基本信息
	getUserInfo()

	function getUserInfo() {
		$.ajax({
			url: '/my/userinfo',
			method: 'GET',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取用户信息失败')
				}
				console.log(res);
				// 调用 form.val() 快速为表单赋值
				form.val('formUserInfo', res.data)
			}
		})
	}
	// 重置表单的数据
	$('#btnReset').on('click', function (e) {
		e.preventDefault()
		// initUserInfo()
		getUserInfo()
	})
	// 监听表单的提交事件
	$('.layui-form').on('submit', function (e) {
		// 阻止表单的默认提交行为
		e.preventDefault()
		// 发起ajax数据请求
		$.ajax({
			url: '/my/userinfo',
			method: 'POST',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('更新用户信息失败！')
				}
				layer.msg('更新用户信息成功！')
				// 调用父页面index.html中的方法，重新渲染用户的头像和昵称等信息
				window.parent.getUserInfo()
			}
		})
	})
})