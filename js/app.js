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
document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape"){
    cerrarMenu();
  }
});
