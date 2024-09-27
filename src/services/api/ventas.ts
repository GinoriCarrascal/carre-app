import axios, { AxiosRequestConfig } from 'axios';


// API para guardar venta que especifica los utensilios de un concepto (es decir, un pedido)
// Lo estudiamos para ver cantidades 

const guardarVenta = (datosentrantes: any): void => {
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:1337/api/ventas',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STRAPI_KEY}`,
    },
    data: JSON.stringify({
      data: datosentrantes,
    }),
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

export { guardarVenta };
