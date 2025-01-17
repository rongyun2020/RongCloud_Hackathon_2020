/*
 * inforhostry.java 信息记录页面
 *
 * Created on 2007年5月23日, 下午7:19
 */

package admin;

import java.io.*;
import java.net.*;
import java.sql.*;
import javax.sql.*;
import inc.condb;
import javax.servlet.*;
import javax.servlet.http.*;

public class inforhostry
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
    try {
      ResultSet rs = null;
      String sql = "select * from listinfo";
      condb conn = new condb();
      rs = conn.executeQuery(sql);

      out.println("\r\n");
      out.println("<style type=\"text/css\">\r\n");
      out.println("<!--\r\n");
      out.println("body,td,th {\r\n");
      out.println("\tfont-size: 12px;\r\n");
      out.println("}\r\n");
      out.println("-->\r\n");
      out.println("</style><body>\r\n");
      out.println(
          "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n");
      out.println("  <tr>\r\n");
      out.println(
          "         <td width=\"50\" height=\"25\" align=\"center\">ID</td>\r\n");
      out.println(
          "    <td width=\"250\" width=\"150\" align=\"center\">主题</td>\r\n");
      out.println(
          "    <td width=\"80\" width=\"100\" align=\"center\">发件人</td>\r\n");
      out.println(
          "\t<td width=\"80\" width=\"100\" align=\"center\">收件人</td>\r\n");

      out.println("  </tr>\r\n");
      //遇到了，心情还可以
      while (rs.next()) {
        out.println("  <tr>\r\n");
        out.println("    <td  bgcolor=\"#9BCDFF\">" + rs.getString("messageid") +
                    "</td>\r\n");
        out.println("    <td  bgcolor=\"#9BCDFF\">" +
                    rs.getString("messagetitle") + "</td>\r\n");
        out.println("    <td  bgcolor=\"#9BCDFF\">" +
                    rs.getString("messagesender") + "</td>\r\n");
        out.println("    <td  bgcolor=\"#9BCDFF\">" +
                    rs.getString("messageincept") + "</td>\r\n");
        out.println("  </tr>\r\n");
        out.println("  <tr>\r\n");
        out.println("    <td align=\"center\" height=\"10\"></td>\r\n");
        out.println("    <td align=\"center\"></td>\r\n");
        out.println("    <td align=\"center\"></td>\r\n");
        out.println("    <td align=\"center\"></td>\r\n");
        out.println("  </tr>\r\n");
      }
      out.println("</table>\r\n");
      out.println("</body>");

    }
    catch (Exception e) {

    }

  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws
      ServletException, IOException {
    doGet(request, response);
  }
}
