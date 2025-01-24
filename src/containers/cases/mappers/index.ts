import isSameDay from "date-fns/isSameDay";
import patient from "./patient.json";

// Fetch Patient Data from FHIR API
function getPatientData(patientId: string) {
  const patient: any = fetchFHIRResource(`patient`);
  return {
    mrn: patient?.identifier[0]?.value || "", // Medical Record Number (MRN)
    name:
      patient.name[0]?.text ||
      `${patient.name[0]?.given.join(" ")} ${patient.name[0]?.family}`,
    gender: patient.gender || "",
    birthDate: patient.birthDate || "",
    line: patient.address[0]?.line?.join(", ") || "",
    city: patient.address[0]?.city || "",
    state: patient.address[0]?.state || "",
    postalCode: patient.address[0]?.postalCode || "",
    country: patient.address[0]?.country || "",
  };
}

// Fetch Encounter Data from FHIR API
function getEncounterData(patientId: string) {
  const encounters: any = fetchFHIRResource(`encounter`);
  return encounters.map((encounter: any) => ({
    id: encounter.resource.id || "",
    start: encounter.resource.period?.start || "",
    end: encounter.resource.period?.end || "",
    conditions: getConditions(encounter.resource.id),
    claims: getClaims(encounter.resource.period.start),
  }));
}

// Fetch Conditions for a Specific Encounter
function getConditions(encounterId: string = "") {
  const conditions: any = fetchFHIRResource(`condition`, encounterId);
  return conditions.map((condition: any) => ({
    clinicalStatus: condition.resource.clinicalStatus?.coding[0]?.code || "",
    verificationStatus:
      condition.resource.verificationStatus?.coding[0]?.code || "",
    category: condition.resource.category[0]?.coding[0]?.display || "",
    code: condition.resource.code?.coding[0]?.code || "",
    name: condition.resource.code?.coding[0]?.display || "",
    recordedDate: condition.resource.recordedDate || "",
  }));
}

// Fetch Claims for a Specific Encounter
function getClaims(encounterDate: string) {
  const claims: any = fetchFHIRResource(`claim`, "", encounterDate);
  return claims.map((claim: any) => ({
    claimType: claim.resource.type?.coding[0]?.code || "",
    status: claim.resource.status || "",
    start: claim.resource.billablePeriod?.start || "",
    end: claim.resource.billablePeriod?.end || "",
    createdDate: claim.resource.created || "",
    provider: claim.resource.provider?.display || "",
    insurance: claim.resource.insurance[0]?.coverage?.display || "",
    total: claim.resource.total?.value || "",
    currency: claim.resource.total?.currency || "",
    items: getClaimDiagnoses(claim.resource),
  }));
}

// Fetch Diagnoses for a Specific Claim
function getClaimDiagnoses(claim: any) {
  if (!claim?.item || !claim?.item?.length) return [];
  return claim.item.map((item: any) => ({
    code: item.productOrService?.coding[0]?.code || "",
    name: item.productOrService?.coding[0]?.display || "",
    value: item?.net?.value || 0,
    currency: item?.net?.currency || null,
  }));
}

function getEncounterClaims(encounterDate: string) {
  const claims = patient.entry.filter(
    (item) => item.resource.resourceType === "Claim"
  ) as any[];

  const result: any[] = claims.filter((claim) =>
    isSameDay(
      new Date(claim.resource.billablePeriod.start),
      new Date(encounterDate)
    )
  );
  return result;
}

// Helper function to fetch data from FHIR API
function fetchFHIRResource(
  endpoint: string,
  encounterId?: string,
  encounterDate?: string
) {
  switch (endpoint) {
    case "patient":
      return patient.entry[0].resource;
    case "encounter":
      return patient.entry.filter(
        (item) => item.resource.resourceType === "Encounter"
      );
    case "condition":
      return patient.entry.filter(
        (item) =>
          item.resource.resourceType === "Condition" &&
          item.resource.encounter?.reference?.includes(encounterId ?? "")
      ) as any;
    case "claim":
      return encounterDate ? getEncounterClaims(encounterDate) : [];
  }
}

// Main function to populate the entire structure
export function populateData(patientId: string) {
  const patientData = getPatientData(patientId);
  const encounterData = getEncounterData(patientId);

  return {
    patient: patientData,
    encounters: encounterData,
  };
}
