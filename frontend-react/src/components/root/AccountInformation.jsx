import React from "react";
import Layout from "./fragments/layout/Layout";
import PersonalInfoForm from "./AccountInformation/PersonalInfoForm";
function AccountInformation() {
  return (
    <Layout>
      <div className="my-auto">
        <PersonalInfoForm />
      </div>
    </Layout>
  );
}

export default AccountInformation;
