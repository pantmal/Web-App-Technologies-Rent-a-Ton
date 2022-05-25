import axios from 'axios';

//Setting the base URL of the Django server so we won't have to specify it in every axios request.
export default axios.create({
  baseURL: `http://localhost:8000/`
});
