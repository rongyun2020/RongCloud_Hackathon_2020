 	 	
/*菜单处理*/
	function createmenu(xmlFile,obj,path)
	{
		var menuHeight	= "";							//菜单高度
		var tdWidth	= "";							//单元格宽度		
		var menuItem = new Array();
		menuItem = loadXml(xmlFile); //加载xml数据

		var div = document.createElement("div");
		div.innerHTML = showMenu(menuItem,path);
		obj.appendChild(div);	
	}
//var xmlFile			= "menu/menu.xml"; //菜单数据xml文件
//--------------------------------------------------------------
// #Subject: 加载菜单数据xml文件
// #Description: 将xml文件数据生成数组
//--------------------------------------------------------------
	function loadXml(obj)
	{
		var xmlDoc		= new ActiveXObject("Microsoft.XMLDOM");
		var xmlItems	 	= new Array();
		var xmlnotes	= "";

		xmlDoc.async	 = "false";
		xmlDoc.loadXML(obj);
		xmlnotes = xmlDoc.documentElement.childNodes; 
		menuHeight = xmlDoc.documentElement.attributes(0).value;
		tdWidth = xmlDoc.documentElement.attributes(1).value;
		
		for (var i=0;i<xmlnotes.length;i++)
		{
			xmlItems[i] = new Array();
			for (var l=0;l<6;l++)
			{
				xmlItems[i][l] = String(xmlnotes(i).childNodes(l).text);
			}
		}
		return xmlItems;
	}
//--------------------------------------------------------------
// #Subject: 生成并显示菜单
//--------------------------------------------------------------
	function showMenu(obj,path)
	{
		var menuHtml		= "";
		var menuHead	 	= "";
		var menuBody		= "";
		var menuFoot		= "";

		menuHead	= "<table align='center' height='"+menuHeight+"' cellspacing='0' cellpadding='0' ><tr>";
		menuFoot	= "</tr></table>";
		for (var i=0;i<obj.length;i++)
		{
			menuBody = menuBody + "<td align='center' width='"+tdWidth+"' ><a "+chekestatus(obj[i][5])+" hideFocus='true' class='menu' href='#' onclick='"+obj[i][3]+";' title='"+obj[i][2]+"'>"+getImage(obj[i][1],path)+obj[i][0]+"</a></td>";
		}
		menuHtml = menuHead+menuBody+menuFoot;
		return menuHtml;
	}
//取得图像标记
	function getImage(obj,path)
	{
		var strImg = '';
		if(obj!='')
		{
			strImg = '<img border="0" src="'+path+obj+'"><br/>';
			return strImg;
		}
		else
		{
			return strImg;
		}
	}
//检查按钮的status，并生成控制操作的html字符串
	function chekestatus(obj)
	{
		var strHtml = "";
		if (obj=="normal")
		{
			return strHtml;
		}else if (obj=="disabled")
		{
			strHtml = "disabled='disabled' onclick='return false'";
			return strHtml;
		}else
		{
			return strHtml;
		}
	}