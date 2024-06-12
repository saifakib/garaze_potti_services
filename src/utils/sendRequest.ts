export function sendRequest(url: string, options: any) {
  return new Promise<any>((resolve, reject) => {
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      ...options,
    })
      .then((response) => response.json())
      .then((responseData) => resolve(responseData))
      .catch((error) => reject(error));
  });
}
