function previewTrailer(div, url){

  let iframe = document.createElement("iframe");
  iframe.src = url + "?autoplay=1&mute=1";
  iframe.className = "preview";

  div.appendChild(iframe);

  div.onmouseleave = ()=>{
    iframe.remove();
  };
}
// =======================
// ELEMENTOS
// =======================
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");

// =======================
// CARRITO
// =======================
let carrito = [];

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

  if(pass==="1234"){
    mostrar("admin");
  }else{
    alert("❌ Acceso denegado");
  }
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
// AGREGAR AL CARRITO
// =======================
function comprar(plan, precio){

  carrito.push({plan, precio});

  actualizarCarrito();

  toast(`✅ ${plan} agregado`);
}

// =======================
// ACTUALIZAR CARRITO
// =======================
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
}

// =======================
// ELIMINAR DEL CARRITO
// =======================
function eliminarDelCarrito(index){
  carrito.splice(index,1);
  actualizarCarrito();
}

// =======================
// ENVIAR CARRITO
// =======================
async function enviarCarrito(){

  if(carrito.length === 0){
    toast("❌ Carrito vacío");
    return;
  }

  let total = 0;
  let mensaje = "🔥 Hola, quiero ordenar:\n\n";

  carrito.forEach(item=>{
    mensaje += `• ${item.plan} - RD$${item.precio}\n`;
    total += item.precio;
  });

  mensaje += `\n💰 Total: RD$${total}`;
  mensaje += "\n\n¿Disponible ahora?";

  // Guardar en Firebase
  try{
    let hoy = new Date();
    let vence = new Date();
    vence.setDate(hoy.getDate()+30);

    for(const item of carrito){
      await db.collection("clientes").add({
        plan: item.plan,
        precio: item.precio,
        fecha: hoy.toISOString(),
        vence: vence.toISOString()
      });
    }

  }catch(error){
    console.error(error);
    toast("❌ Error guardando");
  }

  // Enviar WhatsApp
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

    if(snapshot.empty){
      cont.innerHTML = "<p>No hay clientes</p>";
      return;
    }

    snapshot.forEach(doc=>{
      let c = doc.data();

      let div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${c.plan}</h3>
        <p>💰 RD$${c.precio}</p>
        <p>📅 Expira: ${new Date(c.vence).toLocaleDateString()}</p>
      `;

      cont.appendChild(div);
    });

  }catch(error){
    console.error(error);
    cont.innerHTML = "❌ Error";
  }
}

// =======================
// =======================
// DATOS PELÍCULAS
// =======================
const peliculasData = [
  {nombre:"Joker",imagen:"https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",calificacion:"8.5",trailer:"https://www.youtube.com/embed/zAGVQLHvwOY"},
  {nombre:"Avengers Endgame",imagen:"https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg",calificacion:"8.4",trailer:"https://www.youtube.com/embed/TcMBFSGVi1c"},
  {nombre:"Spider-Man No Way Home",imagen:"https://image.tmdb.org/t/p/w300/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",calificacion:"8.3",trailer:"https://www.youtube.com/embed/JfVOs4VSpmA"},
  {nombre:"The Batman",imagen:"https://image.tmdb.org/t/p/w300/74xTEgt7R36Fpooo50r9T25onhq.jpg",calificacion:"7.9",trailer:"https://www.youtube.com/embed/mqqft2x_Aa4"},
  {nombre:"John Wick 4",imagen:"https://image.tmdb.org/t/p/w300/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",calificacion:"8.2",trailer:"https://www.youtube.com/embed/qEVUtrk8_B4"},

  {nombre:"Fast X",imagen:"https://image.tmdb.org/t/p/w300/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",calificacion:"7.2",trailer:"https://www.youtube.com/embed/aOb15GVFZxU"},
  {nombre:"Aquaman",imagen:"https://image.tmdb.org/t/p/w300/5Kg76ldv7VxeX9YlcQXiowHgdX6.jpg",calificacion:"7.0",trailer:"https://www.youtube.com/embed/WDkg3h8PCVU"},
  {nombre:"Doctor Strange 2",imagen:"https://image.tmdb.org/t/p/w300/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",calificacion:"7.5",trailer:"https://www.youtube.com/embed/aWzlQ2N6qqg"},
  {nombre:"Black Adam",imagen:"https://image.tmdb.org/t/p/w300/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",calificacion:"6.9",trailer:"https://www.youtube.com/embed/X0tOpBuYasI"},
  {nombre:"Venom 2",imagen:"https://image.tmdb.org/t/p/w300/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg",calificacion:"7.1",trailer:"https://www.youtube.com/embed/-ezfi6FQ8Ds"}
];
// =======================
// DATOS ANIME
// =======================
const animeData = [
  {nombre:"Attack on Titan",imagen:"https://upload.wikimedia.org/wikipedia/en/9/9d/Attack_on_Titan_S3.jpg",calificacion:"9.0",trailer:"https://www.youtube.com/embed/MGRm4IzK1SQ"},
  {nombre:"One Piece",imagen:"https://upload.wikimedia.org/wikipedia/en/2/2e/One_Piece_Anime.png",calificacion:"8.9",trailer:"https://www.youtube.com/embed/uaeY3kVfZCo"},
  {nombre:"Demon Slayer",imagen:"https://upload.wikimedia.org/wikipedia/en/3/3e/Kimetsu_no_Yaiba_poster.jpg",calificacion:"8.7",trailer:"https://www.youtube.com/embed/VQGCKyvzIM4"},
  {nombre:"Jujutsu Kaisen",imagen:"https://image.tmdb.org/t/p/w300/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg",calificacion:"8.6",trailer:"https://www.youtube.com/embed/pkKu9hLT-t8"},
  {nombre:"Solo Leveling",imagen:"https://image.tmdb.org/t/p/w300/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",calificacion:"8.8",trailer:"https://www.youtube.com/embed/ghvUY6xGth4"}
];
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

    // 🔥 CLICK → abre trailer
    div.onclick = ()=>abrirTrailer(d.trailer);
function previewTrailer(div, url){

  // evitar duplicados
  if(div.querySelector("iframe")) return;

  let iframe = document.createElement("iframe");

  iframe.src = url + "?autoplay=1&mute=1";
  iframe.className = "preview";

  div.appendChild(iframe);

  div.onmouseleave = ()=>{
    iframe.remove();
  };
}
    // 🔥 HOVER → preview automático
    div.onmouseenter = ()=>previewTrailer(div,d.trailer);

    cont.appendChild(div);
  });
}
