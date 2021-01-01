function check(element) {
  const { title, price, date, description } = element;
  if (!!title && !!price && !!date) {
    if (!description) return { title, price, date }
    return { title, price, date, description }
  }
  return 'some fields are missing!!'
}
function sum(...e) {
  let sum = 0
  for (const i of e) sum += i
  return sum
}
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
  }
}
function getAverage(list, type) {
  let sum = 0
  if (type === 'day') {
    for (const i in list) {
      if (list[i].date.getDate() === new Date().getDate()) sum += 1
      else return sum
    }

  } else if (type === 'week') {
    const currentday = new Date().getDay()
    for (const key in list) {
      if (list[key].date.getDate() >= currentday) sum++
    }
    return Number.parseFloat(sum / 7).toFixed(2)

  } else if (type === 'ceiling') {
    const weekdata = new Array()
    //find the last sunday
    for (let i = 0; i < 7; i++) {
      lastsunday = new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000))
      if (lastsunday.getDay() === 0) break
    }
    //count the posts of the last week; decreasing from the most previous sunday
    let counter = 0
    for (let i = 0; i < 7; i++) {
      sum = 0
      while (list[counter].date.getDate() > lastsunday.getDate()
      || list[counter].date.getFullYear() > lastsunday.getFullYear()
      || list[counter].date.getMonth() > lastsunday.getMonth()){
        counter++
      }
      if(list[counter].date.getDate() === lastsunday.getDate()
      && list[counter].date.getFullYear() === lastsunday.getFullYear()
      && list[counter].date.getMonth() === lastsunday.getMonth()){
        while (list[counter].date.getDate() === lastsunday.getDate()
        && list[counter].date.getFullYear() === lastsunday.getFullYear()
        && list[counter].date.getMonth() === lastsunday.getMonth()) {
          counter++
          sum++
          if (list[counter] === undefined) {
            weekdata.push(sum)
            return weekdata
          }
        }
      } else counter++
      weekdata.push(sum)
      lastsunday=new Date(lastsunday.getTime() - (1 * 24 * 60 * 60 * 1000))
    }
    return weekdata
  }
}
function findTheDay(element) {
  let day = new Array()
  let max = Math.max(...element)
  for (const s in element) {
    if (element[s] === max) day.push(s)
  }
  let g = new Array()
  for (const i of day) {
    if (i === '1') g.push('Sunday')
    if (i === '6') g.push('Monday')
    if (i === '5') g.push('Tuesday')
    if (i === '4') g.push('Wednsday')
    if (i === '3') g.push('Thursday')
    if (i === '2') g.push('Friday')
    if (i === '0') g.push('Saturday')
  }
  if (!g.length) return g
  else return g[0]
}



module.exports = {
  check,
  sum,
  getTheFeed,
  getAverage,
  findTheDay
}
