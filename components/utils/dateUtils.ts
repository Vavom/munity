export function getTimeAgo(timestamp: string): string {
  const currentDate = new Date();
  const pastDate = new Date(timestamp);

  const timeDifferenceInSeconds = Math.floor(
    (currentDate.getTime() - pastDate.getTime()) / 1000
  );

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} second${
      timeDifferenceInSeconds === 1 ? "" : "s"
    } ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
}
