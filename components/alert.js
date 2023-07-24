// Alert Component
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

export default function AlertBox(props) {
  console.log(props.Show);

  const [showSuccessAlert, setShowSusAlexbox] = useState(false);

  console.log(showSuccessAlert);

  useEffect(() => {
    if (props.Show === true) {
      setShowSusAlexbox(true);
      mySuccessFunction();
    } else {
      setShowSusAlexbox(false)
    };
  }, [props.Show])

  // success message timer
  function mySuccessFunction() {
    setTimeout(successAlertFunc, 3000);
  };

  function successAlertFunc() {
    setShowSusAlexbox(false);
  };

  return (
    <>
      <h1>i am working i think</h1>
      {
        showSuccessAlert &&
        <div className='float-start position-absolute bottom-0'>
          <div style={{ maxWidth: '600px' }}>
            <Alert variant={props.Type} dismissible>
              <Alert.Heading>
                {props.Message}
              </Alert.Heading>
            </Alert>
          </div>
        </div>
      }
    </>
  )
};
