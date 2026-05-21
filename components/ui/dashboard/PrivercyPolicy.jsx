import Link from "next/link";
import React from "react";

const PrivercyPolicy = () => {
  return (
    <div className="md:min-w-[650px]  border shadow-xl flex  flex-col gap-2 px-5 py-3 rounded-2xl">
      <h1 className="text-xl font-semibold pb-3"> Privercy and concers </h1>

      <div className="font-thin"> <Link href='#'  className="underline">see privercy and terms  </Link></div>

    </div>
  );
};

export default PrivercyPolicy;
