// readin in the file on the console
d3.json("samples.json").then((data) => {

  // console.log(data);

  // grabbing the sample id using map
  var samples_id = data.samples.map(onesubject => onesubject.id);

  // saving the ID into a variable after selectig it with d3
  var select = d3.select("#selDataset");

  // using d3 syntax to create the spots I need for all datapoints in the ID array
  var option = d3.select("select").selectAll("option")
    .data(samples_id)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });

  // copying the filter method from inside the function to make appear the dashboard at the first load
  var sample = data.samples.filter(onesubject => onesubject.id == select.node().value);
  // console.log(sample);
  buildPlot(sample[0]);

  // copying the filter method from inside the function to make appear the dashboard at the first load
  var demographic = data.metadata.filter(onesubject => onesubject.id == select.node().value);

  buildDemographic(demographic[0])
  console.log(demographic[0]);


  // event attached to the id, the function handleSubmit() will make build buildPlot and buildPlot2 run
  select.on("change", handleSubmit);

  // Submit Button handler
  function handleSubmit() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value
    var id_select = select.node().value;

    //the function will build the bar chart when the input value will correspond to the id
    var sample = data.samples.filter(onesubject => onesubject.id == id_select)

    buildPlot(sample[0]);

    //the function will build the demographic metadata when the input value will correspond
    var demographic = data.metadata.filter(onesubject => onesubject.id == id_select);

    buildDemographic(demographic[0]);


  }

  // Demographic function: the panel and the gauge chart are run with this function
  function buildPlot(sample2show) {
    //
    var sample_values = sample2show.sample_values.slice(0, 10)
    var otu_ids = sample2show.otu_ids.slice(0, 10)
    var otu_labels = sample2show.otu_labels.slice(0, 10)


    var otu_ids_array = [];
    var arrayLength = otu_ids.length;
    for (var i = 0; i < arrayLength; i++) {
      otu_ids_array.push(`OTU ${otu_ids[i]}`);
      //Do something
    }

    // var cc = `OTU ${otu_ids}`
    console.log(otu_ids_array)
    var trace1 = {
      x: sample_values,
      // y: [10,9,8,7,6,5,4,3,2,1,0],
      y: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      text: otu_labels,

      type: "bar",
      orientation: "h"
    };

    // data
    var data = [trace1];

    var layout = {
      title: 'Top 10 OTUs',
      font: {
        size: 12
      },
      yaxis: {
        tickvals: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        ticktext: otu_ids_array

      }
    };
    // Render the plot to the id tag with "bar"
    Plotly.newPlot("bar", data, layout);

    // Bubblechart
    var sample_values_bubble = sample2show.sample_values
    var otu_ids_bubble = sample2show.otu_ids
    var otu_labels_bubble = sample2show.otu_labels

    var trace1 = {
      x: otu_ids_bubble,
      y: sample_values_bubble,
      text: otu_labels_bubble,
      mode: 'markers',
      marker: {
        color: otu_ids_bubble,
        size: sample_values_bubble,
        colorscale: 'YlOrRd',
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Bacteria found in Belly Button: sample',
      showlegend: false,
    };

    Plotly.newPlot('bubble', data, layout);

  }

  // Demographic function: the panel and the gauge chart are run with this function
  function buildDemographic(demographic2show) {

    //Demographic phanel
    var sample_metadata = d3.select("#sample-metadata");
    //
    sample_metadata.html("");

    Object.entries(demographic2show).forEach(([key, value]) => {
      sample_metadata.append("div").text(`${key} : ${value}`);
    });



    // Gauge Chart
    var demografic_frequency = demographic2show.wfreq

    var data = [{
      type: "indicator",
      mode: "gauge+number+delta",
      value: demografic_frequency,
      title: {
        text: 'Belly Button Scrub Washing Frequency',
        font: {
          size: 24
        }
      },
      gauge: {
        axis: {
          range: [null, 9],
        },
        bar: {
          color: "white"
        },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [{
            range: [0, 1],
            color: '#4aa84e'
          },
          {
            range: [1, 2],
            color: '#92b73a'
          },
          {
            range: [2, 3],
            color: '#c6bf22'
          },
          {
            range: [3, 4],
            color: '#edbd02'
          },
          {
            range: [4, 5],
            color: '#ffad00'
          },
          {
            range: [5, 6],
            color: '#ff8c00'
          },
          {
            range: [6, 7],
            color: '#fc6114'
          },
          {
            range: [7, 8],
            color: '#f43021'
          },
          {
            range: [8, 9],
            color: '#ed0022'
          },
        ],
      }
    }];


    var layout = {
      width: 600,
      height: 500,
      margin: {
        t: 25,
        r: 25,
        l: 25,
        b: 25
      },
      font: {
        color: "black",
        family: "Arial"
      }
    };

    Plotly.newPlot('gauge', data, layout);


  }

});
