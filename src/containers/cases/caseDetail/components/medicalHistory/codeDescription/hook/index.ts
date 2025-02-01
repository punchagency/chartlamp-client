import { CaseDcTagMappingUnSaved } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { successAlertVar } from "@/state";
import { useParams } from "next/navigation";
import { startTransition, useEffect, useOptimistic, useState } from "react";

export default function useMapView() {
  const param = useParams();
  const caseId = param.id as string;
  const [caseDcTags, setCaseDcTags] = useState<CaseDcTagMappingUnSaved[]>([]);

  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [optimisticCaseDcTags, updateOptimisticNote] = useOptimistic(
    caseDcTags,
    (
      currentCaseDcTags: CaseDcTagMappingUnSaved[],
      newCaseDcTags: CaseDcTagMappingUnSaved[]
    ) => {
      return newCaseDcTags;
    }
  );

  const handleAddCaseTag = async (newCaseTags: CaseDcTagMappingUnSaved[]) => {
    const caseDcTagsCopy = optimisticCaseDcTags.slice();
    newCaseTags.forEach((item) => {
      const index = caseDcTagsCopy.findIndex(
        (tag) =>
          (tag.dc === item.dc || tag.icdCode === item.icdCode) &&
          tag.report === item.report &&
          tag.caseTag === item.caseTag
      );

      if (index >= 0) {
        if (!caseDcTagsCopy[index]._id && item.isRemove) {
          caseDcTagsCopy.splice(index, 1);
        } else {
          caseDcTagsCopy.splice(index, 1, {
            ...caseDcTagsCopy[index],
            isRemove: item.isRemove,
          });
        }
      } else {
        caseDcTagsCopy.push(item);
      }
    });
    setCaseDcTags(caseDcTagsCopy);

    // console.log("updatedCaseDcTags", caseDcTagsCopy);

    startTransition(() => {
      updateOptimisticNote(caseDcTagsCopy);
    });
    // await handleUpdateMultipleCaseDcTags(newCaseTags);
  };

  const handleUpdateMultipleCaseDcTags = async () => {
    try {
      setLoading(true);
      const caseDcTagsToSave = caseDcTags.filter((item) => {
        if (item._id && item.isRemove) return true;
        if (!item._id && !item.isRemove) return true;
        return false;
      });
      const response = await axiosInstance.post(
        `${endpoints.case.reports.updateReport}/${caseId}/dc/addRemove`,
        caseDcTagsToSave
      );
      if (response.data) {
        await getCaseDcTagMapping();
        successAlertVar("Tag updated successfully");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const getCaseDcTagMapping = async () => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.case.getById}/${caseId}/dcId/tags`
      );
      if (response.data) {
        // console.log("getCaseDcTagMapping", response.data);
        setCaseDcTags(response.data);
      }
    } catch (error) {}
  };

  const handleTagIcdCode = async ({
    reportId,
    data,
  }: {
    reportId: string;
    data: {
      caseTagId: string;
      dc: string;
      isRemove: boolean;
    };
  }) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `${endpoints.case.reports.updateReport}/${caseId}/reports/${reportId}`,
        data
      );
      if (response.data) {
        successAlertVar("Tag updated successfully");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedTag("");
  };

  useEffect(() => {
    if (caseId) getCaseDcTagMapping();
  }, [caseId, selectedTag]);

  return {
    caseId,
    selectedTag,
    loading,
    caseDcTags: optimisticCaseDcTags,
    handleTagIcdCode,
    setSelectedTag,
    handleCancel,
    handleAddCaseTag,
    handleUpdateMultipleCaseDcTags,
  };
}
