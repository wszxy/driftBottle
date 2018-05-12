$(document).ready(function() {
	var NebPay = require("nebpay");
    var nebPay = new NebPay();
    var contractAddress = "n1ijYW3VatPQnJ9dznobsXPX26Xne7Fm6Su";
    var serialNumber;

    //if the extension is installed, var "webExtensionWallet" will be injected in to web page
    if(typeof(webExtensionWallet) === "undefined"){
        alert ("Extension wallet is not installed, please install it first.")
    }

    //登录
    $("#submit").click(function(event) {
    	var name = $("#loginName").val();
    	var age = $("#loginAge").val();
    	var city = $("#loginCity").val();

    	if (!name) {
    		alert("请输入你的名字!");
    		return;
    	}

    	if (!age) {
    		alert("请输入你的年龄!");
    		return;
    	}

    	if (!city) {
    		alert("请输入你的城市!");
    		return;
    	}


    	var callFunction = "register";
		var to = contractAddress;
		var value = 0;
		var callArgs = "[\"" +  name + "\",\"" + age +  "\",\""+ city + "\"]"; //in the form of ["args"]
		nebPay.call(to, value, callFunction, callArgs,  {
			qrcode: {
				showQrCode: false
			},
			listener:cbSubmit,
		})
    });

    function cbSubmit(resp) {
    	$("#login").fadeOut();
    	$("#mainFrame").css({
    		"-webkit-filter": 'blur(0)'
       	});
       	$(".icon").removeAttr('disabled');
    }

    //不想登录的话,请把这段解注释
	// $("#login").fadeOut();
	// $("#mainFrame").css({
	// 	"-webkit-filter": 'blur(0)'
 //   	});
 //   	$(".icon").removeAttr('disabled');

	//点击关闭窗口
	$("#close_pannel_btn").click(function() {
		disapperPannel();
	});

	$("#textArea_close_btn").click(function() {
		disapperPannel();
	});

	$("#allBottles").click(function(event) {
		$("#history").empty();
		$("#allMessages").css({
			"background-color": '#F4F2E8',
			"color": 'black'
		});
		$("#allBottles").css({
			"background-color": '#AD7D29',
			"color": 'white'
		});
		queryMyBottles();
	});

	$("#allMessages").click(function(event) {
		$("#history").empty();
		$("#allBottles").css({
			"background-color": '#F4F2E8',
			"color": 'black'
		});
		$("#allMessages").css({
			"background-color": '#AD7D29',
			"color": 'white'
		});
		queryMyMessages();
	});


	//点击我的瓶子
	$(".myBtn").click(function() {
		disapperPannel();
		$("#title h2").hide();
		$(".historyBtn").fadeIn();
		$("#allBottles").css({
			"background-color": '#F4F2E8',
			"color": 'black'
		});
		$("#allMessages").css({
			"background-color": '#AD7D29',
			"color": 'white'
		});
		$("#history").empty();
		$("#bottle_pannel").fadeIn();
		$("#tableArea").fadeIn();

		queryMyMessages();

		/* Act on the event */
	});

	//点击捞捞看
	$(".btnGet").click(function() {
		getBottle();
		disapperPannel();
		$("#text").empty();
		$("#title h2").fadeIn();
		$("#title h2").text("TA 的留言");

		$("#salvage").css({
			"z-index": '0',
			"width": "100",
			"height": "64",
			"background-size": "100%",
			"left": "68%",
			"top": "75%",
			"opacity": "0.5"
		})
		$("#sea").css({
			"opacity": '0'
		});
		$("#bottleLogo").css({
			"opacity": '0'
		});

		$("#salvage").rotate('5deg');
		$("#salvage").show();
		$("#salvage").animate({
			width: '266px',
			height: '171px',
			opacity: '1.0',
			left: '48%',
			top: '18%',
			rotate: '-50deg'
			},
			'slow', function() {
		});

		$("#salvage").animate({
			left: '48%',
			top: '38%',
			rotate: '-60deg'
			},
			'slow', function() {

			$("#sea").animate({
				opacity: '1'},
				'fast', function() {
			});
		});

		$("#salvage").animate({
			left: '58%',
			},
			'slow', function() {
		});

		$("#salvage").animate({
			left: '48%',
			},
			'slow', function() {
			$("#bottleLogo").css({
				"opacity": '0.7'
			});
		});


		$("#salvage").animate({
			top:'28%',
			rotate: '-10deg',
			},
			'slow', function() {
				$("#sea").animate({
					opacity: '0'},
				'fast', function() {
				});
				$("#salvage").delay('1000').animate({
					opacity: '0'},
					'slow', function() {
						$("#content").fadeIn();
						$("#bottle_pannel").fadeIn();
						$("#salvage").css({
							"z-index": '-1',
						});
				});

			/* stuff to do after animation is complete */
		});
	});

	//扔瓶子
	$(".btnThrow").click(function() {
		disapperPannel();
		$("#title h2").fadeIn();
		$("#bottle_pannel").fadeIn();
		$("#textArea").fadeIn();
		$("#title h2").text("发送留言");
	});

	$("#replyButton").click(function(event) {
		var text =  $("#reply").val();

		var callFunction = "giveComments";
		var to = contractAddress;
		var value = 0;
		var address = $("#text p").text().substring(2);
		var callArgs = "[\"" +  address + "\",\"" + text.trim() + "\"]"; //in the form of ["args"]
		nebPay.call(to, value, callFunction, callArgs,  {
			qrcode: {
				showQrCode: false
			},
			listener:cbCallDapp,
		})
		disapperPannel();
	});

	//扔回海里
	$("#throwBack").click(function(event) {
		disapperPannel();
		throwBottleAnimation();
	});


	//发送扔瓶子操作
	$("#textArea_throw_btn").click(function(event) {
		var userText = $("#userText").val();
		var callFunction = "releaseBottle";
		var to = contractAddress;
		var value = 0;
		console.log("text is" + userText);
		var callArgs = "[\"" +  userText.trim() + "\"]"; //in the form of ["args"]
		nebPay.call(to, value, callFunction, callArgs,  {
			qrcode: {
				showQrCode: false
			},
			listener:cbCallDapp,
		})
		disapperPannel();
	});

	function releaseBottle(callFunction, message) {
		var to = contractAddress;
		var value = 0;
		var callArgs = "[\"" +  message.trim() + "\"]"; //in the form of ["args"]
		nebPay.call(to, value, callFunction, callArgs,  {
			qrcode: {
				showQrCode: false
			},
			listener:cbCallDapp,
		})
	}

	function cbCallDapp(resp) {
        var respString = JSON.stringify(resp);
        console.log("cbCallDapp(): " + JSON.stringify(resp))
        throwBottleAnimation();
	}


	//发送捞瓶子操作
	function getBottle() {
		var to = contractAddress;
		var value = 0;
		var callFunction = "refloatBottle";
		var callArgs = "";

		nebPay.simulateCall(to, value, callFunction, callArgs, {
			qrcode: {
				showQrCode: false
			},
			listener:cbGetBottle
		})
	}

	function cbGetBottle(resp) {
		var respStr = JSON.stringify(resp);
		var result = JSON.parse(respStr).result;
		var contents = JSON.parse(result);
		if (contents != null) {
			$("#text").text(contents.comments);
			$("#text").append('<p style = "text-align:right; margin-top:0px;color:gray;font-size:14px;">' + "来自" + contents.address + '</p>');
			console.log("a : " + contents);
			console.log("a.address :" + contents.address);
		}
	}

	//发送查询瓶子操作
	function queryMyBottles() {
		var to = contractAddress;
		var value = 0;
		var callFunction = "personOf";
		var callArgs = "";

		nebPay.simulateCall(to, value, callFunction,callArgs, {
			qrcode: {
				showQrCode: false
			},
			listener: cbQueryMyBottles,
		})
	}

	function cbQueryMyBottles(resp) {
		var s = JSON.stringify(resp);
		var m = JSON.parse(s);
		var s1 =m.result;
		s1 = JSON.parse(s1);
		var myBottles = s1.myBottles;    
		var myobj = eval("["+myBottles+"]");
		console.log("myobj = " + myobj);
		if (myobj.length != 0) {
			for (var i = 0; i < myobj.length; i++) {
				$("#history").append("<dt class = 'myBottles'>" + myobj[i].comments + "</dt>");
			}
		} else {
			$("#history").append("<dl>你还没有扔过瓶子~</dl>");
		}
	}

	function queryMyMessages() {
		var to = contractAddress;
		var value = 0;
		var callFunction = "viewMyMessage";
		var callArgs = "";

		nebPay.simulateCall(to, value, callFunction,callArgs, {
			qrcode: {
				showQrCode: false
			},
			listener: cbQyeryMyMessages,
		})
	}

	function cbQyeryMyMessages(resp) {
		var s = JSON.stringify(resp);
		var m = JSON.parse(s);
		var s1 =m.result;
		s1 = JSON.parse(s1);
		var myobj = eval("["+s1+"]");
		console.log("result = " + myobj.length);
		if (myobj.length != 0) {
			for (var i = 0; i < myobj.length; i++) {
				$("#history").append("<dt class = 'myMessages'>" + myobj[i].message + "</dt>");
			}

			$(".myMessages").click(function(event) {
				var index = $(this).index();
				var a = myobj[index];
				disapperPannel();
				$("#text").empty();
				$("#text").text(a.message);
				$("#text").append('<p style = "text-align:right;margin-top:0px;color:gray;font-size:14px;">' + "来自" + a.address + '</p>');
				$("#title h2").text("TA 的留言");
				$("#bottle_pannel").fadeIn("0", function() {
					$("#title h2").fadeIn();
					$("#content").fadeIn();
				});;

			});

		} else {
			$("#history").append("<dl>暂时还没有消息~</dl>");
		}
	}

	function disapperPannel() {
		$("#bottle_pannel").fadeOut();
		$("#textArea").fadeOut();
		$("#content").fadeOut();
		$("#tableArea").fadeOut();
		$(".historyBtn").fadeOut();
		$("#reply").val("");
		$("#userText").val("");
	}

	function throwBottleAnimation() {
		$("#throwedBtn").css({
			opacity: '0.5',
			left: '30%',
			top: '70%',
		});
		$("#salvage").css({
			opacity: '0'
		});
		$("#sea").css({
			opacity: '0'
		});
		$("#throwedBtn").rotate('0deg');
		$("#throwedBtn").animate({
			rotate: '400deg',
			left: '50%',
			top: '38%',
			opacity: '1'
		},
			'slow', function() {
		});
		$("#throwedBtn").animate({
			opacity: '0'
		},
			'fast', function() {
		});
	}
});

