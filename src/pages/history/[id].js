import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const ClickablePieChart = () => {
  const router = useRouter();
  const historyId = router.query.id
  
  return (
    <>
     hey
    </>
  );
};

export default ClickablePieChart;
