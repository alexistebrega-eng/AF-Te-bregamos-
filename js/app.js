// =======================
// CONFIG
// =======================
const PHONE = "18494349505";

// =======================
// ELEMENTOS
// =======================
const menu = document.getElementById("menu");

// =======================
// MENU
// =======================
function abrirMenu(){menu.classList.add("active")}
function cerrarMenu(){menu.classList.remove("active")}

// =======================
// SECCIONES
// =======================
function mostrar(id){
  document.querySelectorAll(".seccion").forEach(s=>s.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");
  cerrarMenu();
}

// =======================
// CARRITO (GUARDADO REAL)
// =======================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function comprar(plan,precio){

  carrito.push({
    plan,
    precio,
    fecha: new Date().toLocaleString()
  });

  guardarCarrito();
  actualizarCarrito();

  toast(`🔥 ${plan} agregado`);
}

function guardarCarrito(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito(){

  let lista=document.getElementById("carritoLista");
  let total=document.getElementById("carritoTotal");

  if(!lista || !total) return;

  lista.innerHTML="";
  let suma=0;

  carrito.forEach((p,index)=>{
    suma+=p.precio;

    lista.innerHTML+=`
      <div class="card">
        <h3>${p.plan}</h3>
        <p>RD$${p.precio}</p>
        <button onclick="eliminar(${index})">❌</button>
      </div>
    `;
  });

  total.innerText="Total: RD$"+suma;
}

function eliminar(i){
  carrito.splice(i,1);
  guardarCarrito();
  actualizarCarrito();
}

// =======================
// WHATSAPP PRO (VENTAS)
// =======================
function enviarCarrito(){

  if(carrito.length === 0){
    toast("❌ Carrito vacío");
    return;
  }

  let total=0;
  let msg="🔥 *NUEVO PEDIDO*\n\n";

  carrito.forEach(p=>{
    msg+=`• ${p.plan} - RD$${p.precio}\n`;
    total+=p.precio;
  });

  msg+=`\n💰 Total: RD$${total}`;
  msg+="\n📲 Método de pago: Transferencia";
  msg+="\n📸 Enviar comprobante";

  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`);
}

// =======================
// TOAST
// =======================
function toast(msg){
  let t=document.getElementById("toast");
  if(!t) return;

  t.innerText=msg;
  t.classList.add("show");

  setTimeout(()=>t.classList.remove("show"),2000);
}

// =======================
// TRAILER
// =======================
function abrirTrailer(url){
  let iframe=document.getElementById("iframeTrailer");
  let modal=document.getElementById("modal");

  iframe.src=url+"?autoplay=1";
  modal.style.display="flex";
}

function cerrarTrailer(){
  document.getElementById("iframeTrailer").src="";
  document.getElementById("modal").style.display="none";
}

// =======================
// PREVIEW HOVER (NETFLIX)
// =======================
let hoverTimer;

function preview(div,url){

  hoverTimer=setTimeout(()=>{

    if(div.querySelector("iframe")) return;

    let iframe=document.createElement("iframe");
    iframe.src=url+"?autoplay=1&mute=1";
    iframe.className="preview";

    div.appendChild(iframe);

  },700);

  div.onmouseleave=()=>{
    clearTimeout(hoverTimer);
    let iframe=div.querySelector("iframe");
    if(iframe) iframe.remove();
  }
}

// =======================
// DATOS (10 PELÍCULAS)
// =======================
const peliculas=[
  {img:"https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",trailer:"https://www.youtube.com/embed/zAGVQLHvwOY"},
  {img:"https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg",trailer:"https://www.youtube.com/embed/TcMBFSGVi1c"},
  {img:"https://image.tmdb.org/t/p/w300/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",trailer:"https://www.youtube.com/embed/JfVOs4VSpmA"},
  {img:"https://image.tmdb.org/t/p/w300/74xTEgt7R36Fpooo50r9T25onhq.jpg",trailer:"https://www.youtube.com/embed/mqqft2x_Aa4"},
  {img:"https://image.tmdb.org/t/p/w300/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",trailer:"https://www.youtube.com/embed/qEVUtrk8_B4"},
  {img:"https://image.tmdb.org/t/p/w300/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",trailer:"https://www.youtube.com/embed/aOb15GVFZxU"},
  {img:"https://image.tmdb.org/t/p/w300/5Kg76ldv7VxeX9YlcQXiowHgdX6.jpg",trailer:"https://www.youtube.com/embed/WDkg3h8PCVU"},
  {img:"https://image.tmdb.org/t/p/w300/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",trailer:"https://www.youtube.com/embed/aWzlQ2N6qqg"},
  {img:"https://image.tmdb.org/t/p/w300/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",trailer:"https://www.youtube.com/embed/X0tOpBuYasI"},
  {img:"https://image.tmdb.org/t/p/w300/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg",trailer:"https://www.youtube.com/embed/-ezfi6FQ8Ds"}
];

// =======================
// CARRUSEL
// =======================
function cargar(){

  let cont=document.getElementById("peliculas");
  if(!cont) return;

  cont.innerHTML="";

  peliculas.forEach((p,i)=>{

    let div=document.createElement("div");
    div.className="pelicula";

    div.innerHTML=`
      <span class="ranking">${i+1}</span>
      <img src="${p.img}">
    `;

    div.onclick=()=>abrirTrailer(p.trailer);
    div.onmouseenter=()=>preview(div,p.trailer);

    cont.appendChild(div);
  });

  actualizarCarrito();
}

// =======================
// INIT
// =======================
window.onload=cargar;
