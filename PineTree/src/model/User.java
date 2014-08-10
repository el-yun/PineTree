package model;

public class User {
	
	String user_id;
	String user_pw;
	String user_name;
	String user_birth;
	String user_phone;
	String user_email;
	String user_image_url;
	
	
	public User(String user_id, String user_pw, String user_name,
			String user_birth, String user_phone, String user_email,
			String user_image_url) {
		
		this.user_id = user_id;
		this.user_pw = user_pw;
		this.user_name = user_name;
		this.user_birth = user_birth;
		this.user_phone = user_phone;
		this.user_email = user_email;
		this.user_image_url = user_image_url;
	}


	public String getUser_id() {
		return user_id;
	}


	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}


	public String getUser_pw() {
		return user_pw;
	}


	public void setUser_pw(String user_pw) {
		this.user_pw = user_pw;
	}


	public String getUser_name() {
		return user_name;
	}


	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}


	public String getUser_birth() {
		return user_birth;
	}


	public void setUser_birth(String user_birth) {
		this.user_birth = user_birth;
	}


	public String getUser_phone() {
		return user_phone;
	}


	public void setUser_phone(String user_phone) {
		this.user_phone = user_phone;
	}


	public String getUser_email() {
		return user_email;
	}


	public void setUser_email(String user_email) {
		this.user_email = user_email;
	}


	public String getUser_image_url() {
		return user_image_url;
	}


	public void setUser_image_url(String user_image_url) {
		this.user_image_url = user_image_url;
	}

	
	
	
}
