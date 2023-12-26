import vertShaderSrc from './phong.vert.js';
import fragShaderSrc from './phong.frag.js';

import Shader from './shader.js';
import { HalfEdgeDS } from './half-edge.js';

export default class Mesh {
  constructor(name) {
    // model data structure
    this.heds = new HalfEdgeDS();

    // Matriz de modelagem
    this.angle = 0;
    this.name = name;
    this.tamanhoMesh = 3.5;
    this.model = mat4.create();

    // Shader program
    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    // Data location
    this.vaoLoc = -1;
    this.indicesLoc = -1;

    this.uModelLoc = -1;
    this.uViewLoc = -1;
    this.uProjectionLoc = -1;
  }

  async loadMeshV4() {
    const resp = await fetch(this.name);
    const data = await resp.text();

    const nv = data[0];
    const nt = data[1];

    const coords = [];
    const indices = [];

    const linhas_txt = data.split('\n');

    for (let index = 0; index < linhas_txt.length; index++) {
      const linha = linhas_txt[index].trim();
      const prefix = linha[0]

      if (prefix === 'f') {
        const linha_split = linha.split(/\s+/);
        const f1 = linha_split[1]
        const f2 = linha_split[2]
        const f3 = linha_split[3]
        indices.push(parseInt(f1) - 1, parseInt(f2) - 1, parseInt(f3) - 1);

      } else if (prefix === 'v') {
        const linha_split = linha.split(/\s+/);
        const x = linha_split[1]
        const y = linha_split[2]
        const z = linha_split[3]
        coords.push(parseFloat(x), parseFloat(y), parseFloat(z), 1.0); 
      }
    }
   
    console.log('coords=', coords);
    console.log('indices=', indices);

    this.heds.build(coords, indices);
  }

  createShader(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
    this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
    this.uProjectionLoc = gl.getUniformLocation(this.program, "u_projection");
  }

  createVAO(gl) {
    const vbos = this.heds.getVBOs();
    console.log(vbos);

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    const coordsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[0]));

    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");
    const colorsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[1]));

    var normalsAttributeLocation = gl.getAttribLocation(this.program, "normal");
    const normalsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[2]));

    this.vaoLoc = Shader.createVAO(gl,
      coordsAttributeLocation, coordsBuffer, 
      colorsAttributeLocation, colorsBuffer, 
      normalsAttributeLocation, normalsBuffer);

    this.indicesLoc = Shader.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vbos[3]));
  }  

  init(gl, light) {
    this.createShader(gl);
    this.createUniforms(gl);
    this.createVAO(gl);

    light.createUniforms(gl, this.program);
  }

  updateModelMatrix() {

    if (this.name === 'armadillo.obj'){

      mat4.identity(this.model);
      
      //Coloco na posicao
      mat4.translate(this.model, this.model, [-20, -20, -10]);
      
      //Ajusto a altura
      mat4.scale(this.model,this.model, [10/this.tamanhoMesh,10/this.tamanhoMesh,10/this.tamanhoMesh])
     
  
      
    }

    else if (this.name === 'bunny.obj') {
      mat4.identity( this.model );
      
      //Coloco na posicao
      mat4.translate(this.model, this.model, [20, -20, 10]);
      //Ajusto a altura
      mat4.scale(this.model,this.model, [10/this.tamanhoMesh,10/this.tamanhoMesh,10/this.tamanhoMesh])

  
    }

  
  }

  draw(gl, cam, light) {
    // faces orientadas no sentido anti-horÃ¡rio
    gl.frontFace(gl.CCW);

    // face culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.useProgram(this.program);

    // updates the model transformations
    this.updateModelMatrix();

    const model = this.model;
    const view = cam.getView();
    const proj = cam.getProj();

    //atualiza posicao da luz
    light.updateLightMesh(gl,this.program);
    
    gl.uniformMatrix4fv(this.uModelLoc, false, model);
    gl.uniformMatrix4fv(this.uViewLoc, false, view);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, proj);

    gl.bindVertexArray(this.vaoLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesLoc);

    gl.drawElements(gl.TRIANGLES, this.heds.faces.length * 3, gl.UNSIGNED_INT, 0);

    gl.disable(gl.CULL_FACE);
  }
}