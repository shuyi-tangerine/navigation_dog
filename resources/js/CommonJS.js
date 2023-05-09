// 获取URL中指定查询参数的值
function getQueryString(url, name) {
	// 没有查询参数
	// 查询参数有多个符合条件
	// 查询参数在开始位置并且也是结束位置
	// 查询参数在开始位置但是不在结束位置
	// 查询参数不在开始位置但是在结束位置
	// 查询参数在中间
	// 参数参数存在，但是没有值，即等于号后面是空的或者接着下一个查询参数
	var result = null;
	try {
		if (url.indexOf("?") != -1) {
			var reg = new RegExp("[?&]" + name + "=[^&]*");
			var queryString = url.substring(url.indexOf("?"), url.length).match(reg)[0].split("=")[1];
			result = decodeURIComponent(queryString);
		}
	} catch (e) {}
	return result;
}

// 在URL的后面添加的查询参数
function setQueryString(uri, name, value){
	var tmp = null;
	try {
		// 带有查询参数并且假设有和需要添加的查询参数相同的查询参数
		if (url.indexOf("?") != -1) {
			var reg = new RegExp("[?&]" + name + "=[^&]*");
			var queryString = url.substring(url.indexOf("?"), url.length).match(reg)[0];
			tmp = queryString;
		}
	} catch (e) {}
	if (tmp != null) {	// 有和需要添加的查询参数相同的查询参数的时候，替换值
		tmp = tmp.split("=")[0] + "=" + encodeURIComponent(value);
		url = url.replace(queryString, tmp);
	} else {	// 没有和需要添加的查询参数相同的查询参数的时候，在?后面添加
		tmp = "?" + encodeURIComponent(name) + "=" + encodeURIComponent(value);
		if (url.indexOf("?") == -1) {
			url += tmp;
		} else {
			url = url.replace("?", tmp + "&")
		}
	}
	return url;
}

/**
 * 功能：可以模拟下雪
 * overflow: hidden;这个还是有必要的
 * @param id
 * @param src
 */
function dropDown(id, src) {
	// 设置常量
	var className = "dropDownPicture";
	var amount = 150;
	var interval = 50;
	// 定义模拟下落的方法
	var dropFun = function() {
		var pictures = document.getElementsByClassName(className);
		var v_h = document.documentElement.clientHeight;
		var v_w = document.documentElement.clientWidth;
		for (var i = 0; i < pictures.length; i++) {
			/**
			 * 改变雪花位置，到底或者到左右两边了，则重新开始
			 * 雪花要整体在屏幕内，要不然窗口会抖动
			 */
			var top = parseFloat(pictures[i].style.top);
			var left;
			// 越底部边界
			if (top + 1 + parseFloat(pictures[i].style.height) > v_h) {
				top = -(parseFloat(pictures[i].style.height));
				left = Math.random() * v_w;
				if (left > v_w - parseFloat(pictures[i].style.width)) {
					left = v_w - parseFloat(pictures[i].style.width);
				}
			} else {	// 不越底部边界
				++top;
				left = parseFloat(pictures[i].style.left);
				left += Math.sin(top / 2 * 0.1);
				// 越左右边界，top回顶部，left则随机生成
				if (left+parseFloat(pictures[i].style.width) < 0 || left+parseFloat(pictures[i].style.width) > v_w) {
					left = Math.random() * v_w;
					if (left > v_w - parseFloat(pictures[i].style.width)) {
						left = v_w - parseFloat(pictures[i].style.width);
					}
					top = -(parseFloat(pictures[i].style.height));
				}
			}

			pictures[i].style.top = top + "px";
			pictures[i].style.left = left + "px";
		}
	};


	// 获取客户端宽高
	var v_h = document.documentElement.clientHeight;
	var v_w = document.documentElement.clientWidth;
	// 需要渲染的元素
	var ele = document.getElementById(id);
	/* 这一段代码是初始化下落的图片 */
	for (var i=0; i<amount; i++) {
		// 创建元素图片
		var img = document.createElement("img");
		// 设置元素属性
		img.src = src;
		img.className = className;
		img.style.position = "absolute";
		// 随机大小
		var randSize = Math.random() * 30 + 5;
		img.style.height = randSize + "px";
		img.style.width = randSize + "px";
		/**
		 * 雪花越界，窗口会抖动
		 * 为防止这种情况，雪花要整体在屏幕内
		 * 在初始化的时候注意底部、右边边界即可
		 */
		var top = Math.random() * v_h;
		if (top > v_h - randSize) {
			top = v_h - randSize;
		}
		var left = Math.random() * v_w;
		if (left > v_w - randSize) {
			left = v_w - randSize;
		}
		img.style.top = top + "px";
		img.style.left = left + "px";
		ele.appendChild(img);
	}

	/* 定时调用 */
	setInterval(dropFun, interval);

}

