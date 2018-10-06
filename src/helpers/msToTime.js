export default function msToTime(duration) {
  let milliseconds = parseInt((duration%1000)/100, 10)
    , seconds = parseInt((duration/1000)%60, 10)
    , minutes = parseInt((duration/(1000*60))%60, 10)
    , hours = parseInt((duration/(1000*60*60))%24, 10);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  
  hours = hours > 0 ? `${hours}:`:"";
  minutes = minutes > 0 ? `${minutes}:`:"";

  return hours + minutes + seconds + "." + milliseconds;
}