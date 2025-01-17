package inc;

import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

public class Download
    extends HttpServlet {

  public void init() throws ServletException {
  }

  public void destroy() {
    super.destroy();
  }

  protected void doGet(HttpServletRequest request,
                       HttpServletResponse response) throws ServletException,
      IOException {
    request.setCharacterEncoding("utf-8");
    response.setCharacterEncoding("utf-8");
    String root = getServletContext().getRealPath("/");
    String path = "uploadFiles\\";
    String name = request.getParameter("name");
    //PrintWriter out=response.getWriter();

    HttpSession session = request.getSession();
    String username = (String) session.getAttribute("username");
    String id = (String) session.getAttribute("id");

    response.setContentType("application/x-msdownload");
    response.addHeader("Content-Disposition",
                       "attachment; filename=\"" + name + "\"");
    response.setContentLength( (int) name.length());

    if (username == null) {
      response.sendRedirect("index.html");
      return;
    }

    try {

      byte[] b = new byte[1024];
      int i = 0;
      String downpath = root + path + name;
      FileInputStream fis = new FileInputStream(downpath);
      ServletOutputStream os = response.getOutputStream();
      while ( (i = fis.read(b)) != -1) {
        os.write(b, 0, i);
      }

      fis.close();
      os.flush();
      os.close();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void doPost(HttpServletRequest req, HttpServletResponse resp) throws
      ServletException, IOException {
    doGet(req, resp);
  }
}
