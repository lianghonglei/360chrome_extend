var allTime
var vm = new Vue({
	el: "#container",
	data:{
		isChange: false,
		title:'批量手动创建pid',
		num: 5,
		count: 1,
		statu: 0,
		statu2: 0,
		statu3: 0,
		nums: [1,2,3,4,5,6,7,8,9],
		isActive: 1,
		isStart: false,
		selected: '',
		gcid: 0,
		pvid: '50_115.60.151.227_4846_1540279126603',
		tag: 29,
		itemid: '523189741309',
		t: new Date().getTime(),
		appList: [],
		webList: [],
		otherList: [],
		idList: [{name: "暂无媒体id"}],
		token: '',
		max_num: 0,
		left_num: 0,
		siteid: 0,
		webname: '代理_',
		appname: '',
		realnum: 10,
		webHisList: [],
		startNum: 1,
		numIng: 0,
		isBuild: true,
		list: [],
		seaNum: 0,
		page: 1,
		enterList: [],
		repeat_num: 0,
		success_num: 0,
		allMin: 2,
		allMax: 500,
		isHeader1: false,
		isHeader2: false,
		isHeader3: false,
		isEnter: true,
		timesJ: null,
		timesT: null,
		isStop: 0,
		seaTime: '',
		isStop2: 0,
		isGoLogin: 0,
		isGoLogin2: 0,
		offlineLogin: 1,
	},
	watch: {
		numIng: function(){
			document.getElementById("wc-top").style.width = this.numIng*100 + "%";
		},
		count: function(){
			document.getElementById("wc-top2").style.width = this.count*100 + "%";			
		},
		token: function(){
			console.log("tt")
		}
	},
	mounted(){
		var self = this;
		chrome.storage.local.get(["max_num", "sum", "memberid", "webname", "webHisList", "url", "key", "allMin", "allMax", "startNum"],function(item){
			if (item) {
				self.max_num = item.max_num
				self.left_num = item.sum
				self.memberid = item.memberid				
				self.url = item.url
				self.key = item.key
				if (item.allMin!=undefined && item.allMin) {
					self.allMin = item.allMin
				}
				if (item.allMax!=undefined && item.allMax) {
					self.allMax = item.allMax
				}
				if (item.webname!=undefined && item.webname) {
					self.webname = item.webname
				}
				if (item.startNum!=undefined && item.startNum) {
					self.startNum = item.startNum
				}				
				if (item.webHisList != undefined && item.webHisList.length > 0) {
					self.webHisList = item.webHisList
				}				
			}
		});
		chrome.storage.local.get(["token"],function(item){
			if (item.token) {
				self.token = item.token;
				$.get("https://pub.alimama.com/common/adzone/newSelfAdzone2.json?tag="+self.tag+"&t="+self.t+"&pvid="+self.pvid+"&_tb_token_="+self.token+"&_input_charset=utf-8",function(res,status){
					if (res.constructor == String) {
						if (res.indexOf("<title>阿里妈妈</title>") != -1 ) {
							layer.msg("没有登录或未设置接口")
							chrome.windows.create({
				                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true&forward=http%3A%2F%2Fpub.alimama.com",
				                width:400,
				                height:400,
				                left:600,
				                top:400,
				                type:'popup'
				            });
						}else if(res.indexOf("<title>亲，访问受限了</title>") != -1 ){
							layer.msg("亲，访问受限了, 请五分钟后重试")
						}else{
							var ret = JSON.parse(res);
							chrome.windows.create({
								url: ret.url,
								width:400,
				                height:400,
				                left:600,
				                top:400,
				                type:'popup'	
							})
						}        
					}else{
						if (res.ok) {
							var ret =res.data;
				        	self.appList = ret.appList;
				        	self.otherList = ret.otherList;
				        	self.webList = ret.webList;
				        	self.idList = self.webList;
				        	self.selected = self.idList[0];
				        	self.siteid = self.selected.siteid;
				        	var str = [];
				        	goenter();
				        	function goenter(){
				        		$.get("https://pub.alimama.com/common/adzone/adzoneManage.json?&tab=1&toPage="+self.page+"&perPageSize=40&gcid="+self.gcid+"&t="+self.t+"&pvid="+self.pvid+"&_tb_token_="+self.token+"&_input_charset=utf-8",function(ret,status){
									if (ret.ok) {								
										self.seaNum = ret.data.paginator.items;								
									}
							    });
				        	}			        
						}
					}					        	
			    });
			}else{
				chrome.windows.create({
	                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
	                width:400,
	                height:400,
	                left:600,
	                top:400,
	                type:'popup'
	            });
	            $.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
			        if (ret.data.noLogin){
			        	layer.msg('请登录');
			        	self.name = '未登录';
			        	chrome.storage.local.set({'token': ''});
			        	if (self.isOpen) {
			        		chrome.windows.create({
				                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
				                width:400,
				                height:400,
				                left:600,
				                top:400,
				                type:'popup'
				            });
			        	}
			        } else {
			            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
			                self.token = cookie.value;
			                chrome.storage.local.set({'token': self.token});
			                location.reload();
			            })
			        }
			    });
			}
		});	
		var el_height = $('.wcc-items')[0].scrollHeight;
		$('.wcc-items')[0].scrollTop = el_height;

		allTime = setInterval(function(){
			chrome.windows.create({
                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
                width:400,
                height:400,
                left:600,
                top:400,
                type:'popup'
            });
            $.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
		        if (ret.data.noLogin){
		        	layer.msg('请登录');
		        	self.name = '未登录';
		        	chrome.storage.local.set({'token': ''});
		        	if (self.isOpen) {
		        		chrome.windows.create({
			                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
			                width:400,
			                height:400,
			                left:600,
			                top:400,
			                type:'popup'
			            });
		        	}
		        } else {
		            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
		                self.token = cookie.value;
		                chrome.storage.local.set({'token': self.token});
		            })
		        }
		    });
		},1800000)
	},
	methods: {
		change: function(id){
			var self = this;
			self.statu = id;
			self.gcid = id;
			self.page = 1;
			if (id == 0) {
				self.idList = self.webList;
			}else if (id == 7) {
				self.idList = self.appList;
			}else if (id == 8) {
				self.idList = self.otherList;
			}
			if ( self.idList != undefined && self.idList.length > 0) {
				self.selected = self.idList[0]
			}			
			self.siteid = self.selected.siteid;
			var str = [];
        	goenter();
        	function goenter(){
        		$.get("https://pub.alimama.com/common/adzone/adzoneManage.json?&tab=1&toPage="+self.page+"&perPageSize=40&gcid="+self.gcid+"&t="+self.t+"&pvid="+self.pvid+"&_tb_token_="+self.token+"&_input_charset=utf-8",function(ret,status){
        			if (ret.constructor == String) {
						chrome.windows.create({
			                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
			                width:400,
			                height:400,
			                left:600,
			                top:400,
			                type:'popup'	                
			            });            
					}else if (ret.ok) {
						self.seaNum = ret.data.paginator.items;								
					}
			    });
        	}
		},
		getSelected: function(){
			var self = this;
			self.siteid = self.selected.siteid;
		},
		getTip(){
			layer.msg("正在生成pid，请暂停后再操作。")
		},
		start(){
			var self = this;
			var max = parseInt(self.allMax);
			var i = parseInt(self.allMin);
			var min = parseInt(self.left_num);
			console.log(max + ',' + i + ',' + min)
			if (max > self.max_num) {
				layer.msg("您设置的值过大");
				return false;
			}else if(i < 0){
				layer.msg("请设置大于0的值");
				return false;
			}else if(i > max){
				layer.msg("设置的最大值小于最小值");
				return false;
			}
			if (self.idList.length == 0) {
				layer.msg("请设置推广媒介后创建");
				return false;
			}
			self.isHeader1 = true;
			self.isHeader3 = true;
			self.isStart = true;
			chrome.storage.local.set({"allMin": self.allMin});
			chrome.storage.local.set({"allMax": self.allMax});			
			chrome.storage.local.set({"webname": self.webname});
			if (self.isStop == 0) {
				layer.msg("已开始自动，请勿关闭页面")
			}

			if (i >= self.left_num && i <= max) {
				self.timesJ = setInterval(function(){
					self.getEnter(i);
					i++;
				}, this.num*1000);	
			}else{
				if (self.timesJ != null) {
					clearInterval(self.timesJ);
				}				
				this.timesT = setInterval(self.confirm, 60000);
			}					
		},
		getEnter: function(i){
			var self = this;
			var max = parseInt(self.allMax);
			console.log(i + "" + max + self.left_num)
			if (i >= self.left_num && i < max) {
							
			    var timestamp = Date.parse( new Date()).toString();
			    stamp = timestamp.substring(0,10);
			    var obj = stamp;
			    var newDate = new Date();
			    newDate.setTime(obj * 1000);

			    var year = newDate.getFullYear();
			    var month = newDate.getMonth() + 1;
			    month = month < 10 ? "0" + month : month;
			    var date = newDate.getDate();
			    date = date < 10 ? "0" + date : date;
			    var name = self.webname + stamp+"_"+self.startNum;
			    var hours = newDate.getHours();
			    hours = hours < 10 ? "0" + hours : hours;
			    var minute = newDate.getMinutes();
			    minute = minute < 10 ? "0" + minute : minute;
			    var second = newDate.getSeconds();
			    second = second < 10 ? "0" + second : second;
			    timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minute + ":" + second;
			    
			    var data = {
			        'siteid':self.siteid,  // 媒体id
			        'gcid': self.gcid,   // 0 网站推广，7 APP推广，  8导购推广
			        'tag': self.tag,
			        'selectact': 'add',
			        'newadzonename': name,
			        '_tb_token_': self.token,
			        'pvid': self.pvid,
			    };
			    $.post("https://pub.alimama.com/common/adzone/selfAdzoneCreate.json",
			        data
			        ,function(ret,status){
			        	if (ret.constructor == String) {
			        		chrome.windows.create({
				                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
				                width:400,
				                height:400,
				                left:600,
				                top:400,
								type:'popup'
							});
							$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
						        if (ret.data.noLogin){
						        	layer.msg('请登录');
						        	self.name = '未登录';
						        	chrome.storage.local.set({'token': ''});
					        		chrome.windows.create({
						                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
						                width:400,
						                height:400,
						                left:600,
						                top:400,
						                type:'popup'
						            });
						        } else {
						            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
						                self.token = cookie.value;
						                chrome.storage.local.set({'token': self.token});
						            })
						        }
						    });
			        	}
			            if (ret.ok) {
			            	var pid = "mm_"+self.memberid+"_"+ret.data.siteId+"_"+ret.data.adzoneId;
			            	var list = [{"name": name,"statu": "创建成功","pid": pid, "timestamp": timestamp}];
							$.post(self.url,{api:'importpid', key: self.key,pids: list,memberid: self.memberid},function(res,status){
								if (res.constructor == String) {
									var ret = JSON.parse(res);
								}else{
									var ret = res;
								}
								if (ret.code == 1) {
									self.offlineLogin == 1
									self.sum = ret.left_num;
									self.left_num = ret.left_num;
									self.max_num = ret.max_num;
									self.startNum ++;
								    chrome.storage.local.set({"startNum": self.startNum});
								    
									self.webHisList.push({"name": name,"statu": "创建成功","pid": pid, "timestamp": timestamp});
									chrome.storage.local.set({"webHisList": self.webHisList});
							        chrome.storage.local.set({"max_num": ret.max_num});
							        chrome.storage.local.set({"sum": ret.left_num});
								}else{
									layer.msg(ret.message || ret.msg)
									clearInterval(self.timesJ);
									clearInterval(self.timesT);
									self.isStart = false;
									self.isHeader1 = false;
									self.isHeader2 = false;
									self.isHeader3 = false;
								}
						    });
			            	var el_height = $('.wcc-items')[1].scrollHeight;
							$('.wcc-items')[1].scrollTop = el_height + 30;								
			            }else {
			            	clearInterval(self.timesJ);
		            		chrome.windows.create({
				                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
				                width:400,
				                height:400,
				                left:600,
				                top:400,
								type:'popup'
							});
							$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
						        if (ret.data.noLogin){
						        	layer.msg('请登录');
						        	self.name = '未登录';
						        	chrome.storage.local.set({'token': ''});
						        	if (self.isOpen) {
						        		chrome.windows.create({
							                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
							                width:400,
							                height:400,
							                left:600,
							                top:400,
							                type:'popup'
							            });
						        	}
						        } else {
						            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
						                self.token = cookie.value;
						                chrome.storage.local.set({'token': self.token});
						            })
						        }
						    });
			            }
			        });
			}else{
				clearInterval(self.timesJ);
				this.timesT = setInterval(self.confirm, 60000);
			}
		},
		confirm: function(){
			var self = this;
			chrome.windows.create({
                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
                width:400,
                height:400,
                left:600,
                top:400,
				type:'popup'
			});

			$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
		        if (ret.data.noLogin){
		        	layer.msg('请登录');
		        	self.name = '未登录';
		        	chrome.storage.local.set({'token': ''});
		        	if (self.isOpen) {
		        		chrome.windows.create({
			                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
			                width:400,
			                height:400,
			                left:600,
			                top:400,
			                type:'popup'
			            });
		        	}
		        } else {
		            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
		                self.token = cookie.value;
		                chrome.storage.local.set({'token': self.token});
		            })
		        }
		    });
			$.post(self.url,{api:'pidinfo', key: self.key,memberid: self.memberid},function(res,status){
				if (res.constructor == String) {
					var ret = JSON.parse(res);
				}else{
					var ret = res;
				}
				if (ret.code == 1) {
					self.sum = ret.left_num;
					self.left_num = ret.left_num;
					self.max_num = ret.max_num;
			        chrome.storage.local.set({"max_num": ret.max_num});
			        chrome.storage.local.set({"sum": ret.left_num});
			        var i = parseInt(self.allMin);
			        var max = parseInt(self.allMax);
					if (i >= self.left_num && i < max) {
			        	self.timesJ = setInterval(function(){
							self.getEnter(i);
							i++;
						}, this.num*1000);
			        }
				}else{
					layer.msg(ret.message || ret.msg)
				}						        
		    });
		},
		start2: function(){
			var self = this;
			layer.msg("已结束");
			clearInterval(self.timesJ);
			clearInterval(self.timesT);
			this.timesT = null;
			this.timesJ = null;
			self.isStart = false;
			self.isHeader1 = false;
			self.isHeader2 = false;
			self.isHeader3 = false;
			self.isStop2 = 1;
		},
		clear: function(){
			var self = this;
			chrome.storage.local.remove("webHisList", function(){
				if (self.webHisList.length == 0) {
					layer.msg("记录已为空")
					self.startNum = 0;
					chrome.storage.local.set({"startNum": self.startNum});
					// window.location.reload()
				}else{
					self.webHisList = [];
					self.startNum = 0;
					chrome.storage.local.set({"startNum": self.startNum});
				    layer.msg("清除完毕")
				    window.location.reload()
				}				
			});
		},
		build: function(id){
			var self = this;
			var max = self.max_num;
			var mid = self.realnum;
			var min = self.left_num;

			var i = 1;
			var j = self.startNum;
			chrome.storage.local.set({"webname": self.webname});
			if (self.idList.length == 0) {
				layer.msg("请设置推广媒介后创建")
				return false;
			}
			if (id == 1) {
				if (max - min + 1> mid) {
					self.isBuild = false;
					genpid(i);			
					function genpid(i) {
						var all = parseInt(mid) +1;
						if (i < all) {
				        	var timestamp = Date.parse( new Date()).toString();
						    stamp = timestamp.substring(0,10);
						    var obj = stamp;
						    var newDate = new Date();
						    newDate.setTime(obj * 1000);

						    var year = newDate.getFullYear();
						    var month = newDate.getMonth() + 1;
						    month = month < 10 ? "0" + month : month;
						    var date = newDate.getDate();
						    date = date < 10 ? "0" + date : date;
						    
						    var hours = newDate.getHours();
						    hours = hours < 10 ? "0" + hours : hours;
						    var minute = newDate.getMinutes();
						    minute = minute < 10 ? "0" + minute : minute;
						    var second = newDate.getSeconds();
						    second = second < 10 ? "0" + second : second;
						    timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minute + ":" + second;
						    var name = self.webname + stamp+"_"+self.startNum;
						    var data = {
						        'siteid':self.siteid,  // 媒体id
						        'gcid': self.gcid,   // 0 网站推广，7 APP推广，  8导购推广
						        'tag': self.tag,
						        'selectact':'add',
						        'newadzonename':name,
						        '_tb_token_':self.token,
						        'pvid':self.pvid,
						    };
						    $.post("https://pub.alimama.com/common/adzone/selfAdzoneCreate.json",
						        data
						        ,function(ret,status){
						        	if (ret.constructor == String) {
						        		chrome.windows.create({
							                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
							                width:400,
							                height:400,
							                left:600,
							                top:400,
											type:'popup'
										});
										$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
									        if (ret.data.noLogin){
									        	layer.msg('请登录');
									        	self.name = '未登录';
									        	chrome.storage.local.set({'token': ''});
									        	if (self.isOpen) {
									        		chrome.windows.create({
										                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
										                width:400,
										                height:400,
										                left:600,
										                top:400,
										                type:'popup'
										            });
									        	}
									        } else {
									            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
									                self.token = cookie.value;
									                chrome.storage.local.set({'token': self.token});
									            })
									        }
									    });
						        	}
						        	console.log(typeof ret.ok)
						            if (ret.ok) {
							        	self.isHeader2 = true;
										self.isHeader3 = true;
										
						            	var pid = "mm_"+self.memberid+"_"+ret.data.siteId+"_"+ret.data.adzoneId;
						            	var list = [{"name": name,"statu": "创建成功","pid": pid, "timestamp": timestamp}];
						            	
										$.post(self.url,{api:'importpid', key: self.key, pids: list, memberid: self.memberid},function(res,status){	
									    	if (status == 'success') {

									    		if (res.constructor == String) {
													var ret = JSON.parse(res);
												}else{
													var ret = res;
												}

										    	if (ret.code == 1) {
										    		 self.offlineLogin = 1
													self.sum = ret.left_num;
													self.left_num = ret.left_num;
													self.max_num = ret.max_num;
											        chrome.storage.local.set({"max_num": ret.max_num});
											        chrome.storage.local.set({"sum": ret.left_num});
											        console.log(i + '/ ' + self.realnum )
											        self.numIng = i/parseInt(self.realnum);
											        self.startNum++;
												    chrome.storage.local.set({"startNum": self.startNum});
												    
											        self.webHisList.push({"name": name,"statu": "创建成功","pid": pid, "timestamp": timestamp});
													chrome.storage.local.set({"webHisList": self.webHisList});
													
													var el_height = $('.wcc-items')[0].scrollHeight;
													$('.wcc-items')[0].scrollTop = el_height;
													
													if (i == all-1) {
												    	layer.msg("生成完毕");
											        	self.isBuild = true;
											        	self.isHeader2 = false;
														self.isHeader3 = false;
														clearTimeout(self.timesJ);
														return;
												    }
											  		// var opt = {
													//   	type: "basic",
													//   	title: "创建通知",
													//   	message: "创建成功一个pid",
													//   	iconUrl: "../img/48.png"
													// }
									    			//chrome.notifications.create('1',opt, function(){});
												}else{
													layer.msg(ret.message || ret.msg)
													clearTimeout(self.timesJ)
													self.isBuild = true;
										        	self.isHeader2 = false;
													self.isHeader3 = false;
													return false;
												}

									    	}else{

									    		chrome.windows.create({
									                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
									                width:400,
									                height:400,
									                left:600,
									                top:400,
													type:'popup'
												});

												$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
											        if (ret.data.noLogin){
											        	layer.msg('请登录');
											        	self.name = '未登录';
											        	chrome.storage.local.set({'token': ''});
											        	if (self.isOpen) {
											        		chrome.windows.create({
												                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
												                width:400,
												                height:400,
												                left:600,
												                top:400,
												                type:'popup'
												            });
											        	}
											        } else {
											            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
											                self.token = cookie.value;
											                chrome.storage.local.set({'token': self.token});
											            })
											        }
											    });
									    	}	
									    });	
										
						            }else{
						            	if (ret.info) {
						            		if (ret.info.message == "页面失效，建议重启浏览器再试！") {
							            		var option_url = chrome.extension.getURL('html/options.html#reloaded');
												chrome.tabs.update({url:option_url,selected:true})
							            	}
						            	}else if (this.isGoLogin == 0) {
						            		chrome.windows.create({
								                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
								                width:400,
								                height:400,
								                left:600,
								                top:400,
												type:'popup'
											});
											$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
										        if (ret.data.noLogin){
										        	layer.msg('请登录');
										        	self.name = '未登录';
										        	chrome.storage.local.set({'token': ''});
										        	if (self.isOpen) {
										        		chrome.windows.create({
											                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
											                width:400,
											                height:400,
											                left:600,
											                top:400,
											                type:'popup'
											            });
										        	}
										        } else {
										            chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
										                self.token = cookie.value;
										                chrome.storage.local.set({'token': self.token});
										            })
										        }
										    });
										    this.isGoLogin = 1;
						            	}
						            	
						            }
						        });
								console.log(self.startNum+ '' + j + '' + i)
								// if ((self.startNum - j + 1) < i && self.offlineLogin == 1 && (i + j - self.startNum) < 3) {
								// 	chrome.windows.create({
						  //               url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
						  //               width:400,
						  //               height:400,
						  //               left:600,
						  //               top:400,
								// 		type:'popup'
								// 	});
								// 	$.getJSON("https://pub.alimama.com/common/getUnionPubContextInfo.json",function(ret,status){
								//         if (ret.data.noLogin){
								//         	layer.msg('请登录');
								//         	self.name = '未登录';
								//         	chrome.storage.local.set({'token': ''});
								//         	if (self.isOpen) {
								//         		chrome.windows.create({
								// 	                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
								// 	                width:400,
								// 	                height:400,
								// 	                left:600,
								// 	                top:400,
								// 	                type:'popup'
								// 	            });
								//         	}
								//         } else {
								//             chrome.cookies.get({url:"http://pub.alimama.com",name:"_tb_token_"},function(cookie){
								//                 self.token = cookie.value;
								//                 chrome.storage.local.set({'token': self.token});
								//             })
								//         }
								//     });
								//     self.offlineLogin = 0;
								// }
						    self.timesJ = setTimeout(function () {
						    	i++;
						        genpid(i);     
						    }, self.num*1000);
						    		        							        	
				        }
					}
				}else{
					layer.msg("你的期望生成数量已超上限，上限" + (self.max_num - self.left_num));
				}
			}			
		},
		build2: function(){
			var self = this;
			clearTimeout(self.timesJ);
			self.isBuild = true;
			self.isHeader2 = false;
			self.isHeader3 = false;
			layer.msg("已结束")
		},
		choose: function(id){
			var self = this;
			self.isActive = id;
			if (self.statu == 0) {
				self.idList = self.webList;
			}else if (self.statu == 7) {
				self.idList = self.appList;
			}else if (self.statu == 8) {
				self.idList = self.otherList;
			}   
		    var iid = id -1;
			var el_height = $('.wcc-items')[iid].scrollHeight;
			if (el_height == 0) {
				// self.choose(id)
			}else{
				$('.wcc-items')[iid].scrollTop = el_height;
			}			
		},
		enter: function(){
			var self = this;
			var str = [];
			self.page = 0;
			self.count = 0;
			goenter();
			function goenter(){
        		$.get("https://pub.alimama.com/common/adzone/adzoneManage.json?&tab=1&toPage="+self.page+"&perPageSize=40&gcid="+self.gcid+"&t="+self.t+"&pvid="+self.pvid+"&_tb_token_="+self.token+"&_input_charset=utf-8",function(ret,status){
        			if (ret.constructor == String) {
						chrome.windows.create({
			                url:"https://login.taobao.com/member/login.jhtml?style=mini&newMini2=true&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true",
			                width:400,
			                height:400,
			                left:600,
			                top:400,
			                type:'popup'	                
			            });	            
					}else if (ret.ok) {
						self.isEnter = false;
						var pagelist = ret.data.pagelist;
						if (pagelist != null) {
							$.each(ret.data.pagelist,function (index, item) {
					            str.push({"name": item.name,"pid": item.adzonePid});
					        })
							self.seaNum = ret.data.paginator.items;
							var pages = ret.data.paginator.pages;

							if (pages && self.page < pages) {
								self.isHeader2 = true;
								self.isHeader1 = true;
								self.enterList = str;
								$.post(self.url,{api:'importpid', key: self.key,pids:self.enterList,memberid: self.memberid},function(res,status){
									if (res.constructor == String) {
										var ret = JSON.parse(res);
									}else{
										var ret = res;
									}
									if (ret.code == 1) {
										
										self.repeat_num = ret.repeat_num;
										self.success_num = ret.success_num;
										self.count = self.page/pages;
										layer.msg(ret.message)
										if (self.count >= 1) {
											clearTimeout(self.seaTime)
											document.getElementById("wc-top2").style.width = "100%";
											self.isEnter = true
											self.isHeader2 = false;
											self.isHeader1 = false;
											return false;
										}

									}else{
										self.isEnter = true
										self.isHeader2 = false;
										self.isHeader1 = false;
										layer.msg(ret.message || ret.msg)
										clearTimeout(self.seaTime)
										return false;
									}   
							    });
							    self.seaTime = setTimeout(function(){
									self.page ++
									goenter()
								}, 2000)																
							}else{
								self.enterList = str;
							}
						}else{
							clearTimeout(self.seaTime)
						}														
					}
			    });
        	}			
		},
		enter2: function(){
			var self = this;
			clearTimeout(self.seaTime);
			self.isEnter = true;
			self.isHeader2 = false;
			self.isHeader1 = false;
		}
    },
    beforeDestory(){
        clearInterval(allTime)
    }
})
layui.use('slider', function(){
	var slider = layui.slider;

	slider.render({
		elem: '#slideTest1',
		min: 5,
		max: 30,
		value: vm.num,
		change: function(value){
			vm.num = value;
		}
	});
	slider.render({
		elem: '#slideTest2',
		min: 5,
		max: 30,
		value: vm.num,
		change: function(value){
			vm.num = value;
		}
	});
});