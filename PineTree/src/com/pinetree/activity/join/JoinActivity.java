package com.pinetree.activity.join;

import java.io.File;
import java.nio.charset.Charset;
import java.util.concurrent.Exchanger;

import model.User;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.MediaStore.Images;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.pinetree.R;
import com.pinetree.ServerConnectionInfo;
import com.pinetree.activity.login.LoginActivity;

public class JoinActivity extends Activity {

	EditText idET, pwET, repwET, nameET, yearET, monthET, dayET, phoneET, frontEmailET,
			backEmailET;

	private ImageView profileImageView;
	String selectedImgPath;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_join);
		
		idET = (EditText)findViewById(R.id.edit_id);
		pwET = (EditText)findViewById(R.id.edit_password);
		repwET = (EditText)findViewById(R.id.edit_repassword);
		nameET= (EditText)findViewById(R.id.edit_name);
		yearET= (EditText)findViewById(R.id.edit_year);
		monthET= (EditText)findViewById(R.id.edit_month);
		dayET= (EditText)findViewById(R.id.edit_day); 
		phoneET= (EditText)findViewById(R.id.edit_number); 
		frontEmailET= (EditText)findViewById(R.id.edit_mail); 
		backEmailET= (EditText)findViewById(R.id.edit_domain);
		
		profileImageView = (ImageView) findViewById(R.id.join_profileImageView);

		Button btn_join_check = (Button) findViewById(R.id.btn_join_check);
		Button btn_join_cancel = (Button) findViewById(R.id.btn_join_cancel);

		// 프로필 사진 클릭했을 때
		profileImageView.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Toast.makeText(getApplicationContext(), "프로필사진 설정 클릭", 0)
						.show();

				Intent intent = new Intent(
						Intent.ACTION_PICK,
						android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
				startActivityForResult(intent, 0);

			}
		});

		btn_join_check.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				// 아직 비밀번호 확인 부분 빼고 구현한 것
				
				String id = idET.getText().toString();
				String pw = pwET.getText().toString();
				String name = nameET.getText().toString();
				String birth = yearET.getText().toString()+monthET.getText().toString()+dayET.getText().toString();
				String phone = phoneET.getText().toString();
				String email = frontEmailET.getText().toString()+"@"+backEmailET.getText().toString();
				
				User user = new User(id, pw, name , birth , phone , email , selectedImgPath );
				
				
				SendUserInfo sendUserInfo = new SendUserInfo();
				sendUserInfo.execute(user);
						
				Intent intent = new Intent(getApplicationContext(),
						LoginActivity.class);
				startActivity(intent);

				finish();
			}
		});

		btn_join_cancel.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Toast.makeText(getApplicationContext(), "가입이 취소되었습니다.",
						Toast.LENGTH_SHORT).show();

				Intent intent = new Intent(getApplicationContext(),
						LoginActivity.class);
				startActivity(intent);

				finish();
			}
		});
	}

	protected void onActivityResult(int requestCode, int resultCode, Intent data) {

		Uri targetUri;

		super.onActivityResult(requestCode, resultCode, data);

		if (resultCode == RESULT_OK) {
			targetUri = data.getData();

			try {

				Bitmap bm = Images.Media.getBitmap(getContentResolver(),
						targetUri);

				profileImageView.setImageBitmap(bm);
			} catch (Exception e) {
				Toast.makeText(getApplicationContext(), "이미지로드안됨", 0).show();
			}
			Log.i("test", getPathFromUri_managedQuery(targetUri));
			selectedImgPath = getPathFromUri_managedQuery(targetUri);
		}
	}

	private String getPathFromUri_managedQuery(Uri uri) {
		String[] projection = { MediaStore.Images.Media.DATA };

		Cursor cursor = managedQuery(uri, projection, null, // selection
				null, // selectionArgs
				null // sortOrder
		);

		int column_index = cursor
				.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
		cursor.moveToFirst();

		return cursor.getString(column_index);
	}
	
	private class SendUserInfo extends AsyncTask<User, Void, Void> {

		Uri imgUri;
		String url;

		HttpResponse httpResponse;

		@Override
		protected Void doInBackground(User... user) {

			MultipartEntity reqEntity = new MultipartEntity(
					HttpMultipartMode.BROWSER_COMPATIBLE);

			try{
			
			reqEntity.addPart("action", new StringBody("insert" , Charset.forName("UTF-8") ) );	
			reqEntity.addPart("name", new StringBody(user[0].getUser_name() , Charset.forName("UTF-8") ) );
			reqEntity.addPart("file", new FileBody(new File( user[0].getUser_image_url() ) ) );

			
			}catch(Exception e){
				e.getStackTrace();
			}
			
			DefaultHttpClient httpClient = new DefaultHttpClient();
			HttpPost httpPost = new HttpPost(ServerConnectionInfo.servletPath);

			httpPost.setEntity(reqEntity); // 인코딩 지정 + 값 적재

			try {
				httpResponse = httpClient.execute(httpPost);
				HttpEntity httpEntity = httpResponse.getEntity();

				if (httpEntity != null) {

					String responseStr = EntityUtils.toString(httpEntity);
					Log.i("확인용", responseStr);

				}
			} catch (Exception e) {

				e.printStackTrace();
			}
			Log.i("k", "finish!");
			return null;
		}

	}

}
