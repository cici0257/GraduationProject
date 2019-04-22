/*
窗函数
*/
function window_function(window_data,window_type){
	let frame_length=window_data.length;
	//console.log("frame_length:"+frame_length);
	for(var i=0;i<frame_length;i++)
	{
	if(window_type==="Hanning")
	{
		window_data[i]=0.5-0.5*cos((2*i/(frame_length-1)-1)*Math.PI);
	}
	 else if(window_type==="Hamming"){
		window_data[i]=0.54-0.46*cos((2*i/(frame_length-1)-1)*Math.PI);
	 }
	 else{
		window_data[i]=1;
	 }
  }
  //console.log("window_data:"+window_data);
}

/*
分帧
*/
function DivFrame(PCMData,frame_length,frame_inc,output_audio,window_type){
	let sample_length=PCMData.length;
	let num_of_frames=Math.ceil((sample_length-frame_length)/frame_inc)+1;
	//console.log("num_of_frames in divframe:"+num_of_frames);
	
	var filter = new Array(frame_length)
	//console.log("窗数据数量："+filter.length);
	window_function(filter,window_type);
	for(var i=0;i<num_of_frames;i++)
	{
		for(var j=0;j<frame_length;j++)
		{
	    if(i*frame_inc+j<sample_length)
		{
			output_audio[i][j]=PCMData[i*frame_inc+j]*filter[j];
	    }
		else{
			output_audio[i][j]=0;
		}
		}
	}
	console.log("frame data:"+output_audio);
}

/*
获取声强数据
*/
function get_frame_energy(PCMData,energy_data,frame_length,frame_inc,window_type){
	let sample_length=PCMData.length;
	console.log("sample_length:"+sample_length);
	let num_of_frames=Math.ceil((sample_length-frame_length)/frame_inc)+1;
	console.log("num_of_frames in energy:"+num_of_frames);
	let time_perframe=0.01;
	//let array2d[num_of_frames][frame_length];
	var array2d = new Array();
	for(var k=0;k<num_of_frames;k++){
	array2d[k] = new Array();
	}
	//let array2d=[][];
	DivFrame(PCMData,frame_length,frame_inc,array2d,window_type);
	//console.log("数据"+array2d);
	for(var i=0;i<num_of_frames;i++)
	{
		var  sum=0;
		//energy_data[i]=0;
		for(var j=0;j<frame_length;j++)
		{
			
			sum+=Math.pow(array2d[i][j],2);
		
		}
		
		
		energy_data[i]=20*Math.log10((Math.sqrt(sum/frame_length))/0.00002);
		
	}
	//console.log("声强数据数量："+energy_data.length);
	//console.log("声强数据："+energy_data);
}
/*
获取符合范围的声强数据
*/
function get_intensity_todraw(energy_data,intensity_low,intensity_high){
	let num_of_data=energy_data.length;
	var intensity_data=new Array(num_of_data);
	for(var x=0;x<num_of_data;x++){
		if(energy_data[x]<intensity_low)
			intensity_data[x]=intensity_low;
		else if(energy_data[x]>intensity_high){
			intensity_data[x]=intensity_high;
		}
		else {intensity_data[x]=energy_data[x];}
	}
	return intensity_data;
	
}

