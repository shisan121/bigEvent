$(function () {
	getUserInfo()
	// 点击退出
	$('#btnLogoOut').on('click', function () {
		// 提示用户是否确认退出
		layer.confirm('是否确认退出?', {
			icon: 3,
			title: '提示'
		}, function (index) {
			// 确认退出所进行的操作 1.清空本地存储的token；2.重新跳转到登录界面
			localStorage.removeItem('token')
			location.href = 'login.html'
			// 关闭confirm询问框
			layer.close(index);
		});
	})
})

function getUserInfo() {
	$.ajax({
		url: '/my/userinfo',
		type: 'GET',
		// headers: {
		// 	Authorization: localStorage.getItem('token') || ''
		// },
		success: function (res) {
			console.log(res);
			if (res.status !== 0) {
				return layui.layer.msg('获取用户信息')
			}
			renderAvatar(res.data)
		}
	})
}

function renderAvatar(user) {
	// 1.获取用户昵称或者用户名
	var name = user.nickname || user.username
	// 2.设置欢迎的文本
	$('#welcome').html('欢迎&nbsp;&nbsp;' + name)
	// 3.按需渲染用户头像
	if (user.user_pic !== null) {
		// 3.1渲染图片头像，并显示头像
		$('.layui-nav-img').attr('src', user.user_pic).show()
		$('.text-avatar').hide()
	} else {
		$('.layui-nav-img').hide()
		var first = name[0].toUpperCase()
		$('.text-avatar').html(first).show()
	}

}