// Generate Observed Data
let observedData = []

for (let j = 0; j < numberOfTreatments; j++) {

  let currentGroup = j;
  let currentMean = treatmentMeans[currentGroup];

  let currentObject = {
    "treatment": currentGroup,
    "actualMean": currentMean,
    "data": []
  }

  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    let currentSample = jStat.normal.sample(0, standardDeviation);
    let currentObservation = currentMean + currentSample;
    currentObject.data.push(round(currentObservation, 5));
  };
  observedData.push(currentObject)
}

// Summarize Data

// Compute Group Means
for (let j = 0; j < numberOfTreatments; j++) {
  let groupTotal = 0;
  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    groupTotal = round(groupTotal + observedData[j].data[i], 5);
  };
  let groupMean = round(groupTotal / numberOfRepsPerTreatment, 5);
  observedData[j]['groupMean'] = groupMean
}

// Compute Grand Mean
let grandTotal = 0;
let numGrandObs = numberOfTreatments * numberOfRepsPerTreatment;

for (let j = 0; j < numberOfTreatments; j++) {
  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    grandTotal = round(grandTotal + observedData[j].data[i], 5);
  };
}

let grandMean = round(grandTotal / numGrandObs, 5);

let totalSS = 0;

for (let j = 0; j < numberOfTreatments; j++) {
  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    totalSS = totalSS + Math.pow(observedData[j].data[i] - grandMean,2);
  };
}





let errorSS = 0;

for (let j = 0; j < numberOfTreatments; j++) {
  let localGroupMean = observedData[j].groupMean
  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    errorSS = errorSS + Math.pow(observedData[j].data[i] - localGroupMean,2);
  };
}

let treatmentSS = 0;

for (let j = 0; j < numberOfTreatments; j++) {
  let localGroupMean = observedData[j].groupMean
  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    treatmentSS = treatmentSS + Math.pow(localGroupMean - grandMean,2);
  };
}

console.log(round(treatmentSS,2))


let treatmentDF = numberOfTreatments - 1
let errorDF = numberOfTreatments * numberOfRepsPerTreatment - numberOfTreatments
let totalDF = numberOfTreatments * numberOfRepsPerTreatment -1
document.getElementById("dispTreatmentDF").innerHTML = treatmentDF
document.getElementById("dispErrorDF").innerHTML = errorDF
document.getElementById("dispTotalDF").innerHTML = totalDF
document.getElementById("dispTotalSS").innerHTML = round(totalSS,2)
document.getElementById("dispErrorSS").innerHTML = round(errorSS,2)
document.getElementById("dispTreatmentSS").innerHTML = round(treatmentSS,2)

let errorMS = errorSS/errorDF;
let treatmentMS = treatmentSS/treatmentDF;
document.getElementById("dispErrorMS").innerHTML = round(errorMS,2)
document.getElementById("dispTreatmentMS").innerHTML = round(treatmentMS,2)

document.getElementById("dispF").innerHTML = round(treatmentMS/errorMS,2)
