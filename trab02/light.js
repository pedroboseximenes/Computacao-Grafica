export default class Light {
    constructor() {
      // Luz 1: Branca (movimentando acompanhando a camera)
      this.pos = vec4.fromValues(0,0,0,0.0);

      this.amb_c = vec4.fromValues(5.0, 5.0, 5.0, 5.0);
      this.amb_k = 0.0;
  
      this.dif_c = vec4.fromValues(5.0, 5.0, 5.0, 1.0);
      this.dif_k = 9;
  
      this.esp_c = vec4.fromValues(5.0, 5.0, 5.0, 1.0);
      this.esp_k = 5.0;
      this.esp_p = 5.0;
    

     
  
    }
  
    createUniforms(gl, program){
      // Luz 1: Branca

      const posLoc = gl.getUniformLocation(program, "light_pos");
      gl.uniform4fv(posLoc, this.pos);
  
      const ambCLoc = gl.getUniformLocation(program, "light_amb_c");
      gl.uniform4fv(ambCLoc, this.amb_c);
      const ambKLoc = gl.getUniformLocation(program, "light_amb_k")
      gl.uniform1f(ambKLoc, this.amb_k);
  
      const difCLoc = gl.getUniformLocation(program, "light_dif_c");
      gl.uniform4fv(difCLoc, this.dif_c);
      const difKLoc = gl.getUniformLocation(program, "light_dif_k")
      gl.uniform1f(difKLoc, this.dif_k);
  
      const espCLoc = gl.getUniformLocation(program, "light_esp_c");
      gl.uniform4fv(espCLoc, this.pos);
      const espKLoc = gl.getUniformLocation(program, "light_esp_k")
      gl.uniform1f(espKLoc, this.esp_k);
      const espPLoc = gl.getUniformLocation(program, "light_esp_p")
      gl.uniform1f(espPLoc, this.esp_p);
    }
  
    updateLight(angulo) {
      //luz se mexe junto com a camera matrix, consegue ver o efeito na camera Parada
      this.pos = vec4.fromValues(Math.cos(angulo)*50,-10,50*Math.sin(angulo),1);

    }

    updateLightMesh(gl,program) {

      const posLoc = gl.getUniformLocation(program,"light_pos")
      gl.uniform4fv(posLoc,this.pos);
    }
  }