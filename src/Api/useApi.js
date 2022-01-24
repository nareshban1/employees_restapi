import { useEffect, useReducer } from 'react';

export const useApi = (uri, method, body, headers) => {
    var apiURL = process.env.REACT_APP_TRAINING_URL + decodeURI;

    const initialState = {
        status: 'idle',
        error: "",
        iserror: false,
        data: [],
        loading: true,
    };

    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'FETCHING':
                return { ...initialState, status: 'fetching', loading: true };
            case 'FETCHED':
                return { ...initialState, status: 'fetched', data: action.payload, loading: false };
            case 'FETCH_ERROR':
                return { ...initialState, status: 'error', error: action.payload, loading: false, iserror: true };
            default:
                return state;
        }
    }, initialState);

    useEffect(() => {
        let cancelRequest = false;
        if (!apiURL) return;

        const fetchData = async () => {
            dispatch({ type: 'FETCHING' });
            try {
                const response = await fetch(apiURL, { method: method, body: body, headers: headers });
                const data = await response.json();
                if (cancelRequest) return;
                dispatch({ type: 'FETCHED', payload: data });
            } catch (error) {
                if (cancelRequest) return;
                dispatch({ type: 'FETCH_ERROR', payload: error.message });
            }
        };

        fetchData();

        return function cleanup() {
            cancelRequest = true;
        };
    }, [apiURL, method, body, headers]);

    return state;
};