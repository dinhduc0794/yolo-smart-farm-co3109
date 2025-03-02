import React from 'react'
import Layout from "./fragments/layout/Layout";
import ChangePassword from './AccountInformation/ChangePassword';

function AccountInformation() {
    return (
        <Layout>
            <ChangePassword />
        </Layout>
    )
}

export default AccountInformation