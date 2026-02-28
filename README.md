# Visualizador de Algoritmos de Pathfinding 
Visualizador web interactivo que demuestra visualmente el funcionamiento o el como operan los algortimos de busqueda fundamentales en el campo de la IA 

**¿Como funciona este sistema?**

Este sistema  esta elaborado bajo el paradigma Orientado A Objetos y este funciona a traves de un ciclo renderizado continuo, como por ejemplo:

1. **Grid** que este es el lienzo en donde se divide una matriz bidimensional donde cada celda es un objeto de la clase 'Nodo' y este guarda su propio estado de memoria.
2. **Interaccion con el usuario**. Mediante eventos del DOM y de p5.js ('mousePressed', 'mouseDragged'), el usuario altera el estado de los nodos en tiempo real creando obstáculos (paredes) o moviendo las metas.
3. **Ejecucion Asincrona** cuando se ejecuta dicho algoritmo, se utiliza JavaScript asíncrono ('async/await') junto con la ejecución por milisegundos ('sleep'), esto hace que haya una animacion del proceso de la toma de desiciones paso a paso, asi evitando que dicho algoritmo se resuelva instantaneamente.
4. **Colores de Estado:**
 *  **Verde:** Nodos en la frontera (Lista de espera / Abiertos).
 *  **Rojo:** Nodos ya evaluados (Visitados / Cerrados).
 *  **Amarillo:** Trazado final recuperando los punteros hacia el 'padre' desde la meta hasta el inicio.
  
## Algoritmos Implementados
* **BFS (Anchura):** Explora mediante una estructura de **Cola** (FIFO). Explora todos los niveles.
* **DFS (Profundidad):** Explora mediante una estructura de **Pila** (LIFO). Llega al límite de una ruta antes de retroceder.
* **Dijkstra:** Ordena los nodos evaluando el costo mas barato del recorrido desde el punto de partida.
* **A*:** Algoritmo  de búsqueda informada que utiliza heurísticas para predecir la ruta más eficiente.

## ¿Por qué A-estrella visita menos nodos que BFS?

Al ejecutar ambos algoritmos en el mismo laberinto, es visualmente evidente que BFS evalúa (pinta de rojo) casi todo el mapa, mientras que A* crea un camino mucho más directo y limpio. 
Esto sucede ya que **BFS** es "Ciego" (No informado), no sabe en qué dirección está la meta. Su única regla es explorar todos los niveles (como una onda de agua). De lo contrario **A-estrella** es inteligente (informado) ya que este utiliza una función heurística para tomar decisiones. Por cada paso, A* evalúa la fórmula matemática: 
  $f(n) = g(n) + h(n)$.
Donde $g(n)$ es el costo real desde el inicio, y $h(n)$ es la heuristica por lo tanto ignora los caminos que lo alejan de la meta y prioriza exclusivamente los nodos que minimizan el costo total $f(n)$, resultando en muchos menos nodos visitados y un tiempo de procesamiento mucho más rápido y por lo tanto es mas utilizado para optimizar rutas eficientemente.

## Tecnologías implementadas 
* **HTML5 & CSS:** Estructura y UI/UX.
* **JavaScript:** Para logica y lograr animaciones
* **p5.js:** Renderizado en Canvas.

  
