getdata=function(){
	var audio_file = $('#musicFile')[0].files[0];
	audio_parser(audio_file);
}
function audio_parser(audio_file){
    
    //alert(audio_file.name);
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioSourceNode=audioCtx.createBufferSource();
    var fr= new FileReader();
    fr.readAsArrayBuffer(audio_file);// read the file into array buffer  to  fr.result
    console.log(fr.result);
	
	//console.log(audio_file.sampleRate);
    
    fr.onloadend=function(e){
		
        audioCtx.decodeAudioData(e.target.result, function(audio_buffer){
		console.log("samplerate:"+audio_buffer.sampleRate);
		console.log("samples:"+audio_buffer);
        console.log(e.target.result);
        //-panel div
        //   -wf_panel : waveform btn, pulse btn, zoom ratio btn, zoom start btn, waveform
        //   -intensity_panel:

        var panel_div = document.createElement("div");
        document.body.appendChild(panel_div);
        panel_div.id="panel_div";
		
		var play_panel=document.createElement("div");
		play_panel.id="play_panel";
		panel_div.appendChild(play_panel);
		play_panel.innerHTML+="<br/><hr/><br/>"
        play_panel.innerHTML+="<br><button id='play_bu' class='feature_option'>play audio</button><br><br><br>";
		var play_bu=document.getElementById("play_bu");
		play_bu.onclick=function(){
			audioSourceNode.buffer=audio_buffer;
			audioSourceNode.connect(audioCtx.destination);
			audioSourceNode.start();
		}
		
        var wf_panel=document.createElement("div");
        wf_panel.id="wf_panel";
        panel_div.appendChild(wf_panel);
        
        wf_panel.innerHTML+="<br/><hr/><br/>"
        wf_panel.innerHTML+="<br><button id='btn_wf' class='feature_option'>Generate Waveform (time domain)</button><br>";
        wf_panel.innerHTML+="<br><button id='btn_pulse' class='feature_option'>Generate pulse</button><br><br>";  
        var btn_wf=document.getElementById("btn_wf");
        btn_wf.onclick=function(){
            wf_panel.innerHTML+="<br><label>Zoom Ratio:</label><input type='range' name='zoom_ratio' min='1' max='100' value='100' step='1' id='wf_zoomratio'/><br>"
            wf_panel.innerHTML+="<br><label>Zoom Start:</label><input type='text' value='0' id='wf_zoomstart'/><br>"

            waveform(audio_buffer,1,0);

            var wf_zoomratio_range=document.getElementById("wf_zoomratio");
            var wf_zoomstart_input=document.getElementById("wf_zoomstart");
            wf_zoomratio_range.onchange=function(e){
            var wf_canvas_div_now=document.getElementById("wf_canvas_div");
            if(wf_canvas_div_now!=null){
                wf_canvas_div_now.remove();
            }
            // var zoom_ratio=0.03;
            //var zoom_start=0;
            waveform(audio_buffer,e.target.value/100,wf_zoomstart_input.value);
            }
            wf_zoomstart_input.onchange=function(e){
            var wf_canvas_div_now=document.getElementById("wf_canvas_div");
            if(wf_canvas_div_now!=null){
                wf_canvas_div_now.remove();
            }
            // var zoom_ratio=0.03;
                   
            waveform(audio_buffer,wf_zoomratio_range.value/100,e.target.value);
            }

        } //btm-wf onclick
		var btn_pulse=btn_wf=document.getElementById("btn_pulse");
		btn_wf.onclick=function(){
		alert("脉冲");
		}
		var intensity_panel=document.createElement("div");
        intensity_panel.id="intensity_panel";
        panel_div.appendChild(intensity_panel);            
		intensity_panel.innerHTML+="<br/><hr/><br/>"
		intensity_panel.innerHTML+="<br><button id='btn_intensity' class='feature_option'>Generate intensity</button><br>";
        intensity_panel.innerHTML+="<br><button id='btn_pitch' class='feature_option'>Generate pitch</button><br><br>";
		var btn_intensity=document.getElementById("btn_intensity");
        
		btn_intensity.onclick=function(){
			var my_form_intensity=document.createElement("form");
			my_form_intensity.id="my_form_intensity";
			intensity_panel.appendChild(my_form_intensity);
	
			//my_form_intensity.innerHTML+="<br><label>帧长：</label><input type='text' value='40' id='frame_length'/>(ms)<br>"
			//my_form_intensity.innerHTML+="<br><label>帧移：</label><input type='text' value='15' id='frame_inc'/>(ms)<br>"
			//my_form_intensity.innerHTML+="<br><label>窗型：</label><input type='text' value='Rectangle' id='window_type'/>(Hamming/Hanning/Rectangle)<br>"
			//my_form_intensity.innerHTML+="<br><label>取样间隔：</label><input type='text' value='1/48'id='sample_period'/>(ms)[read only]<br>"
	
			my_form_intensity.innerHTML+="<br><label>范围：</label><input type='text' value='0' id='min'/>"+"  "+"<input type='text' value='100' id='max'/>(dB)<br>"
			my_form_intensity.innerHTML+="<br><label>窗宽度：</label><input type='text' value='40' id='frame_length'/>(ms)<br>"
			my_form_intensity.innerHTML+="<br><label>取样间隔：</label><input type='text' value='1/48'id='sample_period'/>(ms)[read only]<br>"
			my_form_intensity.innerHTML+="<br><button id='my_intensity_button'>确认：</button><br>"
			
			Intensitytier(audio_buffer,1,0,1920,960,"Rectangle",0,100);
			my_intensity_button.onclick=function(e){
			var frame_length=document.getElementById("frame_length").value*48;
			//console.log("帧长："+frame_length);
			var frame_inc=frame_length/2;
			//console.log("帧移："+frame_inc);
			var window_type="Rectangle";
			//console.log("窗型："+window_type);
			var sample_period=document.getElementById("sample_period").value;
			//console.log("取样间隔"+sample_period);
			var intensity_low=document.getElementById("min").value;
			var intensity_high=document.getElementById("max").value;
			var itst_canvas_div_now=document.getElementById("itst_canvas_div");
			if(itst_canvas_div_now!=null){
                itst_canvas_div_now.remove();
            }
			Intensitytier(audio_buffer,1,0,frame_length,frame_inc,window_type,intensity_low,intensity_high);
			
			}
            }
		
		var btn_pitch=document.getElementById("btn_pitch");
        btn_pitch.onclick=function(){
			alert("音高");
            }        

    });
};
    
}