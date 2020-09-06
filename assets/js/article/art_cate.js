$(function () {
	var layer = layui.layer
	var form = layui.form
	initArtCateList()

	function initArtCateList() {
		$.ajax({
			type: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) {
					return '获取文章分类失败！'
				}
				let htmlStr = template('tpl-table', res)
				$('tbody').html(htmlStr)
			}
		})
	}
	// 文章添加类别的点击事件
	var indexAdd = null
	$('#btnAddCate').on('click', function () {
		indexAdd = layer.open({
			type: 1,
			title: '添加文章分类',
			area: ['500px', '250px'],
			content: $('#dialog-add').html()
		});
	})
	// 通过代理的形式，为form-add 表单绑定submit事件
	$('body').on('submit', '#form-add', function (e) {
		e.preventDefault()
		$.ajax({
			url: '/my/article/addcates',
			type: 'POST',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('添加文章失败！')
				}
				initArtCateList()
				layer.msg('添加文章成功！')
				// 根据索引，关闭对应的弹出层
				layer.close(indexAdd)
			}
		})
	})
	// 通过代理的形式，为form-edit 表单绑定修改事件
	var indexEdit = null
	$('tbody').on('click', '.btn-edit', function () {
		indexEdit = layer.open({
			type: 1,
			title: '修改文章分类',
			area: ['500px', '250px'],
			content: $('#dialog-edit').html()
		})

		var id = $(this).attr('data-id')
		$.ajax({
			// 发起请求获取对应分类的数据
			url: '/my/article/cates/' + id,
			method: 'GET',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取对应分类数据失败！')
				}
				form.val('form-edit', res.data)
			}
		})

	})
	// 通过代理的形式， 为修改分类的表单绑定 submit事件
	$('body').on('submit', '#form-edit', function (e) {
		e.preventDefault()
		$.ajax({
			method: 'POST',
			url: '/my/article/updatecate',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('更新分类数据失败！')
				}
				layer.msg('更新分类数据成功！')
				layer.close(indexEdit)
				initArtCateList()
			}
		})
	})



	$('tbody').on('click', '.btn-delete', function () {
		var id = $(this).attr('data-id')
		// 提示用户是否要删除
		layer.confirm('确认删除？', {
			icon: 3,
			title: '提示'
		}, function (index) {
			$.ajax({
				url: '/my/article/deletecate/' + id,
				method: 'GET',
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg('删除分类失败！')
					}
					layer.msg('删除分类成功！')
					layer.close(index)
					initArtCateList()
				}
			})
		})
	})
})