export const reviseCapitalObj = (obj = {}) => {
  let geographic_coordinates, time_difference;
  if (
    obj?.geographic_coordinates?.latitude &&
    obj?.geographic_coordinates?.longitude
  ) {
    const { latitude, longitude } = obj.geographic_coordinates;
    geographic_coordinates = `${latitude.degrees} ${latitude.minutes} ${latitude.hemisphere}, ${longitude.degrees} ${longitude.minutes} ${longitude.hemisphere}`;
  }

  if (obj?.time_difference) {
    const { note, timezone } = obj.time_difference;
    time_difference = `${timezone} (${note})`;
  }

  return {
    ...obj,
    geographic_coordinates,
    time_difference,
  };
};
