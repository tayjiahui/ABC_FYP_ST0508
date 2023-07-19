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
        jwt: true
    },
    theme: {
        colorScheme: "light"
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, user, token }) {
            // session.user.id = token.id;
            if (token) {
                session.accessToken = token.accessToken;
            };

            const sessionEmail = session?.user.email;
            // const sessionEmail = 'abv@gmail.com';

            await axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                {
                    email: sessionEmail
                }
            )
                .then((res) => {
                    // console.log(res.data[0]);
                    const data = res.data[0];

                    session.userDetails = {
                        name: data.name,
                        email: data.email,
                        userID: data.userID,
                        role: data.roleID
                    };
                })
                .catch((err) => {
                    console.log(err, "EROROROR");
                    if (err.code === "ERR_NETWORK") {
                        console.log(err);
                    }
                    else if (err.response.status === 404) {
                        console.log(err.response.data);
                    };
                });

                // console.log(session, "OUTISDE55555555555555555555")

            return session;
        },
    },
    events: {
        signIn: async (session) => {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            console.log(session);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            // console.log("this is the session fr", { session });
            console.log("this is the session fr", session?.account.access_token);

            const email = session?.user.email;
            const accessToken1 = session?.account.access_token;

            console.log(email, "I AM EMAILLSKJDCKLN")

            // AUTH STEP 2 [SUCCESS]
            await axios.get(`http://sso.abc-cooking.studio/auth/realms/test-pos/broker/oidc/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken1
                }
            })
                .then((response) => {
                    // console.log("STEP 2 AXIOS RESPONSE $$$$$$$ ", response.data);

                    const accessToken2 = response.data.access_token;
                    console.log("acesstoken 22222222", accessToken2);

                    async function auth3() {
                        await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}'`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken2
                            }
                        })
                            .then((response) => {
                                console.log("AUTH3 RESPONSE %%%%%%%%%", response.data);
                                // console.log("AUTH3 RESPONSE %%%%%%%%%", response.data.value);

                                axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                                    {
                                        email: email
                                    }
                                )
                                    .then((res) => {
                                        // alert(`Login Successful!`);
                                        // console.log(res.data);
                                        console.log(res.data[0]);

                                        const data = res.data[0];
                                        // console.log(res);

                                        session.userDetails = {
                                            name: data.name,
                                            email: email,
                                            userID: data.userID,
                                            role: data.roleID
                                        };

                                        console.log(session, "hkhcbdcsjidhdbvgchjiofkdewjkbdhv^^^^^^^^^^^^^^^^%#########################^^^^^^^^^^^^^^^^")

                                        // add user data to local storage
                                        localStorage.setItem("ID", data.userID);
                                        localStorage.setItem("roleID", data.roleID);
                                        localStorage.setItem("Name", data.name);
                                    })
                                    .catch((err) => {
                                        console.log(err.response, "EROROROR");
                                        // if (err.code === "ERR_NETWORK") {
                                        //     alert(err);
                                        // }
                                        // else if (err.response.status === 404) {
                                        //     alert(err.response.data);
                                        // }
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                                console.log(err.response);
                                console.log(err.code);
                            })
                    }

                    auth3();
                })
                .catch((err) => {
                    console.log(err);
                })
        },

        signOut: async ({ session }) => {
            await axios.get(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=/`)
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