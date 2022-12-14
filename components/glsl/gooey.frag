#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;
uniform float amplitude;
uniform	float frequency;
uniform	float lacunarity;
uniform	float gain;
uniform float eta;
uniform float gamma;
uniform float eps;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define octave 8

float expStep(float x, float k, float n ){
  //Author: Inigo Quiles
  return exp( -k*pow(x,n) );
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
        sin(_angle),cos(_angle));
}

vec2 rotateFrom(vec2 uv, vec2 center, float angle){
  vec2 uv_ = uv - center;
  uv_ =  rotate2d(angle) * uv_;
  uv_ = uv_ + center;

  return uv_;
}

float random(float value){
  return fract(sin(value) * 43758.5453123);
}

float random(vec2 tex){
  return fract(sin(dot(tex.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float random(vec3 tex){
  //return fract(sin(x) * offset);
  return fract(sin(dot(tex.xyz, vec3(12.9898, 78.233, 12.9898))) * 43758.5453123);//43758.5453123);
}

vec2 random2D(vec2 uv){
  uv = vec2(dot(uv, vec2(127.1, 311.7)), dot(uv, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(uv) * 43758.5453123);
}

vec3 random3D(vec3 uv){
  uv = vec3(dot(uv, vec3(127.1, 311.7, 120.9898)), dot(uv, vec3(269.5, 183.3, 150.457)), dot(uv, vec3(380.5, 182.3, 170.457)));
  return -1.0 + 2.0 * fract(sin(uv) * 43758.5453123);
}

float cubicCurve(float value){
  return value * value * (3.0 - 2.0 * value); // custom cubic curve
}

vec2 cubicCurve(vec2 value){
  return value * value * (3.0 - 2.0 * value); // custom cubic curve
}

vec3 cubicCurve(vec3 value){
  return value * value * (3.0 - 2.0 * value); // custom cubic curve
}

float noise(vec2 uv){
  vec2 iuv = floor(uv);
  vec2 fuv = fract(uv);
  vec2 suv = cubicCurve(fuv);

  float dotAA_ = dot(random2D(iuv + vec2(0.0)), fuv - vec2(0.0));
  float dotBB_ = dot(random2D(iuv + vec2(1.0, 0.0)), fuv - vec2(1.0, 0.0));
  float dotCC_ = dot(random2D(iuv + vec2(0.0, 1.0)), fuv - vec2(0.0, 1.0));
  float dotDD_ = dot(random2D(iuv + vec2(1.0, 1.0)), fuv - vec2(1.0, 1.0));

  return mix(
    mix(dotAA_, dotBB_,	suv.x),
    mix(dotCC_, dotDD_, suv.x),
    suv.y);
}

float noise(vec3 uv){
  vec3 iuv = floor(uv);
  vec3 fuv = fract(uv);
  vec3 suv = cubicCurve(fuv);

  float dotAA_ = dot(random3D(iuv + vec3(0.0)), fuv - vec3(0.0));
  float dotBB_ = dot(random3D(iuv + vec3(1.0, 0.0, 0.0)), fuv - vec3(1.0, 0.0, 0.0));
  float dotCC_ = dot(random3D(iuv + vec3(0.0, 1.0, 0.0)), fuv - vec3(0.0, 1.0, 0.0));
  float dotDD_ = dot(random3D(iuv + vec3(1.0, 1.0, 0.0)), fuv - vec3(1.0, 1.0, 0.0));

  float dotEE_ = dot(random3D(iuv + vec3(0.0, 0.0, 1.0)), fuv - vec3(0.0, 0.0, 1.0));
  float dotFF_ = dot(random3D(iuv + vec3(1.0, 0.0, 1.0)), fuv - vec3(1.0, 0.0, 1.0));
  float dotGG_ = dot(random3D(iuv + vec3(0.0, 1.0, 1.0)), fuv - vec3(0.0, 1.0, 1.0));
  float dotHH_ = dot(random3D(iuv + vec3(1.0, 1.0, 1.0)), fuv - vec3(1.0, 1.0, 1.0));

  float passH0 = mix(
    mix(dotAA_, dotBB_,	suv.x),
    mix(dotCC_, dotDD_, suv.x),
    suv.y);

  float passH1 = mix(
    mix(dotEE_, dotFF_,	suv.x),
    mix(dotGG_, dotHH_, suv.x),
    suv.y);

  return mix(passH0, passH1, suv.z);
}

float computeCurl2DAt(float x, float y) {
  //based Pete Werner implementation on http://platforma-kooperativa.org/media/uploads/curl_noise_slides.pdf
  //float eps = 1.0; //here epsilon is a global
  float n1, n2, a, b;

  //compute gradients
  n1 = noise(vec3(x, y + eps, 0));
  n2 = noise(vec3(x, y - eps, 0));
  a = (n1 - n2) / (2.0 * eps);

  n1 = noise(vec3(x + eps, y, 0));
  n2 = noise(vec3(x - eps, y, 0));
  b = (n1 - n2) / (2.0 * eps);

  vec2 curl = vec2(a, -b);


  return (curl.x + curl.y) / 2.0;
}

float computeCurl3DAt(float x, float y, float z) {
  //based Pete Werner implementation on http://platforma-kooperativa.org/media/uploads/curl_noise_slides.pdf
  //float eps = 1.0; //here epsilon is a global
  float n1, n2, a, b;
  vec3 curl;  

  //compute gradients
  n1 = noise(vec3(x, y + eps, z));
  n2 = noise(vec3(x, y - eps, z));
  a = (n1 - n2) / (2.0 * eps);

  n1 = noise(vec3(x, y, z + eps));
  n2 = noise(vec3(x, y, z - eps));
  b = (n1 - n2) / (2.0 * eps);

  curl.x = a - b;

  n1 = noise(vec3(x, y, z + eps));
  n2 = noise(vec3(x, y, z - eps)); 
  a = (n1 - n2) / (2.0 * eps);

  n1 = noise(vec3(x + eps, y, z));  
  n2 = noise(vec3(x + eps, y, z));  
  b = (n1 - n2) / (2.0 * eps);  

  curl.y = a - b;

  n1 = noise(vec3(x + eps, y, z));
  n2 = noise(vec3(x - eps, y, z));
  a = (n1 - n2) / (2.0 * eps);

  n1 = noise(vec3(x, y + eps, z));
  n2 = noise(vec3(x, y - eps, z));
  b = (n1 - n2) / (2.0 * eps); 

  curl.z = a - b;

  return (curl.x + curl.y + curl.z) / 3.0;
}

float fbm(vec3 st, float amp, float freq, float lac, float gain){
  //initial value
  float fbm = 0.0;

  vec3 shift = vec3(1.0);
  mat2 rot2 = mat2(cos(-eta), sin(eta), -sin(eta), cos(eta));
  mat3 rot3 = mat3(sin(-gamma) * cos(-eta), cos(gamma) * sin(eta), sin(gamma),
    sin(gamma) * -sin(eta), sin(-gamma) * cos(eta), sin(gamma),
    sin(gamma) * cos(eta), cos(gamma) * sin(eta), sin(gamma)
    );

  for(int i = 0; i < octave; i++){
    fbm += amp * computeCurl3DAt(st.x * freq, st.y * freq, st.z * freq);//(st * freq);
    st = rot3 * st * 1.5 + shift;
    freq *= lac;
    amp *= gain;
  }

  return fbm;
}

float domainWarping(vec3 st, float amp, float freq, float lac, float g){
  vec3 q = vec3(0.0);
  q.x = fbm(st, amp, freq, lac, g);
  q.y = fbm(st + vec3(1.0), amp, freq, lac, g);
  q.z = fbm(st + vec3(0.5), amp, freq, lac, g);

  vec3 r = vec3(0.0);
  r.x = fbm(st + 1.0 * q + vec3(0.610, 0.330, 0.556), amp, freq, lac, g);
  r.y = fbm(st + 1.0 * q + vec3(-0.180, 0.190, - 0.156), amp, freq, lac, g);
  r.z = fbm(st + 1.0 * q + vec3(0.750, -0.269, 0.256), amp, freq, lac, g);

  return fbm(st + r, amp, freq, lac, g);
}

vec4 addGrain(vec2 uv, float time, float grainIntensity){
    float grain = random(fract(uv * time)) * grainIntensity;
    return vec4(vec3(grain), 1.0);
}


void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  vec2 ouv = uv;
  vec2 center = vec2(0.5, 0.5);
  
  
  float maxTime = 8.0;
  float timeMod = mod(time, maxTime) / maxTime;
  
    //uv = rotateFrom(uv, vec2(0.0, 0.5), (timeMod * 2.0 - 1.0) * TWO_PI * 0.1);
  
  //uv.y += expStep(timeMod, 4.0, 1.0) * 2.0 - 0.55;//(fract(timeMod) * 1.5 - 0.75);
  
  float amplitudeX = 0.01;
  float periodX = 0.5;
  float amplitudeY = 0.01;
  float periodY = 5.0;
  float wavex = sin(TWO_PI * periodX * uv.x + time) * amplitudeX;
  float wavey = sin(TWO_PI * periodY * uv.y + time) * amplitudeY;
  uv.y += wavex;
  uv.x += wavey;
  
  float dist = length(center - ouv);
  float distEge = 0.05 + smoothstep(0.25, 0.5, dist) * 0.95;
  float dw = domainWarping(vec3(ouv + vec2(0.0, time * 0.01), fract(time * 0.01)), 1.0, 5.0 , 1., 1.0);
  dw = sin(dw * TWO_PI *  distEge * 0.5);
  float displace = dw;// * 2.0 - 1.0;
  displace *= 1.0;
  //displace *= distEge;
  
  float grey = dw * 0.5 + 0.5;
  
  vec2 offset = vec2(0.01, 0.01) * noise(vec3(ouv, time));
  
  float R = texture2D(texture, uv + offset + displace).r;
  float G = texture2D(texture, uv + displace).g;
  float B = texture2D(texture, uv - offset + displace).b;
  
  vec4 grain = addGrain(ouv, time, 0.15);
  
  gl_FragColor = vec4(R, G, B, 1.0) + grain;
}