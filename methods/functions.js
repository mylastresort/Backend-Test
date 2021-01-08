function sum(...nums) {
  let sum = 0;
  for (const num of nums) sum += num;
  return sum;
};

function getTheFeed(list) {
  return {
    first: {
      title: list[0].title,
      description: list[0].description || 'empty',
      price: list[0].price
    },
    second: {
      title: list[1].title,
      description: list[1].description || 'empty',
      price: list[1].price
    },
    third: {
      title: list[2].title,
      description: list[2].description || 'empty',
      price: list[2].price
    },
  };
};

function getAverage(list, type) {
  let sum = 0
  if (type === 'day') {
    for (const i in list) {
      if (list[i].date.getDate() === new Date().getDate()) sum += 1;
      else return sum;
    };
  };
  if (type === 'week') {
    const currentday = new Date().getDay();
    for (const i in list) {
      if (list[i].date.getDate() >= currentday) sum++;
    };
    return Number.parseFloat(sum / 7).toFixed(2);
  };
  if (type === 'weeksprice') {
    const currentday = new Date().getDay();
    for (const i in list) {
      if (list[i].date.getDate() >= currentday) sum += list[i].price;
    };
    return Number.parseFloat(sum / 7).toFixed(2);
  };
  if (type === 'ceiling') {
    const weekdata = new Array();
    //find the last sunday
    for (let i = 0; i < 7; i++) {
      lastsunday = new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000));
      if (lastsunday.getDay() === 0) break;
    };
    //count the posts of the last week; decreasing from the most previous sunday
    let counter = 0;
    for (let i = 0; i < 7; i++) {
      sum = 0;
      while (list[counter].date.getDate() > lastsunday.getDate()
        || list[counter].date.getFullYear() > lastsunday.getFullYear()
        || list[counter].date.getMonth() > lastsunday.getMonth()) {
        counter++;
      };
      if (list[counter].date.getDate() === lastsunday.getDate()
        && list[counter].date.getFullYear() === lastsunday.getFullYear()
        && list[counter].date.getMonth() === lastsunday.getMonth()) {
        while (list[counter].date.getDate() === lastsunday.getDate()
          && list[counter].date.getFullYear() === lastsunday.getFullYear()
          && list[counter].date.getMonth() === lastsunday.getMonth()) {
          counter++;
          sum++;
          if (list[counter] === undefined) {
            weekdata.push(sum);
            return weekdata;
          };
        };
      } else counter++;
      weekdata.push(sum);
      lastsunday = new Date(lastsunday.getTime() - (1 * 24 * 60 * 60 * 1000));
    };
    return weekdata;
  };
};

function findTheDay(days) {
  let ceiling = new Array();
  let max = Math.max(...days);
  for (const sum in days) {
    if (days[sum] === max) ceiling.push(sum);
  };
  let ceilingConverted = new Array();
  for (const day of ceiling) {
    if (day === '1') ceilingConverted.push('Sunday');
    if (day === '6') ceilingConverted.push('Monday');
    if (day === '5') ceilingConverted.push('Tuesday');
    if (day === '4') ceilingConverted.push('Wednsday');
    if (day === '3') ceilingConverted.push('Thursday');
    if (day === '2') ceilingConverted.push('Friday');
    if (day === '0') ceilingConverted.push('Saturday');
  };
  if (!ceilingConverted.length) return ceilingConverted;
  else return ceilingConverted[0];
};


module.exports = {
  sum,
  getTheFeed,
  getAverage,
  findTheDay
};