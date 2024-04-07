var main_color;
var background_color
var eyes = [];
let time=0;
let  f;

let eyes_factors = [25/84,-18/84,
                    59/84,-19/84,
                    0.85,-5/84,
                    67/84,16/84,
                    28/84,19/84,
                    0,0]
let eyes_closed_factors = [33/84,-3/84,
                           68/84,-5/84,
                           0.85,-5/84,
                           68/84,-5/84,
                           33/84,-3/84,
                           0,0
                          ]

let tooth_coordinates = [
  -60/90,0,
  -73/90,-45/90,
  -70/90,-75/90,
  -38/90,-93/90,
  -4/90,-87/90,
  21/90,-93/90,
  54/90,-82/90,
  66/90,-55/90,
  55/90,0,
  45/90,43/90,
  45/90,85/90,
  45/90,110/90,
  22/90,1,
  16/90,60/90,
  0,34/90,
  -8/90,55/90,
  -15/90,80/90,
  -17/90,120/90,
  -36/90,105/90,
  -45/90,60/90,
  -60/90,0,
  -60/90,0,
]

function setup() {
  noStroke()
  var fd = 900;
  createCanvas(fd, fd*9/16);
   background_color = color(0,0,0)
   main_color = color(238,229,229);
  var max_i = 10;
  var max_j = 10;
   for (var i=0;i<=10;i+=1){
     for (var j=0;j<=10;j+=1){
     eyes.push(new Eye(i*fd/max_i,j*fd*9/16/max_j,random(80,90),random(0,5)))
   }
     }
  f = new Eye(100,100,200,0)
  f.speed =3
}

function draw() {
  background(main_color);
  for (const eye of eyes){
    eye.update(time)
  }
  for (const eye of eyes){
    eye.drawEyeBall(time)
  }
  for (const eye of eyes){
  eye.drawState(time)
  }

  
  fill(0,255,0)


  time +=0.01;
}



function mousePressed(){
  for (const eye of eyes){
    eye.delay = abs(eye.delay-eye.initial_delay) 
    eye.speed = 1/eye.speed
  }
  time = 0
  var temp_color = main_color 
  main_color = background_color 
  background_color = temp_color
}

function getMouseAngle(x,y){
  return atan2(x-mouseX,y-mouseY)
}


class Eye{
  constructor(x,y,w,delay){
    this.x = x
    this.y = y 
    this.w = w
    this.delay = delay
    this.initial_delay = delay
    this.internal_time = 0
    this.speed = 0.5
    this.old_time =  0.5
    this.state = true

  }
  update(time){
        this.internal_time = abs(min(0.5+cos(this.delay+time*this.speed),1));
        
        
        if (this.internal_time>0.98 && this.old_time <0.98){
          this.state = !this.state;
        }
    
        this.old_time = this.internal_time
  }
  drawState(time){
      if(this.state){
        this.drawPupil()
        return
      }
      this.drawTeeth()
  }
  drawEyeBall(){
    fill(background_color)
    beginShape()
    vertex(this.x,this.y)
    for(var i=0;i<=12;i+=6){
      bezierVertex(this.x+this.w*((1-this.internal_time)*eyes_factors[i]+this.internal_time*eyes_closed_factors[i]),
                   this.y+this.w*((1-this.internal_time)*eyes_factors[i+1]+this.internal_time*eyes_closed_factors[i+1]),
                   this.x+this.w*((1-this.internal_time)*eyes_factors[i+2]+this.internal_time*eyes_closed_factors[i+2]),
                   this.y+this.w*((1-this.internal_time)*eyes_factors[i+3]+this.internal_time*eyes_closed_factors[i+3]),
                   this.x+this.w*((1-this.internal_time)*eyes_factors[i+4]+this.internal_time*eyes_closed_factors[i+4]),
                   this.y+this.w*((1-this.internal_time)*eyes_factors[i+5]+this.internal_time*eyes_closed_factors[i+5])
                  )
    }
    endShape()
  }
  drawPupil(){
    fill(main_color)
    var angle= getMouseAngle(this.x+this.w/2,this.y)
    var dx = -this.w/5*sin(angle)
    var dy = -this.w/8*cos(angle)
    circle(this.x+dx+this.w/2,this.y+dy,this.w/4)
  }
  drawTeeth(){
    var angle= getMouseAngle(this.x+this.w/2,this.y)
    var dx = -this.w/5*sin(angle)
    var dy = -this.w/8*cos(angle)
    this.drawTooth(this.x+dx+this.w/2,this.y+dy,this.w/8,angle)
  }
  drawTooth(tx,ty,tw,angle){
    push()
      translate(tx,ty)
      rotate(angle)
      fill(main_color)
      beginShape()
      curveVertex(tw*(-60)/90,0)
      for (var i=0;i<=tooth_coordinates.length;i+=2){
        curveVertex(tw*tooth_coordinates[i],tw*tooth_coordinates[i+1])
      }
      endShape()
    pop()  
  }
  
}