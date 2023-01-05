import React from "react";
import { useIsFetching } from "react-query";
import Loader from "./Loader";

const FetchingIndicator = () => {
  const isFetching = useIsFetching();
  if (!isFetching) return null;
  return (
    <div className="fetching-indicator">
      <Loader />
    </div>
  );
};

export default FetchingIndicator;
