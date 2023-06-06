export const renderDeviceMessage = key => {
    if (key.toLowerCase() === 'systolic') {
      return 'b';
    } else if (key.toLowerCase() === 'pulse_rate') {
      return 'p';
    } else if (key.toLowerCase() === 'temperature') {
      return 'm';
    }
    return '';
  };