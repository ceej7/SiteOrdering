layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

	//加载页面数据
	var usersData = '';
	var baseUrl = getRootPath_web();
	$.ajax({
		url: baseUrl + "user/getAll",
		type: "get",
		dataType: "json",
		success: function (data) {
			if (data.status === 200) {
				usersData=data.responseMap.result;
				usersList(usersData);
			}
			else{
				alert("获取用户信息失败");
				$(window).attr('location', baseUrl);
			}
		},
		error: function () {
			alert("检查一下网络吧");
			$(window).attr('location', baseUrl);
		}
	});

	//查询
	var filteredUsersData='';
	$(".search_btn").click(function(){
		filteredUsersData = [];
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
            setTimeout(function(){
				for(var i=0;i<usersData.length;i++){
					var usersStr = JSON.parse(JSON.stringify(usersData[i]));
					var selectStr = $(".search_input").val();
					function changeStr(data){
						var dataStr = '';
						var showNum = data.split(eval("/"+selectStr+"/ig")).length - 1;
						if(showNum > 1){
							for (var j=0;j<showNum;j++) {
								dataStr += data.split(eval("/"+selectStr+"/ig"))[j] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
							}
							dataStr += data.split(eval("/"+selectStr+"/ig"))[showNum];
							return dataStr;
						}else{
							dataStr = data.split(eval("/"+selectStr+"/ig"))[0] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/"+selectStr+"/ig"))[1];
							return dataStr;
						}
					}

					if(selectStr.indexOf("@")>-1){//包含邮件符号，以邮件形式搜索
						if(usersStr.email.indexOf(selectStr) > -1){
							// NO Filtering
							filteredUsersData.push(usersStr);
						}
					}
					else{//以用户名搜索
						if(usersStr.userName.indexOf(selectStr) > -1){
							usersStr["userName"] = changeStr(usersStr.userName);
							filteredUsersData.push(usersStr);
						}
					}
				}

				usersList(filteredUsersData);
                layer.close(index);
            },1000);
		}else{
			usersList(usersData);
		}
	})

	// //添加会员 // 作为打开页面的demo
	// $(".usersAdd_btn").click(function(){
	// 	var index = layui.layer.open({
	// 		title : "添加会员",
	// 		type : 2,
	// 		content : "addUser.html",
	// 		success : function(layero, index){
	// 			layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
	// 				tips: 3
	// 			});
	// 		}
	// 	})
	// 	//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
	// 	$(window).resize(function(){
	// 		layui.layer.full(index);
	// 	})
	// 	layui.layer.full(index);
	// })

    //全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断item是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})

	//批量删除
	$(".batchDel").click(function(){

		}
	);

	// 提交编辑内容
	$("body").on("click",".users_edit",function(){  //编辑
		var $checkbox = $('.news_list tbody input[type="checkbox"][name="checked"]');
		var $checked = $('.news_list tbody input[type="checkbox"][name="checked"]:checked');
		if ($checkbox.is(":checked")) {
			var index = layer.msg('审核中，请稍候', {icon: 16, time: false, shade: 0.8});
			setTimeout(function () {
				for (var j = 0; j < $checked.length; j++) {
					for (var i = 0; i < parkingLotData.length; i++) {
						if (parkingLotData[i].newsId == $checked.eq(j).parents("tr").find(".news_del").attr("data-id")) {
							//修改列表中的文字
							$checked.eq(j).parents("tr").find("td:eq(3)").text("审核通过").removeAttr("style");
							//将选中状态删除
							$checked.eq(j).parents("tr").find('input[type="checkbox"][name="checked"]').prop("checked", false);
							form.render();
						}
					}
				}
				layer.close(index);
				layer.msg("审核成功");
			}, 2000);
		} else {
			layer.msg("请选择需要审核的文章");
		}
	})

	// 删除
	$("body").on("click",".users_del",function(){
		var _this = $(this);
		layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
			//_this.parents("tr").remove();
			for(var i=0;i<usersData.length;i++){
				if(usersData[i].userId == _this.attr("data-id")){
					$.ajax({
						url: baseUrl + "user/deleteById",
						type: "DELETE",
						dataType: "json",
						data:{userId:usersData[i].userId},
						async:false,
						success: function (data) {
							if (data.status === 200) {
								usersData.splice(i,1);
								usersList(usersData);
							}
							else{
								alert("用户删除失败");
							}
						},
						error: function () {
							alert("检查一下网络吧");
							window.location.reload();
						}
					});

				}
			}
			layer.close(index);
		});
	})

	//列出用户数据
	function usersList(data_param){
		//根据data源和offset渲染数据
		function renderDate(data,curr){
			var dataHtml = '';
			var currData = data.concat().splice(curr*nums-nums, nums);
			if(currData.length != 0){
				for(var i=0;i<currData.length;i++){
					dataHtml += '<tr>'
			    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
					+  '<td>'+currData[i].userId+'</td>'
			    	+  '<td>'+currData[i].userName+'</td>'
					+'<td><input type="text" name="" placeholder="用户未填写密码" value="'+currData[i].password+'" autocomplete="off" class="layui-input"></td>'
					+'<td><input type="text" name="" placeholder="用户未填写邮件" value="'+currData[i].email+'" autocomplete="off" class="layui-input"></td>'
					+'<td><input type="text" name="" placeholder="用户未填写描述" value="'+currData[i].description+'" autocomplete="off" class="layui-input"></td>'
			    	+  '<td>'
					+    '<a class="layui-btn layui-btn-mini users_edit"><i class="iconfont icon-edit"></i> 编辑</a>'
					+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].userId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
			        +  '</td>'
			    	+'</tr>';
				}
			}else{
				dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
			}
		    return dataHtml;
		}

		//分页渲染
		var nums = 8; //每页出现的数据量
		laypage({
			cont : "page",
			pages : Math.ceil(data_param.length/nums),
			jump : function(obj){
				// $(".users_content").html("");//清除tbody中的内容
				$(".users_content").html(renderDate(data_param,obj.curr));
				$('.users_list thead input[type="checkbox"]').prop("checked",false);
		    	form.render();
			}
		})
	}
        
})