/*
声强
*/
function Intensitytier(audio_buffer,zoom_ratio,zoom_start,frame_length,frame_inc,window_type,intensity_low,intensity_high){
	//alert("!");
	var c_intensity = document.createElement("canvas");//声强画布
	c_intensity.width=2000;
	c_intensity.height=300;
	var ctx_intensity = c_intensity.getContext("2d");
  
	var itst_canvas_div=document.createElement('div');
	itst_canvas_div.id="itst_canvas_div";
	itst_canvas_div.style.overflow="auto";
	itst_canvas_div.appendChild(c_intensity);
  
	var PCMData=audio_buffer.getChannelData(0);
	var range_intensity=intensity_high-intensity_low;
	var zoom_intensity=c_intensity.height/range_intensity;
	///console.log("data numbers:"+PCMData.length);
	//console.log("data:"+PCMData);
	
	let energy_data=new Array();
	get_frame_energy(PCMData,energy_data,frame_length,frame_inc,window_type);
	get_intensity_todraw(energy_data,intensity_low,intensity_high);
	//console.log("声强数据数量（实例）："+energy_data.length);
	//console.log("声强数据："+energy_data);
	var cursor_info_intensity=document.createElement("p");
	cursor_info_intensity.innerHTML+="Current intensity :";
	intensity_panel.appendChild(cursor_info_intensity);
  
	ctx_intensity.clearRect(0, 0, c_intensity.width, c_intensity.height);

	draw_coord_intensity(c_intensity,ctx_intensity);
	var PCMduration=audio_buffer.duration;
	var PCMSampleRate=audio_buffer.sampleRate;
	var display_duration=PCMduration*zoom_ratio;
	var display_start_pos=Math.ceil((zoom_start/PCMduration)*energy_data.length);
	var intensity_to_draw=energy_data.slice(display_start_pos, display_start_pos+zoom_ratio*energy_data.length);
	//console.log("打印数据："+intensity_to_draw);
	/*

      calculate samples per pixel and will compress them as [min, max] strokes
      in the drawer loop

    */
	var total_samples_energy=energy_data.length;
	//console.log("声强数据数："+energy_data.length);
	var SamplesPerPixel_energy_float=(total_samples_energy)/c_intensity.width;
	//console.log("每帧数据:"+SamplesPerPixel_energy_float);
	var SamplesPerPixel_energy=Math.ceil(SamplesPerPixel_energy_float);
	//console.log("每帧数据（取整）:"+SamplesPerPixel_energy);


	var pixel_energy_value=[];
    
	var last_min_energy=0;

	for(var i=0;i<c_intensity.width;i++){
        
		let range_this_pixel=intensity_to_draw.slice(SamplesPerPixel_energy*i,SamplesPerPixel_energy*(i+1));
		//console.log("range_this_pixel:"+"the"+i+"th-"+range_this_pixel);
		//console.log(range_this_pixel);
		var local_min=getMin(range_this_pixel);
		var local_max=getMax(range_this_pixel);

		//for drawing, I need to get its symmetric one based on axis x=0
		local_min=0-local_min;
		local_max=0-local_max;
		//console.log("local_min:"+"the"+i+"th-"+local_min);
		//console.log("local_max:"+"the"+i+"th-"+local_max);
		//console.log("pixel "+i+" range:"+ local_max);
		//var local_value=range_this_pixel;
		pixel_energy_value.push(0-local_max);
		//var range_low=50;
		//var range_up=100;
		
		//let drawHeight=c_intensity.height/2;
		//let Pixel_value=c_intensity.height-local_value*10000;
		//let minPixel=c_intensity.height+(local_min-50)*10;
        //let maxPixel=c_intensity.height+(local_max-50)*10;
			minPixel=c_intensity.height+(local_min+intensity_low)*zoom_intensity;
			maxPixel=c_intensity.height+(local_max+intensity_low)*zoom_intensity;
		
		//let maxPixel=local_max*drawHeight+drawHeight;
		//console.log("minPixel:"+"the"+i+"th-"+minPixel);
		//console.log("maxPixel:"+"the"+i+"th-"+maxPixel);
		//if(minPixel==maxPixel){
		//   maxPixel+=1;
		//}

        
		ctx_intensity.beginPath();
		ctx_intensity.strokeStyle="yellow";
		ctx_intensity.moveTo(i, minPixel);
		ctx_intensity.lineTo(i, maxPixel);
		ctx_intensity.stroke(); 
		
		
		//smooth the gap
		if(i!=0){
            ctx_intensity.beginPath();
            ctx_intensity.strokeStyle="yellow";
            ctx_intensity.moveTo(i-1, last_maxPixel);
            ctx_intensity.lineTo(i, minPixel);
            ctx_intensity.stroke(); 
            ctx_intensity.closePath();
        }

        last_maxPixel=maxPixel;
    }

    /*
    click, display the amplitude
    */
	c_intensity.onclick=function(e){
    let pos=getMousePos(c_intensity,e);
    cursor_info_intensity.innerHTML="Current energy : " +(pos.x/c_intensity.width)*display_duration+","+energy_data[Math.round(pos.x)];
    }
  
	/*
    a button to remove the current canvas
    */
    var intensity_clear_btn=document.createElement('input');
    intensity_clear_btn.type="button";
    intensity_clear_btn.value="Clear this intensity graph";
    intensity_clear_btn.onclick=function(){
        
		itst_canvas_div.remove();
    }
    itst_canvas_div.appendChild(intensity_clear_btn);

    var intensity_infor=document.createElement('p');
    intensity_infor.innerHTML=
    "zoom ratio:" + zoom_ratio + "<br>" +
    "min energy:"+getMin[intensity_to_draw]+ "<br>" +
    "max energy:"+getMax[intensity_to_draw]+ "<br>" +
    "Sampling Rate:" + PCMSampleRate + "<br>" + 
    "Displayed Duration:"+display_duration ;

    itst_canvas_div.appendChild(intensity_infor);
    document.getElementById("intensity_panel").appendChild(itst_canvas_div);

}
