import {
  DiseaseClass,
  ImageType,
  ImageTypeTwo,
  MapViewFilter,
  ReportsDetailWithBodyPart,
  ReportsFilter,
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
  if (!filter) return reports;

  const { tag, provider, bodyPart } = filter;
  const hasFilter = tag?.length || provider || bodyPart || filter?.icdCode;
  if (!hasFilter) return reports;

  return reports.filter((report) => {
    if (tag?.length && !tag.includes(report._id.toString())) return false;

    if (
      provider &&
      provider.toLowerCase() !== report.providerName?.toLowerCase()
    ) {
      return false;
    }

    if (bodyPart) {
      const hasMatchingBodyPart = report.classification.some((classification) =>
        classification.images.some((image) => image._id === bodyPart)
      );
      if (!hasMatchingBodyPart) return false;
    }

    if (filter?.icdCode) {
      const hasMatchingIcdCode = report.icdCodes?.includes(filter.icdCode);
      if (!hasMatchingIcdCode) return false;
    }

    return true;
  });
};

export const extractImagesFromReport = (
  reports: ReportsDetailWithBodyPart[],
  filter?: MapViewFilter
) => {
  // console.log('extractImagesFromReport', filter);
  if (!filter) {
    // Return all images if no filter is applied
    return reports.flatMap((report) =>
      report.classification.flatMap((classification) => classification.images)
    );
  }

  const { tag, provider, bodyPart } = filter;
  const hasFilter = tag?.length || provider || bodyPart;

  return reports.flatMap((report) => {
    if (tag && tag.length) {
      const matchesTag = tag.includes(report._id.toString());
      if (!matchesTag) return [];
    }
    if (provider) {
      const matchesProvider =
        provider?.toLowerCase() === report.providerName?.toLowerCase();
      if (!matchesProvider) return [];
    }

    if (bodyPart) {
      return report.classification.flatMap((classification) => {
        if (!classification.images.length) return [];

        if (!hasFilter) return classification.images; // No filter, return all images.

        // Check if the report matches the filter conditions

        const matchesBodyPart = bodyPart
          ? classification.images.some((image) => image._id === bodyPart)
          : false;

        if (matchesBodyPart) {
          return classification.images.filter(
            (image) => image._id === bodyPart
          );
        }

        return [];
      });
    }
    return report.classification.flatMap(
      (classification) => classification.images
    );
  });
};

export const extractBodyPartsFromClassification = (
  classifications: DiseaseClass[],
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

export function getUniqueFileNames(data: DiseaseClass[]) {
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

// export const extractBodyPartsFromReport = (
//   reports: ReportsDetailWithBodyPart[]
// ): DiseaseClass[] => {
//   return reports.reduce((bodyParts: DiseaseClass[], report) => {
//     report.classification.forEach((classification) => {
//       if (classification.bodyParts) {
//         bodyParts.push({ ...classification, reportId: report._id });
//       }
//     });
//     return bodyParts;
//   }, []);
// };

export const extractBodyPartsFromReport = (
  reports: ReportsDetailWithBodyPart[],
  filter?: MapViewFilter
): DiseaseClass[] => {
  if (!filter) {
    return reports.flatMap((report) =>
      report.classification
        .filter((classification) => classification.bodyParts)
        .map((classification) => ({ ...classification, reportId: report._id }))
    );
  }

  const { tag, provider, bodyPart } = filter;
  const hasFilter = tag?.length || provider || bodyPart;

  return reports.flatMap((report) => {
    // Apply the same filtering logic as extractFilteredReports
    if (tag?.length && !tag.includes(report._id.toString())) return [];
    if (
      provider &&
      provider.toLowerCase() !== report.providerName?.toLowerCase()
    )
      return [];

    return report.classification
      .filter((classification) => {
        if (!classification?._id) return true;
        if (!classification.bodyParts) return false;
        if (filter.dcs && filter.dcs.length)
          return filter.dcs.includes(classification._id);
        if (!bodyPart) return true; // If no specific bodyPart filter, include all

        return classification.images.some((image) => image._id === bodyPart);
      })
      .map((classification) => ({ ...classification, reportId: report._id }));
  });
};

export const filterReportsByDcForReporting = (
  reports: ReportsDetailWithBodyPart[],
  filter: ReportsFilter
): ReportsDetailWithBodyPart[] => {
  const { tag, searchVal, dcs, icdCodes, isFiltered } = filter;

  if (!tag?.length && !dcs?.length && !icdCodes?.length && !searchVal) {
    if (!isFiltered) return reports;
    return [];
  }
  const normalizedSearchVal = searchVal?.toLowerCase();

  return reports.flatMap((report) => {
    if (tag?.length && !tag.includes(report._id.toString())) return [];

    if (
      normalizedSearchVal &&
      ![
        report.nameOfDisease,
        report.providerName,
        ...(report.icdCodes || []),
      ].some((field) => field.toLowerCase().includes(normalizedSearchVal))
    ) {
      return [];
    }

    if (!dcs?.length && !icdCodes?.length) return [report];

    const classifications = report.classification
      .filter((classification) => {
        const classId = classification?._id;
        // if (!classId) {
        //   console.log("No classId", classification, dcs, icdCodes);
        // };
        if (classId && dcs) {
          return classification.bodyParts && dcs.includes(classId);
        } else {
          return icdCodes?.includes(classification.icdCode);
        }
      })
      .map((classification) => ({
        ...classification,
        reportId: report._id,
      }));

    const nameOfDiseaseByIcdCode = report.nameOfDiseaseByIcdCode?.filter(
      (item) =>
        classifications.some(
          (classification) => classification.icdCode === item.icdCode
        )
    );

    return [
      { ...report, classification: classifications, nameOfDiseaseByIcdCode },
    ];
  });
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

export function ensureUniqueImages(images: ImageTypeTwo[]): ImageTypeTwo[] {
  const uniqueImagesMap = new Map<string, ImageTypeTwo>();

  for (const image of images) {
    if (!uniqueImagesMap.has(image.fileName)) {
      uniqueImagesMap.set(image.fileName, image);
    }
  }

  return Array.from(uniqueImagesMap.values());
}
