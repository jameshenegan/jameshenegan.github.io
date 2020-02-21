// Prep Data For Viz

// Assign X values
// StepSize = 1/ numberOfRepsPerTreatment;

let plotData = []

let currX = 0;
let stepSize = 1 / numberOfRepsPerTreatment;
let currentDataPoint = 0;


for (let j = 0; j < numberOfTreatments; j++) {

  for (let i = 0; i < numberOfRepsPerTreatment; i++) {
    currentDataPoint = currentDataPoint + 1;
    currX = currentDataPoint * stepSize;

    let currY = observedData[j].data[i];
    let currObject = {
      "x": currX,
      "y": currY,
      "group": j
    }

    plotData.push(currObject)
  };
}

let groupedPlotDat = []

let observedfactorMeans2 = []

for (i = 0; i < numberOfTreatments; i++) {
  for (j = 0; j < numberOfRepsPerTreatment; j++) {
    observedfactorMeans2.push(observedData[i].groupMean)
  }
}

// Compute x Means
let newPointDat = []
let newLineBeginDat = []
let newLineEndDat = []

for (j = 0; j < numberOfTreatments; j++) {
  let currentJ = j
  let currentData = plotData.filter(d => d.group == currentJ)
  let currentTotal = 0

  for (i = 0; i < currentData.length; i++) {
    currentTotal = currentTotal + currentData[i].x
  }

  let currentXmean = currentTotal / currentData.length
  for (i = 0; i < currentData.length; i++) {
    newPointDat.push({ "x": currentXmean, "y": observedData[currentJ].groupMean })
  }

  newLineBeginDat.push({
    "x1": currentXmean,
    "x2": currentXmean,
    "y1": observedData[currentJ].groupMean,
    "y2": observedData[currentJ].groupMean
  })

  newLineEndDat.push({
    "x1": currentXmean,
    "x2": currentXmean,
    "y1": observedData[currentJ].groupMean,
    "y2": grandMean
  })

}

let listOfXMeans = []
for(let j = 0; j < numberOfTreatments; j++){
  let currentIndex = j*numberOfRepsPerTreatment;
  listOfXMeans.push(newPointDat[currentIndex].x)
}


