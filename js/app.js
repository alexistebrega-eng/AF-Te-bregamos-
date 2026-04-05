const menu = document.getElementById("menu");

// MENU
function abrirMenu(){menu.classList.add("active")}
function cerrarMenu(){menu.classList.remove("active")}

// SECCIONES
function mostrar(id){
  document.querySelectorAll(".seccion").forEach(s=>s.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");
  cerrarMenu();
}

// CARRITO
let carrito=[];

function comprar(plan,precio){
  carrito.push({plan,precio});
  actualizarCarrito();
}

function actualizarCarrito(){
  let lista=document.getElementById("carritoLista");
  let total=document.getElementById("carritoTotal");

  lista.innerHTML="";
  let suma=0;

  carrito.forEach(p=>{
    suma+=p.precio;
    lista.innerHTML+=`<p>${p.plan} RD$${p.precio}</p>`;
  });

  total.innerText="Total: RD$"+suma;
}

function enviarCarrito(){
  let msg="Pedido:\n";
  carrito.forEach(p=>{
    msg+=p.plan+" RD$"+p.precio+"\n";
  });

  window.open("https://wa.me/18494349505?text="+encodeURIComponent(msg));
}

// TRAILER
function abrirTrailer(url){
  document.getElementById("iframeTrailer").src=url;
  document.getElementById("modal").style.display="flex";
}

function cerrarTrailer(){
  document.getElementById("modal").style.display="none";
}

// DATOS
const peliculas=[
  {img:"https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",trailer:"https://www.youtube.com/embed/zAGVQLHvwOY"},
  {img:"https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg",trailer:"https://www.youtube.com/embed/TcMBFSGVi1c"}
];

function cargar(){
  let cont=document.getElementById("peliculas");

  peliculas.forEach(p=>{
    let div=document.createElement("div");
    div.className="pelicula";
    div.innerHTML=`<img src="${p.img}">`;
    div.onclick=()=>abrirTrailer(p.trailer);
    cont.appendChild(div);
  });
}

window.onload=cargar;
