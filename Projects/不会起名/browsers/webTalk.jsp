﻿<%@page contentType="text/html; charset=utf-8" language="java" import="java.sql.*, java.util.*, java.net.*,msg.*,cache.*"%>
<jsp:useBean id="msgManager" scope="page"  class="msg.MsgManager" />
<jsp:useBean id="userManager" scope="page"  class="msg.UserManager" />
<jsp:useBean id="webStat" scope="page"  class="msg.WebStat" />
<%
String hosts=userManager.getSiteUserInXml("www.100im.cn");
%>
var frmIP='219.234.87.95';vid='12345678901';urlhead='http://';floatfootnote='';autohide=true;floatImgType='blue';guokeType='1';gkAdvert='';gkTopAdvert='';linkContent='';

document.write("<scrip"+"t src='http://219.234.87.95/scripts/msg.js'></scrip"+"t>"); 
document.write("<scrip"+"t src='http://219.234.87.95/scripts/float.js'></scrip"+"t>");

var xmlinvite='<?xml version="1.0" encoding="utf-8"?><style path=""><textlist><text sn="0"><character>您好！有什么可以帮您的？可以和您对话吗？『接受邀请』接受对话邀请！『稍后再说』拒绝邀请，并关闭本消息窗口！</character><color>#0000FF</color><size>13</size><method></method></text><text sn="1"><character>温馨提示：</character><color>#FF0000</color><size>12</size><method></method></text><text sn="2"><character>这是由您浏览的网站人员向您发出的对话邀请，此系统&lt;font color=red&gt;无需安装&lt;/font&gt;任何插件，实现安全的在线对话。</character><color>green</color><size>12</size><method></method></text></textlist><imagelist><image sn="0"><url>topleft.gif</url><alttext>外左上角图片</alttext><method></method></image><image sn="1"><url>topcenter.gif</url><alttext>标题栏背景</alttext><method></method></image><image sn="2"><url>topright.gif</url><alttext>右上角图片</alttext><method></method></image><image sn="3"><url>middleleft.gif</url><alttext>左边框背景</alttext><method></method></image><image sn="4"><url>middleright.gif</url><alttext>右边框背景</alttext><method></method></image><image sn="5"><url>buttomleft.gif</url><alttext>左下角图片</alttext><method></method></image><image sn="6"><url>buttomcenter.gif</url><alttext>底边框背景图片</alttext><method></method></image><image sn="7"><url>buttomright.gif</url><alttext>右下角图片</alttext><method></method></image><image sn="8"><url>move.gif</url><alttext>点击拖动图片</alttext><method></method></image><image sn="9"><url>colsed.gif</url><alttext>关闭按钮图片</alttext><method></method></image><image sn="10"><url>confirm.gif</url><alttext></alttext><method></method></image><image sn="11"><url>confirm0.gif</url><alttext></alttext><method></method></image><image sn="12"><url>cancel.gif</url><alttext></alttext><method></method></image><image sn="13"><url>cancel0.gif</url><alttext></alttext><method></method></image><image sn="14"><url>middlecenter.gif</url><alttext>中间背景图</alttext><method></method></image><image sn="15"><url>kefu.bmp</url><alttext>中间内容图片</alttext><method></method></image><image sn="16"><url>clarity.gif</url><alttext>一个像素的透明图片</alttext><method></method></image></imagelist><widthlist><width sn="0" des="左上角单元格宽度"><value>14</value></width><width sn="1" des="中间宽度"><value>359</value></width><width sn="2" des="右上角单元格宽度"><value>17</value></width><width sn="3" des="对话框表格总宽度"><value>390</value></width></widthlist><heightlist><height sn="0" des="左上角单元格高度"><value>27</value></height><height sn="1" des="中间高度"><value>160</value></height><height sn="2" des="底边框"><value>44</value></height></heightlist><methodlist><method sn="0" des="关闭邀请框"><fun>doAction</fun><param></param></method><method sn="1" des="按钮上鼠标悬停效果"><fun>onmouse</fun><param></param></method><method sn="2" des="[接受邀请]按钮点击方法"><fun>doAction</fun><param></param></method><method sn="3" des="[稍后再说]按钮点击方法"><fun>doAction</fun><param></param></method></methodlist></style>',xmlfloat='<xml><?xml version="1.0" encoding="utf-8"?><float><param><width>118</width><height>105</height></param><head><height>23</height><background>images7/head.gif</background><dragimage>images7/move.gif</dragimage><padding>5px 0px 5px 20px</padding></head><border><leftwidth>5</leftwidth><leftimage>images7/leftborder.gif</leftimage><rigthwidth>5</rigthwidth><rigthimage>images7/rightborder.gif</rigthimage><fillimage>images7/clarity.gif</fillimage></border><centent><width>106</width><height>45</height><border>1px solid #006699</border><background>#FFFFFF</background><group><groupwidth>106</groupwidth><groupheight>19</groupheight><leftbackground>images7/groupleft.gif</leftbackground><centerbackground>images7/groupcenter.gif</centerbackground><rightbackground>images7/groupright.gif</rightbackground><groupfontcolor>#000000</groupfontcolor><grouppadding>3px 0px 0px 0px</grouppadding></group></centent><foot><height>18</height><background>images7/foot.gif</background><text>www.100im.cn</text><footimg>images7/slt.gif</footimg><link>javascript:window.open("http://www.100im.cn/dljm.html");</link><padding>1px 0px 0px 0px</padding></foot><hiddenccontrol><hiddenimage>images7/colsed_2.gif</hiddenimage><displayimage>images7/colsed_1.gif</displayimage><flagimage>images7/talk.gif</flagimage><fontcolor>#990000</fontcolor><position>position:absolute;left:110px;top:23px;</position></hiddenccontrol></float></xml>',align="left",xpos=100,ypos=220,lancode="";
var thehostids;
alert(navigator.appName);
if (navigator.appName == 'Netscape') {	
	thehostids='<%=userManager.getSiteUserInXml_("www.100im.cn")%>'; 
}
else
   document.write("<%=hosts%>"); 

 