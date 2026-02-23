let columnas = 10;
let filas = 10;
let anchoCelda, altoCelda;
let grid = [];


let nodoInicio, nodoFin;


const COLOR_FONDO = [255, 228, 225]; // Salmón
const COLOR_PARED = [52, 52, 52];    // Gris oscuro
const COLOR_INICIO = [172, 99, 240]; // Morado
const COLOR_FIN = [72, 134, 247];       // AZUL


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


class Nodo {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.esPared = false;
    this.esInicio = false;
    this.esFin = false;
    
    this.visitado = false;   //(Cerrado)
    this.esFrontera = false; //(Abierto)
    this.esCamino = false;   //(Ruta final)
    this.padre = null;  
    this.distancia = Infinity; // Para Dijkstra   
    // Para A*
    this.f = Infinity; 
    this.g = Infinity; 
    this.h = 0;

  }

  mostrar() {
    if (this.esInicio) {
      fill(COLOR_INICIO);
    } else if (this.esFin) {
      fill(COLOR_FIN);
    } else if (this.esPared) {
      fill(COLOR_PARED);
    } else if (this.esCamino) {
      fill(255, 255, 0); // Amarillo
    } else if (this.esFrontera) {
      fill(0, 255, 0);   // Verde
    } else if (this.visitado) {
      fill(255, 0, 0);   // Rojo
    } else {
      fill(COLOR_FONDO); // Normal
    }
    
    stroke(0); 
    rect(this.i * anchoCelda, this.j * altoCelda, anchoCelda, altoCelda);
  }
}


function setup() {
  createCanvas(450, 450); 
  anchoCelda = width / columnas;
  altoCelda = height / filas;

  // Fabricamos los 100 nodos
  for (let i = 0; i < columnas; i++) {
    grid[i] = [];
    for (let j = 0; j < filas; j++) {
      grid[i][j] = new Nodo(i, j);
    }
  }

  // Asignamos el inicio y el fin por defecto (esquinas)
  nodoInicio = grid[0][0];
  /*nodoInicio.esInicio = true;*/
  nodoFin = grid[columnas - 1][filas - 1];
  /*nodoFin.esFin = true;*/
}

function draw() {
  background(255);
  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {
      grid[i][j].mostrar();
    }
  }
}

function mouseDragged() { dibujarConMouse(); }
function mousePressed() { dibujarConMouse(); }

function dibujarConMouse() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    
    let i = floor(mouseX / anchoCelda);
    let j = floor(mouseY / altoCelda);
    let nodoClickeado = grid[i][j];

    let herramienta = document.querySelector('input[name="herramienta"]:checked').value;

    if (herramienta === 'inicio') {
      nodoInicio.esInicio = false; // Borra el viejo
      nodoInicio = nodoClickeado;  // Actualiza memoria
      nodoInicio.esInicio = true;  // Pinta el nuevo
      nodoInicio.esPared = false;  // Seguro anticaídas
    } 
    else if (herramienta === 'fin') {
      nodoFin.esFin = false;
      nodoFin = nodoClickeado;
      nodoFin.esFin = true;
      nodoFin.esPared = false;
    } 
    else if (herramienta === 'pared') {
      if (nodoClickeado !== nodoInicio && nodoClickeado !== nodoFin) {
        nodoClickeado.esPared = true; 
      }
    }
  }
}


function limpiarBusqueda() {
  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {
      grid[i][j].visitado = false;
      grid[i][j].esFrontera = false;
      grid[i][j].esCamino = false;
      grid[i][j].padre = null;
      grid[i][j].distancia = Infinity; // Para Dijkstra
      // Para A*
      grid[i][j].f = Infinity;
      grid[i][j].g = Infinity;
      grid[i][j].h = 0;
     
    }
  }
}

function limpiarTablero() {
  limpiarBusqueda(); // Limpia los colores de búsqueda
  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {
      grid[i][j].esPared = false; // Limpia las paredes también
    }
    for (let j = 0; j < filas; j++) {
      grid[i][j].esInicio = false;
    }
    for (let j = 0; j < filas; j++) {
      grid[i][j].esFin = false;
    }
  }
}

