// Number of Treatments
let numberOfTreatments = 6;
// Number of Replicates per Treatment
let numberOfRepsPerTreatment = 17;
// Standard Deviation
let standardDeviation = 1.5;
// Treatment Means
let treatmentMeans = [6, 13, 4, 16, 4, 12]

let round = function (numToRound, decPlaces) {
  let a = numToRound * Math.pow(10, decPlaces);
  let b = Math.round(a);
  let c = b / Math.pow(10, decPlaces)
  return c
}

