/**
 * Calculates attendance statistics, shortage prediction, and safety margin.
 * Threshold is standardized at 75% for university academic eligibility.
 */
const calculateAttendanceMetrics = (attendedCount, totalCount) => {
  const attended = Number(attendedCount) || 0;
  const total = Number(totalCount) || 0;

  if (total === 0) {
    return {
      total: 0,
      attended: 0,
      absent: 0,
      percentage: 100,
      isLowAttendance: false,
      classesNeededFor75: 0,
      classesCanMissBeforeLow: 0,
      statusMessage: 'No classes conducted yet.'
    };
  }

  const absent = total - attended;
  const percentage = Math.round((attended / total) * 1000) / 10; // 1 decimal place
  const isLowAttendance = percentage < 75;

  let classesNeededFor75 = 0;
  let classesCanMissBeforeLow = 0;
  let statusMessage = '';

  if (isLowAttendance) {
    // Formula: (attended + x) / (total + x) >= 0.75
    // => x >= (0.75 * total - attended) / 0.25 => x = Math.ceil(3 * total - 4 * attended)
    classesNeededFor75 = Math.max(0, Math.ceil(3 * total - 4 * attended));
    statusMessage = `Low attendance warning! Attend the next ${classesNeededFor75} lecture${classesNeededFor75 === 1 ? '' : 's'} consecutively to reach the 75% academic threshold.`;
  } else {
    // Formula: attended / (total + y) >= 0.75
    // => 0.75 * y <= attended - 0.75 * total => y <= (4 * attended - 3 * total) / 3
    classesCanMissBeforeLow = Math.max(0, Math.floor((4 * attended - 3 * total) / 3));
    statusMessage = classesCanMissBeforeLow > 0
      ? `On track! You can miss at most ${classesCanMissBeforeLow} class${classesCanMissBeforeLow === 1 ? '' : 'es'} while maintaining at least 75% attendance.`
      : 'You are right at the 75% boundary. Any absence will drop your attendance below eligibility threshold.';
  }

  return {
    total,
    attended,
    absent,
    percentage,
    isLowAttendance,
    classesNeededFor75,
    classesCanMissBeforeLow,
    statusMessage
  };
};

module.exports = {
  calculateAttendanceMetrics
};
