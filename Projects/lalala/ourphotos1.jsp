<%@ page contentType="text/html; charset=gb2312" language="java" import="java.sql.*,java.util.*" errorPage=""%> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<title>�༶���</title>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <link rel="shortcut icon" type="image/ico" href="/images/favicon.gif" />
	<link rel="stylesheet" href="css/lightbox.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="css/mm_health_nutr.css" type="text/css" />
	
	<script src="js/prototype.js" type="text/javascript"></script>
	<script src="js/scriptaculous.js?load=effects" type="text/javascript"></script>
	<script src="js/lightbox.js" type="text/javascript"></script>

<script language="JavaScript" type="text/javascript">

var d=new Date();
var monthname=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

var TODAY = monthname[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

</script>
<style type="text/css">
<!--
.STYLE1 {
	font-size: 16px;
	color: #0000FF;
}
-->
</style>
</head>
<body bgcolor="#F4FFE4">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr bgcolor="#D5EDB3">
    <td colspan="2" rowspan="2"><img src="image/mm_health_photo.jpg" alt="Header image" width="382" height="101" border="0" /></td>
    <td width="253" height="50" id="logo" valign="bottom" align="center" nowrap="nowrap">�༶���</td>
    <td width="58">&nbsp;</td>
  </tr>

  <tr bgcolor="#D5EDB3">
    <td height="51" id="tagline" valign="top" align="center"></td>
	<td width="58">&nbsp;</td>
  </tr>

  <tr>
    <td colspan="4" bgcolor="#5C743D"><img src="mm_spacer.gif" alt="" width="1" height="2" border="0" /></td>
  </tr>

  <tr>
    <td colspan="4" bgcolor="#99CC66" background="mm_dashed_line.gif"><img src="mm_dashed_line.gif" alt="line decor" width="4" height="3" border="0" /></td>
  </tr>

  <tr bgcolor="#99CC66">
  <td>&nbsp;</td>
  	<td colspan="3" id="dateformat" height="20"><a href="index.jsp">��ҳ</a>&nbsp;&nbsp;::&nbsp;&nbsp;���������:<script language="JavaScript" type="text/javascript">
      document.write(TODAY);	</script>	</td>
  </tr>

  <tr>
    <td colspan="4" bgcolor="#99CC66" background="mm_dashed_line.gif"><img src="mm_dashed_line.gif" alt="line decor" width="4" height="3" border="0" /></td>
  </tr>

  <tr>
    <td colspan="4" bgcolor="#5C743D"><img src="mm_spacer.gif" alt="" width="1" height="2" border="0" /></td>
  </tr>
 <tr>
    <td width="40">&nbsp;</td>
    <td colspan="2" valign="top">&nbsp;<br />
    &nbsp;<br />
    
   <div class="section clearfix">
   
    <table border="0" cellspacing="0" cellpadding="2" width="632">
        <tr height="10px">
          <td colspan="7" class="pageName"><p>���ᱭ</p>
          </td>
        </tr>
	  	
		<tr>
          <td width="22%" height="110"><div class="thumbnail"><a href="photos/1/image-1.jpg" rel="lightbox"><img src="photos/1/image-1.jpg" width="150" height="150" border="0" /></a></div></td>
		  <td>&nbsp;</td>
		  <td width="22%" height="110"><div class="thumbnail"><a href="photos/1/image-2.jpg" rel="lightbox"><img src="photos/1/image-2.jpg" width="150" height="150" border="0" /></a></div></td>
		  <td>&nbsp;</td>
		  <td width="22%" height="110"><div class="thumbnail"><a href="photos/1/image-3.jpg" rel="lightbox"><img src="photos/1/image-3.jpg" width="150" height="150" border="0" /></a></div></td>
		  <td>&nbsp;</td>
		  <td width="22%" height="110"><div class="thumbnail"><a href="photos/1/image-4.jpg" rel="lightbox" ><img src="photos/1/image-4.jpg" width="150" height="150" border="0" /></a></div></td>
        </tr>
		<tr>
          <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
		  <td>&nbsp;</td>
	      <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
		 <td>&nbsp;</td>
	      <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
		 <td>&nbsp;</td>
	      <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
        </tr>
		<tr>
			<td colspan="7">&nbsp;</td>
		</tr>

		<tr>
          <td height="110"><div class="thumbnail"><a href="photos/1/image-5.jpg" rel="lightbox"><img src="photos/1/image-5.jpg" width="150" height="150" border="0" /></a></div></td>
		  <td>&nbsp;</td>
		  <td height="110"><div class="thumbnail"><a href="photos/1/image-6.jpg" rel="lightbox"><img src="photos/1/image-6.jpg" width="150" height="150" border="0" /></a></div></td>
		  <td>&nbsp;</td>
		  <td height="110"><div class="thumbnail"><a href="photos/1/image-7.jpg" rel="lightbox"><img src="photos/1/image-7.jpg" width="150" height="150" border="0" /></a></div></td>
		  <td>&nbsp;</td>
		  <td height="110"><div class="thumbnail"><a href="photos/1/image-8.jpg" rel="lightbox"><img src="photos/1/image-8.jpg" width="150" height="150" border="0" /></a></div></td>
        </tr>
		<tr>
          <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
		  <td>&nbsp;</td>
	      <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
		 <td>&nbsp;</td>
		   <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
		 <td>&nbsp;</td>
		   <td class="detailText" valign="top" nowrap="nowrap">&nbsp;</td>
        </tr>
 
		<tr>
			<td colspan="7">&nbsp;</td>
		</tr>
      </table>
      </div>
	</td>
    <td width="58">&nbsp;</td>
  </tr>

 <tr>
    <td width="40">&nbsp;</td>
    <td width="420">&nbsp;</td>
    <td width="253"><span class="STYLE1"> <a href="ourphotos12.jsp">��һҳ</a>    <a href="ourphotos.jsp">����</a></span></td>
	<td width="58">&nbsp;</td>
  </tr>
</table>

<div id="lastfoot">
     <jsp:include flush="false" page="footer.jsp"></jsp:include>
   </div>
</body>
</html>