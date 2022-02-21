function listMeasurements(informationPanel) {
  let m = {};
  for (let tile of informationPanel.tiles) {
    for (let m of tile.measurements) {
      m[m.id] = null;
    }
  }
  return m;
}
function listAssetMeasurements(asset) {
  let m = {};

  for (let m of asset.measurements) {
    m[m.id] = null;
  }

  return m;
}
function generateHeatMapState(heatmap) {
  let state = {};
  for (let area of heatmap.areas) {
    let value = Math.floor(Math.random());
    if (value <= 0.6) {
      area[area.id] = "ok";
    } else if (value <= 0.8) {
      area[area.id] = "warning";
    } else area[area.id] = "warning";
  }
  return state;
}

function generatePanelData(informationPanel) {
  let measurements = listMeasurements(informationPanel);
  let data = {};
  for (let m of Object.keys(measurements)) {
    let value = Math.floor(Math.random() * 150) - 50;
    data[m] = value;
  }
  return data;
}
function generateAssetData(asset) {
  let measurements = listAssetMeasurements(asset);
  let data = {};
  for (let m of Object.keys(measurements)) {
    let value = Math.floor(Math.random() * 150) - 50;
    data[m] = value;
  }
  return data;
}

function generateTimeseries(ids, n = 50) {
  let datasets = [];
  for (let id of ids) {
    var data = [];
    let next = Math.floor(Math.random() * 150) - 50;
    for (var j = 0; j < n; j++) {
      data.push(next);
      next += Math.floor(Math.random() * 150) - 50;
    }
    datasets.push({
      data: data,
      label: `label_${id}`,
      // borderColor: ,
      fill: false,
    });
  }
  let labels = [];

  var t = Date.now();
  t = t - (t % 60000);
  for (j = 0; j < n; j++) {
    labels.push(t - 60000 * (n - j));
  }
  return { datasets: datasets, labels: labels };
}

export { generatePanelData, generateTimeseries, generateAssetData, generateHeatMapState };
