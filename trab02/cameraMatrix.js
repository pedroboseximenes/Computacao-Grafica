
export default class CameraMatrix {
    constructor(gl) {
      // Posição da camera
      this.eye = vec3.fromValues(0,0,0);
      this.at  = vec3.fromValues(0.0, 0.0, 0.0);
      this.up  = vec3.fromValues(0.0, 1.0, 0.0);
  
      this.anguloCam = 0;
  
      // Parâmetros da projeção
      this.fovy = Math.PI / 2;
      this.aspect = gl.canvas.width / gl.canvas.height;
  
      this.left = -50;
      this.right = 50;
      this.top = 50;
      this.bottom = -50;
  
      this.near =0;
      this.far = 250;
  
      // Matrizes View e Projection
      this.view = mat4.create();
      this.proj = mat4.create();
    }
  
    getView() {
      return this.view;
    }
  
    getProj() {
      return this.proj;
    }
  
    updateViewMatrix() {
      mat4.identity( this.view );
      mat4.lookAt(this.view, this.eye, this.at, this.up);
      // TODO: Tentar implementar as contas diretamente
    }
  
    updateProjectionMatrix(type = '') {
      mat4.identity( this.proj );
      mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
      //mat4.ortho(this.proj, this.left, this.right, this.bottom , this.top, this.near, this.far);
  
    }
  
    updateCamPosition(angulo) {
      this.eye = vec3.fromValues(50*Math.cos(angulo),-10,50*Math.sin(angulo));
      //mat4.rotateY(this.view, this.view, angulo);
    }
  
    updateCam(angulo) {
      this.updateViewMatrix();
      this.updateProjectionMatrix();
      this.updateCamPosition(angulo);
    }
  }