import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import axios from "axios";

export default NextAuth({
    debug: true,
    secret: process.env.SECRET,
    providers: [
        KeycloakProvider({
            clientId: String(process.env.KEYCLOAK_ID),
            clientSecret: String(process.env.KEYCLOAK_SECRET),
            issuer: process.env.KEYCLOAK_ISSUER
        })
    ],
    jwt: {
        secret: String(process.env.JWT_SECRET),
    },
    session: {
        strategy: "jwt"
    },
    theme: {
        colorScheme: "light"
    },
    // pages: {
    //     signIn: '/Home',
    //     signOut: '/'
    // },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            // console.log("THIS IS USER", user);
            // console.log("THIS IS ACC", account);
            // console.log("THIS IS PROF", profile);

            // ? general info, not specific to authentication provider
            // THIS IS USER {
            //     id: 'ed2fd76b-f152-48de-a94e-480dbc8e64c5',
            //     name: 'AMALIE CHUA QI WEI',
            //     email: 'amalieqw.21@ichat.sp.edu.sg',
            //     image: undefined
            //   }
            // ? info specific to provider(etc provider details), specific indentifiers, 
            // ? useful for when need to interact with authentication provider's API
            //   THIS IS ACC {
            //     provider: 'keycloak',
            //     type: 'oauth',
            //     providerAccountId: 'ed2fd76b-f152-48de-a94e-480dbc8e64c5',
            //     access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpUU5GR3ljWWlpaDY5UkxaRXhla3o4QnZadnoyTGUzd3dUbk9hd3FNd3o0In0.eyJleHAiOjE2ODk4NDcyODEsImlhdCI6MTY4OTg0Njk4MSwiYXV0aF90aW1lIjoxNjg5ODQzMjM2LCJqdGkiOiIxNDBhNGJlZS1iN2QxLTRlNWEtODkzNS00YjA2YzhjMzIwNWQiLCJpc3MiOiJodHRwczovL3Nzby5hYmMtY29va2luZy5zdHVkaW8vYXV0aC9yZWFsbXMvdGVzdC1wb3MiLCJhdWQiOlsiYnJva2VyIiwiYWNjb3VudCJdLCJzdWIiOiJlZDJmZDc2Yi1mMTUyLTQ4ZGUtYTk0ZS00ODBkYmM4ZTY0YzUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwb3MiLCJzZXNzaW9uX3N0YXRlIjoiNjY5NWRhMmItNzg0Yi00ZmQ4LWE4ZWItNmEyMjY1ZWVmYTdlIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy10ZXN0LXBvcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImJyb2tlciI6eyJyb2xlcyI6WyJyZWFkLXRva2VuIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiQU1BTElFIENIVUEgUUkgV0VJIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYW1hbGllcXcuMjFAaWNoYXQuc3AuZWR1LnNnIiwiZ2l2ZW5fbmFtZSI6IkFNQUxJRSBDSFVBIFFJIiwiZmFtaWx5X25hbWUiOiJXRUkiLCJlbWFpbCI6ImFtYWxpZXF3LjIxQGljaGF0LnNwLmVkdS5zZyJ9.OrTiKmj1fgstIwvaHTu7E-8qHqWIUc4nnXzxV5VDDuyYjrUEjf37x_Dr07KBeO3QMfRuuKcZvU9oSB5a7X8ZfVuRF-_BPpfKS_lMP8TGkIQvlXK_j9HgJvvXMFZ6JNcMRcM_R4OsJxDWUHtxLwXFj0NHm4qMZNkHjObSZWUlymrTng8ZSXfThTTuuygJI8RAk1OUR8SUIfi7v3AzfDpB6sEqMClyHEHiYuOoIyYbabXwrmaLCbpiHtiuTGGw-a4T28Zl5FEgtQnzuTjhhjbyVq77DMzx9bXiW-ZgQfkkAG-JQ9f-Xem--U9mYGB_V3oGOVEC_Eq_wrFdg4UUGAHAXg',
            //     expires_at: 1689847282,
            //     refresh_expires_in: 1800,
            //     refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNjQwMDVkYS1hYmMxLTQ5MDAtODA3Ni1kMzgxNTBjYWIwY2MifQ.eyJleHAiOjE2ODk4NDg3ODEsImlhdCI6MTY4OTg0Njk4MSwianRpIjoiYmQ1MDliMjItZGI1OS00NzE0LTk4NmItZjA4ZDYzODg3MTk0IiwiaXNzIjoiaHR0cHM6Ly9zc28uYWJjLWNvb2tpbmcuc3R1ZGlvL2F1dGgvcmVhbG1zL3Rlc3QtcG9zIiwiYXVkIjoiaHR0cHM6Ly9zc28uYWJjLWNvb2tpbmcuc3R1ZGlvL2F1dGgvcmVhbG1zL3Rlc3QtcG9zIiwic3ViIjoiZWQyZmQ3NmItZjE1Mi00OGRlLWE5NGUtNDgwZGJjOGU2NGM1IiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InBvcyIsInNlc3Npb25fc3RhdGUiOiI2Njk1ZGEyYi03ODRiLTRmZDgtYThlYi02YTIyNjVlZWZhN2UiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.DYh2ESKqxa_i8k8vabAqsPggKYIZzwHF96Q8W6n9bmw',
            //     token_type: 'Bearer',
            //     id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpUU5GR3ljWWlpaDY5UkxaRXhla3o4QnZadnoyTGUzd3dUbk9hd3FNd3o0In0.eyJleHAiOjE2ODk4NDcyODEsImlhdCI6MTY4OTg0Njk4MSwiYXV0aF90aW1lIjoxNjg5ODQzMjM2LCJqdGkiOiI4MmRkZDA5Mi1iNTcwLTQ0MjQtYjc1Zi0xMGVmNjY0YjA2N2IiLCJpc3MiOiJodHRwczovL3Nzby5hYmMtY29va2luZy5zdHVkaW8vYXV0aC9yZWFsbXMvdGVzdC1wb3MiLCJhdWQiOiJwb3MiLCJzdWIiOiJlZDJmZDc2Yi1mMTUyLTQ4ZGUtYTk0ZS00ODBkYmM4ZTY0YzUiLCJ0eXAiOiJJRCIsImF6cCI6InBvcyIsInNlc3Npb25fc3RhdGUiOiI2Njk1ZGEyYi03ODRiLTRmZDgtYThlYi02YTIyNjVlZWZhN2UiLCJhdF9oYXNoIjoiSERtYmw4aFRRUjNSZldFYWtxaDQ1ZyIsImFjciI6IjAiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJBTUFMSUUgQ0hVQSBRSSBXRUkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbWFsaWVxdy4yMUBpY2hhdC5zcC5lZHUuc2ciLCJnaXZlbl9uYW1lIjoiQU1BTElFIENIVUEgUUkiLCJmYW1pbHlfbmFtZSI6IldFSSIsImVtYWlsIjoiYW1hbGllcXcuMjFAaWNoYXQuc3AuZWR1LnNnIn0.ZoxYfSCcaEfyu0XXlRJjFw_LxrqB4999NJxPsOrmkbjhAS2d90i-sX4Gn_Bg238WWu-AplHw6bjH00H2260HDeGf0byaQhkh--7aHE4D5oCZviioJGnXkpyZYLtLnXfJu7RdEUFCxspLL-IsnnW6o1s5TNxvpoYjP1tycCcwa7sOxl9WyeqQHDjTbukT4aPWGVG3A2P8DmPvBXXmzgJR9LkDCZ3d-6t9DkoTJAGY12L578koBD6LyN1N0D-uJ6Dq5980IuvB3u_NzGgCoqmQS_ykZjtYutLDJsArzqDaNL_b7icmlPyEw2BpNs0PCalYbsmEkM1tn_QQF00gw-1dkg',
            //     'not-before-policy': 1661221636,
            //     session_state: '6695da2b-784b-4fd8-a8eb-6a2265eefa7e',
            //     scope: 'openid profile email'
            //   }
            // ? contains raw profile data, data from provider, access to provider specific data
            //   THIS IS PROF {
            //     preferred_username: 'amalieqw.21@ichat.sp.edu.sg',
            //     given_name: 'AMALIE CHUA QI',
            //     family_name: 'WEI',
            //     email: 'amalieqw.21@ichat.sp.edu.sg'
            //   }

            const isAuthenticated = {
                SSO: false,
                DB: false
            };
            const session = {
                name: user.name,
                email: user.email
            }

            const email = user.email;
            // const email = "ashley18182828@gmail.com"
            const accessToken1 = account.access_token;

            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            console.log(email)
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            console.log(accessToken1)
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

            // AUTH STEP 2 [SUCCESS]
            await axios.get(`http://sso.abc-cooking.studio/auth/realms/test-pos/broker/oidc/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken1
                }
            })
                .then(async (response) => {
                    // console.log("STEP 2 AXIOS RESPONSE $$$$$$$ ", response.data);

                    const accessToken2 = response.data.access_token;
                    // console.log("acesstoken 22222222", accessToken2);

                    // async function auth3() {
                    await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}'`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken2
                        }
                    })
                        .then(async(response) => {
                            // console.log("AUTH3 RESPONSE %%%%%%%%%", response.data);

                            isAuthenticated.SSO = true;

                            await axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                                {
                                    email: email
                                }
                            )
                                .then((response) => {
                                    console.log("RES FROM DB", response.data)
                                    isAuthenticated.DB = true;
                                })
                                .catch((err) => {
                                    console.log(err, "EROROROR");
                                    if (err.code === "ERR_NETWORK") {
                                        console.log(err);
                                    }
                                    else if(err){
                                        console.log(err);
                                    }
                                    else if (err.response.status === 404) {
                                        isAuthenticated.DB = false;
                                        console.log(err.response.data);
                                    }
                                });
                        })
                })
                .catch((err) => {
                    console.log(err);

                    isAuthenticated.SSO = false;
                })
            console.log("0000000000000000000000000000000000000000000000000000000")
            console.log("OUTSIDE", isAuthenticated)

            if (isAuthenticated.SSO === true && isAuthenticated.DB === true) {
                console.log("redirect from backkkk")
                // return '/Home';
                return Promise.resolve({
                    session, 
                    redirect: '/Home'
                })
            }
            else if (isAuthenticated.DB === false) {
                console.log("I AM WORKING DB FALSE")
                return Promise.resolve('/SignUp');
            }
            else if (isAuthenticated.SSO === false) {
                console.log("I AM WORKING FALSE")
                return '/Unauthorised';
            }
             else {
                console.log(isAuthenticated)
                console.log("SOMETHING IS WRONG")
            }
        },
        
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            };
            if (account) {
                token.accessToken = account.access_token;
            };
            return token;
        },

        async session({ session, user, token }) {
            // session.user.id = token.id;
            if (token) {
                session.accessToken = token.accessToken;
            };

            const sessionEmail = session?.user.email;
            console.log("SESSION EMAIL", sessionEmail);

            await axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                {
                    email: sessionEmail
                }
            )
                .then((res) => {
                    // console.log("IN SESSION", res.data[0]);
                    const data = res.data[0];

                    session.userDetails = {
                        name: data.name,
                        email: data.email,
                        userID: data.userID,
                        role: data.roleID
                    };
                })
                .catch((err) => {
                    if (err.code === "ERR_NETWORK") {
                        console.log(err);
                    }
                    else if (err.response.status === 404) {
                        console.log(err.response.data);
                    }
                    else {
                        console.log(err, "EROROROR");
                    };
                });
            // console.log(session, "OUTISDE55555555555555555555")

            return session;
        },

    },
    events: {
        // not running callback signIn running insaed
        signIn: async (session) => {
            // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            // console.log(session);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            // console.log("this is the session fr", { session });
            console.log("this is the session fr", session?.account.access_token);

            const email = session?.user.email;
            const accessToken1 = session?.account.access_token;

            // AUTH STEP 2 [SUCCESS]
            await axios.get(`http://sso.abc-cooking.studio/auth/realms/test-pos/broker/oidc/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken1
                }
            })
                .then(async (response) => {
                    // console.log("STEP 2 AXIOS RESPONSE $$$$$$$ ", response.data);

                    const accessToken2 = response.data.access_token;
                    console.log("acesstoken 22222222", accessToken2);

                    // async function auth3() {
                    await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}'`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken2
                        }
                    })
                        .then((response) => {
                            console.log("AUTH3 RESPONSE %%%%%%%%%", response.data);
                            return '/Home';
                            // axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                            //     {
                            //         email: email
                            //     }
                            // )
                            //     .then((res) => {
                            //         // console.log(`Login Successful!`);
                            //         // console.log(res.data);
                            //         console.log(res.data[0]);

                            //         const data = res.data[0];
                            //         // console.log(res);

                            //         session.userDetails = {
                            //             name: data.name,
                            //             email: email,
                            //             userID: data.userID,
                            //             role: data.roleID
                            //         };

                            //         console.log(session, "hkhcbdcsjidhdbvgchjiofkdewjkbdhv^^^^^^^^^^^^^^^^%#########################^^^^^^^^^^^^^^^^")

                            //         // add user data to local storage
                            //         localStorage.setItem("ID", data.userID);
                            //         localStorage.setItem("roleID", data.roleID);
                            //         localStorage.setItem("Name", data.name);
                            //     })
                            //     .catch((err) => {
                            //         console.log(err, "EROROROR");
                            //         // if (err.code === "ERR_NETWORK") {
                            //         //     console.log(err);
                            //         // }
                            //         // else if (err.response.status === 404) {
                            //         //     console.log(err.response.data);
                            //         // }
                            //     });
                        })
                    // .catch((err) => {
                    //     console.log(err);
                    //     console.log(err.response);
                    //     console.log(err.code);
                    // })
                    // };

                    // auth3();
                })
                .catch((err) => {
                    console.log(err);
                    return '/Login';
                })
        },

        signOut: async ({ session }) => {
            await axios.get(`https://sso.abc-cooking.studio/auth/realms/test-pos/protocol/openid-connect/logout?post_logout_redirect_uri=/`)
                .then((response) => {
                    console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111`)
                    console.log("LOgout res", response);

                    // router.push('/');
                })
                .catch((err) => {
                    console.log(`#####################################################`)
                    console.log(err);
                })
        }
    }
})