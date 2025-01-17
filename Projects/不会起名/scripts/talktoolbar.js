//--------------------------------------------------------------
// #Description: 处理菜单的数据并生成html文件
// #Creation Date: 2005年5月5日
// #Generator: EditPlus2.12
// #Author: wysl_8114@hotmail.com
//--------------------------------------------------------------
//生成菜单
function CreateToolbar(xmlFile)
	{
		if (xmlFile=="")
		{
			alert("xml文件加载错误！");
			return;
		}
		var menuHeight	= "";							//菜单高度
		var menuItem		= new Array();
		var div = document.createElement("div");

		menuItem		    = loadXmlFile(xmlFile); //加载xml数据
		div.innerHTML= showToolbar(menuItem);
		talktoolbar.appendChild(div);
}
//var xmlFile			= "menu/menu.xml"; //菜单数据xml文件
//--------------------------------------------------------------
// #Subject: 加载菜单数据xml文件
// #Description: 将xml文件数据生成数组
//--------------------------------------------------------------
function loadXmlFile(obj)
	{
		var xmlDoc		= null;
		try{xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); }catch(e){xmlDoc = new XMLHttpRequest(); } 
		var xmlItems	 	= new Array();
		var xmlnotes	= "";

		xmlDoc.async	 = "false";
		xmlDoc.load(obj);
		xmlnotes = xmlDoc.documentElement.childNodes; 
		menuHeight = xmlDoc.documentElement.attributes(0).value;

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
function showToolbar(obj)
	{
		var menuHtml		= "";
		var menuHead	 	= "";
		var menuBody		= "";
		var menuFoot		= "";

		menuHead	= "<table align='center' width='100%' height='"+menuHeight+"' cellspacing='0' cellpadding='0' style='table-layout:fixed;'><tr>";
		menuFoot	= "</tr></table>";
		for (var i=0;i<obj.length;i++)
			menuBody = menuBody + "<td align='center' class='"+obj[i][4]+"'><a hideFocus='true' class='menu' href='#' onclick='"+obj[i][3]+"' title='"+obj[i][2]+"'>"+getImage(obj[i][1])+obj[i][0]+"</a></td>"
		//添加
		menuBody = menuBody + "<td align='center' style='font-size:12px;' width='70'><input type='checkbox' name='guoke' id='guoke' value='guoke' />发给过客</td>";
		menuBody = menuBody + "<td align='center' style='font-size:12px;' width='70'><input type='checkbox' name='guanggao' id='guanggao' value='guanggao' />发送广告</td>";

		menuHtml = menuHead+menuBody+menuFoot;
		return menuHtml;
}
//取得图像标记
function getImage(obj)
	{
		var strImg = '';
		if(obj!='')
		{
				strImg = '<img border="0" src="'+obj+'"><br/>';
				return strImg;
		}
		else
		{
			return strImg;
		}
}