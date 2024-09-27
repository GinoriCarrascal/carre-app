import axios, { AxiosRequestConfig } from 'axios';


// Una función para guardar el concepto
const guardarConcepto = (datosentrantes: any): void => {
  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:1337/api/conceptos',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STRAPI_KEY}`,
    },
    data: {
      data: {datosentrantes},
    },
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

export { guardarConcepto };
