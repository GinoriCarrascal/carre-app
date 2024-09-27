import axios, { AxiosRequestConfig } from 'axios';

/*interface MenuResponse {
  // Define the expected structure of the response data here
  data: any;
}*/

const getHamburguesas = async (): Promise<any | null> => {
  try {
    const config: AxiosRequestConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:1337/api/menus?pagination[page]=1&pagination[pageSize]=100',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_KEY}`,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};


export  {getHamburguesas};