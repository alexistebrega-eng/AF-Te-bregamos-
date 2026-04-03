// =======================
// ELEMENTOS
// =======================
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");

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
// LOGIN SIMPLE
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
// TOAST (MENSAJES)
// =======================
function toast(msg){
  let t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");

  setTimeout(()=>{
    t.classList.remove("show");
  },2000);
}

// =======================
// COMPRAR (GUARDA EN FIREBASE)
// =======================
async function comprar(plan,precio){

  let hoy = new Date();
  let vence = new Date();
  vence.setDate(hoy.getDate()+30);

  try{

    await db.collection("clientes").add({
      plan: plan,
      precio: precio,
      fecha: hoy.toISOString(),
      vence: vence.toISOString()
    });

    toast("🔥 Enviando a WhatsApp...");

    enviarWhatsApp(plan,precio);

  }catch(error){
    console.error(error);
    toast("❌ Error al guardar");
  }
}

// =======================
// WHATSAPP AUTOMÁTICO
// =======================
function enviarWhatsApp(plan,precio){

  let mensajes = {
    "Netflix":[
      "Quiero Netflix ahora mismo 🔥",
      "Actívame Netflix hoy 🎬",
      "Necesito Netflix urgente 👀"
    ],
    "YouTube Music":[
      "Quiero música sin anuncios 🎧",
      "Dame YouTube Music Premium 🔥"
    ],
    "Combo":[
      "🔥 QUIERO EL COMBO PREMIUM 🔥",
      "Dame todo el combo ahora 🚀"
    ]
  };

  let random = mensajes[plan][Math.floor(Math.random()*mensajes[plan].length)];

  let mensaje = `${random}

💰 Precio: RD$${precio}
📅 Duración: 30 días

¿Disponible ahora?`;

  // REDIRECCIÓN
  setTimeout(()=>{
    location.href="https://wa.me/18494349505?text="+encodeURIComponent(mensaje);
  },800);
}

// =======================
// ADMIN (VER CLIENTES)
// =======================
async function cargarClientes(){

  const cont = document.getElementById("listaClientes");
  cont.innerHTML = "Cargando...";

  try{

    const snapshot = await db.collection("clientes").get();

    cont.innerHTML = "";

    if(snapshot.empty){
      cont.innerHTML = "<p>No hay clientes aún</p>";
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
    cont.innerHTML = "❌ Error cargando clientes";
  }
}

// =======================
// ATAJOS DE TECLADO (PRO)
// =======================
// =======================
// DATOS PELÍCULAS
// =======================
const peliculasData = [
  {
    nombre:"Wonder Woman 1984",
    imagen:"https://image.tmdb.org/t/p/w300/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
    calificacion:"7.4",
    trailer:"https://www.youtube.com/embed/8ugaeA-nMTc"
  },
  {
    nombre:"Black Panther",
    imagen:"https://image.tmdb.org/t/p/w300/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    calificacion:"7.3",
    trailer:"https://www.youtube.com/embed/xjDjIWPwcPU"
  },
  {
    nombre:"Joker",
    imagen:"https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    calificacion:"8.5",
    trailer:"https://www.youtube.com/embed/zAGVQLHvwOY"
  }
];

// =======================
// DATOS ANIME
// =======================
const animeData = [
  {
    nombre:"Attack on Titan",
    imagen:"https://upload.wikimedia.org/wikipedia/en/9/9d/Attack_on_Titan_S3.jpg",
    calificacion:"9.0",
    trailer:"https://www.youtube.com/embed/MGRm4IzK1SQ"
  },
  {
    nombre:"One Piece",
    imagen:"https://upload.wikimedia.org/wikipedia/en/2/2e/One_Piece_Anime.png",
    calificacion:"8.9",
    trailer:"https://www.youtube.com/embed/uaeY3kVfZCo"
  },
  {
    nombre:"Demon Slayer",
    imagen:"https://upload.wikimedia.org/wikipedia/en/3/3e/Kimetsu_no_Yaiba_poster.jpg",
    calificacion:"8.7",
    trailer:"https://www.youtube.com/embed/VQGCKyvzIM4"
  }
];

// =======================
// GENERAR CARRUSEL
// =======================
function generarCarrusel(id,data){
  const cont = document.getElementById(id);
  if(!cont) return;

  cont.innerHTML = "";

  data.forEach((d,i)=>{
    const div = document.createElement("div");
    div.className = "pelicula";

    div.innerHTML = `
      <img src="${d.imagen}" loading="lazy">
      <button class="play-btn" onclick="abrirTrailer('${d.trailer}')">▶</button>
      <div class="info-overlay">
        <h3>${d.nombre}</h3>
        <p>⭐ ${d.calificacion}</p>
        <button onclick="abrirTrailer('${d.trailer}')">Ver Trailer</button>
      </div>
    `;

    cont.appendChild(div);
  });
}

// =======================
// SCROLL CARRUSEL
// =======================
function scrollCarrusel(id,direccion){
  const carrusel = document.getElementById(id);
  if(!carrusel) return;

  const item = carrusel.querySelector(".pelicula");
  if(!item) return;

  const width = item.offsetWidth + 15;

  carrusel.scrollBy({
    left: direccion * width * 2,
    behavior: 'smooth'
  });
}

// =======================
// MODAL TRAILER
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
// INICIO AUTOMÁTICO
// =======================
window.onload = function(){
  generarCarrusel("peliculas", peliculasData);
  generarCarrusel("anime", animeData);
};
document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape"){
    cerrarMenu();
  }
});
