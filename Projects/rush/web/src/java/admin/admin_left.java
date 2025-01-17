/*
 * admin_left.java 管理员左边页面
 *
 * Created on 2007年5月23日, 下午7:29
 */

package admin;

import java.io.*;
import java.net.*;
import java.sql.*;
import javax.sql.*;
import inc.condb;
import javax.servlet.*;
import javax.servlet.http.*;

public class admin_left
    extends HttpServlet {

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws
      ServletException, IOException {
    response.setContentType("text/html;charset=UTF-8");
    PrintWriter out = response.getWriter();
    HttpSession session = request.getSession();
    String username = (String) session.getAttribute("username");
    if (username == null) {
      response.sendRedirect("../index.html");
      return;
    }
    out.println("\r\n");
    out.println("<script language=JavaScript>\r\n");
    out.println("function logout(){\r\n");
    out.println("\tif (confirm(\"系统提示：您确定要退出管理中心吗？\"))\r\n");
    out.println("\ttop.location = \"../index.html\";\r\n");
    out.println("\treturn false;\r\n");
    out.println("}\r\n");
    out.println("</script>\r\n");
    out.println(
        "<link href=\"css/css.css\" rel=\"stylesheet\" type=\"text/css\">\r\n");
    out.println("<body>\r\n");
    out.println("<table width=\"150\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bordercolor=\"#CCCCCC\" class=\"left\">\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"25\" align=\"center\" bgcolor=\"#0099FF\" class=\"write\">用户管理</td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><a href=\"admin_add.do\" target=\"mainFrame\">添加新用户</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("    <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><a href=\"admin_infor.do\" target=\"mainFrame\">修改本人资料</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("    <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><a href=\"admin_password.do\" target=\"mainFrame\">修改本人密码</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"25\" align=\"center\" bgcolor=\"#0099FF\" class=\"write\">信息交流管理</td>\r\n");
    out.println("  </tr>\r\n");

    out.println("    <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><span class=\"STYLE1\"><a href=\"myinfor.do\" target=\"mainFrame\">我的信息</a></span></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><a href=\"write.do\" target=\"mainFrame\">写信息</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><a href=\"inforhostry.do\" target=\"mainFrame\">信息记录</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"25\" align=\"center\" bgcolor=\"#0099FF\" class=\"write\">政绩考核</td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\"><a href=\"online.do\" target=\"mainFrame\">员工列表</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("    <tr>\r\n");
    out.println("    <td height=\"20\" align=\"center\" bgcolor=\"#0099FF\"><a href=\"../logout.do\" onClick=\"logout();\" class=\"write\">退出</a></td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println(
        "    <td height=\"20\" align=\"center\" bgcolor=\"#9CCFFF\">版权所有:</td>\r\n");
    out.println("  </tr>\r\n");
    out.println("  <tr>\r\n");
    out.println("    <td align=\"center\" bgcolor=\"#0099FF\"><a href=\"http://www.chmchm.com\" target=\"_blank\">CHMCHM</a> &copy;2007-2010 </td>\r\n");
    out.println("  </tr>\r\n");
    out.println("</table>\r\n");
    out.println("</body>\r\n");

  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws
      ServletException, IOException {
    doGet(request, response);
  }
}
