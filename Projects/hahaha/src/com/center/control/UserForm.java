/*
 * Generated by MyEclipse Struts
 * Template path: templates/java/JavaClass.vtl
 */
package com.center.control;

import javax.servlet.http.HttpServletRequest;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionMapping;

/** 
 * MyEclipse Struts
 * Creation date: 05-18-2007
 * 
 * XDoclet definition:
 * @struts.form name="userForm"
 */
public class UserForm extends ActionForm {
	/*
	 * Generated fields
	 */

	/** useremail property */
	private String useremail;

	/** userpsw property */
	private String userpsw;

	/** username property */
	private String username;

	/*
	 * Generated Methods
	 */

	/** 
	 * Method validate
	 * @param mapping
	 * @param request
	 * @return ActionErrors
	 */
	public ActionErrors validate(ActionMapping mapping,
			HttpServletRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	/** 
	 * Method reset
	 * @param mapping
	 * @param request
	 */
	public void reset(ActionMapping mapping, HttpServletRequest request) {
		// TODO Auto-generated method stub
	}

	/** 
	 * Returns the useremail.
	 * @return String
	 */
	public String getUseremail() {
		return useremail;
	}

	/** 
	 * Set the useremail.
	 * @param useremail The useremail to set
	 */
	public void setUseremail(String useremail) {
		this.useremail = useremail;
	}

	/** 
	 * Returns the userpsw.
	 * @return String
	 */
	public String getUserpsw() {
		return userpsw;
	}

	/** 
	 * Set the userpsw.
	 * @param userpsw The userpsw to set
	 */
	public void setUserpsw(String userpsw) {
		this.userpsw = userpsw;
	}

	/** 
	 * Returns the username.
	 * @return String
	 */
	public String getUsername() {
		return username;
	}

	/** 
	 * Set the username.
	 * @param username The username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}
}