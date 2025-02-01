import { OptionsType, caseTags } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ClaimRelatedTag,
  PrivilegedTag,
  tagsFilter,
} from "../components/medicalHistory/constants";

export default function useTags() {
  const params = useParams<{ id?: string | undefined }>();
  const [caseTags, setCaseTags] = useState<caseTags[]>([]);

  const tagsArray = useMemo(() => {
    if (!caseTags) return [];
    const labelValue: OptionsType[] = [];

    caseTags.forEach((tag) => {
      const val = {
        label: tag.tagName,
        value: tag._id.toString() as any,
      };
      if (tag.tagName == PrivilegedTag) {
        labelValue.unshift(val);
        return;
      }
      if (tag.tagName == ClaimRelatedTag) {
        labelValue.unshift(val);
        return;
      }

      labelValue.push(val);
    });

    return labelValue.concat(tagsFilter[2]);
  }, [params.id, caseTags]);

  const getCaseTags = async (caseId: string) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.case.reports.updateReport}/${caseId}/tags`
      );
      setCaseTags(response.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      if (params.id) await getCaseTags(params.id);
    })();
  }, [params.id]);

  return { tagsArray };
}
