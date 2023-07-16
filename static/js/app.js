// Use the D3 library to read in samples.json from the URL
let url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and populate the charts and metadata
function init() {
  d3.json(url)
    .then(function (data) {
      // Get the necessary data for the bar chart
      var samples = data.samples;
      var sampleValues = samples[0].sample_values.slice(0, 10).reverse();
      var otuIDs = samples[0].otu_ids
        .slice(0, 10)
        .reverse()
        .map((id) => `OTU ${id}`);
      var otuLabels = samples[0].otu_labels.slice(0, 10).reverse();

      // Create the bar chart
      var trace = {
        x: sampleValues,
        y: otuIDs,
        text: otuLabels,
        type: "bar",
        orientation: "h",
        marker: {
          color: "royalblue",
        },
      };

      var chartData = [trace];

      var layout = {
        margin: {
          l: 150,
          r: 50,
          t: 80,
          b: 50,
        },
        xaxis: {
          showgrid: true,
          gridcolor: "lightgray",
          gridwidth: 0.5,
          tickfont: {
            size: 12,
          },
          title: "",
        },
        yaxis: {
          autorange: "reversed",
          showgrid: false,
          showticklabels: true,
          tickfont: {
            size: 12,
          },
          title: "",
        },
        showlegend: false,
        plot_bgcolor: "white",
        paper_bgcolor: "white",
        hovermode: "closest",
        hoverlabel: {
          bgcolor: "white",
          font: {
            size: 12,
          },
        },
        shapes: [
          {
            type: "line",
            xref: "x",
            yref: "y",
            x0: 0,
            x1: 0,
            y0: -0.5,
            y1: 9.5,
            line: {
              color: "lightgray",
              width: 2,
            },
            layer: "below", 
          },
          {
            type: "line",
            xref: "x",
            yref: "y",
            x0: 50,
            x1: 50,
            y0: -0.5,
            y1: 9.5,
            line: {
              color: "lightgray",
              width: 2,
            },
            layer: "below", 
          },
          {
            type: "line",
            xref: "x",
            yref: "y",
            x0: 100,
            x1: 100,
            y0: -0.5,
            y1: 9.5,
            line: {
              color: "lightgray",
              width: 2,
            },
            layer: "below", 
          },
          {
            type: "line",
            xref: "x",
            yref: "y",
            x0: 150,
            x1: 150,
            y0: -0.5,
            y1: 9.5,
            line: {
              color: "lightgray",
              width: 2,
            },
            layer: "below", 
          },
        ],
      };

      Plotly.newPlot("bar", chartData, layout);

      // Create the bubble chart
      var bubbleTrace = {
        x: samples[0].otu_ids,
        y: samples[0].sample_values,
        text: samples[0].otu_labels,
        mode: "markers",
        marker: {
          size: samples[0].sample_values,
          color: samples[0].otu_ids,
          colorscale: "Viridis",
        },
      };

      var bubbleData = [bubbleTrace];

      var bubbleLayout = {
        margin: {
          l: 100,
          r: 100,
          t: 30,
          b: 100,
        },
        xaxis: {
          title: "OTU ID",
        },
        yaxis: {
          title: "Sample Values",
        },
        hovermode: "closest",
        plot_bgcolor: "white",
        paper_bgcolor: "white",
        hoverlabel: {
          bgcolor: "white",
          font: {
            size: 12,
          },
        },
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
      // Create the gauge chart
      var metadata = data.metadata;
      var selectedMetadata = metadata[0]; 

      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: selectedMetadata.wfreq, 
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [0, 9] }, 
            steps: [
              { range: [0, 3], color: "red" }, 
              { range: [3, 6], color: "yellow" },
              { range: [6, 9], color: "green" },
            ],
            threshold: {
              line: { color: "black", width: 4 },
              thickness: 0.75,
              value: selectedMetadata.wfreq,
            },
          },
        },
      ];

      var gaugeLayout = {
        width: 400,
        height: 300,
        margin: { t: 0, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "blue", family: "Arial" },
      };

      Plotly.newPlot("gauge", gaugeData, gaugeLayout);

      // Get the sample metadata
      var metadata = data.metadata;
      var selectedMetadata = metadata[0];

      // Clear the existing metadata
      var sampleMetadataElement = document.getElementById("sample-metadata");
      sampleMetadataElement.innerHTML = "";

      // Display the key-value pairs from the metadata
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        var metadataItem = document.createElement("p");
        metadataItem.innerText = `${key}: ${value}`;
        sampleMetadataElement.appendChild(metadataItem);
      });

      // Populate the dropdown with the sample names
      var dropdown = d3.select("#selDataset");
      data.names.forEach(function (name) {
        dropdown.append("option").text(name).property("value", name);
      });
    })
    .catch(function (error) {
      // Handle any error that occurred while loading the JSON
      console.error("Error loading the JSON file: " + error);
    });
}

// Function to update the charts and metadata based on the selected sample
function optionChanged(sample) {
  d3.json(url)
    .then(function (data) {
      // Filter the samples data based on the selected sample
      var selectedSample = data.samples.filter((s) => s.id === sample)[0];

      // Update the bar chart
      var barData = [
        {
          x: selectedSample.sample_values.slice(0, 10).reverse(),
          y: selectedSample.otu_ids
            .slice(0, 10)
            .reverse()
            .map((id) => `OTU ${id}`),
          text: selectedSample.otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
          },
      ];

      Plotly.newPlot("bar", barData);

      // Update the bubble chart
      var bubbleData = [
        {
          x: selectedSample.otu_ids,
          y: selectedSample.sample_values,
          text: selectedSample.otu_labels,
          mode: "markers",
          marker: {
            size: selectedSample.sample_values,
            color: selectedSample.otu_ids,
            colorscale: "Viridis",
          },
        },
      ];

      Plotly.newPlot("bubble", bubbleData);

      // Update the gauge chart
      var metadata = data.metadata;
      var selectedMetadata = metadata.filter((m) => m.id === parseInt(sample))[0];

      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: selectedMetadata.wfreq,
          title: { text: "Belly Button Washing Frequency Per Week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [0, 9] },
            steps: [
              { range: [0, 3], color: "red" },
              { range: [3, 6], color: "yellow" },
              { range: [6, 9], color: "green" },
            ],
            threshold: {
              line: { color: "black", width: 4 },
              thickness: 0.75,
              value: selectedMetadata.wfreq,
            },
          },
        },
      ];

      var gaugeLayout = {
        width: 400,
        height: 300,
        margin: { t: 0, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" },
      };

      Plotly.newPlot("gauge", gaugeData, gaugeLayout);

      // Get the metadata for the selected sample
      var metadata = data.metadata;
      var selectedMetadata = metadata.filter((m) => m.id === parseInt(sample))[0];

      // Clear the existing metadata
      var sampleMetadataElement = document.getElementById("sample-metadata");
      sampleMetadataElement.innerHTML = "";

      // Display the key-value pairs from the metadata
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        var metadataItem = document.createElement("p");
        metadataItem.innerText = `${key}: ${value}`;
        sampleMetadataElement.appendChild(metadataItem);
      });
    })
    .catch(function (error) {
      // Handle any error that occurred while loading the JSON
      console.error("Error loading the JSON file: " + error);
    });
}

// Initialize the page
init();
