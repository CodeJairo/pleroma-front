export default function smoothScrollTo(
  targetY: number,
  duration: number = 500
) {
  const startY = window.scrollY; // Posición actual del scroll
  const distance = targetY - startY; // Distancia a recorrer
  const startTime = performance.now(); // Tiempo inicial

  const easeInOutQuad = (t: number) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime; // Tiempo transcurrido
    const progress = Math.min(elapsedTime / duration, 1); // Progreso (máximo 1)
    const ease = easeInOutQuad(progress); // Aplicar función de easing
    window.scrollTo(0, startY + distance * ease); // Actualizar posición del scroll

    if (progress < 1) {
      requestAnimationFrame(animateScroll); // Continuar animación
    }
  };

  requestAnimationFrame(animateScroll); // Iniciar animación
}
