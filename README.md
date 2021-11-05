INSTRUCCIONES

Correr el HTML con Live Server para que no fallen las llamadas asincronas, sobre todo el mazo, que esta en un JS aparte.

EN QUE CONSISTE

Es un juego de BlackJack que conserva los fondos del jugador de forma local. Las reglas son acercarse lo más posible a 21 puntos sin pasarse. 
Se apuesta un monto de dinero que se duplica si el jugador gana. El jugador recibe dos cartas, y cada vez que toca "hit" pide una carta adicional.
Una vez que el jugador hace "stand", juega la computadora (bajo un nombre traído de forma asíncrona mediante AJAX) procurando realizar lo mismo que el jugador para ganarle.
La informacion relevante se va updateando de forma adecuada conforme al momento del juego.
Feature: abajo de todo (hay que scrollear un poco hacia abajo) esta oculta de la vista la lista de jugadores distinguidos de la que toman nombre los bots.

