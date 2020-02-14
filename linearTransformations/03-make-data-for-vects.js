  let originalData = [];

  let numDivisions = 128;

  let lineLength = 3;

  for (let i = 0; i < numDivisions; i++) {

    let temp_x1 = 0;
    let temp_y1 = 0;

    let temp_x2 = temp_x1 + lineLength * Math.cos(2 * Math.PI * i / numDivisions);
    let temp_y2 = temp_y1 + lineLength * Math.sin(2 * Math.PI * i / numDivisions);

    let temp_object = { 'x1': temp_x1, 'x2': temp_x2, 'y1': temp_y1, 'y2': temp_y2 }
    originalData.push(temp_object)
  }

  let theta = Math.atan(1/2);

  for (let i = 0; i < numDivisions; i++) {

    let temp_x1 = 0;
    let temp_y1 = 0;

    let temp_x2 = lineLength * Math.cos(2 * Math.PI * i / numDivisions);
    let temp_y2 = lineLength * Math.sin(2 * Math.PI * i / numDivisions);

    let new_x2 = temp_x2 * Math.cos(theta) - temp_y2 * Math.sin(theta);
    let new_y2 = temp_x2 * Math.sin(theta) + temp_y2 * Math.cos(theta);

    let temp_object = { 'x1': temp_x1, 'x2': new_x2, 'y1': temp_y1, 'y2': new_y2 }
    originalData.push(temp_object)
  }


  
  


  

  let data = originalData;