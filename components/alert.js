// Alert Component
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Alert } from 'react-bootstrap';

export default function AlertBox(props) {
  console.log("componenet", props.Show);

  const [showSuccessAlert, setShowSusAlexbox] = useState(false);
  const [showFailedAlert, setShowFailAlexbox] = useState(false);

  console.log(showSuccessAlert, "hdhc");

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
