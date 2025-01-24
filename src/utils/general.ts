import {
  DiseaseReport,
  ImageType,
  MapViewFilter,
  ReportsDetailWithBodyPart,
} from "@/interface";

export const fQueryParams = (filter?: Record<string, any>) => {
  let query = "?";

  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      query += `${key}=${value}&`;
    });
  }

  return query;
};

export const calculateAge = (date: Date | string | null) => {
  if (!date) return 0;
  const today = new Date();
  const birthDate = new Date(date);
  if (today < birthDate) {
    return 0;
  }
  let ageNow = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    ageNow--;
  }

  return ageNow;
};

export function capitalizeFirstLetter(str?: string | null) {
  const words = str?.split(" ") || [];
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
}
export function capitalizeLetters(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char: string) => char.toUpperCase());
}

// Utility function to mask email
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.length > 2
      ? `${localPart[0]}${"*".repeat(localPart.length - 2)}${
          localPart[localPart.length - 1]
        }`
      : localPart;
  const [domainName, domainExtension] = domain.split(".");
  const maskedDomainName =
    domainName.length > 2
      ? `${domainName[0]}${"*".repeat(domainName.length - 2)}${
          domainName[domainName.length - 1]
        }`
      : domainName;
  return `${maskedLocalPart}@${maskedDomainName}.${domainExtension}`;
}

export function maskPhoneNumber(phoneNumber: string): string {
  // Match the country code and separate the rest of the number
  const countryCodeMatch = phoneNumber.match(/^(\+?[0-9]{1,4})/); // Extract up to 4 digits for the country code
  const countryCode = countryCodeMatch ? countryCodeMatch[0] : "";
  const localNumber = phoneNumber.slice(countryCode.length);

  // Mask the local number, leaving the last 4 digits visible
  const maskedLocalNumber =
    localNumber.length > 4
      ? `${"*".repeat(localNumber.length - 4)}${localNumber.slice(-4)}`
      : localNumber;

  return `${countryCode}${maskedLocalNumber}`;
}

export function formatCurrencyToNumber(
  currency: string | undefined | null
): number {
  if (!currency) {
    return 0;
  }
  if (currency.includes("n") || currency.includes("N")) return 0;
  const numberString = currency.replace(/[^0-9.-]+/g, "");
  return parseFloat(numberString);
}

export const extractFilteredReports = (
  reports: ReportsDetailWithBodyPart[],
  filter?: MapViewFilter
) => {
  const hasFilter =
    filter && (filter.bodyPart || filter.tag || filter.provider);
  const filteredReports: ReportsDetailWithBodyPart[] = [];

  reports.forEach((report) => {
    let shouldAddReport = false; // Flag to track if the report should be added

    report.classification.forEach((classification) => {
      if (hasFilter) {
        if (filter.bodyPart) {
          const filtered = classification.images.filter(
            (item) => item._id == filter.bodyPart
          );
          if (filtered.length) shouldAddReport = true;
        } else if (
          filter.tag &&
          report.tags?.length &&
          report.tags.includes(filter.tag)
        ) {
          shouldAddReport = true;
        } else if (
          filter.provider &&
          filter.provider?.toLowerCase() === report.providerName?.toLowerCase()
        ) {
          shouldAddReport = true;
        }
      } else {
        shouldAddReport = true; // Add if no filter is applied
      }
    });

    // Add the report only once if it matches any criteria
    if (shouldAddReport) {
      filteredReports.push(report);
    }
  });

  return filteredReports;
};

export const extractImagesFromReport = (
  reports: ReportsDetailWithBodyPart[],
  filter?: MapViewFilter
) => {
  const hasFilter =
    filter && (filter.bodyPart || filter.tag || filter.provider);
  const images: ImageType[] = [];
  reports.forEach((report) => {
    if (report) {
      report.classification.forEach((classification) => {
        if (classification.images && classification.images.length) {
          if (hasFilter) {
            if (filter.bodyPart) {
              const filtered = classification.images.filter(
                (item) => item._id == filter.bodyPart
              );
              // console.log("extractImagesFromReport", filtered);
              if (filtered.length) images.push(...filtered);
            } else if (filter.tag && report.tags?.includes(filter.tag)) {
              images.push(...classification.images);
            } else if (
              filter.provider &&
              filter.provider?.toLowerCase() ===
                report.providerName?.toLowerCase()
            ) {
              images.push(...classification.images);
            }
          } else images.push(...classification.images);
        }
      });
    }
  });
  return images;
};

export const extractBodyPartsFromClassification = (
  classifications: DiseaseReport[],
  bodyPart: string
) => {
  const images: ImageType[] = [];
  classifications.forEach((classification) => {
    if (
      classification?.bodyParts?.toLowerCase() == bodyPart?.toLowerCase() &&
      classification?.images &&
      classification?.images.length
    ) {
      images.push(...classification.images);
    }
  });

  return images;
};

export function getUniqueFileNames(data: DiseaseReport[]) {
  const uniqueFiles = new Map();

  data.forEach((item) => {
    item.images.forEach((image) => {
      if (!uniqueFiles.has(image._id)) {
        uniqueFiles.set(image._id, {
          fileName: image.fileName,
          fileId: image._id,
        });
      }
    });
  });

  return Array.from(uniqueFiles.values());
}

export const extractBodyPartsFromReport = (
  reports: ReportsDetailWithBodyPart[]
): DiseaseReport[] => {
  return reports.reduce((bodyParts: DiseaseReport[], report) => {
    report.classification.forEach((classification) => {
      if (classification.bodyParts) {
        bodyParts.push({ ...classification, reportId: report._id });
      }
    });
    return bodyParts;
  }, []);
};

export const getReportsInYear = (
  reports: ReportsDetailWithBodyPart[],
  year: number
) => {
  if (!year) return reports;
  const filteredReports: ReportsDetailWithBodyPart[] = [];
  reports.forEach((report) => {
    const reportYear = new Date(report.dateOfClaim).getFullYear();
    // report.classification.forEach((classification) => {
    //   // if (classification.images && classification.images.length)
    //   console.log("getReportsInYear", report);
    // });
    if (reportYear === year) filteredReports.push(report);
  });
  return filteredReports;
};

export const extractProvidersFromReport = (
  reports: ReportsDetailWithBodyPart[]
) => {
  const providers: string[] = [];
  reports.forEach((report) => {
    providers.push(report.providerName);
  });
  return providers;
};

export const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error("File download failed");
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const getFileName = (url: string) => {
  return url?.substring(url.lastIndexOf("/") + 1) || "";
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
