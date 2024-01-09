'use strict';

export default class CanvasContext {

  constructor(res){
    const { width, height, node } = res;
    
    this.ctx = node.getContext('2d');
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;

    this.taskList = [];
    this.addTask = (fun) => this.taskList.push(fun);
  }

  fillRect(x,y,w,h){
    this.addTask(() => this.ctx.fillRect(x,y,w,h));
  }
  
  stroke(){
    this.addTask(() => this.ctx.stroke());
  }

  fill(){
    this.addTask(() => this.ctx.fill());
  }

  setFillStyle(color){
    this.addTask(() => this.ctx.fillStyle = color);
  }

  setStrokeStyle(color){
    this.addTask(() => this.ctx.strokeStyle = color);
  }

  beginPath(){
    this.addTask(() => this.ctx.beginPath());
  }

  moveTo(x,y){
    this.addTask(() => this.ctx.moveTo(x,y));
  }

  lineTo(x,y){
    this.addTask(() => this.ctx.lineTo(x,y));
  }

  setTextAlign(value){
    this.addTask(() => this.ctx.textAlign = value);
  }

  setTextBaseline(value){
    this.addTask(() => this.ctx.textBaseline = value);
  }

  setFontSize(value){
    this.addTask(() => this.ctx.font = value + "px sans-serif");
  }

  arc(x,y,radius,startAngle,endAngle){
    this.addTask(() => this.ctx.arc(x,y,radius,startAngle,endAngle));
  }

  fillText(text,x,y,maxWidth){
    this.addTask(() => this.ctx.fillText(text,x,y,maxWidth));
  }

  bezierCurveTo(cp1x,cp1y,cp2x,cp2y,cp3x,cp4y){
    this.addTask(() => this.ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,cp3x,cp4y));
  }

  draw(noClear,success){
    if (!noClear) {
      let canvas = this.ctx.canvas;
      this.ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    this.taskList.forEach(t => t());
    this.taskList.length = 0;
    if (typeof success == 'function') success();
  }

  setShadow(offsetX,offsetY,blur,color){
    this.addTask(() => {
      if (offsetX!=undefined) this.ctx.shadowOffsetX = offsetX;
      if (offsetY!=undefined) this.ctx.shadowOffsetX = offsetY;
      if (blur!=undefined) this.ctx.shadowBlur = blur;
      if (color!=undefined) this.ctx.shadowColor = color;
    });
  }

  clearRect(x,y,w,h){
    this.addTask(() => this.ctx.clearRect(x,y,w,h));
  }

	//更多调用方法...
}
