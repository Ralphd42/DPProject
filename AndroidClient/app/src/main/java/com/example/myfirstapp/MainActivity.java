package com.example.myfirstapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.database.MergeCursor;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import java.util.Arrays;

public class MainActivity extends AppCompatActivity {

    private TCPManager tcp;
    public static final String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void sendMessage(View view) {
        EditText outText = (EditText) findViewById(R.id.txtOutput);

        EditText txtInput =(EditText) findViewById(R.id.editText);
        String needsSort =txtInput.getText().toString();
        MergeSort sor = new MergeSort();
        String rv =sor.Sort(needsSort);

        outText.setText(rv);
        Intent intent = new    Intent(this, DisplayMessageActivity.class);
        String message = outText.getText().toString();
        intent.putExtra(EXTRA_MESSAGE, message);
        //outText.setText(txtInput.getText());
        //startActivity(intent);
    }
    public void HandleToggleOn(View view)
    {

        ToggleButton tb = findViewById(R.id.tglConnect);
        if( tb.isChecked()) {
            if( tcp==null) {
                TextView txtViewStatus = (TextView) findViewById(R.id.txtViewStatus);
                txtViewStatus.setText("!!!");
                tcp = new TCPManager(txtViewStatus);
                txtViewStatus.setText("ZZZZ");
                tcp.ConnectToServer();
                //txtViewStatus.setText("DDDDDDDDDDDDD");
                Toast.makeText(getApplicationContext(), "!!@Checked!!!", Toast.LENGTH_LONG).show();
            }else {
                Toast.makeText(getApplicationContext(), "Checked", Toast.LENGTH_LONG).show();
            }
        }else
        {
            Toast.makeText(getApplicationContext(), "NOT Checked", Toast.LENGTH_LONG).show();
        }
    }
}
