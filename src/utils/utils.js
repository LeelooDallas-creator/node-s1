export function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // Tant qu'il reste des éléments à mélanger.
  while (currentIndex !== 0) {

    // Choisir un élément restant.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Et l'échanger avec l'élément actuel.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}