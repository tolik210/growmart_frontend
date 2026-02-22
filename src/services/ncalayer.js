export const signData = (dataToSign) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('wss://127.0.0.1:13579');

    socket.onopen = () => {
      const request = {
        module: "kz.gov.pki.knca.commonUtils",
        method: "signPlainData",
        args: ["PKCS12", "SIGNATURE", dataToSign, "", ""]
      };
      socket.send(JSON.stringify(request));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.code === "200" && response.responseObject) {
        resolve(response.responseObject);
      } else {
        reject(response.message || "Ошибка NCALayer");
      }
      socket.close();
    };

    socket.onerror = () => {
      reject("NCALayer не запущен. Пожалуйста, запустите NCALayer.");
    };
  });
};

// Алиас для логина, чтобы Vite не ругался
export const signWithNCALayer = signData;
