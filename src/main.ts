import P5 from "p5";

import './style.css'

let particles: P5.Vector[];
let field : P5.Vector[][];
const res = 3;
const numParticles = 10000;

let parent: P5.Element;

const sketch = (p5: P5) => {
	p5.setup = () => {
		const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    parent = canvas.parent("app")
    
    field = makeGrid(p5, Math.floor(p5.width/res), Math.floor(p5.height/res))
    drawGrid(p5, res, field);
    particles = makeParticles(p5, numParticles);

    // Draw everything up front. Not gradually in the draw() loop
    // let steps: number = 500;
    // while(steps--){
    //   drawParticles(p5, res, particles, field);
    // }
  }

	p5.draw = () => {
    drawParticles(p5, res, particles, field);
	};

  // TO DO - Use mouse to affect z offset of perlin noise 
  p5.mouseMoved = (e : MouseEvent) => {
    console.log(e.pageX);
    // const zoff = p5.map(e.pageX, 0, p5.width, 0, 2);
    // field = makeGrid(p5, Math.floor(p5.width/res), Math.floor(p5.height/res), zoff)
    // p5.background(255);
    // drawGrid(p5, res, field);
  }

	p5.windowResized = () => {
    const css = getComputedStyle(parent.elt),
      marginWidth = Math.round(p5.float(css.marginLeft) + p5.float(css.marginRight)),
      marginHeight = Math.round(p5.float(css.marginTop) + p5.float(css.marginBottom)),
      w = p5.windowWidth - marginWidth, h = p5.windowHeight - marginHeight;
    p5.resizeCanvas(w, h, true);
	}
}


function makeGrid(p5:P5, cols: number, rows: number, offset:number = 0, zoff:number=0):P5.Vector[][]{
  const field: P5.Vector[][] = []; 
 
  let xoff : number = offset;
  for(let i = 0; i < cols; i++){
    field[i] = [];
    let yoff : number = offset;
    for(let j = 0; j < rows; j++){
      let theta : number = p5.map(p5.noise(xoff, yoff, zoff), 0, 1, 0, p5.TWO_PI);
      // console.log(p5.degrees(theta))
      field[i][j] = p5.createVector(Math.cos(theta), Math.sin(theta));
      yoff += 0.1;
    }
    xoff += 0.1;
  }
  
  return field
}

function drawGrid(p5: P5, res: number, field : P5.Vector[][]){

  p5.noFill();
  // p5.stroke(0, 200)
  
  for(let i = 0; i < field.length; i++){
    for(let j = 0; j < field[0].length; j++){
      
      // Draw vector direction
      p5.push()
      p5.translate(i*res+(res/2), j*res+(res/2))
      p5.rotate(field[i][j].heading())
      p5.stroke(0, 20)
      p5.ellipse(0, 0, 1)
      p5.line(0, 0, res, 0)
      p5.rotate(-field[i][j].heading())
      p5.pop();
      
      // Draw grid rect
      p5.rect(res*i, res*j, res, res)
    }
  }
}

function makeParticles(p5:P5, numParticles: number = 700):P5.Vector[] {
  // Create array for num of particles and then map to create random starting points.
  return Array(numParticles).fill([0,0]).map(()=>randVector(p5));
} 

function drawParticles(p5:P5, res: number, particles: P5.Vector[], field:P5.Vector[][]) {

  p5.stroke(255, 100, 0, 100);

  const cols = field.length;
  const rows = field[0].length;

  let i = particles.length;

  // TO DO - Use lifetime to lerp colour
  // const lifetime = Array(numParticles).fill(0).map(()=>Math.random());
  // p5.stroke(p5.lerpColor(p5.color(colours[0]), p5.color(colours[1]), lifetime[i]))

  while(i--){
    const p = particles[i];
    const previousX = p.x;
    const previousY = p.y;

    const colPos = Math.floor(p.x/res);
    const rowPos = Math.floor(p.y/res);
    
    if(colPos < 0 || colPos+1 > cols || rowPos < 0 || rowPos+1 > rows){
      p.set(randVector(p5));
    } else {
      p.add(field[colPos][rowPos])
      p5.line(previousX, previousY, p.x, p.y);
    }
  }
}

function randVector(p5:P5): P5.Vector {
  return p5.createVector(Math.floor(p5.random(p5.width)), Math.floor(p5.random(p5.height)));
}


new P5(sketch);
