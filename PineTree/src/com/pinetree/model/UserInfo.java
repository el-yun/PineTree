package com.pinetree.model;

public class UserInfo {

	private static UserInfo userInfo = new UserInfo();

	private String id;
	private String password;

	private UserInfo() {
	}

	public static UserInfo getInstance() {
		return userInfo;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
