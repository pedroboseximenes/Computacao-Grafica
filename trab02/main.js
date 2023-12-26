import CameraMatrix from './cameraMatrix.js';
import CameraParada from './cameraParada.js';
import Light from './light.js';
import Mesh from './mesh.js';



class Scene {
  constructor(gl) {
    //Aguarda escolher no front a camera a ser usada;
    this.cam = null;
    this.gl = gl;
    
    //Angulo para fazer a movimentacao da camera e da luz
    this.angulo =0;

    // Luz
    this.light = new Light();

    // Mesh
    this.mesh_armadillo = new Mesh("armadillo.obj");
    this.mesh_bunny = new Mesh("bunny.obj");

  }


  async init(gl) {
    await this.mesh_armadillo.loadMeshV4();
    this.mesh_armadillo.init(gl, this.light);

    await this.mesh_bunny.loadMeshV4();
    this.mesh_bunny.init(gl, this.light);
  }

  draw(gl) {  
    if(this.cam != null){
      //angulo para movimentacao
      this.angulo += 0.005;
      //atualiza camera
      this.cam.updateCam(this.angulo);
      //atualiza posicao da luz
      this.light.updateLight(this.angulo);
      //desenha o armadilho
      this.mesh_armadillo.draw(gl, this.cam, this.light);
      //desenha o bunny
      this.mesh_bunny.draw(gl, this.cam, this.light);
    }
  }

}

class Main {

  constructor() {
    const canvas = document.querySelector("#glcanvas");

    this.gl = canvas.getContext("webgl2");
    this.setViewport();
    console.log(this.gl);

    this.scene = new Scene(this.gl);
    this.scene.init(this.gl).then(() => {
      this.draw();
     
    });

    //Botão camera ortogonal Parada
    this.setarCameraParada = this.setarCameraParada.bind(this);
    document.getElementById("cameraParada").addEventListener("click", this.setarCameraParada);

     //Botão camera perspectiva com movimentação
    this.setarCameraMatrix = this.setarCameraMatrix.bind(this);
    document.getElementById("cameraMatrix").addEventListener("click", this.setarCameraMatrix);
    
     //Botão para pegar valores do formulario
    this.updateColorTriangles = this.updateColorTriangles.bind(this);
    document.getElementById("submit").addEventListener("click", this.updateColorTriangles);
  }

  setarCameraMatrix(){

    this.scene.cam = new CameraMatrix(this.gl);
  }

  setarCameraParada(){

    this.scene.cam = new CameraParada(this.gl);
  }

  setViewport() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);
    
    //Faz rotaçãoS
    requestAnimationFrame(this.draw.bind(this));
  }

  updateColorTriangles() {
    if(this.scene.cam != null){
    
    const bunnyIndex = document.getElementById("bunny_index").value;
    const armadilloIndex = document.getElementById("armadilho_index").value;
    
    this.scene.mesh_bunny.heds.colorirMalha(bunnyIndex, this.gl, this.scene.mesh_bunny);
    this.scene.mesh_armadillo.heds.colorirMalha(armadilloIndex, this.gl, this.scene.mesh_armadillo);
    
    }
    else{
      alert("Escolha uma camera!")
    }
  }



}

window.onload = () => {
  const app = new Main();
  app.draw();
}


