function calculateRatingMedian(array) {
  const starArray = array.map(arr => arr.star);
  const total = starArray.reduce(function(acc, curr) {
    return acc + curr;
  }, 0);
  const median = total / starArray.length;
  const fixedMedian = Math.ceil(median);
  return fixedMedian;
}

export default calculateRatingMedian;
