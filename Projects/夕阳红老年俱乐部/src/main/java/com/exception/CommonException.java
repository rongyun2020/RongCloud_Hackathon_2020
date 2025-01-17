package com.exception;

/**
 * 自定义异常
 * @author lijie
 * @date 2019年3月22日
 */
public class CommonException extends RuntimeException{
	
	private static final long serialVersionUID = -4331119281603616620L;
	private String message;
	
	public CommonException() {
		super();
	}
	
	public CommonException(String message) {
		super(message);
		this.setMessage(message);
	}

	@Override
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
