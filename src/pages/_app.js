import '@/styles/globals.css'
import Layout from '../components/layout'

import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
Amplify.configure(awsExports);

export default function App({ Component, pageProps }) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
      <Layout signOut={signOut} user={user}>
        <Component {...pageProps} />
      </Layout>
      )}
    </Authenticator>

    )
}