/**
 * 两个圈相反转圈圈
 * @param id
 */
function whirl(id) {
	//获取画布的属性
	var canvas = document.getElementById(id);
	var cw = canvas.width;
	var ch = canvas.height;
	var context = canvas.getContext('2d');

	var speed = 0.09;				// 大圆转动的速度，数值越大，转的越快，最快速度受interval变量限制
	var interval = 50;				// 调用转动函数间隔
	var angle01 = 0;				// 画外部大圆的边框小圆，需要从哪个角度开始画
	var angle02 = 0;				// 画内部大圆的边框小圆，需要从哪个角度开始画
	var color = "lightgreen";		// 圆的颜色
	var amountBorderCircle = 120;	// 边框小圆的个数，必须是能整除360的
	var borderCircleR = 2.5;		// 边框小圆的
	var outerCircleR = (cw > ch ? ch : cw)/2 - borderCircleR * 2;	// 外部大圆的半径
	var innerCircleR = outerCircleR - 20;							// 内部大圆的半径

	var rotate = function() {
		// 转圈大圆的变量
		var X = cw/2;
		var Y = ch/2;
		var R = outerCircleR;

		// 转圈圆的变量
		var x = 0;
		var y = 0;
		var r = borderCircleR;

		canvas.height = canvas.height;	//清空画布数据

		// 画外部的大圆
		R = outerCircleR;
		angle01 = (angle01-speed) % 360;
		var i = 0;
		context.lineWidth = r * 2;		//边框小圆的边框宽度
		context.strokeStyle = color;	// 设定圈的颜色
		while (i < amountBorderCircle) {
			x = (cw - R * 2) / 2 + (R + R * Math.cos(Math.PI*angle01/180));
			y = (ch - R * 2) / 2 + (R - R * Math.sin(Math.PI*angle01/180));
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, false);	//预定义画圆
			angle01 = (angle01 + 360/amountBorderCircle)%360;	//转动参数
			context.closePath();	//圆之间不能相连
			context.stroke();		//显示转动的圆
			i++;
		}

		//画内部的大圆
		R = innerCircleR;
		angle02 = (angle02+speed) % 360;
		i = 0;
		while (i < amountBorderCircle) {
			x = (cw - R * 2) / 2 + (R + R * Math.cos(Math.PI*angle02/180));
			y = (ch - R * 2) / 2 + (R - R * Math.sin(Math.PI*angle02/180));
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2, false);
			angle02 = (angle02 + 360/amountBorderCircle)%360;
			context.closePath();
			context.stroke();
			i++;
		}
	};
	setInterval(rotate, interval);//刷新的速度
}

function getRootPath() {
	//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPath = curWwwPath.substring(0, pos);
	//获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPath + projectName);
}

function getCurrentDate() {
	var date = new Date();
	var result = date.getFullYear();
	if (date.getMonth() + 1 < 10) {
		result += '-0' + (date.getMonth() + 1);
	} else {
		result += '-' + (date.getMonth() + 1);
	}
	if (date.getDate() < 10) {
		result += '-0' + date.getDate();
	}  else {
		result += '-' + date.getDate();
	}
	return result;
}

function getFirstDate() {
	var result = getCurrentDate();
	result = result.substr(0, result.length-2) + "01";
	return result;
}























