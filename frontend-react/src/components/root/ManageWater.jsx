import React from 'react';
import Layout from "./fragments/layout/Layout";
import ManageWater from './ManageWater/ManageWater';

function Manage() {
    return (
        <Layout>
            <ManageWater/>
        </Layout>
    );
}

export default Manage;