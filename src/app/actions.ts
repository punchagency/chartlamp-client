"use server";

import axiosInstance from "@/lib/axios";

export async function searchByDisease(terms: string) {
  try {
    const response = await axiosInstance.get(
      `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${terms}`
    );
    return response.data;
  } catch (error) {
    console.error("getProperty - Error", error);
  }
}
