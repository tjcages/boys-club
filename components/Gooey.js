import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import vs from "./glsl/gooey.vert";
import fs from "./glsl/gooey.frag";

const Gooey = ({mobile}) => {
  const canvas = useRef();
  const bitmap = useRef();

  var camera, scene, renderer;
  var uniforms;
  var startTime;

  var text =
    "BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS CLUB BOYS  ";
  var texture;
  var ctx;
  var fontSize = mobile ? 56 : 140;

  useEffect(() => {
    init(); //init scene
  }, [init]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function init() {
    //create image
    ctx = bitmap.current.getContext("2d");
    canvas.current.width = 594;
    canvas.current.height = 841;
    bitmap.current.width = 594;
    bitmap.current.height = 841;
    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;

    // canvas contents will be used for a texture
    texture = new THREE.Texture(bitmap.current);
    texture.needsUpdate = true;

    //Create THREE.JS scene and timer
    startTime = Date.now();
    camera = new THREE.Camera();
    camera.position.z = 1;
    scene = new THREE.Scene();

    //create a simple plance
    var geometry = new THREE.PlaneGeometry(2, 2);

    //create uniform table which provide all our GLSL binding
    uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      texture: { type: "t", value: texture },
      amplitude: { type: "f", value: 0.5 },
      frequency: { type: "f", value: 0.25 },
      lacunarity: { type: "f", value: 2.0 },
      gain: { type: "f", value: 0.5 },
      eta: { type: "f", value: 0.0 },
      gamma: { type: "f", value: 0.0 },
      eps: { type: "f", value: 1.0 },
    };

    //create THREE.JS material
    var material = new THREE.ShaderMaterial({
      //set shaders and uniforms into material
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
    });

    //create mesh, add it to the scene
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //create renderer and add it to the DOM
    renderer = new THREE.WebGL1Renderer({
      antialias: true,
      alpha: true,
      canvas: canvas.current,
    });

    //check window for resize This will give us the proper resolution values to bind
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    //set canvas size
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.font = "Bold " + fontSize + "px sans-serif";
    ctx.fillStyle = "white";
    wrapText(ctx, text, mobile ? 5 : 20, 0, canvas.current.width, fontSize * 0.85);

    animate(); //updateScene

    bitmap.current.remove();
  }

  function onWindowResize(event) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    canvas.current.width = uniforms.resolution.value.x;
    canvas.current.height = uniforms.resolution.value.y;
    bitmap.current.width = uniforms.resolution.value.x;
    bitmap.current.height = uniforms.resolution.value.y;
    
    ctx = bitmap.current.getContext("2d");
    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split("");
    var line = "";

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + "";
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + "";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  function animate() {
    render();
  }

  function render() {
    uniforms.time.value += 0.01;
    renderer.render(scene, camera);
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 100)
  }

  return (
    <>
      <canvas ref={canvas}></canvas>
      <canvas ref={bitmap}></canvas>
    </>
  );
};

export default Gooey;
