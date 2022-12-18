export type DopplerIntervalSuccessCallback = () => void;
export type DopplerIntervalCycleCallback = (
  successCallback: DopplerIntervalSuccessCallback
) => Promise<void>;

export async function interval(
  time: number,
  expireAfter: number,
  callback: DopplerIntervalCycleCallback
) {
  let timeOut: NodeJS.Timeout;

  return new Promise(function (resolve, reject) {
    const interval = setInterval(async function () {
      await callback(function () {
        clearInterval(interval);
        clearTimeout(timeOut);
        resolve(undefined);
      });
    }, time);

    timeOut = setTimeout(function () {
      clearInterval(interval);
      reject("Doppler: Interval failed to be successful");
    }, expireAfter);
  });
}
