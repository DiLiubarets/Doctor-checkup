// Creating our User model
module.exports = function (sequelize, DataTypes) {
  var Appointment = sequelize.define("Appointment", {
    // The email cannot be null, and must be a proper email before creation
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    // The password cannot be null
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hour: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    healthcardNum: {
      type: DataTypes.STRING,
    },
    height: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.STRING,
    },
    currentMed: {
      type: DataTypes.STRING,
    },
    checkup: {
      type: DataTypes.STRING,
    },
  });
  return Appointment;
};
