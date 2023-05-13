import axios from 'axios';

export const apiClient = axios.create(
    {
        baseURL: 'http://worldbank-ebanking-service.eu-central-1.elasticbeanstalk.com/'
        // baseURL: 'http://localhost:8080'
    }
);