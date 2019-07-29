import Axios from 'axios';

export default Axios.create({
  baseURL: 'https://esi.evetech.net/latest',
});
