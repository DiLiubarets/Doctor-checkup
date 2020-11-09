$(document).ready(function () {
  //get Json data from Url
  $.getJSON(
    "https://services9.arcgis.com/pJENMVYPQqZZe20v/arcgis/rest/services/province_daily_totals/FeatureServer/0/query?where=1%3D1&outFields=Province,TotalCases,TotalRecovered,TotalDeaths,TotalActive&outSR=4326&f=json",
    function (data) {
      var states = [];
      var confirmed = [];
      var recovered = [];
      var deaths = [];

      var total_confirmed;
      var total_active;
      var total_recovered;
      var total_deaths;

      total_confirmed = data.statewise[1].confirmed;
      total_active = data.statewise[1].active;
      total_recovered = data.statewise[1].recovered;
      total_deaths = data.statewise[1].deaths;
      console.log(total_confirmed);
      console.log("this is my data");

      $.each(data.statewise, function (id, obj) {
        states.push(obj.state);
        confirmed.push(obj.confirmed);
        recovered.push(obj.recovered);
        deaths.push(obj.deaths);
      });

      console.log(states);
      console.log(confirmed);
      console.log(recovered);
      console.log(deaths);

      states.shift();
      confirmed.shift();
      recovered.shift();
      deaths.shift();

      $("#confirmed").append(total_confirmed);
      $("#active").append(total_active);
      $("#recovered").append(total_recovered);
      $("#deaths").append(total_deaths);

      // // Chart initialization
      var myChart = document.getElementById("myChart").getContext("2d");

      var chart = new chart(myChart, {
        type: "bar",
        data: {
          labels: states,
          datasets: [
            {
              label: "Confirmed",
              data: confirmed,
              backgroundColor: "#f1c40f",
              minBarLength: 100,
            },
            {
              label: "Recovered",
              data: recovered,
              backgroundColor: "#2ecc71",
              minBarLength: 100,
            },
            {
              label: "Deaths",
              data: deaths,
              backgroundColor: "#e74c3c",
              minBarLength: 100,
            },
          ],
        },
      });
    }
  );
});
