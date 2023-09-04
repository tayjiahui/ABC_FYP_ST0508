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

  const handleClose = () => {
    setShowSusAlexbox(false);

    // only if have page redirection
    if (props.Redirect) {
      router.push(props.Redirect);
    };
  };

  return (
    <>
      {
        showSuccessAlert &&
        <div className='position-relative'>
          <div className='top-0 end-0 position-fixed p-5 mt-5'>
            <div style={{ maxWidth: '600px' }}>
              <Alert variant={props.Type} dismissible onClose={handleClose}>
                <Alert.Heading>
                  {props.Message}
                </Alert.Heading>
              </Alert>
            </div>
          </div>
        </div>
      }
    </>
  )
};
