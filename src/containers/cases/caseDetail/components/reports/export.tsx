import React from "react";
import { CSVLink } from "react-csv";

const ExportToCSV = ({
  csvdata,
  children,
}: {
  csvdata: any;
  children: React.JSX.Element;
}) => {
  const csvData = csvdata?.data;

  const csvHeader: any = [{ label: "ICD Code", key: "icdCode" }];
  const csvFilename = csvdata?.fileName;

  return (
    <CSVLink
      style={{ color: "inherit", textDecoration: "none" }}
      data={csvData}
      headers={csvHeader}
      filename={csvFilename}
    >
      {children}
    </CSVLink>
  );
};

export default ExportToCSV;