//ALGORITMO BFS 
async function ejecutarBFS() {
  limpiarBusqueda(); // Limpiamos 
  let queue = [];
  
  queue.push(nodoInicio);
  nodoInicio.visitado = true;

  let movimientos = [ 
    [0, -1], 
    [0, 1], 
    [-1, 0], 
    [1, 0] 
  ];
  let encontrado = false;

  while (queue.length > 0) {
    await sleep(30); 

    let actual = queue.shift();
    actual.esFrontera = false; 

  
    if (actual === nodoFin) {
      encontrado = true;
      break;
    }

    // Revisar a los 4 vecinos
    for (let mov of movimientos) {
      let vecinoI = actual.i + mov[0];
      let vecinoJ = actual.j + mov[1];

      if (vecinoI >= 0 && vecinoI < columnas && vecinoJ >= 0 && vecinoJ < filas) {
        let vecino = grid[vecinoI][vecinoJ];

        if (!vecino.esPared && !vecino.visitado) {
          vecino.visitado = true;
          vecino.padre = actual;     // Recordamos de dónde venimos
          vecino.esFrontera = true;  // Lo pintamos de verde
          queue.push(vecino);        // Lo metemos a la Cola
        }
      }
    }
  }

  //Encontrado pintar de amarillo el camino
  if (encontrado) {
    let actual = nodoFin.padre;
    let ruta = [];
    
    while (actual !== nodoInicio && actual !== null) {
      ruta.push(actual);
      actual = actual.padre;
    }
    
    ruta.reverse(); 
    
    for (let nodoCamino of ruta) {
      await sleep(30);
      nodoCamino.esCamino = true;
    }
  } else {
    alert("No hay camino posible hacia la meta");
  }
}


// ALGORITMO DFS 
async function ejecutarDFS() {
  limpiarBusqueda(); // Limpiamos 
  let stack = []; 
  
  stack.push(nodoInicio);
  nodoInicio.visitado = true;

 
  let movimientos = [
     [0, -1], 
     [0, 1], 
     [-1, 0], 
     [1, 0]
     ];
  let encontrado = false;

  while (stack.length > 0) {
    await sleep(30); 

  
    let actual = stack.pop();
    actual.esFrontera = false; 


    if (actual === nodoFin) {
      encontrado = true;
      break;
    }

    // Revisar a los 4 vecinos
    for (let mov of movimientos) {
      let vecinoI = actual.i + mov[0];
      let vecinoJ = actual.j + mov[1];

    
      if (vecinoI >= 0 && vecinoI < columnas && vecinoJ >= 0 && vecinoJ < filas) {
        let vecino = grid[vecinoI][vecinoJ];

       
        if (!vecino.esPared && !vecino.visitado) {
          vecino.visitado = true;
          vecino.padre = actual;     
          vecino.esFrontera = true;  
          stack.push(vecino); // Lo metemos hasta arriba de la Pila
        }
      }
    }
  }

  //Encontrado pintar de amarillo el camino
  if (encontrado) {
    let actual = nodoFin.padre;
    let ruta = [];
    
    while (actual !== nodoInicio && actual !== null) {
      ruta.push(actual);
      actual = actual.padre;
    }
    
    ruta.reverse(); 
    
    for (let nodoCamino of ruta) {
      await sleep(30);
      nodoCamino.esCamino = true;
    }
  } else {
    alert("No hay camino posible hacia la meta");
  }
}

