export function getRandomPhotos() {
  return fetch('https://pixabay.com/api/?key=3055439-135f649bc82c1d8501a4f2108&q=nature&image_type=photo&pretty=true').then(response => response.json())
}