function CreateMenu(xmlFile,s)
	{
		if (xmlFile=="")
		{
			alert("xml文件加载错误！");
			return;
		}
		var menuHeight	= "";		//菜单高度
		var tdWidth	= "";				//单个按钮宽度
		var menuItem		= new Array();
		var div = document.createElement("div");

		menuItem			= loadXml(xmlFile,s); //加载xml数据
		div.innerHTML	= showMenu(menuItem,xmlFile);
		toolbar.appendChild(div);
}

function loadXml(obj,s)
	{
		var xmlDoc		= null;
		try{xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); }catch(e){xmlDoc = new XMLHttpRequest(); } 
		var xmlItems	= new Array();
		var xmlnotes	= "";
		xmlDoc.async	 = "false";
		xmlDoc.load(obj);
		xmlnotes = xmlDoc.selectSingleNode(s);
		if (xmlnotes==null)
		{
			return null;
		}
		menuHeight = xmlnotes.getAttribute("height");
		tdWidth = xmlnotes.getAttribute("width");
		for (var i=0;i<xmlnotes.childNodes.length;i++)
		{
			xmlItems[i] = new Array();
			if (xmlnotes.childNodes(i).getAttribute("id")!=null)
			{
				xmlItems[i][6]=xmlnotes.childNodes(i).getAttribute("id");
			}
			if(xmlnotes.getAttribute("pid")!=null)
			{
				xmlItems[i][6]=xmlnotes.getAttribute("pid");
			}
			for (var l=0;l<6;l++)
			{
				xmlItems[i][l] = String(xmlnotes.childNodes(i).childNodes(l).text);
			}
		}
		return xmlItems;
}
//--------------------------------------------------------------
// #Subject: 生成并显示菜单
// #Description: 
//--------------------------------------------------------------
function showMenu(obj,xmlFile)
	{
		var menuHtml		= "";
		var menuHead	 = "";
		var menuBody	= "";
		var menuFoot		= "";

		menuHead	= "<table width='"+(obj.length*tdWidth)+"' align='left' height='"+menuHeight+"' cellspacing='0' cellpadding='0'><tr>";
		menuFoot	= "</tr></table>";
		for (var i=0;i<obj.length;i++)
		{
			menuBody = menuBody + "<td align='center' class='"+obj[i][4]+"'><a hideFocus='true' href='#' id='bn"+obj[i][6]+"' class='menu' onmouseover=ShowMoveMenu('"+xmlFile+"',\"//child[@pid='"+obj[i][6]+"']\",gety(this)-10,64)><img src='"+obj[i][1]+"' border='0' onclick='"+obj[i][3]+"' onmouseover=\"onmouse(this,'"+obj[i][5]+"')\" onmouseout=\"onmouse(this,'"+obj[i][1]+"')\"  title='"+obj[i][2]+"'>"+obj[i][0]+"</a></td>";
		}
		menuHtml = menuHead+menuBody+menuFoot;
		return menuHtml;
}
//鼠标悬停事件
function onmouse(obj,img)
	{
		obj.src = img;
}

//鼠标Over弹出菜单
function ShowMoveMenu(xmlFile,s,lx,ly)
	{
		if (xmlFile=="")
		{
			alert("xml文件加载错误！");
			return;
		}
		var menuHeight	= "";		//菜单高度
		var tdWidth	= "";				//单个按钮宽度
		var menuItem		= new Array();
		var strMenu = "";
		var div = document.createElement("div");

		menuItem = loadXml(xmlFile,s); //加载xml数据
		if (menuItem==null)
		{
			return;
		}

		strMenu = strMenu + "<table align='center' cellpadding='0' cellspacing='0'>";
		strMenu = strMenu + "<tr><td style='color:#FFFFFF;font-size:12px;height:25px;text-align:center;background-image:url(img/manage/toolbar/childtop1.gif);'>子菜单</td></tr>";
		for (var i=0;i<menuItem.length;i++)
		{
			strMenu = strMenu + "<tr style='background:#FFFFFF;background-image:url(img/manage/toolbar/childmiddle1.gif);'><td width='"+tdWidth+"' height='"+menuHeight+"' align='center' class='"+menuItem[i][4]+"'><table><tr><td height='1'><br/></td></tr></table><span style='border:1px solid #FFFFFF;'><a hideFocus='true' href='#' class='menu' onclick='bn"+menuItem[i][6]+".innerHTML=this.innerHTML;'><img src='"+menuItem[i][1]+"' onclick='"+menuItem[i][3]+"' onmouseover=\"onmouse(this,'"+menuItem[i][5]+"')\" onmouseout=\"onmouse(this,'"+menuItem[i][1]+"')\" title='"+menuItem[i][2]+"' border='0'>"+menuItem[i][0]+"</a></span></td></tr>"
		}
		strMenu = strMenu + "<tr><td><img src='img/manage/toolbar/childfoot1.gif'></td></tr>";
		strMenu = strMenu + "</table></div>";

		if (document.getElementById("MoveMenu")==null)
		{
			div.id	= "MoveMenu";
			div.innerHTML	= strMenu;
			div.style.position = "absolute";
			div.style.posLeft = lx;
			div.style.posTop = ly;
			div.style.width = 76;
			div.style.border ="0px solid #FF0000";
			document.body.appendChild(div);
			document.body.attachEvent("onmouseover",Function("hiddenMenu(window.event.x,window.event.y)"));
			document.body.attachEvent("onclick",Function("try{MoveMenu.style.display='none';}catch(e){}"))			
		}
		else
		{
			MoveMenu.removeNode(true);
			div.id	= "MoveMenu";
			div.innerHTML	= strMenu;
			div.style.position = "absolute";
			div.style.posLeft = lx;
			div.style.posTop = ly;
			div.style.width = 76;
			document.body.appendChild(div);
			document.body.attachEvent("onclick",Function("try{MoveMenu.style.display='none';}catch(e){}"))			
			document.body.attachEvent("onmouseover",Function("hiddenMenu(window.event.x,window.event.y)"));
		}
}

//获取对象位置x
function getx(o)
	{
		var lx=o.offsetTop;
		while(o=o.offsetParent)
		{
			lx+=o.offsetTop;
		}
		return lx;
}
//获取对象位置y
function gety(o)
	{
		var ly=o.offsetLeft;
		while(o=o.offsetParent)
		{
			ly+=o.offsetLeft;
		}
		return ly;
}
//鼠标移动隐藏菜单
function hiddenMenu(lx,ly)
{
	if (document.getElementById("MoveMenu")==null)
	{
		document.body.detachEvent("onmouseover",Function("hiddenMenu(window.event.x,window.event.y)"));
		return;
	}
	var lw	= gety(document.getElementById("MoveMenu"));
	var rw	= gety(document.getElementById("MoveMenu"))+document.getElementById("MoveMenu").clientWidth;
	var bh	= getx(document.getElementById("MoveMenu"))+document.getElementById("MoveMenu").clientHeight;
	var mousex = lx;
	var mousey = ly;
	if (mousex>lw&&mousex<rw&&mousey>0&&mousey<bh)
	{
		;
	}else
	{
		MoveMenu.removeNode(true);
		document.body.detachEvent("onmouseover",Function("hiddenMenu(window.event.x,window.event.y)"));
	}
}