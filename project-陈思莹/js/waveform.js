function waveform(audio_buffer,zoom_ratio,zoom_start){

    console.clear();
    // console.log(audio_buffer.getChannelData(0));
    var PCMData=audio_buffer.getChannelData(0);
    var audioDuration=audio_buffer.duration;
    var audioSampleRate=audio_buffer.sampleRate;
    var Max=getMax(PCMData);
    var Min=getMin(PCMData);
    console.log("min:"+Min);
    console.log("max:"+Max);
    console.log("Duration:" + audioDuration);
    console.log("Sampling Rate:"+ audioSampleRate);

    /*
     -div :auto, that makes canvas scrollable if it overflows
        -canvas
        -p : cursor infor
        -p : wf infor
    */
   var wf_canvas_div=document.createElement('div');
   wf_canvas_div.id="wf_canvas_div";
   wf_canvas_div.style.overflow="auto";

   
   // canvas ctx
   var c = document.createElement("canvas");
   c.width=2000;
   c.height=300;
   var ctx = c.getContext("2d");
  

    wf_canvas_div.appendChild(c);

    var cursor_info=document.createElement("p");
    cursor_info.innerHTML+="Current Value :";
    wf_canvas_div.appendChild(cursor_info);

    //clear existing things
    ctx.clearRect(0, 0, c.width, c.height);

    draw_coord(c,ctx);
    
    /*

    zoom ratio will shorten the displayed audio duration to fit the canvas
    thus the displayed PCMData will be shortened

    */

    var displayed_duration=audioDuration * zoom_ratio;
    var zoom_start_pos=Math.ceil((zoom_start/audioDuration)*PCMData.length); // however the zoom start point should in whole audio file context
    var PCMData_to_draw=PCMData.slice(zoom_start_pos, zoom_start_pos+zoom_ratio*PCMData.length);
    console.log(PCMData_to_draw);

    console.log("Displayed Duration:"+displayed_duration);

    /*

      calculate samples per pixel and will compress them as [min, max] strokes
      in the drawer loop

    */

    var total_samples= displayed_duration*audioSampleRate;
    var SamplesPerPixel_float=(total_samples)/c.width;
    console.log("SamplesPerPixel_raw:"+SamplesPerPixel_float);
    var SamplesPerPixel=Math.ceil(SamplesPerPixel_float);
    console.log("SamplesPerPixel:"+SamplesPerPixel);
    var pixel_values=[];
    
    var last_minPixel=0;

    for(var i=0;i<c.width;i++){
        
        let range_this_pixel=PCMData_to_draw.slice(SamplesPerPixel*i,SamplesPerPixel*(i+1));
        
        //console.log(range_this_pixel);
        var local_min=getMin(range_this_pixel);
        var local_max=getMax(range_this_pixel);

        //for drawing, I need to get its symmetric one based on axis x=0
        local_min=0-local_min;
        local_max=0-local_max;

        //console.log("pixel "+i+" range:"+ local_max);

        pixel_values.push(0-local_max);


        let drawHeight=c.height/2;

        let minPixel=local_min*drawHeight+drawHeight;
        
        let maxPixel=local_max*drawHeight+drawHeight;

        if(minPixel==maxPixel){
            maxPixel+=1;
        }       
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.moveTo(i, minPixel);
        ctx.lineTo(i, maxPixel);
        ctx.stroke(); 

        //smooth the gap
        if(i!=0){
            ctx.beginPath();
            ctx.strokeStyle="black";
            ctx.moveTo(i-1, last_maxPixel);
            ctx.lineTo(i, minPixel);
            ctx.stroke(); 
            ctx.closePath();
        }

        last_maxPixel=maxPixel;
       
    }

    /*
    click, display the amplitude
    */
    c.onclick=function(e){
        let pos=getMousePos(c,e);
        cursor_info.innerHTML="Current Value : " +(pos.x/c.width)*displayed_duration+","+pixel_values[Math.round(pos.x)];
    }
    
    /*
    a button to remove the current canvas
    */
    var wf_clear_btn=document.createElement('input');
    wf_clear_btn.type="button";
    wf_clear_btn.value="Clear this graph";
    wf_clear_btn.onclick=function(){
        
        wf_canvas_div.remove();
    }
    wf_canvas_div.appendChild( wf_clear_btn );

    var wf_infor=document.createElement('p');
    wf_infor.innerHTML=
    "zoom ratio:" + zoom_ratio + "<br>" +
    "min amplitude:"+Min+ "<br>" +
    "max amplitude:"+Max+ "<br>" +
    "Sampling Rate:" + audioSampleRate + "<br>" + 
    "Displayed Duration:"+displayed_duration ;

    wf_canvas_div.appendChild(wf_infor);



    document.getElementById("wf_panel").appendChild(wf_canvas_div);
   
   
}