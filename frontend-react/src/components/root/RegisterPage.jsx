import React from "react";
import HeaderMain from "./fragments/header/HeaderMain";
import RegisForm from "./Login/RegisterForm";
import Footer from "./fragments/footer/Footer";

function RegisPage() {
  return (
    <div>
      <HeaderMain />
      <div className="flex overflow-hidden flex-col items-center bg-zinc-100">
        <main className="flex justify-center items-center p-7 my-7 max-md:px-5 max-md:mt-10 rounded-md">
          <RegisForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}
export default RegisPage;
