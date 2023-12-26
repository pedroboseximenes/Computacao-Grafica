export default class CameraParada {
    constructor(gl) {
      // Posição da camera
      this.eye = vec3.fromValues(50, 50, 50);
      this.at  = vec3.fromValues(0, 0.0, 0.0);
      this.up  = vec3.fromValues(0.0, 1.0, 0.0);
  
      // Parâmetros da projeção
      this.left = -50.0;
      this.right = 50.0;
      this.top = 50.0;
      this.bottom = -50.0;
      this.near = 0;
      this.far = 200;
  
      this.aspect = gl.canvas.width / gl.canvas.height;
  
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
  
    updateProjectionMatrix() {
      mat4.identity( this.proj );
  
      const aspect = this.aspect;
      mat4.ortho(this.proj, this.left * aspect, this.right * aspect, this.bottom , this.top, this.near, this.far);
    }
  
    updateCam() {
      this.updateViewMatrix();
      this.updateProjectionMatrix();
    }
  }