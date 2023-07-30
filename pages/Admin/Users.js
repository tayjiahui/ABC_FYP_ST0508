// this is the admin homepage

// Base urls
const URL = [];

function isLocalhost (){
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // console.log('hostname   ' + hostname);
        if(hostname == 'localhost'){
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
            
        }
        else if(hostname == 'abc-cooking-studio.azurewebsites.net'){
            URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
            console.log(URL);
        };

        return URL;
    };
};

isLocalhost();

const baseUrl = URL[0];

//----------------------function name has to be uppercase
export default function Users() {

    return (
        <div>
            <div className="px-5">
                <h2>Users</h2>
            </div>
        </div>
    );
};