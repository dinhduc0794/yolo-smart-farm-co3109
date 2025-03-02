import React from 'react';
import Layout from "./fragments/layout/Layout";
import FarmLogTable from './FarmLogTable/FarmLogTable';

function FarmLog() {
    return (
        <Layout>
            <FarmLogTable />
        </Layout>
    );
}

export default FarmLog;
