/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable indent */
const covid19ImpactEstimator = (req, res, next) => {
  const { reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = req.body;
  const { avgDailyIncomeInUSD,
    avgDailyIncomePopulation
  } = req.body.region;

  function changeData(currently) {
    let newData; let infect;
    if (periodType === 'months') {
      newData = Math.trunc(2 ** Math.trunc((timeToElapse * 30) / 3));
      infect = Math.trunc(currently * newData);
    } else if (periodType === 'weeks') {
      newData = Math.trunc(2 ** Math.trunc((timeToElapse * 7) / 3));
      infect = Math.trunc(currently * newData);
    } else if (periodType === 'days') {
      newData = Math.trunc(2 ** Math.trunc((timeToElapse * 1) / 3));
      infect = Math.trunc(currently * newData);
    }
    return infect;
  }
  function changeDay(currentlyInfected) {
    let newDay;
    if (periodType === 'months') {
      newDay = timeToElapse * 30;
    } else if (periodType === 'weeks') {
      newDay = timeToElapse * 7;
    } else if (periodType === 'days') {
      newDay = timeToElapse * 1;
    }
    const calc = (currentlyInfected * avgDailyIncomeInUSD * avgDailyIncomePopulation) / newDay;
    return Math.trunc(calc);
  }
  const bed = (0.35 * totalHospitalBeds);
  
  function severeImpact() {

    const currentlyInfected = reportedCases * 50;
    const infectionsByRequestedTime = Math.trunc(changeData(currentlyInfected));
    const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
    const bed = (0.35 * totalHospitalBeds);
    const hospitalBedsByRequestedTime = Math.trunc(bed - severeCasesByRequestedTime);
    const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
    const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
    const dollarsInFlight = changeDay(infectionsByRequestedTime);
    return {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight
    };
  }
  const impact = () =>  {

    const currentlyInfected = reportedCases * 10;
    const infectionsByRequestedTime = Math.trunc(changeData(currentlyInfected));
    const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
    const bed = (0.35 * totalHospitalBeds);
    const hospitalBedsByRequestedTime = Math.trunc(bed - severeCasesByRequestedTime);
    const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
    const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
    const dollarsInFlight = changeDay(infectionsByRequestedTime);
    return {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight
    };
  }

  res.body = {
    data: req.body,
    impact: impact(),
    severeImpact: severeImpact()
  }
  next();
}

module.exports = covid19ImpactEstimator;
