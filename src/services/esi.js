import Axios from 'axios';
import _ from 'lodash';

export const EsiService = Axios.create({
  baseURL: 'https://esi.evetech.net/latest',
});

export default EsiService;

export const fetchRegionIds = async () => {
  const { data: ids } = await EsiService.get('/universe/regions');
  return ids;
};

export const fetchRegionData = async () => {
  const ids = await fetchRegionIds();
  const responses = await Promise.all(ids.map(id => EsiService.get(`/universe/regions/${id}`)));
  const data = responses.map(item => item.data);
  return data;
};

export const fetchRegionMarketIds = async (regionId) => {
  const response = await EsiService.get(`/market/${regionId}/types`);
  const types = response.data.slice();
  const totalPages = response.headers['x-pages'];
  const pages = _.range(2, totalPages);
  const requests = pages.map(page => EsiService.get(`/market/${regionId}/types`, {
    params: {
      page,
    },
  }));
  const responses = await Promise.all(requests);
  return types.concat(...responses.map(resp => resp.data));
};
