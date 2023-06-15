import NextAuth from "next-auth"
import { decode, encode } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

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
    // session:{
    //     strategy: jwt
    // },
    theme: {
        colorScheme: "light"
    },
    callbacks: {
        async jwt({ token, user, account}) {
            if(user) {
                token.id = user.id;
            }
            if(account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token, user}) {
            // session.user.id = token.id;
            if(token){
                session.accessToken = token.accessToken;
            }

            return session;
        },
    },
    events: {
        signOut: async({session}) => {
            if (session.provider === "keycloak"){
                console.log("axios logout keycloak");
                await axios.get(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=encodedRedirectUri`)
            }
        }
    }
})