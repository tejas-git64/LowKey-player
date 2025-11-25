export default function secondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const paddedHrs = hours < 10 ? "0" + hours + ":" : hours + ":";
  return `${hours === 0 ? "" : paddedHrs}${
    minutes < 10 ? "0" + minutes : minutes
  }:${secs < 10 ? "0" + secs : secs}`;
}
