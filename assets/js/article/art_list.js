$(function () {
	var layer = layui.layer
	var form = layui.form
	var laypage = layui.laypage
	// 定义美化时间的过滤器
	template.defaults.imports.dataFormat = function (date) {
		let dt = new Date(date)
		let y = dt.getFullYear()
		let m = padZero(dt.getMonth() + 1)
		let d = padZero(dt.getDate())
		let hh = padZero(dt.getHours())
		let mm = padZero(dt.getMinutes())
		let ss = padZero(dt.getSeconds())
		return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
	}

	function padZero(n) {
		return n > 9 ? n : '0' + n
	}

	var q = {
		pagenum: 1, //页码值，默认请求的第一页的数据
		pagesize: 2, //每页显示几条数据，默认每页显示2条
		cate_id: '', //文章的分类的id
		state: '' // 文章的发布状态
	}

	initTable()
	// 获取文章列表数据的方法
	function initTable() {
		$.ajax({
			url: '/my/article/list',
			method: 'GET',
			data: q,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取文章列表失败！')
				}
				// 使用模板引擎渲染页面的数据

				let htmlStr = template('tpl-table', res)
				$('tbody').html(htmlStr)
				renderPage(res.total)
			}
		})
	}
	initCate()
	// 获取文章分类的方法
	function initCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取分类数据失败！')
				}
				var htmlStr = template('tpl-cate', res)
				$('[name=cate_id]').html(htmlStr)
				form.render()
			}
		})
	}
	// 为筛选绑定submit事件
	$('#form-search').on('submit', function (e) {
		e.preventDefault()
		// 获取表单中选定项的值
		var cate_id = $('[name=cate_id]').val()
		var state = $('[name=state]').val()
		// 为查询参数对象q中的对应的属性赋值
		q.cate_id = cate_id
		q.state = state
		// 根据最新的筛选条件， 重新渲染表格的数据
		initTable()
	})
	// 定义渲染分页的方法
	function renderPage(total) {
		// 调用laypage.render() 方法来渲染分页的结构
		laypage.render({
			elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,即分页容器的id
			count: total, //数据总数，从服务端得到
			limit: q.pagesize, //每页显示几条数据
			curr: q.pagenum, //设置默认被选中的分页
			layout: ['count', 'limit', 'page', 'prev', 'next', 'skip'],
			limits: [2, 3, 5, 10],
			// 分页发生切换时，触发jump回调
			jump: function (obj, first) {
				// 把最新的页码值，赋值到q这个查询参数对象中
				q.pagenum = obj.curr
				// first(是否为首次调用，一般用于初始加载的判断)
				// first为underfined 表示 手动触发
				// first 为 true 表示程序触发
				// console.log('jump加载状态：' + first);
				if (!first) {
					// 把最新每页显示数目，赋值到pagesize属性中
					q.pagesize = obj.limit
					// 根据最新的q获取对应的数据列表， 并渲染表格
					initTable()
				}
			}
		});
	}
	// 通过Id删除指定文章
	$('tbody').on('click', '.btn-delete', function () {
		// 获取删除按钮的个数 - 当前数据的条数
		var len = $('.btn-delete').length
		// 获取到文章的Id
		var id = $(this).attr('data-id')
		// 询问用户是否要删除文章？
		layer.confirm('是否确定删除？', function (index) {
			$.ajax({
				url: '/my/article/delete/' + id,
				method: 'GET',
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg('删除文章失败！')
					}
					layer.msg('删除文章成功！	')
					// 如果当前页只有一条数据，并且当前的页码值不为1
					if (len === 1 && q.pagenum !== 1) {
						// 如果len的值等于1， 证明删除完毕之后， 页面上就没有任何数据了
						// 页码值最小必须是1
						q.pagenum -= 1
					}
					initTable()
				}
			})
			layer.close(index);
		});
	})
})