import { Constants } from '../constants/Constants';
import { StringUtils } from '../utils/StringUtils';

export enum FetchType {
    DEFAULT = '',
    PATIENT = 'Patients',
    MEASURE = 'Measures',
    EVALUATE_MEASURE = 'Evaluate Measure',
    DATA_REQUIREMENTS = 'Data Requirements',
    COLLECT_DATA = 'Collect Data',
    SUBMIT_DATA = 'Submit Data'
};

export abstract class AbstractDataFetch {
    type: FetchType = FetchType.DEFAULT;

    abstract getUrl(): string;
    protected abstract processReturnedData(data: any): any;

    fetchData = async (token: string): Promise<any> => {
        let ret: any;

        // Add any token provided to the header
        const requestOptions = {
            headers: {"Authorization": `Bearer ${token}`}
        };


        let responseStatusText = '';

        await fetch(this.getUrl(), requestOptions)
            .then((response) => {
                responseStatusText = response?.statusText;
                return response.json();
            })
            .then((data) => {
                ret = this.processReturnedData(data);
            })
            .catch((error) => {
                let message = StringUtils.format(Constants.fetchError, this.getUrl(), this.type, error);
                if (responseStatusText.length > 0 && responseStatusText !== 'OK' ){
                    message = StringUtils.format(Constants.fetchError, this.getUrl(), this.type, responseStatusText);
                }
                throw new Error(message);
            })
        return ret;
    };

    isJsonString = (data: any): boolean => {
        try {
            JSON.stringify(data, undefined, 2);
        } catch (e) {
            return false;
        }
        return true;
    }
}


