package com.pinetree.activity.login;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.EditText;

import com.pinetree.R;
import com.pinetree.activity.join.JoinActivity;
import com.pinetree.activity.projectlist.ProjectListActivity;

public class LoginActivity extends Activity {

	private EditText edit_id;
	private EditText edit_password;
	private CheckBox checkBox_remember;
	private Button btn_login;
	private Button btn_join;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);

		edit_id = (EditText) findViewById(R.id.edit_id);
		edit_password = (EditText) findViewById(R.id.edit_password);
		checkBox_remember = (CheckBox) findViewById(R.id.checkBox_remember);
		btn_login = (Button) findViewById(R.id.btn_login);
		btn_join = (Button) findViewById(R.id.btn_join);

		checkBox_remember.setOnCheckedChangeListener(new OnCheckedChangeListener() {

			@Override
			public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
				if (isChecked) {
					Log.i("checkBox_remember", "checked");
				} else {
					Log.i("checkBox_remember", "unchecked");
				}
			}
		});

		btn_login.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Intent intent = new Intent(getApplicationContext(), ProjectListActivity.class);
				startActivity(intent);

				finish();
			}
		});

		btn_join.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Intent intent = new Intent(getApplicationContext(), JoinActivity.class);
				intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				startActivity(intent);
			}
		});
	}

}
