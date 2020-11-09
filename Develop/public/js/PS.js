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

// Usage:
let user = new Province("John");
user.sayHi();
