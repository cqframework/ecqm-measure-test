import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Patient } from '../models/Patient';
import { MeasureComparisonManager } from '../utils/MeasureComparisonManager';

interface props {
  showTestCompare: boolean;
  setShowTestCompare: React.Dispatch<React.SetStateAction<boolean>>;
  items: Map<Patient, MeasureComparisonManager>;
  compareTestResults: () => void;
  loading: boolean;

}


/**
 * User must select:
 * - Knowledge Repo server and Measure
 * - Data Repo server and Patient
 * - Measure Evaluation server
 * 
 * Test Comparator will:
 * - query MeasureReport based on selected Patient:
 *   https://fhir.ecqm.icfcloud.com/fhir/MeasureReport?evaluated-resource=Patient/07663bba-9abe-46e2-b2e6-bcfc26e57a45
 * - For each MeasureReport returned, verify property "measure":
 *   "measure": "https://madie.cms.gov/Measure/HIVRetentionFHIR",
 * - Store test results locally
 * - Call Evaluate Measure against measure, patient
 * - Compare test against results
 * 
 * If no measure is selected
 * @param param0 
 * @returns 
 */
const TestingComparator: React.FC<props> = ({ showTestCompare, setShowTestCompare, items, compareTestResults, loading }) => {

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='row'>
          <div className='col-md-3'>Test Comparator</div>
          <div className='col-md-1 ml-auto'>
            {showTestCompare ? (
              <Button
                data-testid='test-compare-hide-section-button'
                className='btn btn-primary btn-lg float-right'
                onClick={() => setShowTestCompare(false)}
              >
                Hide
              </Button>
            ) : (
              <Button
                data-testid='test-compare-show-section-button'
                className='btn btn-primary btn-lg float-right'
                onClick={() => setShowTestCompare(true)}
              >
                Show
              </Button>
            )}
          </div>
        </div>
      </div>

      {showTestCompare ? (
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-5 order-md-2'>
              <br />
              {loading ? (
                <Button data-testid='test-compare-collect-data-button-spinner' className='w-100 btn btn-primary btn-lg' id='evaluate' disabled={loading}>
                  <Spinner
                    as='span'
                    variant='light'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                    animation='border' />
                  Loading...
                </Button>
              ) : (
                <Button
                  data-testid='test-compare-collect-data-button'
                  className='w-100 btn btn-primary btn-lg'
                  id='evaluate'
                  disabled={loading}
                  onClick={(e) => compareTestResults()}
                >
                  Generate Test Comparison Summary</Button>
              )}
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, padding: '.1rem' }}>
                {items.size > 0 &&
                  <div >
                     {items.size} Patients evaluated using {items.get(items.keys().next().value)?.selectedMeasure.name}
                  </div>
                }
                {Array.from(items.entries()).map(([key, value]) => (
                  value.fetchedMeasureReportGroups.length > 0 && value.fetchedEvaluatedMeasureGroups.length > 0 ? (
                    <div className="row mt-4" key={key.display + key.id}>

                      <div className="row mt-4">
                        <h4>{key.display} - {key.id}</h4>
                        <h5 className={`${value.discrepancyExists ? 'text-danger' : 'text-success'}`}>
                          {value.discrepancyExists ? 'Discrepancy' : 'Match'}</h5>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-6">
                          <h6>Current Evaluation</h6>
                          <table className="table">
                            <tbody>
                              {value.fetchedEvaluatedMeasureGroups.map((group, index) => (
                                <tr key={index}>
                                  <td>{group.code}</td>
                                  <td>{group.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-6">
                          <h6>Existing Measure Report</h6>
                          <table className="table">
                            <tbody>
                              {value.fetchedMeasureReportGroups.map((group, index) => (
                                <tr key={index}>
                                  <td>{group.code}</td>
                                  <td>{group.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>


                    </div>
                  ) : (
                    <div key={key.display + key.id}>
                      <div className="row mt-4">
                        <h4>{key.display} - {key.id}</h4>
                        <h5 className='text-danger'>
                          Processing Error</h5>
                      </div>
                      <div>
                        {value.fetchedMeasureReportGroups.length == 0 && <h6>MeasureReport not found for: {key.display} - {key.id} using selected Data Repository Server.</h6>}
                        {value.fetchedEvaluatedMeasureGroups.length == 0 && <h6>Measure Evaluation was unsuccesful for: {key.display} - {key.id}.<br></br>Please verify results with Measure Evaluation Service.</h6>}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default TestingComparator;
