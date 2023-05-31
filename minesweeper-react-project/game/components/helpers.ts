
export function getRandomNumber(min: number, max: number): number {
    // Calculate the range
    const range = max - min + 1;
    // Generate a random number within the range
    const randomNumber = Math.floor(Math.random() * range) + min;
    return randomNumber;
  }
