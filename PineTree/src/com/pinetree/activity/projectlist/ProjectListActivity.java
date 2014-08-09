package com.pinetree.activity.projectlist;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ListView;

import com.pinetree.R;
import com.pinetree.activity.timeline.TimeLineActivity;

public class ProjectListActivity extends Activity {

	private Button btn_newproject;
	private View project_list_progress;
	private View project_list_complete;
	private ListView listView_project_list_progress;
	private ListView listView_project_list_complete;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_project_list);

		btn_newproject = (Button) findViewById(R.id.btn_newproject);
		btn_newproject.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Intent intent = new Intent(getApplicationContext(), TimeLineActivity.class);
				startActivity(intent);

				finish();
			}
		});

		project_list_progress = (View) findViewById(R.id.activity_project_list_progress);
		project_list_complete = (View) findViewById(R.id.activity_project_list_complete);

		listView_project_list_progress = (ListView) project_list_progress
				.findViewById(R.id.listView_project_list_progress);
		listView_project_list_progress.setAdapter(new ProjectListProgressAdapter(this));

		listView_project_list_complete = (ListView) project_list_complete
				.findViewById(R.id.listView_project_list_complete);
		listView_project_list_complete.setAdapter(new ProjectListCompleteAdapter(this));
	}

}
