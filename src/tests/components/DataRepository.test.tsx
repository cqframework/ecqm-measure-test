import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import DataRepository from '../../components/DataRepository';

test('expect functions to be called when selecting items in dropdown', () => {
    const patients = ['test-patient-1', 'test-patient-2'];
    const serverUrls = ['test-server-1', 'test-server-2'];

    const loadingFlag: boolean = false;
    const showDataRepo: boolean = true;

    const fetchPatients = jest.fn();
    const setSelectedPatient = jest.fn();

    render(<DataRepository
        showDataRepo={showDataRepo}
        setShowDataRepo={jest.fn()}
        serverUrls={serverUrls}
        setSelectedDataRepo={jest.fn()}
        selectedDataRepo={serverUrls[1]}
        patients={patients}
        fetchPatients={fetchPatients}
        setSelectedPatient={setSelectedPatient}
        selectedPatient={patients[0]}
        collectData={jest.fn()}
        loading={loadingFlag}
    />);

    //select first server
    const serverDropdown: HTMLSelectElement = screen.getByTestId('data-repo-server-dropdown');
    userEvent.selectOptions(serverDropdown, 'test-server-2');
    expect(fetchPatients).toBeCalledWith('test-server-2')

    //select first patient
    const patientDropdown: HTMLSelectElement = screen.getByTestId('data-repo-patient-dropdown');
    userEvent.selectOptions(patientDropdown, 'test-patient-1');
    expect(setSelectedPatient).toBeCalledWith('test-patient-1')

});

test('expect spinner to show when loading is true', () => {
    const patients = ['test-patient-1', 'test-patient-2'];
    const serverUrls = ['test-server-1', 'test-server-2'];

    const loadingFlag: boolean = true;
    const showDataRepo: boolean = true;

    const fetchPatients = jest.fn();
    const setSelectedPatient = jest.fn();

    render(<DataRepository
        showDataRepo={showDataRepo}
        setShowDataRepo={jest.fn()}
        serverUrls={serverUrls}
        setSelectedDataRepo={jest.fn()}
        selectedDataRepo={serverUrls[1]}
        patients={patients}
        fetchPatients={fetchPatients}
        setSelectedPatient={setSelectedPatient}
        selectedPatient={patients[0]}
        collectData={jest.fn()}
        loading={loadingFlag}
    />);

    const evaluateButtonWithSpinner: HTMLButtonElement = screen.getByTestId('data-repo-collect-data-button-spinner');
    expect(evaluateButtonWithSpinner).toBeInTheDocument();
});

test('hide section', () => {
    const patients = ['test-patient-1', 'test-patient-2'];
    const serverUrls = ['test-server-1', 'test-server-2'];

    const loadingFlag: boolean = false;
    const showDataRepo: boolean = false;

    const setShowDataRepo = jest.fn();
    const setSelectedDataRepo = jest.fn();
    const fetchPatients = jest.fn();
    const setSelectedPatient = jest.fn();
    const collectData = jest.fn();


    render(<DataRepository
        showDataRepo={showDataRepo}
        setShowDataRepo={setShowDataRepo}
        serverUrls={serverUrls}
        setSelectedDataRepo={setSelectedDataRepo}
        selectedDataRepo={''}
        patients={patients}
        fetchPatients={fetchPatients}
        setSelectedPatient={setSelectedPatient}
        selectedPatient={''}
        collectData={collectData}
        loading={loadingFlag}
    />);

    const hideShowButton: HTMLButtonElement = screen.getByTestId('data-repo-show-section-button');
    fireEvent.click(hideShowButton);
    expect(setShowDataRepo).toHaveBeenCalledWith(true);
});

test('show section', () => {
    const patients = ['test-patient-1', 'test-patient-2'];
    const serverUrls = ['test-server-1', 'test-server-2'];

    const loadingFlag: boolean = false;
    const showDataRepo: boolean = true;

    const setShowDataRepo = jest.fn();
    const setSelectedDataRepo = jest.fn();
    const fetchPatients = jest.fn();
    const setSelectedPatient = jest.fn();
    const collectData = jest.fn();

    render(<DataRepository
        showDataRepo={showDataRepo}
        setShowDataRepo={setShowDataRepo}
        serverUrls={serverUrls}
        setSelectedDataRepo={setSelectedDataRepo}
        selectedDataRepo={''}
        patients={patients}
        fetchPatients={fetchPatients}
        setSelectedPatient={setSelectedPatient}
        selectedPatient={''}
        collectData={collectData}
        loading={loadingFlag}
    />);

    const evaluateButton: HTMLButtonElement = screen.getByTestId('data-repo-hide-section-button');
    fireEvent.click(evaluateButton);
    expect(setShowDataRepo).toHaveBeenCalledWith(false);
});

 