		var xmldoc;
		var xmlDoc = null;
		try{xmlDoc = new ActiveXObject("Microsoft.XMLDOM");}catch(e){ xmlDoc = new XMLHttpRequest(); }
		var chatHistory=new Array();
		var current=null,preObj=null,currentstate=0;currentgroup=null;//currentstate:1 talking 2:invitation
		var lasttime=null,LastTime=null;//上次检测时间
		var keyview=false;
		var debug="",statushtml="";
		var oPopup =null;
		var noted=false,lastsoundtime=null;
		var crcIds=""; //用来返回给服务器以校验短信息获取与否
		var isConnected=true; //网络是否连接	
		var lastMsg=null; //最后一次发送消息的url		 

		String.prototype.trim = function()
		{
			return this.replace(/(^\s*)|(\s*$)/g, "");
		}
		
		function CONTACT(node)
		{
			this.name=node.getAttribute("name");
			this.sex=node.getAttribute("sex");
			this.workphone=node.getAttribute("workphone");
			this.mobilephone=node.getAttribute("mobilephone");
			this.sht=node.getAttribute("sht");
			this.email=node.getAttribute("email");
			this.qq=node.getAttribute("qq");
			this.msn=node.getAttribute("msn");
			
			return this;
		}
		
		function User(u)
		{
			this.node=null;
			
			if(typeof(u)=="string")
				this.node=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+u+"\"]");
			else
				this.node=u;
				
			this.id=this.node.getAttribute("i");
			this.type=this.node.getAttribute("t");
			this.name=this.node.getAttribute("n");
			this.state=this.node.getAttribute("s");
			this.prefix="";
			this.prefixColor="";
			this.tag=this.node.getAttribute("tag");
			this.visit=this.node.getAttribute("v");
			this.talker="";
			if(this.visit==null)
				this.visit=0;
			else if(this.visit.substring(0,1)=="1")
				this.visit=1;
			else if(this.visit.substring(0,1)=="2")
			{
				//this.talker=this.visit.substring(2);
				this.talker=this.visit.substring(1);
				this.visit=(this.talker==thisname)?3:2;
				 
			}			
			this.dm=this.node.getAttribute("dm");
			if(this.dm==null||this.dm=="")//根据ID 查询domain
				this.dm=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+u+"\"]").getAttribute("dm");
				
			this.contact=null;
			var nd=this.node.selectSingleNode("contact");
			if(nd!=null)
				this.contact=new CONTACT(nd);
			
			this.Refresh=function(redraw)
			{//创建对象,根据state创建
				if(this.type=="1")
				{
					//this.Update(this.state,redraw);
					return;//暂时不处理Host用户
				}
				if(this.state=="0")//删除用户
				{
					
				}					
				else
				{
					this.Update("ONLINE",redraw);
				}
			}
			
			this.CheckUpdate=function(gid,redraw)
			{//先检查是否存在
				node=xmldata.selectSingleNode()
			}
			
			this.Update=function(gid,redraw)
			{//将用户复制到指定组下,gid决定了图标
				if(this.type=="1"){
					return;
					 
				}
				node=xmldata.XMLDocument.createNode(1,"U","");
				//id属性
				na=xmldata.XMLDocument.createAttribute("r");
				node.attributes.setNamedItem(na);
				node.setAttribute("r",this.id);

				//image属性
				na=xmldata.XMLDocument.createAttribute("i");
				node.attributes.setNamedItem(na);
				node.setAttribute("i",this.IMG(gid,this.state,this.visit));
				
				na=xmldata.XMLDocument.createAttribute("t");
				node.attributes.setNamedItem(na);
				if(this.visit==1)
					node.setAttribute("t","以前曾访问过本网站");
				else if(this.visit==2)
					node.setAttribute("t","上次与"+this.talker+"交谈过");
				else if(this.visit==3)
					node.setAttribute("t","上次与自己交谈过");				

				//设置prefix属性
				this.setPrefix();				

				//设置状态属性
				na=xmldata.XMLDocument.createAttribute("s");
				node.attributes.setNamedItem(na);
				node.setAttribute("s",this.state);
																
				//设置对话对象属性
				na=xmldata.XMLDocument.createAttribute("tag");
				node.attributes.setNamedItem(na);
				try
				{
					node.setAttribute("tag",this.tag);
				}
				catch(e)
				{}

				//text属性
				na=xmldata.XMLDocument.createAttribute("tt");
				node.attributes.setNamedItem(na);
				node.setAttribute("tt",this.Text());
				//prefix属性
				if(this.prefix!="")
				{
					na=xmldata.XMLDocument.createAttribute("p");
					node.attributes.setNamedItem(na);
					node.setAttribute("p",this.prefix);				
					//prefixColor属性
					na=xmldata.XMLDocument.createAttribute("pc");
					node.attributes.setNamedItem(na);
					node.setAttribute("pc",this.prefixColor);
				}
				//增加到相应组中
				
				(new Group(gid,this.dm)).AddUser(node,redraw);					
			}
			
			this.setPrefix=function()
			{
				var px="",color="";
				nd=this.node.selectSingleNode("I");
				if(nd!=null)
				{//根据搜索引擎及广告类型决定文字
					var ip=nd.getAttribute("i");
					if(ip==myip)
						engine="同事";
					else
						engine=nd.getAttribute("e");

					if(engine!=""&&engine!=null)
						this.prefix="["+engine+"]";
					else
						this.prefix="";

						
					switch(nd.getAttribute("ad").toString())
					{
						case "0":
							this.prefixColor="blue";
							break;
						case "1":
							this.prefixColor="red";
							break;
						case "2":
							this.prefixColor="green";
							break;								
					}
				}			
			}
			
			this.IMG=function(gid,state,typing)
			{
				var type=0;
				if(gid==10&&state=="10")
					type="0";
				else
					type=state.toString();
				
				var img="img/";
				switch(type)
				{
					case "OFFLINE":
						break;
					case "TALKING":
						img+="im.gif";
						break;
					default:
						if(typing=="1")
							img+="backagain.gif";
						else if(typing=="2")
							img+="talkedwithothers.gif";
						else if(typing=="3")
							img+="talkedwithme.gif";
						else
							img+="blank.gif";
						break;
				}
				return img;
			}
			
			this.Text=function()
			{//获取要显示内容,主要根据姓名，来源及方式决定
				var t="",color="",prfix="";;
				if(this.type=="999" || this.type=='9' || this.type=='99')
					t=this.name;
				else if(this.contact==null)
					t=this.id;
				else
					t=this.contact.name;
				
				return t;
			}
			
			this.Remove=function()
			{//删除用户
				var group;
				if(this.type=="1")
					return;
				if(this.state=="TALKING")
				{
					group=new Group(this.state);
					if(group!=null)
						group.RemoveUser(this.id);
				}
				group=new Group("ONLINE",this.dm);
				group.RemoveUser(this.id);
				this.node.parentNode.removeChild(this.node);
			}
			
			return this;
		}

		function formatdate()
		{
			var d=new Date();
			var s=tw(d.getMonth()+1)+"-"+tw(d.getDate())+" "+tw(d.getHours())+":"+tw(d.getMinutes());
			return s;
		}
		
		function tw(s)
		{
			s=s.toString();
			return (s.length==1)?"0"+s:s;			
		}
		
		function Group(gid,dm)
		{//Group对象，增加用户，修改状态等
			this.node=null;
			if(gid.indexOf("TALKING")!=-1)
				dm=null;
			if(dm==null)
				this.node=xmldata.XMLDocument.selectSingleNode("//GS/G[@i=\""+gid+"\"]");
			else
			{
				var nodelist=xmldata.XMLDocument.selectNodes("//GS/G[@i=\""+gid+"\"]");
				for(var ni=0;ni<nodelist.length;ni++)
					if(nodelist.item(ni).getAttribute("tag")==dm)
					{
						this.node=nodelist.item(ni);
						break;
					}
			}
			
			this.tag=dm;
			
			this.count=this.node.getAttribute("c");
			
			this.div=function()
			{
				if(this.tag==null)
					return document.getElementById("tg"+gid);
				else
					return document.getElementById("tg"+gid+this.tag);
			}
			
			this.Redraw=function()
			{//重新绘制界面
				var exp=this.expanded();
				this.div().outerHTML=this.node.transformNode(xsldata.XMLDocument);
				if(exp)
					this.Expand();
			}
			
			this.isExists=function(uid)
			{//检测用户是否存在
				node=this.node.selectSingleNode("U[@r=\""+uid+"\"]");
				return (node!=null);
			}
			
			this.AddCount=function()
			{
				if(this.count==null)
				{
					n=xmldata.XMLDocument.createAttribute("c");
					this.node.attributes.setNamedItem(n);
				}
				
				this.node.setAttribute("c",this.node.childNodes.length);
			}
			
			this.AddUser=function(unode,redraw)
			{//redraw指明是否更新显示,首先查找是否存在指定对象,如果存在则将指定ID的Node用Unode取代
				uid=unode.getAttribute("r");
				
				tnode=this.node.selectSingleNode("U[@r=\""+uid+"\"]");
				
				if(tnode!=null)//已存在
					this.node.replaceChild(unode,tnode);
				else
					//this.node.appendChild(unode);
					this.node.insertBefore(unode,this.node.childNodes.item(0));

				this.AddCount();
				
				if(redraw)//及时更新,用于node对应的
					this.Redraw();	
					
			}
			
			this.RemoveUser=function(uid)
			{//删除指定用户
				tnode=this.node.selectSingleNode("U[@r=\""+uid+"\"]");
				if(tnode!=null)
				{
					this.node.removeChild(tnode);
					this.node.setAttribute("c",this.node.childNodes.length);
					this.Redraw();
				}
			}
			
			this.Expand=function()
			{
				expand(this.div());	
			}
			
			this.expanded=function()
			{//是否已展开
				if(this.div().open=="true")
					return true;
				else
					return false;
			}

			return this;
		}
		
	function initdata()
	{
		var nodelist=xmldata.XMLDocument.documentElement.selectNodes("//US/U");
		var user,group;
			
		for(var ni=0;ni<nodelist.length;ni++)
		{
			node=nodelist.item(ni);
			(new User(node)).Refresh(false);				
		}
		
		tree.innerHTML = xmldata.XMLDocument.documentElement.transformNode(xsldata.XMLDocument);
//clipboardData.setData("text",tree.innerHTML);		
		//如果有留言状态转换为对话状态，即有
		nodelist=xmldata.XMLDocument.documentElement.selectNodes("//TalkHistory");
		var msgs;
		for(var ni=0;ni<nodelist.length;ni++)
		{
			node=nodelist.item(ni);
			vid=node.getAttribute("toid");
//window.alert(vid);
			msgs=node.selectNodes("M");
			chatHistory[vid]="";
			for(var nj=0;nj<msgs.length;nj++)//生成对话记录
			{
				node=msgs.item(nj);
				frmid=node.getAttribute("f");Msg=unescape(node.getAttribute("m"));time=node.getAttribute("tm")						
				chatHistory[vid]+=formatMsg((frmid==thisid)?"您":frmid,(frmid==thisid)?0:1,time,Msg);
			}
			//加入talking组,找出node
			node=xmldata.XMLDocument.documentElement.selectSingleNode("//US/U[@i=\""+vid+"\"]");
//window.alert(node);
			var u=new User(node);
			u.Update("TALKING",true);
			expand(document.getElementById("tgTALKING"),true);
			GetTalkingObject(vid).className="itemAlert";
			setAlert(vid,true);			
		}
		//生成状态html
		statushtml="<table border=0 style='font-size:12px;cursor:hand' width=100%><tr  onclick='window.parent.ChangeState(\"ONLINE\");' ><td width=10><img src=img/status/online.gif width=12 height=12></td><td>在线</td></tr><tr  onclick='window.parent.ChangeState(\"BUSY\");' ><td><img src=img/status/busy.gif width=12 height=12></td><td>繁忙</td></tr><tr  onclick='window.parent.ChangeState(\"LEFT\");' ><td><img src=img/status/left.gif width=12 height=12></td><td>离开</td></tr><tr  onclick='window.parent.ChangeState(\"ONPHONE\");' ><td><img src=img/status/onphone.gif width=12 height=12></td><td>电话中</td></tr><tr><td colspan=2></td></tr></table>"
	}
		

	function showStatus()
	{
		oPopup = window.createPopup();
		var oPopBody = oPopup.document.body;
		oPopBody.style.backgroundColor = "honeydew";
		oPopBody.style.border = "solid black 1px";
		oPopBody.innerHTML = statushtml;
		oPopup.show(158,event.y+10,100,100,document.body);
	}
	
	function GetTalkingObject(id)
	{
		id="TALKING_"+id;
		return document.getElementById(id);
	}
	
	function MSG(node)
	{//根据node创建msg对象
		this.frmid=node.getAttirubte("f");
		this.toid=node.getAttirubte("t");
		this.type=node.getAttirubte("tp");
	
	}
	
	function SetIPData(sid)
	{
		node=xmldata.XMLDocument.selectSingleNode("//US/U/I[../@i=\""+sid+"\"]");
		if(node!=null)
			ipdata.innerHTML=node.transformNode(vsxsldata.XMLDocument);

	}
	
	function SetVSData(sid)
	{
		node=xmldata.XMLDocument.selectSingleNode("//US/U/VS[../@i=\""+sid+"\"]");
		if(node!=null)
		{
			vsdata.innerHTML=node.transformNode(vsxsldata.XMLDocument);
			vsdata.scrollTop=32000;   			
		}
	}
	
	
	function SetReadAttribute(sid)
	{
		node=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+sid+"\"]");
		if(node!=null)
		{
			if(node.getAttribute("rd")==null)
			{
				na=xmldata.XMLDocument.createAttribute("rd");
				node.attributes.setNamedItem(na);
				node.setAttribute("rd","true");
			}
		}
		nodeGroup=xmldata.XMLDocument.selectSingleNode("//GS/G[@i=\"ONLINE\"]");
		node=nodeGroup.selectSingleNode("//U[@r=\""+sid+"\"]");
		if(node!=null)
		{
			if(node.getAttribute("rd")==null)
			{
				na=xmldata.XMLDocument.createAttribute("rd");
				node.attributes.setNamedItem(na);
				node.setAttribute("rd","true");
			}
		}		
	}	
	
	
	function GetUsername(uid)
	{
		var node=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+uid+"\"]");
		if(node.getAttribute("t")=='999' || node.getAttribute("t")=='9' || node.getAttribute("t")=='99')
			return node.getAttribute("n");
		node=node.selectSingleNode(".//contact");
		if(node!=null)
		{
			uid=node.getAttribute("name");
			noted=true;
		}
		else
			noted=false;
			
		return uid;
	}
	
	function SetContactTitle(uid)
	{
		var s="ID:"+uid+"\r\n";
		node=xmldata.XMLDocument.selectSingleNode("//US/U/contact[../@i=\""+uid+"\"]");
		if(node==null)
			return;
		s+="姓名:"+node.getAttribute("name")+"\r\n";
		if(node.getAttribute("sex")!=null)
			if(node.getAttribute("sex")=="1")
				s+="性别:男\r\n";
			else
				s+="性别:女\r\n";
				
		if(node.getAttribute("workphone")!=null)
			s+="电话:"+node.getAttribute("workphone")+"\r\n";			
		if(node.getAttribute("mobilephone")!=null)
			s+="手机:"+node.getAttribute("mobilephone")+"\r\n";						
		if(node.getAttribute("sht")!=null)
			s+="市话通:"+node.getAttribute("sht")+"\r\n";			
		if(node.getAttribute("email")!=null)
			s+="邮件:"+node.getAttribute("email")+"\r\n";						
		if(node.getAttribute("qq")!=null)
			s+="QQ:"+node.getAttribute("qq")+"\r\n";			
		if(node.getAttribute("msn")!=null)
			s+="MSN:"+node.getAttribute("msn")+"\r\n";
		if(node.getAttribute("address")!=null)
			s+="地址:"+node.getAttribute("address")+"\r\n";
		if(node.getAttribute("type")!=null)
			s+="类别:"+node.getAttribute("type")+"\r\n";
						
		notesign.title=s;

		if(node.getAttribute("website")!=null&&node.getAttribute("website")!="")
		{
			url=node.getAttribute("website");
			notesign.onclick=function()
			{
				openlink(url);
			}
			notesign.src='img/note2.gif';
			notesign.title+="-----------\r\n点击查看详情";
		}
		else
		{
			notesign.onclick=null;
			notesign.src='img/note.gif';			
		}
	}
	
	
	function ClickUser(obj)
	{//点击用户后操作，显示IP属性，以及对话记录 
		if(obj==null)
			return;
		var id=obj.id;
		var ni=id.indexOf("_");
		groupid=id.substring(0,ni);userid=id.substring(ni+1);//,id.length-ni-1);
		var username=GetUsername(userid);
		currentuser.innerText=username;currentgroup=groupid;
		if(noted)
		{
			notesign.style.display="inline";
			SetContactTitle(userid);
		}
		else
			notesign.style.display="none";
	
		SetIPData(userid);
		SetVSData(userid);
		SetReadAttribute(userid);
		
		if(currentstate==1&&current!=null)//交谈中,保存对话内容
			chatHistory[current]=document.frames("historyframe").HistoryList.innerHTML;
			
		if(current!=null&&keyview==true)
		{
			keyview=false;
			SendKeyInfo(false,current);
		}
		
		current=userid;
		
		switch(groupid)
		{
			case "TALKING":
				currentstate=1;
				document.frames("historyframe").HistoryList.innerHTML=chatHistory[current];
				scrolltobottom();
				break;
			default:
				if(groupid=="ONLINE")
				{	
					var userNode=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+userid+"\"]");
					if(userNode.getAttribute("t")=='999' || userNode.getAttribute("t")=='9' || userNode.getAttribute("t")=='99')//如果点击群组人员或好友
					{
						var nodelist=xmldata.XMLDocument.selectNodes("//GS/G[@i=\""+groupid+"\"]");
						var theGroupName="";
						for(var ni=0;nodelist!=null && ni<nodelist.length;ni++)
							if(nodelist.item(ni).getAttribute("tag")==userNode.getAttribute("tag"))
						 	{
								theGroupName=nodelist.item(ni).getAttribute("t");
								break;
							}
						if(currentstate==0)
							currentstate=1;
						if(current==null)
							current=id;
						if(userNode.getAttribute("t")=='999')
						    document.frames("historyframe").HistoryList.innerHTML +="<br><font color=green>向同事 "+userNode.getAttribute("n")+" 发送消息</font>";		
						else if(userNode.getAttribute("t")=='9')
						    document.frames("historyframe").HistoryList.innerHTML +="<br><font color=green>向 "+userNode.getAttribute("n")+" 所在的群"+theGroupName+"发送消息</font>";	
						else if(userNode.getAttribute("t")=='99')
						    document.frames("historyframe").HistoryList.innerHTML +="<br><font color=green>向好友 "+userNode.getAttribute("n")+" 发送消息</font>";		 
					}
					else
					{	
						if(userNode.getAttribute("s")=="TALKING")
						{
							document.frames("historyframe").HistoryList.innerHTML +="<br><font color=green>访问者 "+searchusername(userid)+" 已经在对话中, <font color=red>你不能再邀请</font></font>";	
						}
						else
						{			 			
							currentstate=2;
							document.frames("historyframe").HistoryList.innerHTML +="<br><font color=green>向 "+searchusername(userid)+" 发送对话邀请(输入邀请内容后点击<font color=red>发送</font>按钮)</font>";			 
						}
					}
				}
				else
				{
					currentstate=0;
					document.frames("historyframe").HistoryList.innerHTML="";
				}
				break;
		}
		
		if(preObj!=null)
			if(document.getElementById(preObj)!=null)
				document.getElementById(preObj).className="itemNormal";
			//preObj.className="itemNormal";

		hightuser(obj);
		
		preObj=obj.id;

		document.getElementById("talkstatus").innerHTML="";
		msg.focus();
	}
	
	function setObjectStyle(s,obj)
	{
		try
		{
			switch(s)
			{
				case "itemnormal":
					obj.className="itemNormal";
					obj.all("caption").style.color="black";
					break;
				case "itemselect":
					obj.className="itemSelect";
					obj.all("caption").style.color="hotpink";
					break;			
			}
		}
		catch(e)
		{}
	}
	
	function ClearCurrent()
	{
		vsdata.innerText="";
		ipdata.innerText="";	
		currentgroup=null;current=null;
		currentuser.innerText="";document.frames("historyframe").HistoryList.innerText="";//msg.innerText="";
		notesign.style.display="none";
	}

	function jumptotalk(id)
	{
		ClickUser(document.getElementById("TALKING_"+id));
	}
	
	function hightuser(obj)
	{
		setAlert(obj.id,false);			
		obj.className="itemSelect";
		obj.style.color="hotpink";
		obj.all("caption").style.color="hotpink";	
	}

	function setAlert(id,md)
	{
		var obj=document.getElementById("TALKING_"+id);
		if(obj==null)
			return;
		if(md)
			obj.all("caption").style.color="white";
		else
			obj.all("caption").style.color="hotpink";
	}
	
	function searchusername(fid)
	{
		node=xmldata.XMLDocument.selectSingleNode("//US/U/I[../@i=\""+fid+"\"]");
		if(node==null)
			node=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+fid+"\"]");//can be client
		if(node!=null)
			return GetUsername(fid);
		else
			return fid;
	}
	function addAttribute(node,attribute,value)
	{
		na=xmldata.XMLDocument.createAttribute(attribute);
		node.attributes.setNamedItem(na);
		node.setAttribute(attribute,value);		
	}
	function processxml()
	{
			if(xmlDoc.readyState!=4)
				return;
	 		//如果连接状态为断开，显示为连接
			if(isConnected==false)
			{
				document.getElementById("netStatus").innerHTML="网络:<font color='green'>正常</font>";
				if(lastMsg != null && lastMsg != "null" && !msgSent)
				{	
					var lastMsg0=lastMsg;				
					var index=lastMsg.indexOf("&msg=");
					if(index>0)
						lastMsg=lastMsg.substring(index+5);
					index=lastMsg.indexOf("&toid=");
					if(index>0)
						lastMsg=lastMsg.substring(0,index);					
					document.frames("historyframe").HistoryList.innerHTML+=formatMsg("",3,formatdate(),"重发上次消息...<br>");
					msgSent=true;
					scrolltobottom();					
					SendMessage(lastMsg0);
					lastMsg=null;
				}				
				isConnected=true;				
			}	
			var msgtype,frmid,toid,Msg,state;
			var nodelist=xmlDoc.selectNodes("//M");			 
			var node;
			//var messageIds=""; //已经读取到本地的短信息id
			crcIds="";
 
			for(var ni=0;ni<nodelist.length;ni++)
			{
				node=nodelist.item(ni);
				//messageIds +=node.getAttribute("id")+",";//多个已经读取到本地的短信息id
				if(crcIds != node.getAttribute("id") && crcIds.indexOf(","+node.getAttribute("id")+",")<0)
		 			crcIds +=node.getAttribute("id")+",";//多个已经读取到本地的短信息id

				msgtype=node.getAttribute("tp");frmid=node.getAttribute("f");toid=node.getAttribute("t");
				Msg=unescape(node.getAttribute("m"));time=node.getAttribute("tm");tag=unescape(node.getAttribute("tag"));
				node=xmldata.XMLDocument.selectSingleNode("//US/U[@i=\""+frmid+"\"]");

				try
				{
					switch(msgtype)
					{
						case "ONPAGEINIT"://进入网站,首先查找该用户是否存在，然后更新信息
							nodeNew=xmlDoc.selectSingleNode("//U");
							nodeGroup=xmldata.XMLDocument.selectSingleNode("//US");
							if(node==null)
								nodeGroup.appendChild(nodeNew);
							//else//node已存在 不更新
							//	nodeGroup.replaceChild(nodeNew,node);

							new User(nodeNew).Refresh(true);
							//new Group("ONLINE").Expand();
							if(currentgroup=="ONLINE"&&current!=null)
								hightuser(document.getElementById("ONLINE_"+current));
								
							if(setalert.checked)
							{
								node=xmldata.XMLDocument.selectSingleNode("//US/U/I[../@i=\""+frmid+"\"]");
								if(node!=null)
								{
									frmid=GetUsername(frmid);
									if(!keyview)
										showmsg(frmid,"访客:"+frmid+"进入"+nodeNew.getAttribute("dm"),"",node.transformNode(vsxsldata.XMLDocument));
									else
										innershowmsg(frmid,"访客:"+frmid+"进入"+nodeNew.getAttribute("dm"),node.transformNode(vsxsldata.XMLDocument));
								}
								if(!keyview)
									playSound(2);								
							}
							break;
						case "ONPAGE"://进入网页,增加访问记录
							if(node!=null)
							{
								node=node.selectSingleNode("VS");
								nodeNew=xmlDoc.selectSingleNode("//T");
								if(node!=null&&nodeNew!=null)
								{
									node.appendChild(nodeNew);
									if(current==frmid)
										SetVSData(current);
								}
							}
							break;
						case "SHINVITATION":
							document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,"发送给用户<font color=red>"+searchusername(frmid)+"</font>的邀请在等待用户应答");
							scrolltobottom();
							break;
						case "FLINVITATION":
							document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,"发送给用户<font color=red>"+searchusername(frmid)+"</font>的邀请<font color=red>失败</font>:用户未在任何有效页面浏览");
							scrolltobottom();					
							break;
						case "RJINVITATION":
							document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,"用户<font color=red>"+searchusername(frmid)+"</font>暂时<font color=red>不需要</font>对话");
							scrolltobottom();									
							break;		
						case "ONTALK"://进入对话							
							if(node==null)
							{ 
								//nodeNew=xmldata.XMLDocument.createNode(1, "U", "");
								//addAttribute(nodeNew,"i",frmid);								 
								//addAttribute(nodeNew,"dm","");														 
								//node.appendChild(nodeNew); 
								continue;								
							}	
							node.setAttribute("s","TALKING");
							if(tag!="null")
								node.setAttribute("tag",tag);
							var u=new User(node);
							u.Refresh(true);
							if(toid==thisid)//本人对话
							{
								u.Update(u.state,true);
								if(chatHistory[frmid]==null)
									chatHistory[frmid]="";
								if(frmid==current||current==null)//转至对话窗口
									ClickUser(document.getElementById("TALKING_"+frmid));
								else
								{
									frmid=searchusername(frmid);
									document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,"用户<font color=red>"+frmid+"</font>已<font color=red>进入</font>对话状态,点击<a href=# onclick=\"window.top.jumptotalk('"+frmid+"');return false;\">此处</a>与其对话");		
								}

								new Group("TALKING").Expand();
								if(!keyview)
									playSound(1);						
								window.focus();						
								msg.focus();
							}
							//new Group("ONLINE").Expand();
							break;
						case "OFFTALK"://退出对话
							if(node==null)
								continue;
													
							if(toid==thisid)//退出对话
							{
								new Group("TALKING").RemoveUser(frmid);
								if(frmid==current)
									ClearCurrent();
								//window.focus();
							}
							node.setAttribute("s","OFFTALK");
							var u=new User(node);u.talker=thisname;u.visit=3;
							u.Refresh(true);
							if(!keyview)
								playSound(4);
							break;
						case "STATECHANGE"://状态变化，包括online,offline
							if(node!=null)
							{
								node.setAttribute("s",Msg);
								if(tag!="null")
									node.setAttribute("tag",tag);
								switch(Msg)
								{
									case "OFFLINE":
										try
										{
											new Group("TALKING").RemoveUser(frmid);										
										}
										catch(e)
										{}
										new User(node).Remove();
										//new Group("ONLINE").Expand();
										if(current==frmid)
											ClearCurrent();
										if(!keyview&&setalert.checked)
											playSound(3);
										break;
									default:
										new User(node).Refresh(true);
										break;								
								}
								if(currentgroup=="ONLINE"&&current!=null)
									hightuser(document.getElementById("ONLINE_"+current));
							}
							break;
						case "TALKMSG":
							if(node!=null)
							{								 						
								if(current==frmid&&currentstate==1)
								{									
									document.frames("historyframe").HistoryList.innerHTML+=formatMsg(searchusername(frmid),1,time,Msg);
									scrolltobottom();
									if(!keyview)
									{
										window.focus();
										msg.focus();	
									}
								}
								else
								{
									chatHistory[frmid]+=formatMsg(searchusername(frmid),1,time,Msg);
									expand(document.getElementById("tgTALKING"),true);
									GetTalkingObject(frmid).className="itemAlert";
									setAlert(frmid,true);
									window.focus();									
									 
								}
								
								document.getElementById("talkstatus").innerText="";
								if(!keyview)
									playSound(0);
							}							
							break;
						case "GKMSG"://
							if(Msg=="OPENGUOKE")
								document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,frmid+"打开过客窗");
							else if(Msg=="CLOSEGUOKE")
								document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,frmid+"关闭过客窗");
							else
								document.frames("historyframe").HistoryList.innerHTML+=formatMsg("过客"+frmid,1,time,Msg);
							break;
						case "KEYSTATUS"://输入信息
							if(frmid==current)
							{
								var obj=document.getElementById("talkstatus");
								if(Msg.indexOf("0")==0)//显示
									obj.innerHTML="";				
								else
									obj.innerHTML="<img src=img/status/typing.gif width=12 height=12> "+searchusername(frmid)+"输入: "+Msg;
									
							}
							break;
						case "TRANSFER"://转接对话
							var nj=Msg.indexOf(",");
							var frm=Msg.substring(0,nj),vid=Msg.substring(nj+1);
							formatMsg("",2,formatdate(),frm+"将与"+searchusername(vid)+"的对话转移给您");
							break;
						case "SETNOTE"://设置新的标注信息
							//var cnode=nodelist.item(ni).selectSingleNode("contact");
							var cnode=xmlDoc.selectSingleNode("//contact");
				 	
							if(node==null||cnode==null)
								return;
				 
							var contactnode=node.selectSingleNode(".//contact");
							
							if(contactnode==null)//需要新增
								node.appendChild(cnode);
							else
								node.replaceChild(cnode,contactnode);							
								
							//重新刷新
							new User(node).Refresh(true);						
							if(currentgroup=="ONLINE"&&current!=null)
								hightuser(document.getElementById("ONLINE_"+current));
							//是否在对话中
							if(new Group("TALKING",null).isExists(frmid))
							{
								new User(node).Update("TALKING",true);
								if(currentgroup=="TALKING"&&current!=null)
									hightuser(document.getElementById("TALKING_"+current));
							}
							
							if(frmid==current)//更新当前显示
							{
								currentuser.innerText=GetUsername(frmid);
								notesign.style.display="inline";
								SetContactTitle(frmid);
							}
							break;
						case "DELNOTE":
							var contactnode=node.selectSingleNode(".//contact");
							
							if(contactnode!=null)
								node.removeChild(contactnode);

							new User(node).Refresh(true);						
							if(currentgroup=="ONLINE"&&current!=null)
								hightuser(document.getElementById("ONLINE_"+current));
							//是否在对话中
							if(new Group("TALKING",null).isExists(frmid))
							{
								new User(node).Update("TALKING",true);
								if(currentgroup=="TALKING"&&current!=null)
									hightuser(document.getElementById("TALKING_"+current));
							}
							
							if(frmid==current)//更新当前显示
							{
								currentuser.innerText=GetUsername(frmid);
								notesign.style.display="none";
							}						
							break;
						case "SYSNOTIFY"://由外部链入
							document.frames("historyframe").HistoryList.innerHTML+=formatMsg(frmid,2,time,Msg);
							break;
					}
				}
				catch(e)
				{}
			}
			//crcIds=messageIds;
	}
	 
	function ProcessMsg(s)
	{
		//debug+=s+"\r\n";
		if(s=="reConnect();")
		{
			reConnect();
			return;
		}
		xmlDoc.async=true;xmlDoc.resolveExternals = false;
		xmlDoc.onreadystatechange = processxml;
		xmlDoc.loadXML(s);
	}		
	
	function MyAlert(s)
	{
		alert(s);	
	}
	
	function getUserList()
	{//获取当前用户列表
		var nodelist=xmldata.XMLDocument.selectNodes("//US/U");
		var node;
		var s="";
		for(var ni=0;ni<nodelist.length;ni++)
		{
			node=nodelist.item(ni);
			if(node.getAttribute("t")==0)
				s+=node.getAttribute("i")+","+node.getAttribute("s")+",";
		}
		if(s.length>0)
			s=s.substr(0,s.length-1);
		return escape(s);
	}
	
	

	
	function ReadMessage()
	{//根据时间，决定是简单读信息还是带检查的读信息
		var rurl=null,b2=false,list=null;
		if(lasttime==null)
			lasttime=new Date();
		var n=(new Date()).getMinutes()-lasttime.getMinutes();

		if(Math.abs(n)<1)
			rurl="msgManager.jsp?vid="+thisid+"&a=1"+"&crcIds="+crcIds;
		else
		{
		     
		    rurl="msgManager.jsp?vid="+thisid+"&a=10"+"&crcIds="+crcIds+"&";  //获取发往所有服务人员的信息
		    b2=true;
		    list="l="+getUserList();
		    lasttime=new Date(); 		     
		}
		if(objread.object==null)
		{
			var bok=false;
			if(b2)
				bok=msgread2(rurl,true,objread,ProcessMsg,list);
			else
				bok=msgread(rurl,true,objread,ProcessMsg);					 
			if(!bok)
			{
				if(isConnected ){					 
					document.getElementById("netStatus").innerHTML="网络:<font color='red'>连接...</font>";
					scrolltobottom();
					//isConnected=false; //不能将isConnected=false,因为msgread()返回时，可能请求正在进行
					//window.clearInterval(readtimer);			
				}				
			}
			else
				crcIds="";			 
		}
		else if((((new Date())-objread.time)/1000)>=30) //from 60 to 30
		{
			objread.object.abort();
			objread.object=null;			
			document.getElementById("netStatus").innerHTML="网络:<font color='red'>连接....</font>";
			scrolltobottom();
			//window.clearInterval(readtimer);
			isConnected=false;		
		}		
		
		if(keyview)//键输入
		{
			d=(new Date())-LastTime;
			if((d/1000)>5)
			{
				keyview=false;
				if(current!=null)
				{
					SendKeyInfo(false,current);
					keyview=false;
				}
			}	
		}
		
		if(lastsoundtime!=null)
		{
			var n=(new Date()).getSeconds()-lastsoundtime.getSeconds();
			if(Math.abs(n)>5)
			{
				lastsoundtime=null;
				soundeffect.src="";
			}
		}		
	}
	
	function SayMeLogoff()
	{
		msgread("msgManager.jsp?a=8&vid="+thisid,false,null,null);
		try
		{
			if(objread.object!=null)
				objread.object.abort();
			objread=null;
			if(objsend.object!=null)
				objsend.object.abort();
			objsend=null;
			if(objkey.object!=null)
				objkey.object.abort();
			objkey=null;
		}
		catch(e)
		{}		
	}
	
	function ShowDropPopup(tp)
	{
		showModelessDialog("chooseurl.htm",window,"status:false;dialogWidth:300px;dialogHeight:360px");
	}
	function initClient()
	{
		var obj=null;
		var url="http://"+webUrl+"/clientInit.jsp?vid="+thisid+"&curURL="+curURL;
		try{obj = new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){ obj = new XMLHttpRequest();}
		if(obj){
			obj.onreadystatechange=function()
			{ 
				if(obj.readyState==4)
				{
					if (obj.status==200)
					{
						var sResult=obj.responseText;							
						myXml=document.createElement("xml");	
						myXml.id="xmldata"; 
						myXml.innerText=sResult.substring(0,sResult.length-6);
						var head = document.getElementsByTagName('head')[0]; 
						head.appendChild(myXml);
						obj=null;	
		initdata();  //defined in manage.js
		readtimer=window.setInterval("ReadMessage()",3000); //ReadMessage() is defined in manage.js
		window.attachEvent("onunload",SayMeLogoff);
		window.attachEvent("onbeforeunload",ConfirmOut);

		reloadShortCut();				 
					}
				}
			}	 
			obj.open("GET",url,false);
			obj.send();
		}
	}
	function loadNewGroups()
	{	 
		var obj=null;
		var url="http://"+webUrl+"/manage/hyqz_data.jsp";
		try{obj = new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){ obj = new XMLHttpRequest();}
		if(obj){
			obj.onreadystatechange=function()
			{ 
				if(obj.readyState==4)
				{
					if (obj.status==200)
					{
						var sResult=obj.responseText;	
						try{
						var items= sResult.split("|");
						var group=document.getElementById("hyqz");
						for(var i=0;group!=null && items!=null && i<items.length;i++){
							group.innerHTML +=items[i]+"<br>";
						}
						group.innerHTML +="<a href='#' onClick=window.open('manage/clientManage.jsp?action=group&vid='+thisid+'&sid='+sid,'ydmanage')>更多群组 加入群组</a>";
						}catch(e){}
					}
				}
			}	 
			obj.open("GET",url,false);
			obj.send();
		}
	}
	var maxSiteId="0";
	function reloadLatestSites()
	{	 
		var obj=null;
		var url="http://"+webUrl+"/manage/latestSites_data.jsp?maxDomainId="+maxSiteId;
		try{obj = new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){ obj = new XMLHttpRequest();}
		if(obj){
			obj.onreadystatechange=function()
			{ 
				if(obj.readyState==4)
				{
					if (obj.status==200)
					{
						var sResult=obj.responseText;	
						try{
						var latestSites=document.getElementById("latestSites");				
						if(latestSites!=null) {
							var index=sResult.indexOf("maxId=");
							maxSiteId=sResult.substring(index+6);
							var cont=sResult.substring(0,index);
							latestSites.innerHTML=cont+latestSites.innerHTML;
						}
						}catch(e){}
					}
				}
			}	 
			obj.open("GET",url,false);
			obj.send();
		}
		setTimeout('reloadLatestSites()',120000);
	}
	 
	function SystemInitial()
	{
 
		initTransfer2(); //defined in msg.js 

		//initdata();  //defined in manage.js
		//readtimer=window.setInterval("ReadMessage()",3000); //ReadMessage() is defined in manage.js
		//window.attachEvent("onunload",SayMeLogoff);
		//window.attachEvent("onbeforeunload",ConfirmOut);
		 
		//设置iframe内容
		//document.frames("historyframe").document.body.innerHTML="";
		checksize();
		//new Group("ONLINE").Expand();
		setstate(thisstate);
 
		//关闭原窗口
		if(window.opener!=null&&window.opener!="xx")
		{
			try
			{
				window.opener.opener="xx";
				window.opener.close();
			}
			catch(e)
			{}
		}
		try{window.opener="xx";}catch(e){}
//loadNewGroups();
setTimeout('initClient()',100);
setTimeout('loadNewGroups()',400);
setTimeout('reloadLatestSites()',1000);

	}
	
   function ConfirmOut()
   {
		event.returnValue="离开当前窗口会自动退出系统，是否继续?";
   }
   
   function formatMsg(mname,mtype,time,str)
   {
   	  if(mtype==0)//自己
   	    str="<p style=\"margin-top: 0; margin-bottom: 0.5em\"><font color=red>"+mname+" 说:</font><font color=green>("+time+"</font>)<br>"+str+"</p>"; 
   	  else if(mtype==1)
		str="<p style=\"margin-top: 0; margin-bottom: 10px\"><font color=blue>"+mname+" 说:</font><font color=green>("+time+"</font>)<br>"+str+"</p>"; 
	  else if(mtype==2)//系统
		str="<p style=\"margin-top: 0; margin-bottom: 10px\"><font color=green>系统消息:"+str+"("+time+")</font></p>"; 
	  
	  return str;
   }
   
   function checkkey()
   {
		if(!keyview&&current!=null&&currentgroup=="TALKING")
		{
			keyview=true;
			SendKeyInfo(true,current);
		}
		LastTime=new Date();
   }

   function SendMsg()
   {
	if(!isConnected)
	{		
		document.getElementById("talkstatus").innerHTML="<font color=red>网络不通</font>, 正在重新连接,请稍候再发。";	
		return;
	}
		if(event.keyCode!=0)
			if(!(event.keyCode==13&&!event.shiftKey))
				return true;


		event.keyCode=0;
		
		if(msg.innerHTML=="")
		{
			alert("不能发送空信息");
			return;
		}
//window.alert(currentstate);
 		//可以发给过客
		if( current==null||currentstate==0 )
		{
			alert("未选择任何对象");
			return false;
		}		 
		var url="msgManager.jsp?msg="+escape(msg.innerHTML)+"&vid="+thisid+"&b=1&toid="+escape(current);				 
//var url="msgManager.jsp?vid="+thisid+"&msg=%CE%D2%C3%C7&toid="+escape(current);

		//////////////////
		if( (new User(current)).type=="9" )			 
			url+="&a=2&gid="+(new User(current)).dm; 
		else if( (new User(current)).type=="99" )			 
			url+="&a=2&friend=true"; 
		else if( (new User(current)).type=="999" )			 
			url+="&a=2&mate=true"; 		
		else if(currentstate==1 && document.getElementById("guanggao").checked==true)//广告
			url+="&a=2&gg=true"; 
		else if(currentstate==2 && document.getElementById("guoke").checked==true)//消息
			url+="&a=2&&gk=true";	
		else if(currentstate==1)
			url+="&a=2";	
		else if(currentstate==2)//邀请
		{//检测是否已在通话中
			if((new User(current)).state=="TALKING")
				if(!confirm("用户"+current+"已在对话中,是否邀请?"))
					return;
			url+="&a=4";
		}		 
//alert(currentstate+" "+url+" "+msg.innerHTML);
		if(SendMessage(url))
		{
			if(currentstate==1 && document.getElementById("guanggao").checked==true)
			   document.frames("historyframe").HistoryList.innerHTML+=formatMsg("系统",0,formatdate(),"系统已向对方发送广告页面:"+msg.innerHTML);
			else
			   document.frames("historyframe").HistoryList.innerHTML+=formatMsg("您",0,formatdate(),msg.innerHTML);
			scrolltobottom();
			msg.innerHTML="";
		}
		msg.focus();
		
		keyview=false;
		SendKeyInfo(false,current);		
		return false;
   }
   
	function SendMessage(msg)
	{
		var bResult=false;
		if(objsend.object!=null)
		{
			if((((new Date())-objsend.time)/1000)>=30)
			{
				objsend.object.abort();
				objsend.object=null;				
				document.getElementById("talkstatus").innerHTML="发送超时,上次消息发送未成功。";
				isConnected=false;
				document.getElementById("netStatus").innerHTML="网络:<font color='red'>连接....</font>";
				scrolltobottom();
			}
			else
			{			
				document.getElementById("talkstatus").innerHTML="上次发送尚未完成,请稍后再发。";
				scrolltobottom();			   
			}
		   return bResult;
		}
		if(objsend.object==null && !msgSent)//如果上次没有发送成功
		{			
			document.getElementById("talkstatus").innerHTML="发送超时,上次消息发送失败。";
			scrolltobottom();
			//msgSent=true;	
			isConnected=false;
			document.getElementById("netStatus").innerHTML="网络:<font color='red'>连接....</font>";
			return false;			 		 
		}
		lastMsg=msg;	
		if(!msgsend(msg,true,objsend,null))
		{			
			document.getElementById("talkstatus").innerHTML="上次发送尚未完成,请稍后再发。";
			scrolltobottom();	
			return false;		   		
		}	
						 
		return true;		 
	}


   function scrolltobottom()
   {
	  document.frames("historyframe").HistoryList.scrollTop=32000;   
   }	
   
   function ShowPopup(mode)
   {
		//var att="dialogLeft:"+event.x+"dialogTop:",url="";
		var att="status=off;help=off;dialogLeft="+event.screenX+";dialogTop=",url="",t="";
		switch(mode.toString())
		{
			case "0"://color
				url="colors.htm";
				att+=event.screenY-120+";dialogWidth=130px;dialogHeight=110px;";
				break;
			case "1":
				url="emotions.htm";
				att+=event.screenY-240+";dialogWidth=260px;dialogHeight=240px;";
				break;
		}
		var x=window.showModelessDialog(url,null,att);
		x.opener=window;
   }   
   
	function doAction(mode,sP2)
	{
		window.focus();
		msg.focus();
		if(mode==0)//set color
			document.execCommand("ForeColor",false,sP2);
		else if(mode==1)
		{
			document.execCommand("InsertImage",false,sP2);
			document.selection.empty();		
			document.body.createTextRange().collapse();						
		}
		window.focus();
		msg.focus();
	}   
	
	function openlink(link)
	{
		var link1=unescape(link);
		if(link1=="")
			return; 
		var index=thisdomain.indexOf(";");
	alert(link1);	
		if(link1.indexOf("://")==-1)//本站内
			link1="http://"+thisdomain+link1;
		var obj=window.open(link1,"linkwindow");
		obj.focus();
	}
	
	function sendText(txt)
	{
		msg.innerText="";
		setText(txt);
		SendMsg();
	}
	
	function setText(txt)
	{
		txt=MapMsg(txt);
		//if(obj.init=="邀请类")
		//	t+="<BR><font color=red>(您无需下载任何插件或程序即可对话)</font>";
		msg.innerHTML=txt;
		scrolltobottom();		
	}
	
	function MapMsg(txt)
	{//根据访客情况映射快捷语
		var k="",a="";
		if(current!=null)
		{
			node=xmldata.XMLDocument.selectSingleNode("//US/U/I[../@i=\""+current+"\"]");
			if(node!=null)
			{
				ipdata.innerHTML=node.transformNode(vsxsldata.XMLDocument);
				if(node.getAttribute("k")!=null)
					k="<font color=blue>"+node.getAttribute("k")+"</font>";
				if(node.getAttribute("a")!=null)
					a="来自<font color=blue>"+node.getAttribute("a")+"</font>";
			}
		}
		txt=txt.replace("{关键词}",k);
		txt=txt.replace("{地域}",a);
		return txt;
	}
	
	function SendKeyInfo(bOn,toid)
	{
		var url="msgManager.jsp?vid="+thisid+"&a=9&toid="+toid+"&msg="+((bOn)?"1":"0");
		var bResult=false;
		if(objkey.object==null)
		{
			if(!msgread(url,true,objkey,null))
			{
				//document.frames("historyframe").HistoryList.innerHTML+=formatMsg("",3,formatdate(),"无法收发信息,请检查网络及对方网站是否可用");				 
				//scrolltobottom();
			}
			else
				bResult=true;
		}
		else if((((new Date())-objkey.time)/1000)>=30)
		{
			objkey.object.abort();
			objkey.object=null;
			//document.frames("historyframe").HistoryList.innerHTML+=formatMsg("",3,formatdate(),"无法收发信息,请检查网络及对方网站是否可用");
			//scrolltobottom();
		}
		return bResult;
	}
		
	
   function NotInService()
   {
		alert("由于短信网关调整,短信用户暂时只能接收访客发送的短信,不能群发短信。\r\n调整完毕后，我们将会以系统消息的方式及时通知用户");
   }
   
   function getStateName(state)
   {
		var statename="";
		switch(state)
		{
			case "ONLINE":
				statename="在线";
				break;
			case "OFFLINE":
				statename="离线";
				break;
			case "ONPHONE":
				statename="通话中";
				break;
			case "LEFT":
				statename="离开";
				break;
			case "BUSY":
				statename="繁忙";
				break;						
		}
		return statename;
   }
   
	function getStateImg(status)
	{
		//window.alert("img/status/"+status.toLowerCase()+".gif");
		return "img/status/"+status.toLowerCase()+".gif";
	}   
   
   function setstate(state)
   {
		document.getElementById("stateimg").src=getStateImg(state);
		document.getElementById("statename").innerText=getStateName(state);
   }
   
   function ChangeState(state)
   {
		oPopup.hide();
		if(SendMessage("msgManager.jsp?&vid="+thisid+"&a=20&msg="+state))
	        {
              	   setstate(state);
		   thisstate=state;
	        }
   }
   
   function reConnect()
   {
		window.focus();
		alert("与服务器连接已断开,需要重新登陆");
		window.detachEvent("onunload",SayMeLogoff);
		window.detachEvent("onbeforeunload",ConfirmOut);	  
		document.URL="http://"+webUrl;
   }


   function toolbarAction(tid)
   {
	    var manwin=null;
	    switch(tid)
	    {
			case 10://字体颜色
			case 20://
				var att="status=off;help=off;dialogLeft="+window.event.screenX+";dialogTop=",url="",t="";
				switch(tid)
				{
					case 10://color
						url="colors.htm";
						att+=window.event.screenY-120+";dialogWidth=130px;dialogHeight=110px;";
						break;
					case 20:
						url="emotions.htm";
						att+=window.event.screenY-240+";dialogWidth=260px;dialogHeight=230px;";
						break;
				}
				var x=window.showModelessDialog(url,null,att);
				x.opener=window;			
				break;
			case 30://保存
				break;
			case 40://清除
				msg.innerText="";
				break;				
			case 50://邀请
				SendMsg();	
				break;
			case 51://结束邀请
				break;
			case 52://结束对话
				TerminateTalk();
				break;
			case 53://对话转接
				showonlinhost();
				break;
			case 54://加入对话
				break;		
			case 60://刷新
				if(confirm("刷新将中断当前所有在进行的对话，是否继续?"))
				{
					window.detachEvent("onunload",SayMeLogoff);
					window.detachEvent("onbeforeunload",ConfirmOut);
					location.reload(true);
				}
				break;
			case 70://离开
				if(confirm("退出系统将中断当前所有在进行的对话，是否继续?"))
				{
					window.detachEvent("onbeforeunload",ConfirmOut);
					window.close();
				}			
				break;
			case 80://查看记录
				manwin=window.open("manage/clientManage.jsp?action=historyMsg&vid="+thisid+"&sid="+sid,"ydmanage");
				break;
			case 90://流量分析
				if(disablecount)
				{
					alert("该选项对您不可用");
					return;
				}
				manwin=window.open("manage/clientManage.jsp?action=webStat&vid="+thisid+"&sid="+sid,"ydmanage");
				break;			
			case 100://系统设置
				manwin=window.open("manage/clientManage.jsp?vid="+thisid+"&sid="+sid,"ydmanage");		
				break;
			case 110://通讯录信息
				manwin=window.open("manage/clientManage.jsp?action=contact&vid="+thisid+"&sid="+sid,"ydmanage");
				break;
			case 120://发送文件
				if(current==null||currentstate!=1)
				{
					alert("只能向在线交谈用户发送文件");
					return false;
				}
				var uform=document.getElementById("uploadform");
				if(uform.style.display=="none")
				{
					document.frames("uploadframe").document.URL="upload.jsp?id="+thisid+"&toid="+current;
					uform.style.display="inline";
				}
				break;
			case 130://标注用户
				//alert("标注功能测试中,即将对用户开放...");
				//return;
				if(current==null||currentstate!=1)
				{
					alert("只能标注当前对话用户");
					return false;
				}
				uform=document.getElementById("setnoteform");
				if(uform.style.display=="none")
				{
					SetLabel(current);
					uform.style.display="inline";
				}
				break;							
	    }
	    
	    if(manwin!=null)
			manwin.focus();
   }	
   
   function TerminateTalk()
   {//主动关闭对话
		if(current==null||currentstate!=1)
		{
			alert("未选择任何交谈对象");
			return;
		}
		if(!confirm("是否结束与用户"+current+"的对话中?"))
			return;
		var url="msgManager.jsp?vid="+thisid+"&a=14&toid="+escape(current);
		SendMessage(url);
		msg.focus();
   }
   
   function showonlinhost()
   {//显示选择窗口
		if(current==null||currentstate!=1)
		{
			alert("未选择任何交谈对象");
			return;
		}
		hwnd=window.showModelessDialog("msgManager.jsp?vid="+thisid+"&a=-3","选择转接对象","status:false;dialogWidth:250px;dialogHeight:260px");
		hwnd.opener=window;
		hwnd.focus();   
   }
   
   function transfer(talkid)
   {
		if(current==null||currentstate!=1)
			return;
		var url="msgManager.jsp?vid="+thisid+"&a=17&toid="+escape(current)+"&tid="+escape(talkid);
		SendMessage(url);
		msg.focus();
   }
   
   function showmsg(sid,stitle,scaption,scontent)
   {
		var msg1 = new CLASS_MSN_MESSAGE(sid,210,120,stitle,scaption,scontent);   
		msg1.speed = 15; 
		msg1.autoHideTimeOut = 3000;
		msg1.show();
   }
   
   function OpenHistory(id)
   {
		var url="manage/clientManage.jsp?action="+escape("historyMsg.jsp?toId="+id)+"&vid="+thisid+"&sid="+sid;
		window.open(url);
		return false;		
   }   
   
   function closeUpload()
   {
		uploadtd.innerHTML='<iframe src=about:blank border=0 name=uploadframe style=width:100%;height:100%></iframe>';
		uploadform.style.display='none';   
   }   
   
	function SetLabel(uid)
	{
		ydv_from.reset();
		document.getElementById("ydv_vid").value=uid;
				
		node=xmldata.XMLDocument.selectSingleNode("//US/U/contact[../@i=\""+uid+"\"]");
		if(node==null)
			return;

		document.getElementById("ydv_name").value=node.getAttribute("name");

		if(node.getAttribute("sex")!=null)
			document.getElementById("ydv_sex").value=node.getAttribute("sex");		
		else
			document.getElementById("ydv_sex").value="1";
				
		if(node.getAttribute("workphone")!=null)
			document.getElementById("ydv_tel").value=node.getAttribute("workphone");

		if(node.getAttribute("mobilephone")!=null)			
			document.getElementById("ydv_mbl").value=node.getAttribute("mobilephone");
			
		if(node.getAttribute("sht")!=null)			
			document.getElementById("ydv_smalltel").value=node.getAttribute("sht");

		if(node.getAttribute("email")!=null)		
			document.getElementById("ydv_email").value=node.getAttribute("email");

		if(node.getAttribute("qq")!=null)
			document.getElementById("ydv_qq").value=node.getAttribute("qq");

		if(node.getAttribute("msn")!=null)
			document.getElementById("ydv_msn").value=node.getAttribute("msn");
			
		if(node.getAttribute("address")!=null)
			document.getElementById("ydv_add").value=node.getAttribute("address");
			
		if(node.getAttribute("type")!=null)
			document.getElementById("ydv_type").value=node.getAttribute("address");						
	}
	
	function DelLabel()
	{
		if(confirm("是否要删除该标注?"))	
		{
			var ydvid=document.getElementById("ydv_vid").value.trim();
			var url="msgManager.jsp?vid="+thisid+"&a=255&toid="+escape(ydvid);
			SendMessage(url);
			document.getElementById("setnoteform").style.display="none";
		}
	}
	
	function UpdateLabel()
	{
		var ydvName=document.getElementById("ydv_name").value.trim();
		var ydvid=document.getElementById("ydv_vid").value.trim();
		if(ydvName=="")
		{
			alert("必须输入用户名");
			return;
		}
		
		var node=xmlDoc.createNode(1,"contact","");
		//id属性
		
		var ydvSex=document.getElementById("ydv_sex").value;
		var ydvTel=document.getElementById("ydv_tel").value.trim();
		var ydvMbl=document.getElementById("ydv_mbl").value.trim();
		var ydvSmalltel=document.getElementById("ydv_smalltel").value.trim();
		var ydvEmail=document.getElementById("ydv_email").value.trim();
		var ydvQq=document.getElementById("ydv_qq").value.trim();
		var ydvMsn=document.getElementById("ydv_msn").value.trim();
		var ydvAdd=document.getElementById("ydv_add").value.trim();
		var ydvType=document.getElementById("ydv_type").value.trim();

		na=xmlDoc.createAttribute("name");
		node.attributes.setNamedItem(na);
		node.setAttribute("name",ydvName);

		na=xmlDoc.createAttribute("sex");
		node.attributes.setNamedItem(na);
		node.setAttribute("sex",ydvSex);
		
		if(ydvTel!="")
		{
			na=xmlDoc.createAttribute("workphone");
			node.attributes.setNamedItem(na);
			node.setAttribute("workphone",ydvTel);			
		}
		
		if(ydvMbl!="")
		{
			na=xmlDoc.createAttribute("mobilephone");
			node.attributes.setNamedItem(na);
			node.setAttribute("mobilephone",ydvMbl);			
		}
		
		if(ydvSmalltel!="")
		{
			na=xmlDoc.createAttribute("sht");
			node.attributes.setNamedItem(na);
			node.setAttribute("sht",ydvSmalltel);			
		}
		
		if(ydvEmail!="")
		{
			na=xmlDoc.createAttribute("email");
			node.attributes.setNamedItem(na);
			node.setAttribute("email",ydvEmail);			
		}
		
		if(ydvQq!="")
		{
			na=xmlDoc.createAttribute("qq");
			node.attributes.setNamedItem(na);
			node.setAttribute("qq",ydvQq);			
		}
		
		if(ydvMsn!="")
		{
			na=xmlDoc.createAttribute("msn");
			node.attributes.setNamedItem(na);
			node.setAttribute("msn",ydvMsn);			
		}
				
		if(ydvAdd!="")
		{
			na=xmlDoc.createAttribute("address");
			node.attributes.setNamedItem(na);
			node.setAttribute("address",ydvAdd);			
		}
		
		if(ydvType!="")
		{
			na=xmlDoc.createAttribute("type");
			node.attributes.setNamedItem(na);
			node.setAttribute("type",ydvType);			
		}
		
		var contact='<?xml version="1.0" encoding="unicode"?>'+node.xml;
		var url="msgManager.jsp?vid="+thisid+"&a=250&msg="+escape(contact)+"&toid="+escape(ydvid);
		
		SendMessage(url);
		
		document.getElementById("setnoteform").style.display="none";
	}   
	
	function innershowmsg(sid,scaption,scontent)
	{
		var str = "";   
		//str += "<div style='border-right:#455690 1px solid;border-top:#a6b4cf 1px solid;z-index:99999;left:0px;border-left:#a6b4cf 1px solid;width:100%;border-bottom: #455690 1px solid;top:0px;height:100%; background-color:#DBE2F7'>";
		str += "<table width='100%' style='border-top:#ffffff 1px solid;border-left:#ffffff 1px solid' cellspacing='0' cellpadding='0' width='100%' bgcolor='#E4EAFA' border='0' onclick='innermsg.style.display=\"none\";'>";
		str += "<tr>";
		str += "<td style='font-size:12px;color:#0f2c8c;background-image:url(img/title.gif);' width='30' height='30'></td>";
		str += "<td style='padding-left:4px;font-weight:normal;font-size:12px;color:#1f336b;padding-top:4px;background-image:url(img/title.gif);' valign='center'>" + scaption+ "</td>";
		str += "<td style='padding-right:2px;padding-top:2px;background-image:url(img/title.gif);' valign='center' align='right' width='19'>";
		str += "<span title='关闭' style='font-weight:bold;font-size:12px;cursor:hand;color:red;margin-right:4px' id='btsysclose'>×</span></td>";
		str += "</tr>";   
		str += "<tr>";
		str += "<td style='padding-right:1px;padding-bottom:1px;'colspan='3'>";
		str += "<div style='word-break:break-all' align='left'><a href='javascript:void(0)' hidefocus='true' id='btcommand'><font color='#0000FF'>" +scontent+ "</font></a></div>";
		str += "</div>";
		str += "</td>";
		str += "</tr>";
		str += "</table>";
		//str += "</div>";
		innermsg.innerHTML=str;
		if(innermsg.style.display=="none")
		{
			innermsg.style.display="inline";
			window.setTimeout(function(){innermsg.style.display="none";},3000);
		}
	}