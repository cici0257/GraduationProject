/*
获取最大值函数
*/
function getMax(data){

    var max_v=data[0];
    var i=0;
    for(i=0;i<data.length;i++){
        if(data[i]>max_v){
            max_v=data[i];
        }
    }
    return max_v;

}
/*
获取最小值函数
*/
function getMin(data){

    var min_v=data[0];
    var i=0;
    for(i=0;i<data.length;i++){
        if(data[i]<min_v){
            min_v=data[i];
        }
    }
    return min_v;

}
/*
画时域声波图的坐标
*/
function draw_coord(c,ctx){

    // y=0
    ctx.beginPath();

    let mid_h=Math.ceil((c.height+1)/2);
    ctx.moveTo(0,mid_h);
    ctx.lineTo(i=c.width, mid_h);
    ctx.strokeStyle="red";
    ctx.globalCompositeOperation="source-over";
    ctx.stroke(); 
    ctx.closePath();

    //x=0
    ctx.beginPath();

    
    ctx.moveTo(0,0);
    ctx.lineTo(0,c.height);
    ctx.strokeStyle="red";
    ctx.globalCompositeOperation="source-over";
    ctx.stroke(); 
    ctx.closePath();

    
}
/*
画声强图的坐标
*/
function draw_coord_intensity(c,ctx){

    // y=0
    ctx.beginPath();

    ctx.moveTo(0,c.height);
    ctx.lineTo(c.width,c.height);
    ctx.strokeStyle="red";
    ctx.globalCompositeOperation="source-over";
    ctx.stroke(); 
    ctx.closePath();

    //x=0
    ctx.beginPath();

    
    ctx.moveTo(0,0);
    ctx.lineTo(0,c.height);
    ctx.strokeStyle="red";
    ctx.globalCompositeOperation="source-over";
    ctx.stroke(); 
    ctx.closePath();

    
}
/*
返回鼠标当前位置
*/
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}