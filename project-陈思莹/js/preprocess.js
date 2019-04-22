/*
短时能量函数实现
*/
function GetFrameEnergy(array2d,Energy_data){
	let num_of_frames=array2d.length;
	let frame_length=array2d[0].length;
	for(var i=0;i<num_of_frames;i++){
		Energy_data[i]=0;
		for(var j=0;j<frame_length;j++){
			Energy_data[i]+=Math.pow(array2d[i][j],2);
		}
	}
	
}
/*
短时过零率实现
*/
function GetZeroCrossing(array2d,zeroCrossing_data){
	let num_of_frames=array2d.length;
	let frame_length=array2d[0].length;
	for(var i=0;i<num_of_frames;i++){
		Energy_data[i]=0;
		for(var j=0;j<frame_length;j++){
			if(array2d[i][j-1]*array2d[i][j]<0)
			{
				zeroCrossing_data[i]++;
			}
		}
	}
}

/*
短时自相关实现
*/
function GetFrameAutoCorrlation(frame_data,autoCorrlation_data){
	let frame_length=frame_data.length;
	let sum;
	for(var k=0;i<frame_length;k++)
	{
		sum=0.00;
		for(var j=0;j<frame_length;j++)
		{
		sum+=frame_data[j+k]*frame_data[j];
		
		}
		autoCorrlation_data[k]=sum;
	}
	
}

/*
定义语音段的类
*/
function CSpeechSegment(begin,end){
	this.begin=begin;
	this.end=end;
	}
	CSpeechSegment.prototype = {
	constructor:CSpeechSegment,
	setValue:function(){
	this.begin=0;
	this.end=0;
	}
	getBegin:function(){
    return this.begin;
	},
	getEnd:function(){
    return this.eng;
	},
	setBegin:function(begin){
    this.begin=begin;
	},
	setEnd:function(end){
	this.end=end;
	}
	}

/*
双门限法端点检测的函数实现
*/
function EndPointsDectectonintensityZeroCrossing(PCMData,datasegment,frame_length,frame_inc,window_type,num_of_noiseframes){
	let sample_length=PCMData.length;
	let num_of_frames=GetFrames(sample_length,frame_length,frame_inc);
	let array2d=new Array();
	for(var x;x<num_of_frames;x++)
	{
		array2d[x]=new Array();
	}
	divframe(PCMData,frame_length,frame_inc,array2d,window_type);
	let Energy_data=new Array(num_of_frames);
	GetFrameEnergy(array2d,Energy_data);
	let zeroCrossing_data=new Array(num_of_frames);
	GetZeroCrossing(array2d,zeroCrossing_data);
	let NoiseEnergy；
	let sum_energy=0;
	let NoiseZeroCrossing=0;
	let sum_noisezeroCrossing=0;
	for(var a=0;a<num_of_noiseframes;a++)\
	{
		sum_energy+=Energy_data[a];
		sum_noisezeroCrossing+=zeroCrossing_data[a];
	}
	NoiseEnergy=sum_energy/num_of_noiseframes;
	NoiseZeroCrossing=sum_noisezeroCrossing/num_of_noiseframes;
}
	let threshold1_Energy=8*NoiseEnergy;
	let threshold2_Energy=4*NoiseEnergy;
	let threshold_zeroCrossing=4*NoiseZeroCrossing;
	DoubleThreshold(Energy_data,zeroCrossing_data,threshold1_Energy,threshold2_Energy,threshold_zeroCrossing,datasegment);
/*
双参数双门限法的函数实现
*/  
function DoubleThreshold(Energy_data,zeroCrossing_data,threshold1_Energy,threshold2_Energy,threshold_zeroCrossing,datasegment){
	let num_of_frames=Energy_data.length;
	let maxsielence=3;//最大连续静音帧数，超过此值判为静音
	let minvoice=3;//最小连续语音帧数，小于此值为噪音
	let segment=new object();
	let status=0;
	let count=0;
	let silence=0;
	for(var n=0;n<num_of_frames;n++){
		switch(status)
		{
			case 0:
			case 1:
				if(Energy_data[n]>threshold1_Energy){
					status=2;
					segment.setBegin(getMax(n-count-1,1));
					silence=0;
					count+=1;
				}
				else if(Energy_data[n]>threshold2_Energy||zeroCrossing_data[n]>threshold_zeroCrossing)
				{
					status=1;
					count+=1;
				}
				else{
					status=0;
					count=0;
					segment.setValue();
				}
				break;
				case 2:
				if(Energy_data[n]>threshold2_Energy||zeroCrossing_data>threshold2_Energy||zeroCrossing_data)
				{
					count++;
				}
				else
				{
					silence++;
					if(silence<maxsielence)
					{
						count+=1;
					}
					else if(count<minvoice)
					{
						status=0;
						silence=0;
						count=0;
					}
					else{
						status=3;
						segment.setEnd(segment.getBegin()+count);
					}
				}
				break;
				case 3:
				datasegment.push(segment);
				status=0;
				sount=0;
				silence=0;
				segment.setValue();
				break;
		}
	}
	datasegment.shrink_to_fit();
}