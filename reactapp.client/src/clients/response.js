import _ from "lodash";
import axios from "axios";

export default class Response {
    constructor() {
        this._isError = false;
        this._data = null;
    }

    static of(data,isError){
        const respond = new Response()

        respond.data = data
        respond.isError =isError

        return respond
    }

    get isError() {
        return this._isError;
    }

    set isError(value) {
        this._isError = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    handleError(err){
        this.isError = true
        this._data = err?.response?.data
    }

    handleResult(result){
        if(!this.isError){
            this.data = result.data
        }
    }

    ifNotError(callBack){
        if(!this.isError){
            callBack(this.data)
        }
    }
}

export async function fetchGet(url, query = {}, token) {
    const response = new Response();

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const params = new URLSearchParams(_.omitBy(query, _.isUndefined)).toString();
    const fullUrl = `${url}?${params}`;

    try {
        const axiosResponse = await axios.get(fullUrl, { headers });
        response.handleResult(axiosResponse);
    } catch (error) {
        response.handleError(error);
    }

    return response;
}

const DEFAULT_CONFIG =  {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
      },
    body: null
}

const middleWear = (config, token) => {
    if (config?.headers?.Authorization) {
      return;
    }
    if (config.headers && token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers = !token ? { "Content-Type": "application/json" } : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
    }
  };

const toConfig = (c) =>{
    return {
        headers: c.headers,
    }
}

export async function fetchPost(url,token = null, config = DEFAULT_CONFIG) {
    const response = new Response();

    middleWear(config,token)

    response.handleResult(
        await axios.post(url,config.body, toConfig(config)).catch(error => {
            response.handleError(error)
        })
    )
    return response;
}

export async function fetchPostEvent(url, token = null, config) {
    const response = new Response();

    const middleWear = (config, token) => {
        if (config?.headers?.Authorization) {
            return;
        }
        if (config.headers && token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            config.headers = !token ? {} : {
                Authorization: `Bearer ${token}`
            };
        }
    };

    middleWear(config, token);

    try {
        const axiosResponse = await axios.post(url, config.body, {
            headers: {
                ...config.headers
            }
        });
        response.handleResult(axiosResponse);
    } catch (error) {
        response.handleError(error);
    }

    return response;
}

export async function fetchPostFilter(axiosMethod,url,token = null, config = DEFAULT_CONFIG){
    const response = new Response();

    middleWear(config,token)

    response.handleResult(
        await axiosMethod(url,config.body, toConfig(config)).catch(error => {
            response.handleError(error)
        })
    )

    return response;
}

export async function fetchPut(url,token = null, config = DEFAULT_CONFIG) {
    return await fetchPostFilter(axios.put,url,token,config);
}