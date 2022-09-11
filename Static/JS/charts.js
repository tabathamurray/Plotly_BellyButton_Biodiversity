function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
    d3.json("./Static/Data/samples.json").then((data) => {

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option") 
        .text(sample)
        .property("value", sample);
    });
    console.log(data);
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./Static/Data/samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
  
// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("./Static/Data/samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array and another that holds the metadata array. 

    let samples = data.samples;

    let metadata = data.metadata;

    // Create a variable that filters the samples for the object with the desired sample number.

    let resultArray = samples.filter(sampleObject => sampleObject.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    let resultMetadataArray = metadata.filter(metadataObj => metadataObj.id == sample);
    
    // Create a variable that holds the first sample in the array.
  
    let result = resultArray[0];

    console.log(result);

    // 2. Create a variable that holds the first sample in the metadata array.
    
    let resultMetadata = resultMetadataArray[0];

    console.log(resultMetadata);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // recall that the keys in the object can be called using dot notation.
    let otu_ids = result.otu_ids;
    console.log(otu_ids);

    let otu_labels = result.otu_labels;
    // console.log(otu_labels); 

    let sample_values = result.sample_values;
    console.log(sample_values);

    // 3. Create a variable that holds the washing frequency. Convert to floating-point decimal.

    let washFreq = parseFloat(resultMetadata.wfreq);
    console.log(washFreq);
   
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    // console.log(yticks);

    // Use Plotly to plot the bar data and layout.
    var barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels,
        type: "bar",
        orientation: "h"
      }
    ];

    //Create the layout for the bar chart. 
    var barLayout = {
      title: `Top Ten Bacteria Cultures Found in Sample ${sample}`, 
      font: { size: 13, color: "black"},
      paper_bgcolor: "lightgray",
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Bluered'
        }
      }
   
    ];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: `<b>All Bacteria Cultures for Sample ${sample}</b>`,
      font: { size: 20, color: "black" },
      xaxis:{title: "OTU ID"},
      yaxis: {title: "Bacteria Count"},
      paper_bgcolor: "lightgray",
    };

    // Use Plotly to plot the data with the layout. Recall that data must be passed as an array. Layout is okay as an object.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create the trace for the gauge chart.
    var gaugeData = [
     {
      type: "indicator",
		  mode: "gauge+number",
      value: washFreq,
      // <b> is for bold text and <br> is for new line
      title: { text: "<b>Navel Washing Frequency</b> <br> Scrubs per Week", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "black",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" },
        ]
      }
     }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lightgray",
      font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}