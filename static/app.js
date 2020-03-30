/****************************
* Belly Button Biodiversity *
*****************************/
// Step 1: Plotly
// 1. Use the D3 library to read in `samples.json`
// Bring the overall data from samples.json that we are going to use
// on the graphs and ID selection.

/**********************************************************************************
* Initialize                                                                      *
***********************************************************************************/
// samples.json have three panel of data: names, metadata and sample
// the panel "names" will be used in the dropdown menu to select the subject 'id' for the chart

/************************************************************************************
 * Build Table to show demographic data for selected 'Subject id'                   *
 ************************************************************************************/ 
// Bring the data from the JSON file to build data for the table in 'Demographic Info'

function buildMetadata(selectSubject) {
  d3.json("/samples.json").then(function(allData) {

    // bring data
    // let data = allData;

    // Assign var to the metadata sample
    var sampleMetadata = allData.metadata;

    // Filter the data for subject id
    var selectedMetadata = sampleMetadata.filter(x => x.id == selectSubject);
    var filteredMetadata = selectedMetadata[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_Metadata = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    sample_Metadata.html("");

    // Use `Object.entries` to add each key and values to the panel
    // R5. Display each key-value pair from the metadata JSON object somewhere on the page.      
    object.entries(filteredMetadata).forEach(function([key,value]){        
      // Use d3 to append new tags for each key-value in the metadata.
      var row = sample_Metadata.append("p");
      row.text(`${key}:${value}`);
    });

    // print the filtered data to the console
    console.log(filteredMetadata);

  });

  // load the data with the function buildMetadata
  buildMetadata()

  // Establish the reference between the element in the html and load data on the demografoc table. 
  var inputID = d3.select("#subjectid");
  var inputAge = d3.select("#age");
  var inputGender = d3.select("#gender");
  var inputEthnicity = d3.select("#ethnicity");
  var inputBbtype = d3.select("#bbtype");
  var inputWashFreq = d3.select('#wfreq');
  var inputLocation = d3.select('#location')
 
  // create the connection with the selection button to filter the data by "SubjectID"
  function filterData() {
    
    // set up the website and prevent it to refresh
    d3.event.preventDefault();

    // extract the input selected for all the row "subjectid", "age", "gender", "ethnicity", "bbtype", "wfreq", "location"
    var idValue = inputID.property("value");
    var ageValue = inputAge.property("value");
    var genderValue = inputGender.property("value");
    var ethnicityValue = inputEthnicity.property("value");
    var bbtypeValue = inputBbtype.property("value");
    var washFreqValue = inputWashFreq.property("value");
    var locationValue = inputLocation.property("value");
  }

}

/************************************************************************************
 * Build Bar Chart for selected 'Subject id'                                        *
 ************************************************************************************/ 
// R2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//      * Use `sample_values` as the values for the bar chart.
//      * Use `otu_ids` as the labels for the bar chart.
//      * Use `otu_labels` as the hovertext for the chart.

function buildCharts(selectSubject) {

  // Use d3.Json to fetch the sample panel values in the samples.
  
  d3.json("/samples.json").then(function(allData){
    // Assign var to the sample in sample
    var sampleSamples = allData.samples;

    // Build the bubble chart using the sample data
    // Define values for X axis and use 'otu_ids'
    var x_values = allData.otu.ids;
    var y_values = allData.sample_values;
    var m_size = allData.sample_values;
    var m_colors = allData.otu_ids; 
    var t_values = allData.otu_labels;

    // Use slice to display the chart the top 10 OTUs
    x_sliced = x_values.slice(0,10);
    y_sliced = y_values.slice(0,10);
    t_sliced = t_values.slice(0,10);
    ms_sliced = m_size.slice(0,10);
    mc_sliced = m_colors.sliced(0,10);
      
    // Create a trace object with the data
    var trace1 = {
      type: 'bar',
      orientation: "h",
      y: x_sliced ,
      x: y_sliced,
      hovertext: t_sliced,
    };
  
    // Create a data array with the above trace
    var data = [trace1];

    // Use `layout` to define a title, axis, etc
    var layout = {
      yaxis: {autoarange: "reversed"},
      title: "Bacterias",
      xaxis: { title: "OTU"},
      yaxis: { title: "Samples"}
    };
  
    // Render the plot 
    Plotly.newPlot("bar", data, layout); 
  });    
}

/************************************************************************************
 * Build Bubble Chart for selected 'Subject id'                                     *
 ************************************************************************************/
//R3. Create a bubble chart that displays each sample.
     // * Use `otu_ids` for the x values.
     // * Use `sample_values` for the y values.
     // * Use `sample_values` for the marker size.
     // * Use `otu_ids` for the marker colors.
     // * Use `otu_labels` for the text values.
     

// Display the sample metadata for an individual's demographic information.
function buildBubbleChart() {
  var subjectID = d3.select("#selDataset");
  d3.json("/samples.json").then(function(allData){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleSamples = allData.samples;


    var trace2 = {
      x: x_sliced,
      y: y_sliced,
      text: t_sliced,
      mode: 'markers',
      marker: {
        color: mc_sliced,
        size: ms_sliced
      } 
    };

    var data = [trace2];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', data, layout);

  });
};


/************************************************************************************
 * Build function Initiate 
 ************************************************************************************/

// R4. Display the sample metadata, i.e., an individual's demographic information.
function init() {
  // Grab a reference to the dropdown select the Test 'Subject ID'
  var subjectID = d3.select("#selDataset");

  /* Use the list of sample names to populate the select options and
     define the var for each of the panel of data in samples */ 
  d3.json("/samples.json").then((allData) => {
    // let data = allData
    var sampleName = allData.names;

    sampleName.forEach((sample) => {
      subjectID
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list ('id-940') to build the 'demographic table' and initial plots
    // Show the first sample subject id
    const selectSubject = sampleName[0];

    // Populate the demographic table 
    buildMetadata(selectSubject)

    // Build the  charts: horizontal bar chart and Bubble chart 
    buildCharts(selectSubject);

    // Buil the Gauge 
    buildGauge(selectSubject);
    
  });
};

/************************************************************************************
 * Build function OptionChanged                                                     *
 ************************************************************************************/

// R6. Update all of the plots any time that a new sample is selected. 
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // buildCharts(newSample);
  buildMetadata(newSample);
}

/************************************************************************************
 * Initialize the dashboard                                                         *
 ************************************************************************************/

init();

/************************************************************************************
 * Bonus:
 * Generate the Gauge to measure the washing frequency of the Belly Button                                                   *
 ************************************************************************************/

function buildGauge(wfreq) {
  // Enter the washing frequency between 0 and 180 (half of a circle 360 degree)
  var level = parseFloat(wfreq) * 20;

  // Calculate using trigonometric the meter points for gauge

  // dregree of the circle i.e half of circle
  var degrees = 180 - level;
  // radius of the circle
  var radius = 0.5;
  // Calculate the radians base on the mathematical equation based on 
  // a full circle has 2PI radians, so for half circle will be 1PI radians
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Adjust the triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "#FEFE69","#EEFFBA", "#D6FA8C", "#BEED53", "#A5D721",
          "#82B300", "#5D8700", "#447741", "#316033", "#006266"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, data, layout);
}



