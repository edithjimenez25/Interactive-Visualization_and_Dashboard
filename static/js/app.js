/****************************
* Belly Button Biodiversity *
*****************************/
// Step 1: Plotly
// 1. Use the D3 library to read in `samples.json`
// Bring the overall data from samples.json that we are going to use
// on the graphs and ID selection.

/*************************************************************************************************
* Initialize                                                                                     *
**************************************************************************************************/
// samples.json have three panel of data: names, metadata and sample
// the panel "names" will be used in the dropdown menu to select the subject 'id' for the chart

/*************************************************************************************************
 * Build Table to show demographic data for selected 'Subject id'                                *
 *************************************************************************************************/ 
// Bring the data from the JSON file to build data for the table in 'Demographic Info'

function buildMetadata(selectSubject) {
  d3.json("/data/samples.json").then(function(allData) {

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
    Object.entries(filteredMetadata).forEach(function([key,value]) {        
      // Use d3 to append new tags for each key-value in the metadata.
      sample_Metadata.append("h6").text(`${key.toUpperCase()}:${value}`);
    });

    // print the filtered data to the console
    console.log(filteredMetadata);

  });

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
  
  d3.json("/data/samples.json").then(function(allData){

    // Assign var to the sample in sample
    var samples = allData.samples;

    // Filter the data for subject id
    var filteredSample = samples.filter(x => x.id == selectSubject);
    var targetSample = filteredSample[0];

    // Build the bubble chart using the sample data
    // Define values for X axis and use 'otu_ids'
    // Use slice to display the chart the top 10 OTUs
    var otu_ids_values = targetSample.otu_ids.slice(0,10);
    var sample_values = targetSample.sample_values.slice(0,10);
    var m_size = targetSample.sample_values.slice(0,10);
    var m_colors = targetSample.otu_ids.slice(0,10); 
    var otu_label_values = targetSample.otu_labels.slice(0,10);
    
    var y_label = targetSample.otu_ids.slice(0, 10).map(function(x){
      return "OTU " + x;
    }).reverse();

    // Create a trace object with the data
    var trace1 = {
      type: 'bar',
      orientation: "h",
      x: sample_values,
      y: y_label,
      hovertext: otu_label_values,
    };
  
    // Create a data array with the above trace
    var data = [trace1];

    // Use `layout` to define a title, axis, etc
    var layout = {
      yaxis: {autoarange: "reversed"},
      title: "Bacterias",
      xaxis: { 
        title: "OTU",
      },
      
    };
  
    // Render the plot 
    Plotly.newPlot("bar", data, layout); 
    


  /************************************************************************************
   * Build Bubble Chart for selected 'Subject id'                                     *
   ************************************************************************************/
  // R3. Create a bubble chart that displays each sample.
      // * Use `otu_ids` for the x values.
      // * Use `sample_values` for the y values.
      // * Use `sample_values` for the marker size.
      // * Use `otu_ids` for the marker colors.
      // * Use `otu_labels` for the text values.
      
      // Create a trace object with the data
      var trace2 = {
        y: sample_values,
        x: otu_ids_values,
        text: otu_label_values,
        mode: 'markers',
        marker: {
          color: m_colors,
          size: m_size,
        },
      };

      var data = [trace2];

      var layout = {
        xaxis: { title: "OTU ID"},
      };

      Plotly.newPlot('bubble', data, layout);

  }); 
}

/************************************************************************************
 * Build function Initiate 
 ************************************************************************************/

// R4. Display the sample metadata, i.e., an individual's demographic information.
function init() {
  // Grab a reference to the dropdown select the Test 'Subject ID'
  var subjectID = d3.select("#selDataset");

  /* Use the list of sample names to populate the select options and
     define the var for each of the panel of data in samples */ 
  d3.json("/data/samples.json").then((allData) => {
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

    // Build the  horizontal bar chart and Bubble chart 
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
  // Use d3.Json to fetch the sample panel values in the samples.
  // d3.json("/data/samples.json").then(function(allData) {    

    // Assign var to the metadata sample where washing frequency (wfreq) values are
    var sampleMetadata= allData.metadata;

    // Filter the metadata to get the washing frequency (wfreq)
    // var filteredFrequency = sampleMetadata.filter(y => y.wfreq == selectSubject);
    // var targetFrequency = filteredFrequency[0];
    // var wfreq = targetFrequency.wfreq.slice(0,10); 

    // Enter the washing frequency between 0 and 180 (half of a circle 360 degree)
    var gaugeLevel = parseFloat(wfreq) * 20;
      
    // Calculate using trigonometric the meter points for gauge
    // dregree of the circle i.e half of circle
    var degrees = 180 - gaugeLevel;
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
        text: gaugeLevel,
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
            "#006266",
            "#447741",
            "#316033", 
            "#5D8700",
            "#82B300",
            "#A5D721", 
            "#BEED53",
            "#D6FA8C",
            "#EEFFBA",
            "white",   
          
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
      title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      height: 450,
      width: 450,
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
