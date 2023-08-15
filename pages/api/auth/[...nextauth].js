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
    callbacks: {
        async signIn({ user, account, profile }) {
            const isAuthenticated = {
                SSO: false,
                DB: false
            };

            // to return session
            const session = {};

            const email = user.email;
            const accessToken1 = account.access_token;

            // AUTH STEP 2 [SUCCESS]
            await axios.get(`http://sso.abc-cooking.studio/auth/realms/test-pos/broker/oidc/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken1
                }
            })
                .then(async (response) => {
                    const accessToken2 = response.data.access_token;

                    await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}'`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken2
                        }
                    })
                        .then(async (response) => {
                            isAuthenticated.SSO = true;

                            // !edit base url
                            await axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                                {
                                    email: email
                                }
                            )
                                .then((response) => {
                                    isAuthenticated.DB = true;
                                })
                                .catch(async (err) => {
                                    if (err.code === "ERR_NETWORK") {
                                        console.log(err);
                                    } else if (err.response.status === 404) {
                                        isAuthenticated.DB = false;
                                        console.log(err.response.data);
                                        
                                        // create new user automatically
                                        await axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/user`, {

                                            roleID: 2,
                                            name: user.name,
                                            email: email

                                        })
                                            .then((response) => {
                                                isAuthenticated.DB = true;
                                            });
                                    } else if (err) {
                                        console.log(err);
                                    };
                                });
                        })
                })
                .catch((err) => {
                    console.log(err);
                    isAuthenticated.SSO = false;
                });

            if (isAuthenticated.SSO === true && isAuthenticated.DB === true) {
                return Promise.resolve({
                    session,
                    redirect: '/Home'
                });
            }
            else if (isAuthenticated.DB === false) {
                return Promise.resolve('/SignUp');
            }
            else if (isAuthenticated.SSO === false) {
                return '/Unauthorised';
            }
            else {
                console.log(isAuthenticated);
            };
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

            await axios.post(`https://abc-cooking-studio-backend.azurewebsites.net/api/user/login`,
                {
                    email: sessionEmail
                }
            )
                .then((res) => {
                    const data = res.data;

                    session.userDetails = {
                        name: data.name,
                        email: data.email,
                        userID: data.id,
                        role: data.roleID,
                        token: data.token
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

            return session;
        },

    },
    events: {
        // not running callback signIn running insaed
        signIn: async (session) => {
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

                    const accessToken2 = response.data.access_token;

                    // async function auth3() {
                    await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}'`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken2
                        }
                    })
                        .then((response) => {
                        });

                })
                .catch((err) => {
                    console.log(err);
                });
        },

        signOut: async ({ session }) => {
            await axios.get(`https://sso.abc-cooking.studio/auth/realms/test-pos/protocol/openid-connect/logout?post_logout_redirect_uri=/`)
                .then((response) => {
                    // router.push('/');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
})