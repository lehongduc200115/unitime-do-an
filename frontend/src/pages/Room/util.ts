export const generateRowsInfo = () => {
  let res: any[] = [];
  let startTime = new Date(0, 0, 0, 7, 0);
  let interval = 50*60000;
  let breakTime = 10*60000;
  for (let i = 2; i <= 12; ++i) {
    let tmpRes: any = {};
    let endTime = new Date(startTime.getTime() + interval);

    tmpRes.period = i;
    
    tmpRes.timeSlot = `${('0' + startTime.getHours()).slice(-2)}:${('0' + startTime.getMinutes()).slice(-2)} - `;
    tmpRes.timeSlot += `${('0' + endTime.getHours()).slice(-2)}:${('0' + endTime.getMinutes()).slice(-2)}`;

    if (startTime.getHours() >= 18) {
      startTime = new Date(startTime.getTime() + interval);
    } else {
      startTime = new Date(startTime.getTime() + interval + breakTime);
    }
    res = [...res, tmpRes];
  }

  return res;
}