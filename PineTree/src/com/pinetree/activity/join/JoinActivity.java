package com.pinetree.activity.join;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Toast;

import com.pinetree.R;
import com.pinetree.activity.login.LoginActivity;

public class JoinActivity extends Activity {

	private Button btn_join_check;
	private Button btn_join_cancel;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_join);

		btn_join_check = (Button) findViewById(R.id.btn_join_check);
		btn_join_cancel = (Button) findViewById(R.id.btn_join_cancel);

		btn_join_check.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Toast.makeText(getApplicationContext(), "가입을 축하합니다.", Toast.LENGTH_SHORT).show();

				Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
				startActivity(intent);

				finish();
			}
		});

		btn_join_cancel.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Toast.makeText(getApplicationContext(), "가입이 취소되었습니다.", Toast.LENGTH_SHORT).show();

				Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
				startActivity(intent);

				finish();
			}
		});
	}
}
