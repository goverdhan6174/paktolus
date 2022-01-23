export default function timer(delay: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
