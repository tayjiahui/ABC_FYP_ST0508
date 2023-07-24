// Alert Component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert } from 'react-bootstrap';

export default function AlertBox(props) {
  const router = useRouter();

  const [showSuccessAlert, setShowSusAlexbox] = useState(false);

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

  // only if have page redirection
  const handleRedirect = () => {
    setShowSusAlexbox(false);
    // router.push(props.Redirect)
  }

  return (
    <>
      {
        showSuccessAlert &&
        <div className='float-start position-absolute bottom-0'>
          <div style={{ maxWidth: '600px' }}>
            <Alert variant={props.Type} dismissible onClose={handleRedirect}>
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
