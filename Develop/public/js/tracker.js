$(document).ready(function () {
  class Province {
    constructor(name) {
      this.name = name;
      this.totalCases = 0;
      this.totalRecovered = 0;
      this.total_death = 0;
      this.active = 0;
    }

    getName() {
      return this.name;
    }

    getTC() {
      return this.totalCases;
    }

    gettotalRecovered() {
      return this.totalRecovered;
    }
    getDeath() {
      return this.total_death;
    }
    getActive() {
      return this.active;
    }

    updateTC(count) {
      this.totalCases += count;
    }
    updatetotalRecovered(count) {
      this.totalRecovered += count;
    }

    updateDeath(count) {
      this.total_death += count;
    }
    updateActive(count) {
      this.active += count;
    }
  }

  //get Json data from Url
  $.getJSON(
    "https://services9.arcgis.com/pJENMVYPQqZZe20v/arcgis/rest/services/province_daily_totals/FeatureServer/0/query?where=1%3D1&outFields=Province,TotalCases,TotalRecovered,TotalDeaths,TotalActive&outSR=4326&f=json",
    function (data) {
      var active = [];
      var confirmed = [];
      var recovered = [];
      var deaths = [];

      var total_confirmed;
      var total_active;
      var total_recovered;
      var total_deaths;

      let AB = new Province("ALBERTA");
      let ON = new Province("ONTARIO");
      let MB = new Province("MANITOBA");
      let QC = new Province("QUEBEC");
      let NS = new Province("NOVA SCOTIA");
      let YK = new Province("YUKON");
      let SK = new Province("SASKATCHEWAN");
      let PE = new Province("PEI");
      let NB = new Province("NEW BRUNSWICK");
      let BC = new Province("BRITISH COLUMBIA");
      let NF = new Province("NEWFOUNDLAND AND LABRADOR");
      let CA = new Province("CANADA");

      //  console.log(AB.getName())
      //  console.log(data.features[789].attributes.Province)
      //  console.log(data.features[789].attributes.TotalCases)

      $.each(data.features, function (id, obj) {
        switch (obj.attributes.Province) {
          case "ALBERTA":
            AB.updateTC(obj.attributes.TotalCases);
            AB.updatetotalRecovered(obj.attributes.TotalRecovered);
            AB.updateDeath(obj.attributes.TotalDeaths);
            AB.updateActive(obj.attributes.TotalActive);
            break;

          case "ONTARIO":
            ON.updateTC(obj.attributes.TotalCases);
            ON.updatetotalRecovered(obj.attributes.TotalRecovered);
            ON.updateDeath(obj.attributes.TotalDeaths);
            ON.updateActive(obj.attributes.TotalActive);
            break;

          case "MANITOBA":
            MB.updateTC(obj.attributes.TotalCases);
            MB.updatetotalRecovered(obj.attributes.TotalRecovered);
            MB.updateDeath(obj.attributes.TotalDeaths);
            MB.updateActive(obj.attributes.TotalActive);
            break;

          case "QUEBEC":
            QC.updateTC(obj.attributes.TotalCases);
            QC.updatetotalRecovered(obj.attributes.TotalRecovered);
            QC.updateDeath(obj.attributes.TotalDeaths);
            QC.updateActive(obj.attributes.TotalActive);
            break;

          case "NOVA SCOTIA":
            NS.updateTC(obj.attributes.TotalCases);
            NS.updatetotalRecovered(obj.attributes.TotalRecovered);
            NS.updateDeath(obj.attributes.TotalDeaths);
            NS.updateActive(obj.attributes.TotalActive);
            break;

          case "YUKON":
            YK.updateTC(obj.attributes.TotalCases);
            YK.updatetotalRecovered(obj.attributes.TotalRecovered);
            YK.updateDeath(obj.attributes.TotalDeaths);
            YK.updateActive(obj.attributes.TotalActive);
            break;

          case "SASKATCHEWAN":
            SK.updateTC(obj.attributes.TotalCases);
            SK.updatetotalRecovered(obj.attributes.TotalRecovered);
            SK.updateDeath(obj.attributes.TotalDeaths);
            SK.updateActive(obj.attributes.TotalActive);
            break;

          case "PEI":
            PE.updateTC(obj.attributes.TotalCases);
            PE.updatetotalRecovered(obj.attributes.TotalRecovered);
            PE.updateDeath(obj.attributes.TotalDeaths);
            PE.updateActive(obj.attributes.TotalActive);
            break;

          case "NEW BRUNSWICK":
            NB.updateTC(obj.attributes.TotalCases);
            NB.updatetotalRecovered(obj.attributes.TotalRecovered);
            NB.updateDeath(obj.attributes.TotalDeaths);
            NB.updateActive(obj.attributes.TotalActive);
            break;

          case "BRITISH COLUMBIA":
            BC.updateTC(obj.attributes.TotalCases);
            BC.updatetotalRecovered(obj.attributes.TotalRecovered);
            BC.updateDeath(obj.attributes.TotalDeaths);
            BC.updateActive(obj.attributes.TotalActive);
            break;

          case "NEWFOUNDLAND AND LABRADOR":
            NF.updateTC(obj.attributes.TotalCases);
            NF.updatetotalRecovered(obj.attributes.TotalRecovered);
            NF.updateDeath(obj.attributes.TotalDeaths);
            NF.updateActive(obj.attributes.TotalActive);
            break;

          case "CANADA":
            CA.updateTC(obj.attributes.TotalCases);
            CA.updatetotalRecovered(obj.attributes.TotalRecovered);
            CA.updateDeath(obj.attributes.TotalDeaths);
            CA.updateActive(obj.attributes.TotalActive);
            break;
        }
      });

      finaldeath = CA.getDeath();
      finalconfirmed = CA.getTC();
      finalrecovered = CA.gettotalRecovered();
      finalactive = CA.getActive();

      // finaldeath= AB.getDeath() +ON.getDeath() +QC.getDeath() +MB.getDeath() +NS.getDeath() +YK.getDeath() +SK.getDeath() +PE.getDeath() +NB.getDeath() +BC.getDeath() +NF.getDeath()
      // finalconfirmed= AB.getTC() +ON.getTC() +QC.getTC() +MB.getTC() +NS.getTC() +YK.getTC() +SK.getTC() +PE.getTC() +NB.getTC() +BC.getTC() +NF.getTC()
      // finalrecovered= AB.gettotalRecovered() +ON.gettotalRecovered() +QC.gettotalRecovered() +MB.gettotalRecovered() +NS.gettotalRecovered() +YK.gettotalRecovered() +SK.gettotalRecovered() +PE.gettotalRecovered() +NB.gettotalRecovered() +BC.gettotalRecovered() +NF.gettotalRecovered()
      // finalactive= AB.getActive() +ON.getActive() +QC.getActive() +MB.getActive() +NS.getActive() +YK.getActive() +SK.getActive() +PE.getActive() +NB.getActive() +BC.getActive() +NF.getActive()

      $("#confirmed").append(finalconfirmed);
      $("#death").append(finaldeath);
      $("#recovered").append(finalrecovered);
      $("#active").append(finalactive);

      console.log(
        AB.updateActive() +
          "" +
          ON.updateActive() +
          "" +
          QC.updateActive() +
          "" +
          MB.updateActive() +
          "" +
          NS.updateActive() +
          "" +
          YK.updateActive() +
          "" +
          SK.updateActive() +
          "" +
          PE.updateActive() +
          "" +
          NB.updateActive() +
          "" +
          BC.updateActive() +
          "" +
          NF.updateActive()
      );
    }
  );
});
