/*
自相关法基音检测实现
*/ 
function pitchdetectionAutoCorrlation(array2d,datasegment,len_min,len_max,num_of_frames,frame_length,data_sampleRate){
	let num_of_segments=datasegment.length;
	var Period=new Array(num_of_frames);
	for(var i=0;i<num_of_segments;i++){
		let begin_pos=datasegment[i].getBegin();
		let end_pos=datasegment[i].getEnd();
		let range_len=end_pos-begin_pos+1;
		for(var k=0;k<range_len;k++)
		{
			let autoCorrlation_data=new Array(frame_length);
			GetFrameAutoCorrlation(array2d[k+begin_pos],autoCorrlation_data);
			let detection_segment=autoCorrlation_data.slice(len_min,len_max);
			var max_v=data[0],position=0;
			var i=0;
			for(i=0;i<data.length;i++){
				if(data[i]>max_v){
				max_v=data[i];
				position=i;
				}
			}
			Period[begin_pos+k]=position/data_sampleRate;
		}
	}
	return Period;
}

/*
音高可视化
*/
function pitch(audio_buffer,zoom_ratio,zoom_start){
	var my_form_pitch=document.createElement("form");
	my_form_pitch.id="my_form_pitch";
	intensity_panel.appendChild(my_form_pitch);
	my_form_pitch.innerHTML+="<br><label>帧长：</label><input type='text' value='40' id='frame_length_pitch'/>(ms)<br>"
	my_form_pitch.innerHTML+="<br><label>帧移：</label><input type='text' value='15' id='frame_inc_pitch'/>(ms)<br>"
	my_form_pitch.innerHTML+="<br><label>窗型：</label><input type='text' value='Rectangle' id='window_type_pitch'/>(Hamming/Hanning/Rectangle)<br>"
	my_form_pitch.innerHTML+="<br><label>取样间隔：</label><input type='text' value='1/48'id='sample_period_pitch'/>(ms)[read only]<br>"
	my_form_pitch.innerHTML+="<br><label>范围：</label><input type='text' value='75' id='min_pitch'/>"+"  "+"<input type='text' value='500' id='max_pitch'/>(Hz)<br>"
	let frame_length=document.getElementById("frame_length_pitch").value*48;
	console.log("帧长："+frame_length);
	let frame_inc=document.getElementById("frame_inc_pitch").value*48;
	console.log("帧移："+frame_inc);
	let window_type=document.getElementById("window_type_pitch").value;
	console.log("窗型："+window_type);
	let sample_period=document.getElementById("sample_period_pitch").value;
	console.log("取样间隔"+sample_period);
	let pitch_low=document.getElementById("min_pitch").value;
	let pitch_high=document.getElementById("max_pitch").value;
	let pitch_range=c_intensity.height/(pitch_high-pitch_low);
	let PCMData=audio_buffer.getChannelData(0);
	let range_intensity=intensity_high-intensity_low;
	let room_intensity=c_intensity.height/range_intensity;
	let PCMData=audio_buffer.getChannelData(0);
	let sample_length=PCMData.length;
	let data_sampleRate=audio_buffer.sampleRate;
	var datasegment=new object;
	var num_of_noiseframes=0;
	let len_min=1/max_pitch*48;
	let len_max=1/min_pitch*48;
	EndPointsDectectonintensityZeroCrossing(PCMData,datasegment,frame_length,frame_inc,window_type,num_of_noiseframes);
	var period=pitchdetectionAutoCorrlation(array2d,datasegment,len_min,len_max,num_of_frames,frame_length,data_sampleRate);
	var PCMduration=audio_buffer.duration;
	var PCMSampleRate=audio_buffer.sampleRate;
	var display_duration=PCMduration*zoom_ratio;
	var display_start_pos=Math.ceil((zoom_start/PCMduration)*period.length);
	var pitch_to_draw=period.slice(display_start_pos, display_start_pos+zoom_ratio*period.length);
	var total_samples_pitch=period.length;
	for(var i=0;i<total_samples_pitch;i++){
		var local_value=period[i];
		if(local_value!=0){
			local_value=0-local_value;
			pixel_value=c_intensity.height+(local_value+min_pitch)*pitch_range;
			ctx_intensity.beginPath();
			ctx_intensity.strokeStyle="blue";
			ctx_intensity.moveTo(i, pixel_value);
			ctx_intensity.lineTo(i, pixel_value);
			ctx_intensity.stroke(); 
		}
		
	
	}
}