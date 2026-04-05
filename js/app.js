// =======================
// ELEMENTOS
// =======================
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");

// =======================
// CARRITO (PERSISTENTE)
// =======================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =======================
// MENU
// =======================
function abrirMenu(){
  menu.classList.add("active");
  overlay.classList.add("active");
}

function cerrarMenu(){
  menu.classList.remove("active");
  overlay.classList.remove("active");
}

// =======================
// SECCIONES
// =======================
function mostrar(id){
  document.querySelectorAll(".seccion").forEach(s=>s.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");

  if(id==="admin"){
    cargarClientes();
  }

  cerrarMenu();
}

// =======================
// LOGIN
// =======================
function login(){
  let pass = prompt("Clave admin:");
  if(pass==="1234") mostrar("admin");
  else alert("❌ Acceso denegado");
}

// =======================
// TOAST
// =======================
function toast(msg){
  let t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}

// =======================
// CARRITO
// =======================
function comprar(plan, precio){
  carrito.push({plan, precio});
  actualizarCarrito();
  toast(`✅ ${plan} agregado`);
}

function actualizarCarrito(){
  const lista = document.getElementById("carritoLista");
  const total = document.getElementById("carritoTotal");

  if(!lista || !total) return;

  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach((item,index)=>{
    suma += item.precio;

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.plan}</h3>
      <p>RD$${item.precio}</p>
      <button class="btn" onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;

    lista.appendChild(div);
  });

  total.innerText = `Total: RD$${suma}`;

  // 🔥 guardar carrito
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(index){
  carrito.splice(index,1);
  actualizarCarrito();
}

// =======================
// WHATSAPP
// =======================
async function enviarCarrito(){

  if(carrito.length === 0){
    toast("❌ Carrito vacío");
    return;
  }

  let total = 0;
  let mensaje = "🔥 NUEVO PEDIDO\n\n";

  carrito.forEach(item=>{
    mensaje += `• ${item.plan} - RD$${item.precio}\n`;
    total += item.precio;
  });

  mensaje += `\n💰 Total: RD$${total}`;
  mensaje += "\n📸 Enviar comprobante";

  location.href = "https://wa.me/18494349505?text=" + encodeURIComponent(mensaje);
}

// =======================
// ADMIN
// =======================
async function cargarClientes(){

  const cont = document.getElementById("listaClientes");
  cont.innerHTML = "Cargando...";

  try{
    const snapshot = await db.collection("clientes").get();

    cont.innerHTML = "";

    snapshot.forEach(doc=>{
      let c = doc.data();

      let div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${c.plan}</h3>
        <p>💰 RD$${c.precio}</p>
      `;

      cont.appendChild(div);
    });

  }catch(error){
    cont.innerHTML = "❌ Error";
  }
}

// =======================
// TRAILER CLICK
// =======================
function abrirTrailer(url){
  document.getElementById("iframeTrailer").src = url + "?autoplay=1";
  document.getElementById("modal").style.display = "flex";
}

function cerrarTrailer(){
  document.getElementById("iframeTrailer").src = "";
  document.getElementById("modal").style.display = "none";
}

// =======================
// PREVIEW HOVER (PRO)
// =======================
let hoverTimer;

function previewTrailer(div, url){

  hoverTimer = setTimeout(()=>{

    if(div.querySelector("iframe")) return;

    let iframe = document.createElement("iframe");
    iframe.src = url + "?autoplay=1&mute=1";
    iframe.className = "preview";

    div.appendChild(iframe);

  },700);

  div.onmouseleave = ()=>{
    clearTimeout(hoverTimer);
    let iframe = div.querySelector("iframe");
    if(iframe) iframe.remove();
  };
}

// =======================
// CARRUSEL
// =======================
function generarCarrusel(id,data){
  const cont = document.getElementById(id);
  if(!cont) return;

  cont.innerHTML = "";

  data.forEach((d,index)=>{
    const div = document.createElement("div");
    div.className = "pelicula";

    div.innerHTML = `
      <span class="ranking">${index+1}</span>
      <img src="${d.imagen}">
      <div class="info-overlay">
        <h3>${d.nombre}</h3>
        <p>⭐ ${d.calificacion}</p>
      </div>
    `;

    div.onclick = ()=>abrirTrailer(d.trailer);
    div.onmouseenter = ()=>previewTrailer(div,d.trailer);

    cont.appendChild(div);
  });
}

// =======================
// INIT
// =======================
window.onload = ()=>{
  generarCarrusel("peliculas", peliculasData);
  generarCarrusel("anime", animeData);
  actualizarCarrito();
};

document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape") cerrarMenu();
});
