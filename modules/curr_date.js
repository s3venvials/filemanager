let curTime = (() => {
    let date = new Date();
    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    time = hour+":"+min;
    return {'hour': hour, 'min': min, 'time': time}
})

let curDate = (() => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    today = month+"/"+day+"/"+year;
    return {'month': month, 'day': day, 'year': year, 'today': today}
});

module.exports = {curTime, curDate}