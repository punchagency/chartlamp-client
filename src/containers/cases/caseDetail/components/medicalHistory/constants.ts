import { TagsType } from "@/interface";

const tagsFilter = [
  {
    label: "Claim Related",
    value: TagsType.CLAIM_RELATED,
  },
  {
    label: "Privileged",
    value: TagsType.PRIVILEGED,
  },
  {
    label: "Add a custom tag",
    value: TagsType.CUSTOM_TAG,
  },
];

const ClaimRelatedTag = "Claim Related";
const PrivilegedTag = "Privileged";

export { ClaimRelatedTag, PrivilegedTag, tagsFilter };