//ALGORITMO DIJKSTRA
async function ejecutarDijkstra() {
  limpiarBusqueda(); // Limpiamos
  let listaEspera = [];

  nodoInicio.distancia = 0;
  listaEspera.push(nodoInicio);

  let movimientos = [
    [0, -1], 
    [0, 1], 
    [-1, 0], 
    [1, 0]
  ];
  let encontrado = false;

  while (listaEspera.length > 0) {
    await sleep(30);

    listaEspera.sort((a, b) => a.distancia - b.distancia);
    let actual = listaEspera.shift();
    actual.esFrontera = false;

    if (actual === nodoFin) {
      encontrado = true;
      break;
    }

    actual.visitado = true; //marcamos como visitado (cerrado)

    //Revisar a los 4 vecinos
    for (let mov of movimientos) {
      let vecinoI = actual.i + mov[0];
      let vecinoJ = actual.j + mov[1];

      if (vecinoI >= 0 && vecinoI < columnas && vecinoJ >= 0 && vecinoJ < filas) {
        let vecino = grid[vecinoI][vecinoJ];

        if (!vecino.esPared) {
          let nuevaDistancia = actual.distancia + 1;
          if (vecino.distancia === undefined || nuevaDistancia < vecino.distancia) {
            vecino.distancia = nuevaDistancia;
            vecino.padre = actual; // Recordamos de dónde venimos
            if (!vecino.esFrontera) {
              vecino.esFrontera = true; //Lo pintamos de verde
              listaEspera.push(vecino); // Lo metemos a la lista de espera
            }
          }
        }
      }
    }


  }
  //Encontrado pintar de amarillo el camino
  if (encontrado) {
    let actual = nodoFin.padre;
    let ruta = [];  

    while (actual !== nodoInicio && actual !== null) {
      ruta.push(actual);
      actual = actual.padre;
    }

    ruta.reverse();

    for (let nodoCamino of ruta) {
      await sleep(30);
      nodoCamino.esCamino = true;
    }
  } else {
    alert("No hay camino posible hacia la meta");
  }
}

//HEURÍSTICA PARA A* 
function heuristica(a, b) {
  return dist(a.i, a.j, b.i, b.j);
}

//ALGORITMO A*
async function ejecutarAStar() {
  limpiarBusqueda(); // Limpiamos
  let listaEspera = []; 

  //Calculamos la heurística para el nodo inicio
  nodoInicio.g = 0;
  nodoInicio.f = heuristica(nodoInicio, nodoFin);
  listaEspera.push(nodoInicio);

  let movimientos = [
    [0, -1], 
    [0, 1], 
    [-1, 0], 
    [1, 0],

    //En diagonal 
    [-1, -1], 
    [1, -1], 
    [-1, 1], 
    [1, 1]
  ];
  let encontrado = false;

  while (listaEspera.length > 0) {
    await sleep(30);

    // Ordenamos por f = g + h
    listaEspera.sort((a, b) => a.f - b.f);

    let actual = listaEspera.shift();
    actual.esFrontera = false;

    if (actual === nodoFin) {
      encontrado = true;
      break;
    }

    actual.visitado = true; //marcamos como visitado (cerrado)

    //Revisar a los 4 vecinos
    for (let mov of movimientos) {
      let vecinoI = actual.i + mov[0];
      let vecinoJ = actual.j + mov[1];

      if (vecinoI >= 0 && vecinoI < columnas && vecinoJ >= 0 && vecinoJ < filas) {
        let vecino = grid[vecinoI][vecinoJ];

        if (!vecino.esPared && !vecino.visitado) {
          let nuevaG = actual.g + 1;

          if (vecino.g === undefined || nuevaG < vecino.g) {
            vecino.g = nuevaG;
            vecino.h = heuristica(vecino, nodoFin);
            vecino.f = vecino.g + vecino.h;
            vecino.padre = actual; // Recordamos de dónde venimos
            if (!listaEspera.includes(vecino)) {
              vecino.esFrontera = true; //Lo pintamos de verde
              listaEspera.push(vecino); // Lo metemos a la lista de espera
            }
          }
        }
      }
    }
  }
  //Encontrado pintar de amarillo el camino
  if (encontrado) {
    let actual = nodoFin.padre;
    let ruta = [];  
    while (actual !== nodoInicio && actual !== null) {
      ruta.push(actual);
      actual = actual.padre;
    }
    ruta.reverse();
    for (let nodoCamino of ruta) {
      await sleep(30);
      nodoCamino.esCamino = true;
    }
  } else {
    alert("No hay camino posible hacia la meta");

    }
  }

